/**
 * SWC + Worker Threads 기반 Translation Wrapper
 * - 병렬 처리로 성능 향상
 * - SWC 파서 사용
 */

import { glob } from "glob";
import { readFileSync } from "fs";
import {
  ScriptConfig,
  SCRIPT_CONFIG_DEFAULTS,
} from "../../common/default-config";
import { WorkerPool } from "./worker-pool";
import { WorkerTask, WorkerResult } from "./types";

export async function wrapTranslations(
  config: Partial<ScriptConfig> = {},
): Promise<{
  processedFiles: string[];
  totalTime: number;
  stats: {
    totalFiles: number;
    modifiedFiles: number;
    skippedFiles: number;
    errorFiles: number;
    averageTimePerFile: number;
    workerStats: any;
  };
}> {
  const fullConfig = {
    ...SCRIPT_CONFIG_DEFAULTS,
    ...config,
  } as Required<ScriptConfig>;

  const startTime = Date.now();
  const processedFiles: string[] = [];

  // 1. 파일 목록 가져오기
  const filePaths = await glob(fullConfig.sourcePattern);
  console.log(`📁 Found ${filePaths.length} files to process`);

  if (filePaths.length === 0) {
    return {
      processedFiles: [],
      totalTime: 0,
      stats: {
        totalFiles: 0,
        modifiedFiles: 0,
        skippedFiles: 0,
        errorFiles: 0,
        averageTimePerFile: 0,
        workerStats: {},
      },
    };
  }

  // 2. Worker Pool 초기화
  const workerPool = new WorkerPool();
  await workerPool.initialize();
  console.log(
    `🔧 Worker pool initialized with ${workerPool.getStats().totalWorkers} workers`,
  );

  // 3. 파일 처리 (병렬)
  let modifiedCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  try {
    const tasks: Promise<WorkerResult>[] = filePaths.map((filePath) => {
      const code = readFileSync(filePath, "utf-8");
      const task: WorkerTask = {
        type: "process-file",
        filePath,
        code,
        config: fullConfig,
      };
      return workerPool.runTask(task);
    });

    // 모든 작업 완료 대기
    const results = await Promise.allSettled(tasks);

    // 결과 처리
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const workerResult = result.value;
        if (workerResult.type === "success" && workerResult.modified) {
          processedFiles.push(workerResult.filePath);
          modifiedCount++;
        } else if (workerResult.type === "error") {
          errorCount++;
          console.error(
            `❌ Error processing ${filePaths[index]}: ${workerResult.error}`,
          );
        } else {
          skippedCount++;
        }
      } else {
        errorCount++;
        console.error(
          `❌ Task failed for ${filePaths[index]}: ${result.reason}`,
        );
      }
    });
  } finally {
    // 4. Worker Pool 종료
    await workerPool.terminate();
  }

  const totalTime = Date.now() - startTime;
  const workerStats = workerPool.getStats();

  return {
    processedFiles,
    totalTime,
    stats: {
      totalFiles: filePaths.length,
      modifiedFiles: modifiedCount,
      skippedFiles: skippedCount,
      errorFiles: errorCount,
      averageTimePerFile: totalTime / filePaths.length,
      workerStats,
    },
  };
}
