#!/usr/bin/env node

import { ScriptConfig } from "../common/default-config";
import { TranslationWrapper } from "./translation-wrapper";
import { PerformanceReporter } from "../common/performance-reporter";
import {
  CONSOLE_MESSAGES,
  CLI_OPTIONS,
  CLI_HELP,
  STRING_CONSTANTS,
} from "./constants";

// ScriptConfig 타입을 re-export (하위 호환성)
export type { ScriptConfig };

// TranslationWrapper 클래스를 re-export (하위 호환성)
export { TranslationWrapper };

export async function runTranslationWrapper(
  config: Partial<ScriptConfig> = {}
) {
  const wrapper = new TranslationWrapper(config);

  const startTime = Date.now();

  try {
    const { processedFiles } = await wrapper.processFiles();

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // 완료 리포트 출력
    const report = wrapper.performanceMonitor.getReport();
    PerformanceReporter.printCompletionReport(
      report,
      processedFiles,
      totalTime,
      STRING_CONSTANTS.COMPLETION_TITLE
    );

    // 상세 리포트 출력 (verbose mode인 경우)
    if (process.env.I18N_PERF_VERBOSE === "true") {
      wrapper.performanceMonitor.printReport(true);
    }

    // 성능 데이터 플러시
    await wrapper.performanceMonitor.flush();
  } catch (error) {
    console.error(CONSOLE_MESSAGES.FATAL_ERROR, error);
    await wrapper.performanceMonitor.flush();
    throw error;
  }
}

// CLI 실행 부분
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: Partial<ScriptConfig> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case CLI_OPTIONS.PATTERN:
      case CLI_OPTIONS.PATTERN_SHORT:
        config.sourcePattern = args[++i];
        break;
      case CLI_OPTIONS.HELP:
      case CLI_OPTIONS.HELP_SHORT:
        console.log(`
${CLI_HELP.USAGE}

${CLI_HELP.OPTIONS}

${CLI_HELP.EXAMPLES}
        `);
        process.exit(0);
        break;
    }
  }

  runTranslationWrapper(config).catch(console.error);
}
