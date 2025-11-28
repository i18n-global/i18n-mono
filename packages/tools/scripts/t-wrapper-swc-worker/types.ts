/**
 * Worker Thread 통신용 타입 정의
 */

import { ScriptConfig } from "../common/default-config";

/**
 * Worker로 전송할 작업 메시지
 */
export interface WorkerTask {
  type: "process-file";
  filePath: string;
  code: string;
  config: Required<ScriptConfig>;
}

/**
 * Worker로부터 받을 결과 메시지
 */
export interface WorkerResult {
  type: "success" | "error" | "no-change";
  filePath: string;
  modified?: boolean;
  error?: string;
  processingTime?: number;
}

/**
 * Worker Pool 통계
 */
export interface WorkerPoolStats {
  totalWorkers: number;
  activeWorkers: number;
  queuedTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalProcessingTime: number;
}
