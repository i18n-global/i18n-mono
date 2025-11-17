import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PerformanceMonitor } from "../common/performance-monitor";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { parseFile, generateCode } from "../common/ast/parser-utils";
import { isReactComponent } from "./ast-helpers";
import { createUseTranslationHook, addImportIfNeeded } from "./import-manager";
import { transformFunctionBody } from "./ast-transformers";
import { CONSOLE_MESSAGES, STRING_CONSTANTS } from "./constants";

const DEFAULT_CONFIG = SCRIPT_CONFIG_DEFAULTS;

export class TranslationWrapper {
  private config: Required<ScriptConfig>;
  private performanceMonitor: PerformanceMonitor;

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as Required<ScriptConfig>;
    this.performanceMonitor = new PerformanceMonitor({
      enabled: this.config.enablePerformanceMonitoring,
      sentryDsn: this.config.sentryDsn,
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

  private ensureNamedImport(ast: t.File, source: string, importedName: string) {
    let hasSource = false;
    let hasSpecifier = false;
    for (const node of ast.program.body) {
      if (t.isImportDeclaration(node) && node.source.value === source) {
        hasSource = true;
        for (const spec of node.specifiers) {
          if (
            t.isImportSpecifier(spec) &&
            t.isIdentifier(spec.imported) &&
            spec.imported.name === importedName
          ) {
            hasSpecifier = true;
            break;
          }
        }
        if (!hasSpecifier) {
          node.specifiers.push(
            t.importSpecifier(
              t.identifier(importedName),
              t.identifier(importedName)
            )
          );
          hasSpecifier = true;
        }
        break;
      }
    }
    if (!hasSource) {
      const decl = t.importDeclaration(
        [
          t.importSpecifier(
            t.identifier(importedName),
            t.identifier(importedName)
          ),
        ],
        t.stringLiteral(source)
      );
      ast.program.body.unshift(decl);
      hasSpecifier = true;
    }
    return hasSpecifier;
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

  private processFunctionBody(
    path: NodePath<t.Function>,
    sourceCode: string
  ): boolean {
    const transformResult = transformFunctionBody(path, sourceCode);
    return transformResult.wasModified;
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
            if (componentName && isReactComponent(componentName)) {
              const wasModified = this.processFunctionBody(path, code);
              if (wasModified) {
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
              if (componentName && isReactComponent(componentName)) {
                const wasModified = this.processFunctionBody(path, code);
                if (wasModified) {
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

          if (isClientMode) {
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
            addImportIfNeeded(ast, this.config.translationImportSource);
          }
          if (wasServerImportAdded) {
            this.ensureNamedImport(
              ast,
              this.config.translationImportSource,
              this.config.serverTranslationFunction
            );
          }

          if (!this.config.dryRun) {
            const output = generateCode(ast, this.config.parserType, {
              retainLines: true,
              comments: true,
            });

            fs.writeFileSync(filePath, output.code, "utf-8");
          }

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

  /**
   * 성능 리포트 출력
   */
  public printPerformanceReport(verbose: boolean = false): void {
    this.performanceMonitor.printReport(verbose);
  }

  /**
   * 성능 데이터 플러시 (Sentry에 전송)
   */
  public async flushPerformanceData(): Promise<void> {
    await this.performanceMonitor.flush();
  }
}
