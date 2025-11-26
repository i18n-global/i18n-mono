/**
 * extractor E2E 테스트
 * 실제 파일 시스템을 사용하여 전체 워크플로우 테스트
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { runTranslationExtractor } from "./index";

describe("extractor E2E", () => {
  let tempDir: string;
  let outputDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "i18n-extractor-e2e-"));
    outputDir = path.join(tempDir, "locales");
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("t() 함수 호출에서 키를 추출해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const { t } = useTranslation();
  return <div>{t("hello.world")}</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
    });

    const koFile = path.join(outputDir, "ko.json");
    expect(fs.existsSync(koFile)).toBe(true);

    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));
    expect(koContent["hello.world"]).toBeDefined();
  });

  it("여러 키를 추출해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const { t } = useTranslation();
  return (
    <div>
      {t("greeting")}
      {t("farewell")}
    </div>
  );
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
    });

    const koFile = path.join(outputDir, "ko.json");
    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));

    expect(koContent).toHaveProperty("greeting");
    expect(koContent).toHaveProperty("farewell");
  });

  it("defaultValue가 있으면 추출해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const { t } = useTranslation();
  return <div>{t("hello", { defaultValue: "안녕하세요" })}</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
    });

    const koFile = path.join(outputDir, "ko.json");
    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));

    expect(koContent["hello"]).toBe("안녕하세요");
  });

  it("여러 파일에서 키를 추출해야 함", async () => {
    const file1 = path.join(tempDir, "Component1.tsx");
    const file2 = path.join(tempDir, "Component2.tsx");

    fs.writeFileSync(file1, `function Component1() { return <div>{t("key1")}</div>; }`, "utf-8");
    fs.writeFileSync(file2, `function Component2() { return <div>{t("key2")}</div>; }`, "utf-8");

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
    });

    const koFile = path.join(outputDir, "ko.json");
    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));

    expect(koContent).toHaveProperty("key1");
    expect(koContent).toHaveProperty("key2");
  });

  it("중복 키는 하나만 저장해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const { t } = useTranslation();
  return (
    <div>
      {t("duplicate")}
      {t("duplicate")}
    </div>
  );
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
    });

    const koFile = path.join(outputDir, "ko.json");
    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));

    expect(koContent).toHaveProperty("duplicate");
    // 중복 키는 하나만 있어야 함
    const keys = Object.keys(koContent);
    const duplicateKeys = keys.filter((k) => k === "duplicate");
    expect(duplicateKeys.length).toBe(1);
  });

  it("CSV 형식으로 출력해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const { t } = useTranslation();
  return <div>{t("hello.world")}</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "csv",
      outputFile: "translations.csv",
    });

    const csvFile = path.join(outputDir, "translations.csv");
    expect(fs.existsSync(csvFile)).toBe(true);

    const csvContent = fs.readFileSync(csvFile, "utf-8");
    expect(csvContent).toContain("Key,English,Korean");
    expect(csvContent).toContain("hello.world");
  });

  it("기존 번역 파일에 새 키를 추가해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const koFile = path.join(outputDir, "ko.json");

    // 기존 번역 파일 생성
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      koFile,
      JSON.stringify({ existing: "기존 키" }, null, 2),
      "utf-8"
    );

    // 새 키가 있는 파일 생성
    fs.writeFileSync(
      testFile,
      `function Component() { return <div>{t("new.key")}</div>; }`,
      "utf-8"
    );

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
      force: false,
    });

    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));

    // 기존 키 유지
    expect(koContent).toHaveProperty("existing");
    expect(koContent["existing"]).toBe("기존 키");
    // 새 키 추가
    expect(koContent["new.key"]).toBeDefined();
  });

  it("force 모드에서는 기존 번역을 덮어써야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const koFile = path.join(outputDir, "ko.json");

    // 기존 번역 파일 생성
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      koFile,
      JSON.stringify({ old: "기존 값" }, null, 2),
      "utf-8"
    );

    // 새 키만 있는 파일 생성
    fs.writeFileSync(
      testFile,
      `function Component() { return <div>{t("new")}</div>; }`,
      "utf-8"
    );

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
      force: true,
    });

    const koContent = JSON.parse(fs.readFileSync(koFile, "utf-8"));

    // 기존 키는 제거됨
    expect(koContent).not.toHaveProperty("old");
    // 새 키만 있음
    expect(koContent).toHaveProperty("new");
  });

  it("index.ts 파일을 생성해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    fs.writeFileSync(
      testFile,
      `function Component() { return <div>{t("hello")}</div>; }`,
      "utf-8"
    );

    await runTranslationExtractor({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      outputDir,
      outputFormat: "json",
      languages: ["ko", "en"],
    });

    const indexFile = path.join(outputDir, "index.ts");
    expect(fs.existsSync(indexFile)).toBe(true);

    const indexContent = fs.readFileSync(indexFile, "utf-8");
    expect(indexContent).toContain("import ko from");
    expect(indexContent).toContain("import en from");
    expect(indexContent).toContain("export const translations");
  });
});

