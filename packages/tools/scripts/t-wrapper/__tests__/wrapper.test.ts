/**
 * Babel Wrapper 테스트
 */

import { wrapTranslations } from "../babel/wrapper";
import * as path from "path";
import {
  writeFile,
  readFile,
  createTempDir,
  removeDir,
} from "../common/utils/fs-utils";

describe("t-wrapper (Babel)", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("i18n-wrapper-test-");
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
      expect(result.processedFiles).toContain(testFile);
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

      expect(result.processedFiles.length).toBe(5);
    });

    it("총 처리 시간을 올바르게 반환해야 함", async () => {
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

      expect(result.totalTime).toBeGreaterThan(0);
      expect(result.processedFiles.length).toBeGreaterThan(0);
    });

    it("빈 파일 목록에 대해 올바르게 처리해야 함", async () => {
      const result = await wrapTranslations({
        sourcePattern: path.join(tempDir, "non-existent/**/*.tsx"),
      });

      expect(result.processedFiles).toEqual([]);
    });
  });
});
