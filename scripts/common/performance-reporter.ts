/**
 * Performance Reporter
 *
 * 성능 리포트를 콘솔에 출력하는 기능
 */

import { PerformanceReport, PerformanceMetric } from "./performance-monitor";

export class PerformanceReporter {
  /**
   * 성능 리포트를 콘솔에 출력
   */
  static printReport(report: PerformanceReport, verbose: boolean = false): void {
    if (report.metrics.length === 0) {
      console.log("📊 Performance monitoring disabled or no metrics collected");
      return;
    }

    console.log("\n📊 Performance Report");
    console.log("═".repeat(80));
    console.log(`⏱️  Total Duration: ${report.totalDuration.toFixed(2)}ms`);
    console.log(`📈 Total Operations: ${report.summary.totalOperations}`);
    console.log(
      `📊 Average Duration: ${report.summary.averageDuration.toFixed(2)}ms`
    );
    console.log(`🐌 Slowest: ${report.summary.slowestOperation}`);
    console.log(`⚡ Fastest: ${report.summary.fastestOperation}`);

    if (verbose) {
      console.log("\n📋 Detailed Metrics:");
      console.log("─".repeat(80));

      // 느린 순서로 정렬
      const sorted = [...report.metrics].sort(
        (a, b) => b.duration - a.duration
      );

      sorted.forEach((metric, index) => {
        const memMB = metric.memoryUsage
          ? (metric.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
          : "N/A";

        console.log(
          `${index + 1}. ${metric.name.padEnd(40)} ` +
            `${metric.duration.toFixed(2)}ms`.padStart(12) +
            ` | Memory: ${memMB}MB`
        );

        if (metric.metadata && Object.keys(metric.metadata).length > 0) {
          console.log(`   Metadata:`, metric.metadata);
        }
      });
    }

    console.log("═".repeat(80) + "\n");
  }

  /**
   * 단일 메트릭을 콘솔에 출력
   */
  static printMetric(metric: PerformanceMetric): void {
    const memMB = metric.memoryUsage
      ? (metric.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
      : "N/A";

    console.log(
      `📊 ${metric.name}: ${metric.duration.toFixed(2)}ms | Memory: ${memMB}MB`
    );

    if (metric.metadata && Object.keys(metric.metadata).length > 0) {
      console.log(`   Metadata:`, metric.metadata);
    }
  }

  /**
   * 에러를 콘솔에 출력
   */
  static printError(error: Error, context?: Record<string, any>): void {
    console.error("❌ Error:", error);
    if (context) {
      console.error("Context:", context);
    }
  }
}

