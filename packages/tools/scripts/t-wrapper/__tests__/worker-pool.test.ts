/**
 * Worker Pool 유닛 테스트
 */

import { WorkerPool } from "../swc-worker/worker-pool";
import { WorkerTask, WorkerResult } from "../swc-worker/types";
import { SCRIPT_CONFIG_DEFAULTS } from "../../common/default-config";

// Worker threads가 Jest에서 TypeScript를 로드하지 못하므로 스킵
describe.skip("WorkerPool", () => {
  let workerPool: WorkerPool;

  beforeEach(async () => {
    workerPool = new WorkerPool(2); // 테스트용으로 2개만 사용
    await workerPool.initialize();
  });

  afterEach(async () => {
    await workerPool.terminate();
  });

  it("Worker Pool이 올바르게 초기화되어야 함", () => {
    const stats = workerPool.getStats();
    expect(stats.totalWorkers).toBe(2);
    expect(stats.activeWorkers).toBe(0);
    expect(stats.queuedTasks).toBe(0);
  });

  it("작업을 실행하고 결과를 반환해야 함", async () => {
    const task: WorkerTask = {
      type: "process-file",
      filePath: "test.tsx",
      code: `function Test() { return <div>Test</div>; }`,
      config: SCRIPT_CONFIG_DEFAULTS as any,
    };

    const result = await workerPool.runTask(task);
    expect(result.filePath).toBe("test.tsx");
    expect(["success", "error", "no-change"]).toContain(result.type);
  });

  it("통계가 올바르게 업데이트되어야 함", async () => {
    const task: WorkerTask = {
      type: "process-file",
      filePath: "test.tsx",
      code: `function Test() { return <div>안녕하세요</div>; }`,
      config: SCRIPT_CONFIG_DEFAULTS as any,
    };

    await workerPool.runTask(task);

    const stats = workerPool.getStats();
    expect(stats.completedTasks + stats.failedTasks).toBeGreaterThan(0);
  });

  it("여러 작업을 병렬로 처리할 수 있어야 함", async () => {
    const tasks: WorkerTask[] = Array.from({ length: 5 }, (_, i) => ({
      type: "process-file",
      filePath: `test-${i}.tsx`,
      code: `function Test${i}() { return <div>Test ${i}</div>; }`,
      config: SCRIPT_CONFIG_DEFAULTS as any,
    }));

    const results = await Promise.all(
      tasks.map((task) => workerPool.runTask(task)),
    );

    expect(results.length).toBe(5);
    results.forEach((result, i) => {
      expect(result.filePath).toBe(`test-${i}.tsx`);
    });
  });
});
