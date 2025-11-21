import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PerformanceMonitor } from "../common/performance-monitor";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { parseFile, generateCode } from "../common/ast/parser-utils";
import { isReactComponent, isReactCustomHook } from "./ast-helpers";
import { createUseTranslationHook, ensureNamedImport } from "./import-manager";
import { transformFunctionBody } from "./ast-transformers";
import { CONSOLE_MESSAGES, STRING_CONSTANTS } from "./constants";

const DEFAULT_CONFIG = SCRIPT_CONFIG_DEFAULTS;

export class TranslationWrapper {
  public readonly config: Required<ScriptConfig>;
  public performanceMonitor: PerformanceMonitor;

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as Required<ScriptConfig>;
    this.performanceMonitor = new PerformanceMonitor({
      enabled: this.config.enablePerformanceMonitoring,
      environment: process.env.NODE_ENV || STRING_CONSTANTS.DEFAULT_ENV,
      release: process.env.npm_package_version,
    });
  }

  private ensureUseClientDirective(ast: t.File) {
    // 이미 존재하면 패스
    const hasDirective = (ast.program.directives || []).some(
      (d) => d.value.value === STRING_CONSTANTS.USE_CLIENT_DIRECTIVE
    );
    if (!hasDirective) {
      const dir = t.directive(
        t.directiveLiteral(STRING_CONSTANTS.USE_CLIENT_DIRECTIVE)
      );
      ast.program.directives = ast.program.directives || [];
      ast.program.directives.unshift(dir);
    }
  }

  private createServerTBinding(serverFnName: string): t.VariableDeclaration {
    const awaitCall = t.awaitExpression(
      t.callExpression(t.identifier(serverFnName), [])
    );
    const pattern = t.objectPattern([
      t.objectProperty(
        t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
        t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
        false,
        true
      ),
    ]);
    return t.variableDeclaration(STRING_CONSTANTS.VARIABLE_KIND, [
      t.variableDeclarator(pattern, awaitCall),
    ]);
  }

  public async processFiles(): Promise<{
    processedFiles: string[];
  }> {
    this.performanceMonitor.start("translation_wrapper:total");

    const filePaths = await glob(this.config.sourcePattern);
    const processedFiles: string[] = [];

    for (const filePath of filePaths) {
      this.performanceMonitor.start("file_processing", { filePath });

      let isFileModified = false;
      const code = fs.readFileSync(filePath, "utf-8");

      try {
        const ast = parseFile(code, this.config.parserType, {
          sourceType: "module",
          tsx: true,
          decorators: true,
        });

        // 수정된 컴포넌트 경로 저장
        const modifiedComponentPaths: NodePath<t.Function>[] = [];

        // Step 4: 컴포넌트 내부 처리
        traverse(ast, {
          FunctionDeclaration: (path) => {
            const componentName = path.node.id?.name;
            if (
              componentName &&
              (isReactComponent(componentName) ||
                isReactCustomHook(componentName))
            ) {
              const transformResult = transformFunctionBody(path, code);
              if (transformResult.wasModified) {
                isFileModified = true;
                modifiedComponentPaths.push(path);
              }
            }
          },
          ArrowFunctionExpression: (path) => {
            if (
              t.isVariableDeclarator(path.parent) &&
              t.isIdentifier(path.parent.id)
            ) {
              const componentName = path.parent.id.name;
              if (
                componentName &&
                (isReactComponent(componentName) ||
                  isReactCustomHook(componentName))
              ) {
                const transformResult = transformFunctionBody(path, code);
                if (transformResult.wasModified) {
                  isFileModified = true;
                  modifiedComponentPaths.push(path);
                }
              }
            }
          },
        });

        if (isFileModified) {
          let wasUseHookAdded = false;
          let wasServerImportAdded = false;

          const isServerMode = this.config.mode === "server";
          const isClientMode = this.config.mode === "client";
          const isNextjsFramework = this.config.framework === "nextjs";

          // "use client" 디렉티브는 Next.js 환경에서 useTranslation 모드일 때만 추가
          // - React/Vite 프로젝트에서는 필요 없음
          // - 서버 번역 모드에서는 필요 없음 (서버 컴포넌트이므로)
          if (isNextjsFramework && isClientMode) {
            this.ensureUseClientDirective(ast);
          }

          modifiedComponentPaths.forEach((componentPath) => {
            if (
              componentPath.scope.hasBinding(
                STRING_CONSTANTS.TRANSLATION_FUNCTION
              )
            ) {
              return;
            }

            if (isServerMode) {
              // server 모드: config에 정의된 서버형 함수 사용
              (componentPath.node as any).async = true;

              const body = componentPath.get("body");
              const decl = this.createServerTBinding(
                this.config.serverTranslationFunction
              );
              if (body.isBlockStatement()) {
                body.unshiftContainer("body", decl);
                wasServerImportAdded = true;
              } else {
                // concise body → block으로 감싼 후 return 유지
                const original = body.node as t.Expression;
                const block = t.blockStatement([
                  decl,
                  t.returnStatement(original),
                ]);
                (componentPath.node as any).body = block;
                wasServerImportAdded = true;
              }
            } else {
              // client 모드 (또는 기본값): useTranslation 사용
              const body = componentPath.get("body");
              if (body.isBlockStatement()) {
                let hasHook = false;
                body.traverse({
                  CallExpression: (p) => {
                    if (
                      t.isIdentifier(p.node.callee, {
                        name: STRING_CONSTANTS.USE_TRANSLATION,
                      })
                    ) {
                      hasHook = true;
                    }
                  },
                });
                if (!hasHook) {
                  body.unshiftContainer("body", createUseTranslationHook());
                  wasUseHookAdded = true;
                }
              }
            }
          });

          // 필요한 import 추가
          if (wasUseHookAdded) {
            ensureNamedImport(
              ast,
              this.config.translationImportSource,
              STRING_CONSTANTS.USE_TRANSLATION
            );
          }
          if (wasServerImportAdded) {
            ensureNamedImport(
              ast,
              this.config.translationImportSource,
              this.config.serverTranslationFunction
            );
          }

          const output = generateCode(ast, this.config.parserType, {
            retainLines: true,
            comments: true,
          });

          fs.writeFileSync(filePath, output.code, "utf-8");

          processedFiles.push(filePath);
        }
        this.performanceMonitor.end("file_processing", {
          filePath,
          modified: isFileModified,
        });
      } catch (error) {
        console.error(CONSOLE_MESSAGES.ERROR_PROCESSING(filePath), error);
        this.performanceMonitor.captureError(error as Error, { filePath });
        this.performanceMonitor.end("file_processing", {
          filePath,
          error: true,
        });
      }
    }

    this.performanceMonitor.end("translation_wrapper:total", {
      totalFiles: filePaths.length,
      processedFiles: processedFiles.length,
    });

    return {
      processedFiles,
    };
  }
}
