import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { parseFileWithSwc, generateCodeFromAst } from "../swc-utils";
import { parse as babelParse } from "@babel/parser";
import generate from "@babel/generator";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PerformanceMonitor } from "../common/performance-monitor";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import {
  hasIgnoreComment,
  shouldSkipPath,
  isReactComponent,
  isServerComponent,
} from "./ast-helpers";
import { createUseTranslationHook, addImportIfNeeded } from "./import-manager";

const DEFAULT_CONFIG = SCRIPT_CONFIG_DEFAULTS;

export class TranslationWrapper {
  private config: Required<ScriptConfig>;
  private performanceMonitor: PerformanceMonitor;

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.performanceMonitor = new PerformanceMonitor({
      enabled: this.config.enablePerformanceMonitoring,
      sentryDsn: this.config.sentryDsn,
      environment: process.env.NODE_ENV || "production",
      release: process.env.npm_package_version,
    });
  }

  /**
   * 설정된 파서로 파일 파싱
   */
  private parseFile(
    code: string,
    options: {
      sourceType?: "module" | "script";
      jsx?: boolean;
      tsx?: boolean;
      decorators?: boolean;
    } = {}
  ): t.File {
    if (this.config.parserType === "babel") {
      return babelParse(code, {
        sourceType: options.sourceType || "module",
        plugins: [
          "typescript",
          "jsx",
          "decorators-legacy",
          "classProperties",
          "objectRestSpread",
        ],
      });
    } else {
      return parseFileWithSwc(code, {
        sourceType: options.sourceType || "module",
        tsx: options.tsx !== false,
        jsx: options.jsx !== false,
        decorators: options.decorators !== false,
      });
    }
  }

  /**
   * AST를 코드로 생성
   */
  private generateCodeFromAst(
    ast: t.File,
    options: {
      retainLines?: boolean;
      comments?: boolean;
    } = {}
  ): { code: string; map?: any } {
    if (this.config.parserType === "babel") {
      return generate(ast, {
        retainLines: options.retainLines !== false,
        comments: options.comments !== false,
      });
    } else {
      return generateCodeFromAst(ast, {
        retainLines: options.retainLines !== false,
        comments: options.comments !== false,
      });
    }
  }

  private processFunctionBody(
    path: NodePath<t.Function>,
    sourceCode: string
  ): { wasModified: boolean; isServerComponent: boolean } {
    let wasModified = false;
    const isServerComponentResult = isServerComponent(path);

    path.traverse({
      StringLiteral: (subPath) => {
        if (
          shouldSkipPath(subPath, hasIgnoreComment) ||
          hasIgnoreComment(subPath, sourceCode)
        ) {
          return;
        }

        // 빈 문자열이나 공백만 있는 문자열은 스킵
        const trimmedValue = subPath.node.value.trim();
        if (!trimmedValue) {
          return;
        }

        // 한국어 텍스트가 포함된 문자열만 처리
        if (/[가-힣]/.test(subPath.node.value)) {
          wasModified = true;
          const replacement = t.callExpression(t.identifier("t"), [
            t.stringLiteral(subPath.node.value),
          ]);

          if (t.isJSXAttribute(subPath.parent)) {
            subPath.replaceWith(t.jsxExpressionContainer(replacement));
          } else {
            subPath.replaceWith(replacement);
          }
        }
      },
      TemplateLiteral: (subPath) => {
        // i18n-ignore 주석이 있는 경우 스킵
        if (
          shouldSkipPath(subPath as any, hasIgnoreComment) ||
          hasIgnoreComment(subPath, sourceCode)
        ) {
          return;
        }

        // 이미 t()로 래핑된 경우 스킵
        if (
          t.isCallExpression(subPath.parent) &&
          t.isIdentifier(subPath.parent.callee, { name: "t" })
        ) {
          return;
        }

        // 템플릿 리터럴의 모든 부분에 하나라도 한국어가 있는지 확인
        const hasKorean = subPath.node.quasis.some((quasi) =>
          /[가-힣]/.test(quasi.value.raw)
        );

        if (!hasKorean) {
          return;
        }

        // 템플릿 리터럴을 i18next interpolation 형식으로 변환
        // 예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
        wasModified = true;

        const templateNode = subPath.node;
        const expressions = templateNode.expressions;
        const quasis = templateNode.quasis;

        // 표현식이 없으면 단순 문자열로 처리
        if (expressions.length === 0) {
          const replacement = t.callExpression(t.identifier("t"), [
            t.stringLiteral(quasis[0].value.raw),
          ]);
          subPath.replaceWith(replacement);
          return;
        }

        // i18next 형식으로 변환: `안녕 ${name}` → `안녕 {{name}}`
        let i18nextString = "";
        const interpolationVars: t.ObjectProperty[] = [];

        quasis.forEach((quasi, index) => {
          i18nextString += quasi.value.raw;

          if (index < expressions.length) {
            const expr = expressions[index];

            // 변수명 추출
            let varName: string;
            if (t.isIdentifier(expr)) {
              varName = expr.name;
            } else if (t.isMemberExpression(expr)) {
              // user.name → user_name
              varName = this.generateCodeFromAst(expr as any).code.replace(
                /\./g,
                "_"
              );
            } else {
              // 복잡한 표현식은 expr0, expr1 등으로 처리
              varName = `expr${index}`;
            }

            // i18next 형식: {{varName}}
            i18nextString += `{{${varName}}}`;

            // interpolation 객체에 추가
            interpolationVars.push(
              t.objectProperty(t.identifier(varName), expr as t.Expression)
            );
          }
        });

        // t("안녕 {{name}}", { name: name })
        const args: Array<t.Expression | t.SpreadElement> = [
          t.stringLiteral(i18nextString),
        ];

        // interpolation 객체가 있으면 두 번째 인자로 추가
        if (interpolationVars.length > 0) {
          args.push(t.objectExpression(interpolationVars));
        }

        const replacement = t.callExpression(t.identifier("t"), args);
        subPath.replaceWith(replacement);
      },
      JSXText: (subPath) => {
        // i18n-ignore 주석이 있는 경우 스킵
        if (hasIgnoreComment(subPath, sourceCode)) {
          return;
        }

        const text = subPath.node.value.trim();

        // 빈 텍스트나 공백만 있는 경우 스킵
        if (!text) {
          return;
        }

        // 한국어가 포함된 텍스트만 처리
        if (/[가-힣]/.test(text)) {
          wasModified = true;

          // t() 함수 호출로 감싸기
          const replacement = t.jsxExpressionContainer(
            t.callExpression(t.identifier("t"), [t.stringLiteral(text)])
          );

          subPath.replaceWith(replacement);
        }
      },
    });

    return { wasModified, isServerComponent: isServerComponentResult };
  }

  public async processFiles(): Promise<{
    processedFiles: string[];
  }> {
    this.performanceMonitor.start("translation_wrapper:total");

    const filePaths = await glob(this.config.sourcePattern);
    const processedFiles: string[] = [];

    console.log(`📁 Found ${filePaths.length} files to process...`);

    for (const filePath of filePaths) {
      this.performanceMonitor.start("file_processing", { filePath });

      let isFileModified = false;
      const code = fs.readFileSync(filePath, "utf-8");

      try {
        const ast = this.parseFile(code, {
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
                console.log(
                  `     🔵 Server component detected - skipping useTranslation hook`
                );
                return;
              }
              if (componentPath.scope.hasBinding("t")) {
                return;
              }

              const body = componentPath.get("body");
              if (body.isBlockStatement()) {
                let hasHook = false;
                body.traverse({
                  CallExpression: (path) => {
                    if (
                      t.isIdentifier(path.node.callee, {
                        name: "useTranslation",
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
            const output = this.generateCodeFromAst(ast, {
              retainLines: true,
              comments: true,
            });

            fs.writeFileSync(filePath, output.code, "utf-8");
          }

          processedFiles.push(filePath);
          console.log(
            `🔧 ${filePath} - ${
              this.config.dryRun ? "Would be modified" : "Modified"
            }`
          );
        }
        this.performanceMonitor.end("file_processing", {
          filePath,
          modified: isFileModified,
        });
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
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
