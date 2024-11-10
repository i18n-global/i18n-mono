/**
 * translation-wrapper 테스트
 * TranslationWrapper 클래스 테스트
 */

import { TranslationWrapper } from "./translation-wrapper";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

describe("translation-wrapper", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "i18n-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe("processFiles", () => {
    it("한국어가 포함된 파일을 처리해야 함", async () => {
      const testFile = path.join(tempDir, "test.tsx");
      fs.writeFileSync(
        testFile,
        `function Component() {
  return <div>안녕하세요</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: true,
      });

      const result = await wrapper.processFiles();
      expect(result.processedFiles.length).toBeGreaterThan(0);
    });

    it("한국어가 없으면 처리하지 않아야 함", async () => {
      const testFile = path.join(tempDir, "test.tsx");
      fs.writeFileSync(
        testFile,
        `function Component() {
  return <div>Hello</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: true,
      });

      const result = await wrapper.processFiles();
      expect(result.processedFiles.length).toBe(0);
    });

    it("i18n-ignore 주석이 있으면 처리하지 않아야 함", async () => {
      const testFile = path.join(tempDir, "test.tsx");
      fs.writeFileSync(
        testFile,
        `function Component() {
  // i18n-ignore
  return <div>안녕하세요</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: true,
      });

      const result = await wrapper.processFiles();
      expect(result.processedFiles.length).toBe(0);
    });

    it("서버 컴포넌트는 useTranslation 훅을 추가하지 않아야 함", async () => {
      const testFile = path.join(tempDir, "test.tsx");
      fs.writeFileSync(
        testFile,
        `async function Component() {
  const t = await getServerTranslation();
  return <div>안녕하세요</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: true,
      });

      const result = await wrapper.processFiles();
      const content = fs.readFileSync(testFile, "utf-8");
      expect(content).not.toContain("useTranslation");
    });
  });
});
