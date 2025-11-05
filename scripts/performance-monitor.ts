/**
 * Performance Monitoring System
 *
 * 각 함수의 성능을 측정하고 Sentry/다른 모니터링 서비스에 보고
 */

import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

export interface PerformanceMetric {
  name: string;
  duration: number; // ms
  timestamp: number;
  metadata?: Record<string, any>;
  memoryUsage?: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
}

export interface PerformanceReport {
  totalDuration: number;
  metrics: PerformanceMetric[];
  summary: {
    averageDuration: number;
    slowestOperation: string;
    fastestOperation: string;
    totalOperations: number;
  };
}

// 개발자의 기본 Sentry DSN (사용자 데이터 수집용)
// 사용자가 자신의 DSN을 설정하면 override됨
// 빌드 시 scripts/inject-sentry-dsn.js가 이 값을 주입함
const DEFAULT_SENTRY_DSN = process.env.I18NEXUS_TOOLS_SENTRY_DSN || "";

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private startTimes: Map<string, number> = new Map();
  private enabled: boolean;
  private sentryEnabled: boolean;

  constructor(options?: {
    enabled?: boolean;
    sentryDsn?: string;
    environment?: string;
    release?: string;
  }) {
    this.enabled =
      options?.enabled ?? process.env.I18N_PERF_MONITOR !== "false";

    // DSN 우선순위:
    // 1. 사용자가 직접 설정한 DSN (options.sentryDsn)
    // 2. 사용자의 환경변수 (SENTRY_DSN)
    // 3. 개발자의 기본 DSN (DEFAULT_SENTRY_DSN)
    const dsn =
      options?.sentryDsn || process.env.SENTRY_DSN || DEFAULT_SENTRY_DSN;
    this.sentryEnabled = !!dsn;

    // Sentry 초기화
    if (this.sentryEnabled && this.enabled) {
      Sentry.init({
        dsn,
        environment:
          options?.environment || process.env.NODE_ENV || "production",
        release: options?.release || process.env.npm_package_version,
        integrations: [new ProfilingIntegration()],
        // 샘플링 비율 (모든 사용자 데이터 수집하면 비용 많이 나옴)
        tracesSampleRate: 0.1, // 10%만 수집
        profilesSampleRate: 0.1,
      });
    }
  }

  /**
   * 함수 실행 시간 측정 시작
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    const startTime = performance.now();
    this.startTimes.set(name, startTime);

    // Sentry 트랜잭션 시작
    if (this.sentryEnabled) {
      const transaction = Sentry.startTransaction({
        name,
        op: "function",
        data: metadata,
      });
      Sentry.getCurrentHub().configureScope((scope) => {
        scope.setSpan(transaction);
      });
    }
  }

  /**
   * 함수 실행 시간 측정 종료
   */
  end(name: string, metadata?: Record<string, any>): PerformanceMetric | null {
    if (!this.enabled) return null;

    const startTime = this.startTimes.get(name);
    if (!startTime) {
      console.warn(`⚠️  Performance measurement not started for: ${name}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    const memoryUsage = process.memoryUsage();

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
      memoryUsage: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss,
      },
    };

    this.metrics.push(metric);
    this.startTimes.delete(name);

    // Sentry에 보고
    if (this.sentryEnabled) {
      const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
      if (transaction) {
        transaction.setMeasurement("duration", duration, "millisecond");
        transaction.setMeasurement(
          "memory.heapUsed",
          memoryUsage.heapUsed,
          "byte"
        );
        transaction.finish();
      }

      // 느린 작업 경고 (1초 이상)
      if (duration > 1000) {
        Sentry.captureMessage(`Slow operation detected: ${name}`, {
          level: "warning",
          tags: {
            operation: name,
          },
          extra: {
            duration: `${duration.toFixed(2)}ms`,
            metadata,
          },
        });
      }
    }

    return metric;
  }

  /**
   * 함수를 래핑하여 자동으로 성능 측정
   */
  wrap<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    metadata?: Record<string, any>
  ): T {
    if (!this.enabled) return fn;

    const monitor = this;

    return function (this: any, ...args: Parameters<T>): ReturnType<T> {
      monitor.start(name, metadata);
      try {
        const result = fn.apply(this, args);

        // Promise 처리
        if (result && typeof result.then === "function") {
          return result.then(
            (value: any) => {
              monitor.end(name, metadata);
              return value;
            },
            (error: any) => {
              monitor.end(name, { ...metadata, error: true });
              throw error;
            }
          ) as ReturnType<T>;
        }

        monitor.end(name, metadata);
        return result;
      } catch (error) {
        monitor.end(name, { ...metadata, error: true });
        throw error;
      }
    } as T;
  }

  /**
   * 데코레이터: 메서드 성능 자동 측정
   */
  static measure(metadata?: Record<string, any>) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      const className = target.constructor.name;
      const methodName = `${className}.${propertyKey}`;

      descriptor.value = function (this: any, ...args: any[]) {
        // @ts-ignore
        const monitor = this.performanceMonitor as PerformanceMonitor;

        if (!monitor || !monitor.enabled) {
          return originalMethod.apply(this, args);
        }

        monitor.start(methodName, metadata);
        try {
          const result = originalMethod.apply(this, args);

          // Promise 처리
          if (result && typeof result.then === "function") {
            return result.then(
              (value: any) => {
                monitor.end(methodName, metadata);
                return value;
              },
              (error: any) => {
                monitor.end(methodName, { ...metadata, error: true });
                throw error;
              }
            );
          }

          monitor.end(methodName, metadata);
          return result;
        } catch (error) {
          monitor.end(methodName, { ...metadata, error: true });
          throw error;
        }
      };

      return descriptor;
    };
  }

  /**
   * 성능 리포트 생성
   */
  getReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalDuration: 0,
        metrics: [],
        summary: {
          averageDuration: 0,
          slowestOperation: "N/A",
          fastestOperation: "N/A",
          totalOperations: 0,
        },
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const averageDuration = totalDuration / this.metrics.length;

    const sorted = [...this.metrics].sort((a, b) => b.duration - a.duration);
    const slowest = sorted[0];
    const fastest = sorted[sorted.length - 1];

    return {
      totalDuration,
      metrics: this.metrics,
      summary: {
        averageDuration,
        slowestOperation: `${slowest.name} (${slowest.duration.toFixed(2)}ms)`,
        fastestOperation: `${fastest.name} (${fastest.duration.toFixed(2)}ms)`,
        totalOperations: this.metrics.length,
      },
    };
  }

  /**
   * 성능 리포트 출력
   */
  printReport(verbose: boolean = false): void {
    if (!this.enabled || this.metrics.length === 0) {
      console.log("📊 Performance monitoring disabled or no metrics collected");
      return;
    }

    const report = this.getReport();

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

    // Sentry에 전체 리포트 전송
    if (this.sentryEnabled) {
      Sentry.captureMessage("Performance Report", {
        level: "info",
        extra: {
          report,
        },
      });
    }
  }

  /**
   * 메트릭 초기화
   */
  reset(): void {
    this.metrics = [];
    this.startTimes.clear();
  }

  /**
   * Sentry에 커스텀 이벤트 전송
   */
  captureCustomMetric(
    name: string,
    value: number,
    unit: string = "millisecond",
    metadata?: Record<string, any>
  ): void {
    if (!this.sentryEnabled) return;

    Sentry.captureMessage(`Custom Metric: ${name}`, {
      level: "info",
      tags: {
        metric: name,
      },
      extra: {
        value,
        unit,
        metadata,
      },
    });
  }

  /**
   * 에러 캡처
   */
  captureError(error: Error, context?: Record<string, any>): void {
    if (this.sentryEnabled) {
      Sentry.captureException(error, {
        extra: context,
      });
    } else {
      console.error("❌ Error:", error);
      if (context) {
        console.error("Context:", context);
      }
    }
  }

  /**
   * Sentry flush (프로세스 종료 전 호출)
   */
  async flush(): Promise<void> {
    if (this.sentryEnabled) {
      await Sentry.close(2000);
    }
  }
}

/**
 * 전역 Performance Monitor 인스턴스
 */
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * 유틸리티: 함수 실행 시간 측정
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  globalPerformanceMonitor.start(name, metadata);
  try {
    const result = await fn();
    globalPerformanceMonitor.end(name, metadata);
    return result;
  } catch (error) {
    globalPerformanceMonitor.end(name, { ...metadata, error: true });
    throw error;
  }
}

/**
 * 유틸리티: 동기 함수 실행 시간 측정
 */
export function measureSync<T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, any>
): T {
  globalPerformanceMonitor.start(name, metadata);
  try {
    const result = fn();
    globalPerformanceMonitor.end(name, metadata);
    return result;
  } catch (error) {
    globalPerformanceMonitor.end(name, { ...metadata, error: true });
    throw error;
  }
}
