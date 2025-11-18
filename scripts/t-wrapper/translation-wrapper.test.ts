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

    it("Next.js 환경에서 client 모드일 때만 'use client'를 추가해야 함", async () => {
      const testFile = path.join(tempDir, "client.tsx");
      fs.writeFileSync(
        testFile,
        `function ClientComp() {
  return <div>안녕하세요</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: false,
        mode: "client",
        framework: "nextjs",
      } as any);

      await wrapper.processFiles();
      const content = fs.readFileSync(testFile, "utf-8");
      expect(content).toContain("'use client'");
      expect(content).toContain("useTranslation");
      expect(content).toContain("t(");
    });

    it("React 환경에서 client 모드일 때는 'use client'를 추가하지 않아야 함", async () => {
      const testFile = path.join(tempDir, "client-react.tsx");
      fs.writeFileSync(
        testFile,
        `function ClientComp() {
  return <div>안녕하세요</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: false,
        mode: "client",
        framework: "react",
      } as any);

      await wrapper.processFiles();
      const content = fs.readFileSync(testFile, "utf-8");
      expect(content).not.toContain("'use client'");
      expect(content).toContain("useTranslation");
      expect(content).toContain("t(");
    });

    it("server 모드에서는 지정한 serverTranslationFunction으로 t 바인딩을 생성해야 함", async () => {
      const testFile = path.join(tempDir, "server.tsx");
      fs.writeFileSync(
        testFile,
        `function ServerComp() {
  return <div>안녕하세요</div>;
}`,
        "utf-8"
      );

      const wrapper = new TranslationWrapper({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        dryRun: false,
        mode: "server",
        serverTranslationFunction: "getServerT",
      } as any);

      await wrapper.processFiles();
      const content = fs.readFileSync(testFile, "utf-8");
      expect(content).toContain("await getServerT");
      expect(content).toContain("const { t } =");
      expect(content).toContain("t(");
    });
  });
});
