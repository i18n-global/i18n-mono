import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PerformanceMonitor } from "../common/performance-monitor";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { parseFile, generateCode } from "../common/ast/parser-utils";
import { isReactComponent, isServerComponent } from "./ast-helpers";
import { createUseTranslationHook, addImportIfNeeded } from "./import-manager";
import { transformFunctionBody } from "./ast-transformers";
import { CONSOLE_MESSAGES, STRING_CONSTANTS } from "./constants";

const DEFAULT_CONFIG = SCRIPT_CONFIG_DEFAULTS;

export class TranslationWrapper {
  private config: Required<ScriptConfig>;
  private performanceMonitor: PerformanceMonitor;

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.performanceMonitor = new PerformanceMonitor({
      enabled: this.config.enablePerformanceMonitoring,
      sentryDsn: this.config.sentryDsn,
      environment: process.env.NODE_ENV || STRING_CONSTANTS.DEFAULT_ENV,
      release: process.env.npm_package_version,
    });
  }

  private processFunctionBody(
    path: NodePath<t.Function>,
    sourceCode: string
  ): { wasModified: boolean; isServerComponent: boolean } {
    const isServerComponentResult = isServerComponent(path);
    const transformResult = transformFunctionBody(path, sourceCode);

    return {
      wasModified: transformResult.wasModified,
      isServerComponent: isServerComponentResult,
    };
  }

  public async processFiles(): Promise<{
    processedFiles: string[];
  }> {
    this.performanceMonitor.start("translation_wrapper:total");

    const filePaths = await glob(this.config.sourcePattern);
    const processedFiles: string[] = [];

    console.log(CONSOLE_MESSAGES.FILES_FOUND(filePaths.length));

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

        // 수정된 컴포넌트 경로와 서버 컴포넌트 여부 저장
        const modifiedComponentPaths: Array<{
          path: NodePath<t.Function>;
          isServerComponent: boolean;
        }> = [];

        // Step 4: 컴포넌트 내부 처리
        traverse(ast, {
          FunctionDeclaration: (path) => {
            const componentName = path.node.id?.name;
            if (componentName && isReactComponent(componentName)) {
              const result = this.processFunctionBody(path, code);
              if (result.wasModified) {
                isFileModified = true;
                modifiedComponentPaths.push({
                  path,
                  isServerComponent: result.isServerComponent,
                });
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
                const result = this.processFunctionBody(path, code);
                if (result.wasModified) {
                  isFileModified = true;
                  modifiedComponentPaths.push({
                    path,
                    isServerComponent: result.isServerComponent,
                  });
                }
              }
            }
          },
        });

        if (isFileModified) {
          let wasHookAdded = false;

          // 수정된 컴포넌트에 useTranslation 훅 추가
          // 단, 서버 컴포넌트는 제외 (getServerTranslation 사용)
          modifiedComponentPaths.forEach(
            ({ path: componentPath, isServerComponent }) => {
              // 서버 컴포넌트는 useTranslation 훅을 추가하지 않음
              if (isServerComponent) {
                console.log(CONSOLE_MESSAGES.SERVER_COMPONENT_SKIP);
                return;
              }
              if (
                componentPath.scope.hasBinding(STRING_CONSTANTS.TRANSLATION_FUNCTION)
              ) {
                return;
              }

              const body = componentPath.get("body");
              if (body.isBlockStatement()) {
                let hasHook = false;
                body.traverse({
                  CallExpression: (path) => {
                    if (
                      t.isIdentifier(path.node.callee, {
                        name: STRING_CONSTANTS.USE_TRANSLATION,
                      })
                    ) {
                      hasHook = true;
                    }
                  },
                });

                if (!hasHook) {
                  body.unshiftContainer("body", createUseTranslationHook());
                  wasHookAdded = true;
                }
              }
            }
          );

          // 필요한 경우 import 추가
          if (wasHookAdded) {
            addImportIfNeeded(ast, this.config.translationImportSource);
          }

          if (!this.config.dryRun) {
            const output = generateCode(ast, this.config.parserType, {
              retainLines: true,
              comments: true,
            });

            fs.writeFileSync(filePath, output.code, "utf-8");
          }

          processedFiles.push(filePath);
          console.log(
            CONSOLE_MESSAGES.FILE_MODIFIED(filePath, this.config.dryRun)
          );
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
