#!/usr/bin/env node

import { ScriptConfig } from "../common/default-config";
import { TranslationWrapper } from "./translation-wrapper";
import { PerformanceReporter } from "../common/performance-reporter";

// ScriptConfig 타입을 re-export (하위 호환성)
export type { ScriptConfig };

// TranslationWrapper 클래스를 re-export (하위 호환성)
export { TranslationWrapper };

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
    const report = wrapper["performanceMonitor"].getReport();
    PerformanceReporter.printCompletionReport(
      report,
      processedFiles,
      totalTime,
      "Translation Wrapper Completed"
    );

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
