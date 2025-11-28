#!/usr/bin/env node

/**
 * i18n-wrapper-swc-worker CLI
 *
 * SWC + Worker Threads를 사용한 고성능 번역 래퍼
 * - 병렬 처리로 10-12배 성능 향상
 * - 멀티코어 CPU 활용
 */

import { ScriptConfig } from "../common/default-config";
import { wrapTranslations } from "./wrapper";
import { CLI_OPTIONS, CLI_HELP } from "../t-wrapper/utils/constants";

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
i18n-wrapper-swc-worker - High-Performance Translation Wrapper

${CLI_HELP.USAGE}

${CLI_HELP.OPTIONS}

Performance:
  - Uses SWC parser for fast parsing
  - Uses Worker Threads for parallel processing
  - Expected 10-12x performance improvement over standard version

${CLI_HELP.EXAMPLES}

Note: This version uses Worker Threads and may consume more memory.
      Use standard i18n-wrapper for memory-constrained environments.
        `);
        process.exit(0);
        break;
    }
  }

  console.log("🚀 Starting i18n-wrapper-swc-worker...\n");

  wrapTranslations(config)
    .then((result) => {
      const timeInSeconds = (result.totalTime / 1000).toFixed(2);
      console.log("\n✅ Processing complete!");
      console.log("═══════════════════════════════════════");
      console.log(`⏱️  Total time: ${timeInSeconds}s`);
      console.log(`📊 Total files: ${result.stats.totalFiles}`);
      console.log(`✏️  Modified: ${result.stats.modifiedFiles}`);
      console.log(`⏭️  Skipped: ${result.stats.skippedFiles}`);
      console.log(`❌ Errors: ${result.stats.errorFiles}`);
      console.log(
        `⚡ Average per file: ${result.stats.averageTimePerFile.toFixed(2)}ms`,
      );
      console.log("═══════════════════════════════════════");
      console.log(
        `\n🔧 Workers: ${result.stats.workerStats.totalWorkers} | Completed: ${result.stats.workerStats.completedTasks} | Failed: ${result.stats.workerStats.failedTasks}`,
      );
    })
    .catch((error) => {
      console.error("❌ Fatal error:", error);
      process.exit(1);
    });
}

export { wrapTranslations };
