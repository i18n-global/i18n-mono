/**
 * translation-wrapper 테스트
 */

import { wrapTranslations } from "../wrapper";
import * as path from "path";
import { writeFile, readFile, createTempDir, removeDir } from "../utils/fs-utils";

describe("translation-wrapper", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("i18n-test-");
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
}`
      );

      const result = await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
      });
      expect(result.processedFiles.length).toBeGreaterThan(0);
    });

    it("Next.js 환경에서 client 모드일 때만 'use client'를 추가해야 함", async () => {
      const testFile = path.join(tempDir, "client.tsx");
      writeFile(
        testFile,
        `function ClientComp() {
  return <div>안녕하세요</div>;
}`
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

    it("React 환경에서 client 모드일 때는 'use client'를 추가하지 않아야 함", async () => {
      const testFile = path.join(tempDir, "client-react.tsx");
      writeFile(
        testFile,
        `function ClientComp() {
  return <div>안녕하세요</div>;
}`
      );

      await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        mode: "client",
        framework: "react",
      } as any);

      const content = readFile(testFile);
      expect(content).not.toMatch(/["']use client["']/);
      expect(content).toContain("useTranslation");
      expect(content).toContain("t(");
    });

    it("server 모드에서는 지정한 serverTranslationFunction으로 t 바인딩을 생성해야 함", async () => {
      const testFile = path.join(tempDir, "server.tsx");
      writeFile(
        testFile,
        `function ServerComp() {
  return <div>안녕하세요</div>;
}`
      );

      await wrapTranslations({
        sourcePattern: path.join(tempDir, "**/*.tsx"),
        mode: "server",
        serverTranslationFunction: "getServerT",
      } as any);

      const content = readFile(testFile);
      expect(content).toContain("await getServerT");
      expect(content).toContain("const { t } =");
      expect(content).toContain("t(");
    });
  });
});
