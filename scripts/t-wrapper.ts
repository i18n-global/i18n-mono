#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { parseFileWithSwc, generateCodeFromAst } from "./swc-utils";
import { parse as babelParse } from "@babel/parser";
import generate from "@babel/generator";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PerformanceMonitor, measureSync } from "./performance-monitor";

export interface ScriptConfig {
  sourcePattern?: string;
  translationImportSource?: string;
  dryRun?: boolean;
  /**
   * 상수로 인식할 네이밍 패턴 (접미사)
   * 예: ['_ITEMS', '_MENU', '_CONFIG', '_FIELDS']
   * 비어있으면 모든 ALL_CAPS/PascalCase를 상수로 인식
   */
  constantPatterns?: string[];
  /**
   * 성능 모니터링 활성화 여부
   */
  enablePerformanceMonitoring?: boolean;
  /**
   * Sentry DSN (성능 데이터 전송)
   */
  sentryDsn?: string;
  /**
   * 파서 타입 선택 (성능 비교용)
   * - 'babel': @babel/parser 사용 (기본값, 권장)
   * - 'swc': @swc/core 사용 (실험적, 현재 Babel보다 느릴 수 있음)
   *
   * ⚠️ 주의: SWC 옵션은 실험적입니다. SWC AST를 Babel AST로 변환하는 과정에서
   * 성능 오버헤드가 발생할 수 있습니다. 안정성과 성능을 위해 Babel을 권장합니다.
   */
  parserType?: "babel" | "swc";
}

const DEFAULT_CONFIG: Required<ScriptConfig> = {
  sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
  translationImportSource: "i18nexus",
  dryRun: false,
  constantPatterns: [], // 기본값: 모든 상수 허용
  enablePerformanceMonitoring: process.env.I18N_PERF_MONITOR !== "false",
  sentryDsn: process.env.SENTRY_DSN || "",
  parserType: "babel", // 기본값: babel (안정적이고 빠름)
};

export class TranslationWrapper {
  private config: Required<ScriptConfig>;
  // 성능 모니터
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

  private createUseTranslationHook(): t.VariableDeclaration {
    // useTranslation()을 빈 값으로 호출 - 내부적으로 현재 언어 자동 주입
    const hookCall = t.callExpression(t.identifier("useTranslation"), []);

    return t.variableDeclaration("const", [
      t.variableDeclarator(
        t.objectPattern([
          t.objectProperty(t.identifier("t"), t.identifier("t"), false, true),
        ]),
        hookCall
      ),
    ]);
  }

  /**
   * i18n-ignore 주석이 노드 바로 위에 있는지 확인
   * 파일의 원본 소스코드를 직접 검사하여 주석 감지
   */
  private hasIgnoreComment(path: NodePath, sourceCode?: string): boolean {
    const node = path.node;

    // 1. AST의 leadingComments 확인
    if (node.leadingComments) {
      const hasIgnore = node.leadingComments.some(
        (comment) =>
          comment.value.trim() === "i18n-ignore" ||
          comment.value.trim().startsWith("i18n-ignore")
      );
      if (hasIgnore) return true;
    }

    // 2. 부모 노드의 leadingComments 확인
    if (path.parentPath?.node?.leadingComments) {
      const hasIgnore = path.parentPath.node.leadingComments.some(
        (comment) =>
          comment.value.trim() === "i18n-ignore" ||
          comment.value.trim().startsWith("i18n-ignore")
      );
      if (hasIgnore) return true;
    }

    // 3. 소스코드 직접 검사 (node.loc가 있는 경우)
    if (sourceCode && node.loc) {
      const startLine = node.loc.start.line;
      const lines = sourceCode.split("\n");

      // 현재 라인과 바로 위 라인 검사
      for (let i = Math.max(0, startLine - 3); i < startLine; i++) {
        const line = lines[i];
        if (
          line &&
          (line.includes("i18n-ignore") ||
            line.includes("// i18n-ignore") ||
            line.includes("/* i18n-ignore") ||
            line.includes("{/* i18n-ignore"))
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private shouldSkipPath(path: NodePath<t.StringLiteral>): boolean {
    // i18n-ignore 주석이 있는 경우 스킵
    if (this.hasIgnoreComment(path)) {
      return true;
    }

    // 부모 노드에 i18n-ignore 주석이 있는 경우도 스킵
    if (path.parent && this.hasIgnoreComment(path.parentPath as NodePath)) {
      return true;
    }

    // t() 함수로 이미 래핑된 경우 스킵
    if (
      t.isCallExpression(path.parent) &&
      t.isIdentifier(path.parent.callee, { name: "t" })
    ) {
      return true;
    }

    // import 구문은 스킵
    const importParent = path.findParent((p) => t.isImportDeclaration(p.node));
    if (importParent?.node && t.isImportDeclaration(importParent.node)) {
      return true;
    }

    // 객체 프로퍼티 KEY면 무조건 스킵
    if (t.isObjectProperty(path.parent) && path.parent.key === path.node) {
      return true;
    }

    return false;
  }

  /**
   * 함수가 getServerTranslation으로 감싸진 서버 컴포넌트인지 확인
   */
  private isServerComponent(path: NodePath<t.Function>): boolean {
    // 함수 body 내에서 getServerTranslation 호출이 있는지 확인
    let hasServerTranslation = false;

    path.traverse({
      CallExpression: (callPath) => {
        if (
          t.isIdentifier(callPath.node.callee, {
            name: "getServerTranslation",
          }) ||
          (t.isAwaitExpression(callPath.parent) &&
            t.isCallExpression(callPath.node) &&
            t.isIdentifier(callPath.node.callee, {
              name: "getServerTranslation",
            }))
        ) {
          hasServerTranslation = true;
          callPath.stop(); // 찾았으면 더 이상 탐색하지 않음
        }
      },
    });

    return hasServerTranslation;
  }

  private processFunctionBody(
    path: NodePath<t.Function>,
    sourceCode: string
  ): { wasModified: boolean; isServerComponent: boolean } {
    let wasModified = false;
    const isServerComponent = this.isServerComponent(path);

    path.traverse({
      StringLiteral: (subPath) => {
        if (
          this.shouldSkipPath(subPath) ||
          this.hasIgnoreComment(subPath, sourceCode)
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
          this.shouldSkipPath(subPath as any) ||
          this.hasIgnoreComment(subPath, sourceCode)
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
        if (this.hasIgnoreComment(subPath, sourceCode)) {
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

    return { wasModified, isServerComponent };
  }

  private addImportIfNeeded(ast: t.File): boolean {
    let hasImport = false;

    traverse(ast, {
      ImportDeclaration: (path) => {
        if (path.node.source.value === this.config.translationImportSource) {
          const hasUseTranslation = path.node.specifiers.some(
            (spec) =>
              t.isImportSpecifier(spec) &&
              t.isIdentifier(spec.imported) &&
              spec.imported.name === "useTranslation"
          );

          if (!hasUseTranslation) {
            path.node.specifiers.push(
              t.importSpecifier(
                t.identifier("useTranslation"),
                t.identifier("useTranslation")
              )
            );
          }
          hasImport = true;
        }
      },
    });

    if (!hasImport) {
      const importDeclaration = t.importDeclaration(
        [
          t.importSpecifier(
            t.identifier("useTranslation"),
            t.identifier("useTranslation")
          ),
        ],
        t.stringLiteral(this.config.translationImportSource)
      );
      ast.program.body.unshift(importDeclaration);
      return true;
    }

    return false;
  }

  private isReactComponent(name: string): boolean {
    return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
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
            if (componentName && this.isReactComponent(componentName)) {
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
              if (componentName && this.isReactComponent(componentName)) {
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
                  body.unshiftContainer(
                    "body",
                    this.createUseTranslationHook()
                  );
                  wasHookAdded = true;
                }
              }
            }
          );

          // 필요한 경우 import 추가
          if (wasHookAdded) {
            this.addImportIfNeeded(ast);
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

/**
 * 작업 완료 후 성능 리포트 출력
 */
function printCompletionReport(
  wrapper: TranslationWrapper,
  processedFiles: string[],
  totalTime: number
): void {
  const report = wrapper["performanceMonitor"].getReport();
  const metrics = report.metrics;
  const processedCount = processedFiles.length || 1;

  // 각 파일 처리 시간 집계
  const fileProcessingTime = metrics
    .filter((m) => m.name === "file_processing")
    .reduce((sum, m) => sum + m.duration, 0);

  const avgTimePerFile = fileProcessingTime / processedCount;

  // 가장 느린 파일 top 3
  const slowestFiles = metrics
    .filter((m) => m.name === "file_processing")
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 3);

  // 결과 출력
  console.log("\n" + "═".repeat(80));
  console.log("✅ Translation Wrapper Completed");
  console.log("═".repeat(80));

  console.log(`\n📊 Overall Statistics:`);
  console.log(`   Total Time:        ${totalTime.toFixed(0)}ms`);
  console.log(`   Files Processed:   ${processedFiles.length} files`);
  console.log(`   Avg per File:      ${avgTimePerFile.toFixed(1)}ms/file`);

  if (slowestFiles.length > 0) {
    console.log(`\n🐌 Slowest Files:`);
    slowestFiles.forEach((m, index) => {
      const filePath = m.metadata?.filePath || "unknown";
      const fileName = filePath.split("/").pop();
      console.log(
        `   ${index + 1}. ${fileName?.padEnd(40)} ${m.duration.toFixed(1)}ms`
      );
    });
  }

  console.log("═".repeat(80) + "\n");
}

export async function runTranslationWrapper(
  config: Partial<ScriptConfig> = {}
) {
  const wrapper = new TranslationWrapper(config);

  console.log("🚀 Starting translation wrapper...");
  const startTime = Date.now();

  try {
    const { processedFiles } = await wrapper.processFiles();

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // 완료 리포트 출력
    printCompletionReport(wrapper, processedFiles, totalTime);

    // 상세 리포트 출력 (verbose mode인 경우)
    if (process.env.I18N_PERF_VERBOSE === "true") {
      wrapper.printPerformanceReport(true);
    }

    // Sentry 데이터 플러시
    await wrapper.flushPerformanceData();
  } catch (error) {
    console.error("❌ Fatal error:", error);
    await wrapper.flushPerformanceData();
    throw error;
  }
}

// CLI 실행 부분
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: Partial<ScriptConfig> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--pattern":
      case "-p":
        config.sourcePattern = args[++i];
        break;
      case "--dry-run":
      case "-d":
        config.dryRun = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Usage: t-wrapper [options]

Options:
  -p, --pattern <pattern>    Source file pattern (default: "src/**/*.{js,jsx,ts,tsx}")
  -d, --dry-run             Preview changes without modifying files
  -h, --help                Show this help message

Examples:
  t-wrapper
  t-wrapper -p "app/**/*.tsx"
  t-wrapper --dry-run
        `);
        process.exit(0);
        break;
    }
  }

  runTranslationWrapper(config).catch(console.error);
}
