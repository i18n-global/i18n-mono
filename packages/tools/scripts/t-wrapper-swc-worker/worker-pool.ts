/**
 * Worker Pool 관리 클래스
 * - Worker Thread 생성 및 관리
 * - 작업 큐 관리
 * - 결과 수집
 */

import { Worker } from "worker_threads";
import { WorkerTask, WorkerResult, WorkerPoolStats } from "./types";
import * as path from "path";
import * as os from "os";

interface QueuedTask {
  task: WorkerTask;
  resolve: (result: WorkerResult) => void;
  reject: (error: Error) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: QueuedTask[] = [];
  private availableWorkers: Worker[] = [];
  private workerTasks: Map<Worker, QueuedTask> = new Map();
  private stats: WorkerPoolStats;

  constructor(private workerCount: number = os.cpus().length) {
    this.stats = {
      totalWorkers: workerCount,
      activeWorkers: 0,
      queuedTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      totalProcessingTime: 0,
    };
  }

  /**
   * Worker Pool 초기화
   */
  async initialize(): Promise<void> {
    const workerScript = path.join(__dirname, "worker.js");

    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
      this.availableWorkers.push(worker);

      // Worker 메시지 리스너 설정
      worker.on("message", (result: WorkerResult) => {
        this.handleWorkerMessage(worker, result);
      });

      // Worker 에러 리스너 설정
      worker.on("error", (error) => {
        this.handleWorkerError(worker, error);
      });

      // Worker 종료 리스너 설정
      worker.on("exit", (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
        }
      });
    }
  }

  /**
   * 작업 실행
   */
  async runTask(task: WorkerTask): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
      const queuedTask: QueuedTask = { task, resolve, reject };
      this.taskQueue.push(queuedTask);
      this.stats.queuedTasks = this.taskQueue.length;
      this.processQueue();
    });
  }

  /**
   * 큐 처리
   */
  private processQueue(): void {
    while (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const queuedTask = this.taskQueue.shift()!;
      const worker = this.availableWorkers.shift()!;

      this.workerTasks.set(worker, queuedTask);
      this.stats.activeWorkers++;
      this.stats.queuedTasks = this.taskQueue.length;

      worker.postMessage(queuedTask.task);
    }
  }

  /**
   * Worker 메시지 처리
   */
  private handleWorkerMessage(worker: Worker, result: WorkerResult): void {
    const queuedTask = this.workerTasks.get(worker);
    if (!queuedTask) return;

    this.workerTasks.delete(worker);
    this.availableWorkers.push(worker);
    this.stats.activeWorkers--;

    if (result.type === "success") {
      this.stats.completedTasks++;
      if (result.processingTime) {
        this.stats.totalProcessingTime += result.processingTime;
      }
      queuedTask.resolve(result);
    } else if (result.type === "error") {
      this.stats.failedTasks++;
      queuedTask.reject(new Error(result.error || "Unknown worker error"));
    } else {
      // no-change
      this.stats.completedTasks++;
      queuedTask.resolve(result);
    }

    this.processQueue();
  }

  /**
   * Worker 에러 처리
   */
  private handleWorkerError(worker: Worker, error: Error): void {
    const queuedTask = this.workerTasks.get(worker);
    if (queuedTask) {
      this.workerTasks.delete(worker);
      this.stats.failedTasks++;
      queuedTask.reject(error);
    }

    // Worker를 사용 가능 목록에서 제거
    const index = this.availableWorkers.indexOf(worker);
    if (index > -1) {
      this.availableWorkers.splice(index, 1);
    }
  }

  /**
   * 통계 조회
   */
  getStats(): WorkerPoolStats {
    return { ...this.stats };
  }

  /**
   * Worker Pool 종료
   */
  async terminate(): Promise<void> {
    await Promise.all(this.workers.map((worker) => worker.terminate()));
    this.workers = [];
    this.availableWorkers = [];
    this.workerTasks.clear();
  }
}
