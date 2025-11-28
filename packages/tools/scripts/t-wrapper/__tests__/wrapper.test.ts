/**
 * SWC Worker Wrapper 테스트
 */

import { wrapTranslations } from "../wrapper";
import * as path from "path";
import {
  writeFile,
  readFile,
  createTempDir,
  removeDir,
} from "../../babel/utils/fs-utils";

describe("t-wrapper-swc-worker", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("i18n-swc-worker-test-");
  });

  afterEach(() => {
    removeDir(tempDir);
  });

  describe("wrapTranslations", () => {
    it("한국어가 포함된 파일을 처리해야 함", async () => {
      const testFile = path.join(tempDir, "test.tsx");
      writeFile(
        testFile,
        `function Component() {
  return <div>안녕하세요</div>;
}`,
      );

      const result = await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
      });

      expect(result.processedFiles.length).toBeGreaterThan(0);
      expect(result.stats.totalFiles).toBe(1);
      expect(result.stats.modifiedFiles).toBe(1);
    });

    it("여러 파일을 병렬로 처리해야 함", async () => {
      // 5개의 테스트 파일 생성
      for (let i = 0; i < 5; i++) {
        const testFile = path.join(tempDir, `test-${i}.tsx`);
        writeFile(
          testFile,
          `function Component${i}() {
  return <div>안녕하세요 ${i}</div>;
}`,
        );
      }

      const result = await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
      });

      expect(result.stats.totalFiles).toBe(5);
      expect(result.stats.modifiedFiles).toBe(5);
      expect(result.processedFiles.length).toBe(5);
    });

    it("통계 정보를 올바르게 반환해야 함", async () => {
      const testFile = path.join(tempDir, "stats-test.tsx");
      writeFile(
        testFile,
        `function Component() {
  return <div>안녕하세요</div>;
}`,
      );

      const result = await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
      });

      expect(result.stats).toMatchObject({
        totalFiles: expect.any(Number),
        modifiedFiles: expect.any(Number),
        skippedFiles: expect.any(Number),
        errorFiles: expect.any(Number),
        averageTimePerFile: expect.any(Number),
        workerStats: expect.any(Object),
      });

      expect(result.stats.workerStats.totalWorkers).toBeGreaterThan(0);
    });

    it("Next.js 환경에서 client 모드일 때만 'use client'를 추가해야 함", async () => {
      const testFile = path.join(tempDir, "client.tsx");
      writeFile(
        testFile,
        `function ClientComp() {
  return <div>안녕하세요</div>;
}`,
      );

      await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        mode: "client",
        framework: "nextjs",
      } as any);

      const content = readFile(testFile);
      expect(content).toMatch(/["']use client["']/);
      expect(content).toContain("useTranslation");
      expect(content).toContain("t(");
    });

    it("server 모드에서는 getServerTranslation 기반으로 t 바인딩을 생성해야 함", async () => {
      const testFile = path.join(tempDir, "server.tsx");
      writeFile(
        testFile,
        `function ServerComp() {
  return <div>안녕하세요</div>;
}`,
      );

      await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        mode: "server",
      } as any);

      const content = readFile(testFile);
      expect(content).toContain("await getServerTranslation");
      expect(content).toContain("const { t } =");
      expect(content).toContain("t(");
    });

    it("빈 파일 목록에 대해 올바르게 처리해야 함", async () => {
      const result = await wrapTranslations({
        sourcePattern: path.join(tempDir, "non-existent/**/*.tsx"),
      });

      expect(result.processedFiles).toEqual([]);
      expect(result.stats.totalFiles).toBe(0);
      expect(result.totalTime).toBe(0);
    });
  });
});
