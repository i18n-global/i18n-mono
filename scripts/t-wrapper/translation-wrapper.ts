import * as path from "path";
import { glob } from "glob";
import { writeFile, readFile } from "./fs-utils";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { PerformanceMonitor } from "../common/performance-monitor";
import { ScriptConfig, SCRIPT_CONFIG_DEFAULTS } from "../common/default-config";
import { parseFile, generateCode } from "../common/ast/parser-utils";
import {
  isReactComponent,
  isReactCustomHook,
  hasTranslationFunctionCall,
  createTranslationBinding,
} from "./ast-helpers";
import { ensureNamedImport, ensureUseClientDirective } from "./import-manager";
import { transformFunctionBody } from "./ast-transformers";
import { CONSOLE_MESSAGES, STRING_CONSTANTS } from "./constants";
import { PerformanceReporter } from "../common/performance-reporter";

export class TranslationWrapper {
  public readonly config: Required<ScriptConfig>;
  public performanceMonitor: PerformanceMonitor;

  constructor(config: Partial<ScriptConfig> = {}) {
    this.config = {
      ...SCRIPT_CONFIG_DEFAULTS,
      ...config,
    } as Required<ScriptConfig>;
    this.performanceMonitor = new PerformanceMonitor({
      enabled: this.config.enablePerformanceMonitoring,
      environment: process.env.NODE_ENV || STRING_CONSTANTS.DEFAULT_ENV,
      release: process.env.npm_package_version,
    });
  }

  /** 컴포넌트 변환 처리 */
  private processComponent(
    path: NodePath<t.Function>,
    componentName: string | null | undefined,
    code: string,
    modifiedComponentPaths: NodePath<t.Function>[]
  ): boolean {
    if (
      componentName &&
      (isReactComponent(componentName) || isReactCustomHook(componentName))
    ) {
      const transformResult = transformFunctionBody(path, code);
      if (transformResult.wasModified) {
        modifiedComponentPaths.push(path);
        return true;
      }
    }
    return false;
  }

  /** 수정된 파일에 번역 바인딩 및 import 추가 */
  private applyTranslationsToFile(
    ast: t.File,
    filePath: string,
    modifiedComponentPaths: NodePath<t.Function>[]
  ): void {
    const isServerMode = this.config.mode === "server";
    const isClientMode = this.config.mode === "client";
    const isNextjsFramework = this.config.framework === "nextjs";

    // "use client" 디렉티브는 Next.js 환경에서 useTranslation 모드일 때만 추가
    // - React/Vite 프로젝트에서는 필요 없음
    // - 서버 번역 모드에서는 필요 없음 (서버 컴포넌트이므로)
    if (isNextjsFramework && isClientMode) {
      ensureUseClientDirective(ast);
    }

    // 사용된 번역 함수 추적 (중복 import 방지)
    const usedTranslationFunctions = new Set<string>();

    modifiedComponentPaths.forEach((componentPath) => {
      if (
        componentPath.scope.hasBinding(STRING_CONSTANTS.TRANSLATION_FUNCTION)
      ) {
        return;
      }

      const body = componentPath.get("body");

      // 이미 번역 함수가 있는지 체크 (모드별)
      const translationFunctionName = isServerMode
        ? this.config.serverTranslationFunction
        : STRING_CONSTANTS.USE_TRANSLATION;

      if (hasTranslationFunctionCall(body, translationFunctionName)) {
        return; // 이미 번역 함수가 있으면 스킵
      }

      // t 바인딩 생성 (모드별)
      if (isServerMode) {
        (componentPath.node as any).async = true;
      }
      const decl = createTranslationBinding(
        isServerMode ? "server" : "client",
        isServerMode ? this.config.serverTranslationFunction : undefined
      );

      // 선언문 추가 (공통 로직)
      if (body.isBlockStatement()) {
        body.unshiftContainer("body", decl);
      } else {
        // concise body → block으로 감싼 후 return 유지
        const original = body.node as t.Expression;
        (componentPath.node as any).body = t.blockStatement([
          decl,
          t.returnStatement(original),
        ]);
      }

      // 사용된 번역 함수 기록 (이미 체크했으므로 무조건 추가됨)
      usedTranslationFunctions.add(translationFunctionName);
    });

    // 필요한 import 추가 (중복 방지)
    usedTranslationFunctions.forEach((functionName) => {
      ensureNamedImport(ast, this.config.translationImportSource, functionName);
    });

    const output = generateCode(ast, this.config.parserType, {
      retainLines: true,
      comments: true,
    });

    writeFile(filePath, output.code);
  }

  public async processFiles(): Promise<{
    processedFiles: string[];
  }> {
    const startTime = Date.now();
    this.performanceMonitor.start("translation_wrapper:total");

    const filePaths = await glob(this.config.sourcePattern);
    const processedFiles: string[] = [];

    for (const filePath of filePaths) {
      this.performanceMonitor.start("file_processing", { filePath });

      let isFileModified = false;
      const code = readFile(filePath);

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
            isFileModified = this.processComponent(
              path,
              path.node.id?.name,
              code,
              modifiedComponentPaths
            );
          },
          ArrowFunctionExpression: (path) => {
            if (
              t.isVariableDeclarator(path.parent) &&
              t.isIdentifier(path.parent.id)
            ) {
              isFileModified = this.processComponent(
                path,
                path.parent.id.name,
                code,
                modifiedComponentPaths
              );
            }
          },
        });

        if (isFileModified) {
          this.applyTranslationsToFile(ast, filePath, modifiedComponentPaths);
          processedFiles.push(filePath);
        }
        this.performanceMonitor.end("file_processing", {
          filePath,
          modified: isFileModified,
        });
      } catch (error) {
        // 개별 파일 에러는 조용히 처리 (성능 모니터에만 기록)
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

    // 완료 리포트 출력
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const report = this.performanceMonitor.getReport();
    PerformanceReporter.printCompletionReport(
      report,
      processedFiles,
      totalTime,
      STRING_CONSTANTS.COMPLETION_TITLE
    );

    // 상세 리포트 출력 (verbose mode인 경우)
    if (process.env.I18N_PERF_VERBOSE === "true") {
      this.performanceMonitor.printReport(true);
    }

    return {
      processedFiles,
    };
  }
}
