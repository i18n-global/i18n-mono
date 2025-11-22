/**
 * Performance Monitoring System
 *
 * 각 함수의 성능을 측정하고 콘솔에 출력
 */

import { PerformanceReporter } from "./performance-reporter";

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

// 디버그 모드 확인
const isDebugMode = process.env.I18N_PERF_DEBUG === "true";

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private startTimes: Map<string, number> = new Map();
  private enabled: boolean;

  constructor(options?: {
    enabled?: boolean;
    environment?: string;
    release?: string;
  }) {
    this.enabled =
      options?.enabled ?? process.env.I18N_PERF_MONITOR !== "false";

    if (isDebugMode && this.enabled) {
      console.log("[Performance Monitor] ✅ Initialized");
      console.log(
        "[Performance Monitor] Environment:",
        options?.environment || process.env.NODE_ENV || "production"
      );
    }
  }

  /**
   * 함수 실행 시간 측정 시작
   */
  start(name: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    const startTime = performance.now();
    this.startTimes.set(name, startTime);

    if (isDebugMode) {
      console.log(`[Performance Monitor] 🎯 Started: ${name}`, metadata || {});
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

    // 느린 작업 경고 (1초 이상)
    if (duration > 1000) {
      console.warn(
        `[Performance Monitor] 🐌 Slow operation detected: ${name} (${duration.toFixed(2)}ms)`,
        metadata || {}
      );
    } else if (isDebugMode) {
      console.log(
        `[Performance Monitor] ✅ Finished: ${name} (${duration.toFixed(2)}ms)`,
        metadata || {}
      );
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
    PerformanceReporter.printReport(report, verbose);
  }

  /**
   * 메트릭 초기화
   */
  reset(): void {
    this.metrics = [];
    this.startTimes.clear();
  }

  /**
   * 커스텀 메트릭 로깅
   */
  captureCustomMetric(
    name: string,
    value: number,
    unit: string = "millisecond",
    metadata?: Record<string, any>
  ): void {
    if (!this.enabled) return;

    console.log(`[Performance Monitor] 📊 Custom Metric: ${name}`, {
      value,
      unit,
      ...metadata,
    });
  }

  /**
   * 에러 캡처
   */
  captureError(error: Error, context?: Record<string, any>): void {
    PerformanceReporter.printError(error, context);
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
