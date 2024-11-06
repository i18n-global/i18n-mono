/**
 * Translation Wrapper 완료 리포트 출력
 */

import { PerformanceReport } from "../common/performance-monitor";

/**
 * 작업 완료 후 성능 리포트 출력
 */
export function printCompletionReport(
  report: PerformanceReport,
  processedFiles: string[],
  totalTime: number
): void {
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

