#!/usr/bin/env node

/**
 * Performance Comparison Tool
 *
 * Babel 파서와 swc 파서의 성능을 비교하는 도구
 *
 * Usage:
 *   npm run benchmark
 *   node dist/bin/benchmark.js
 */

import { runTranslationWrapper } from "../scripts/t-wrapper";
import { loadConfig } from "../scripts/config-loader";

async function runBenchmark() {
  console.log("🔬 Parser Performance Benchmark");
  console.log("═".repeat(80));
  console.log("\nComparing Babel vs swc parser performance...\n");

  const projectConfig = loadConfig();
  const baseConfig = {
    sourcePattern: projectConfig.sourcePattern,
    translationImportSource: projectConfig.translationImportSource,
    constantPatterns: projectConfig.constantPatterns || [],
    dryRun: true, // Don't modify files during benchmark
    enablePerformanceMonitoring: true,
  };

  // Babel 벤치마크
  console.log("📊 Running with Babel parser...");
  console.log("─".repeat(80));
  const babelStart = Date.now();

  try {
    await runTranslationWrapper({
      ...baseConfig,
      parserType: "babel",
    });
  } catch (error) {
    console.error("Babel run failed:", error);
  }

  const babelTime = Date.now() - babelStart;
  console.log(`\n⏱️  Babel Total Time: ${babelTime}ms\n`);

  // swc 벤치마크
  console.log("📊 Running with swc parser...");
  console.log("─".repeat(80));
  const swcStart = Date.now();

  try {
    await runTranslationWrapper({
      ...baseConfig,
      parserType: "swc",
    });
  } catch (error) {
    console.error("swc run failed:", error);
  }

  const swcTime = Date.now() - swcStart;
  console.log(`\n⏱️  swc Total Time: ${swcTime}ms\n`);

  // 결과 비교
  console.log("═".repeat(80));
  console.log("🏁 Benchmark Results");
  console.log("═".repeat(80));
  console.log(`\n📈 Performance Comparison:`);
  console.log(`   Babel:     ${babelTime}ms`);
  console.log(`   swc:       ${swcTime}ms`);
  console.log(
    `   Speedup:   ${(babelTime / swcTime).toFixed(2)}x faster with swc`
  );
  console.log(
    `   Reduction: ${((1 - swcTime / babelTime) * 100).toFixed(1)}% time saved\n`
  );

  if (swcTime < babelTime) {
    console.log(
      `✅ swc is ${(babelTime / swcTime).toFixed(2)}x faster than Babel!`
    );
  } else {
    console.log(
      `⚠️  Unexpected: Babel was faster. This might indicate an issue.`
    );
  }

  console.log("═".repeat(80) + "\n");
}

runBenchmark().catch((error) => {
  console.error("❌ Benchmark failed:", error);
  process.exit(1);
});
