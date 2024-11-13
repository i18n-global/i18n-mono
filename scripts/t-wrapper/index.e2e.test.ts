/**
 * t-wrapper E2E 테스트
 * 실제 파일 시스템을 사용하여 전체 워크플로우 테스트
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { runTranslationWrapper } from "./index";

describe("t-wrapper E2E", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "i18n-wrapper-e2e-"));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("한국어 문자열을 t() 함수로 변환해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  return <div>안녕하세요</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      dryRun: false,
    });

    const modifiedContent = fs.readFileSync(testFile, "utf-8");
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    // 파일이 변환되었는지 확인 (원본과 다름)
    expect(modifiedContent).not.toBe(originalContent);
  });

  it("템플릿 리터럴을 i18next 형식으로 변환해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const name = "홍길동";
  return <div>{\`안녕하세요 \${name}님\`}</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      dryRun: false,
    });

    const modifiedContent = fs.readFileSync(testFile, "utf-8");
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    // 템플릿 리터럴이 변환되었는지 확인
    expect(modifiedContent).not.toContain("`안녕하세요 ${name}님`");
  });

  it("서버 컴포넌트는 useTranslation 훅을 추가하지 않아야 함", async () => {
    const testFile = path.join(tempDir, "ServerComponent.tsx");
    const originalContent = `async function ServerComponent() {
  const { t } = await getServerTranslation();
  return <div>안녕하세요</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      dryRun: false,
    });

    const modifiedContent = fs.readFileSync(testFile, "utf-8");
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).not.toContain("useTranslation");
    expect(modifiedContent).toContain("getServerTranslation");
  });

  it("i18n-ignore 주석이 있으면 변환하지 않아야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  // i18n-ignore
  const text = "안녕하세요";
  return <div>{text}</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      dryRun: false,
    });

    const modifiedContent = fs.readFileSync(testFile, "utf-8");
    expect(modifiedContent).toContain('const text = "안녕하세요"');
    expect(modifiedContent).not.toContain("t(\"안녕하세요\")");
  });


  it("dry-run 모드에서는 파일을 수정하지 않아야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  return <div>안녕하세요</div>;
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      dryRun: true,
    });

    const modifiedContent = fs.readFileSync(testFile, "utf-8");
    expect(modifiedContent).toBe(originalContent);
  });

});

