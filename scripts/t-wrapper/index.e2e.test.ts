/**
 * t-wrapper E2E 테스트
 * 실제 파일 시스템을 사용하여 전체 워크플로우 테스트
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { runTranslationWrapper } from "./index";
import { setFile, readFile } from "./test-utils";

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

    setFile(testFile, originalContent);

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
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

    setFile(testFile, originalContent);

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    // 템플릿 리터럴이 변환되었는지 확인
    expect(modifiedContent).not.toContain("`안녕하세요 ${name}님`");
  });

  it("커스텀 훅 내부의 문자열도 변환되어야 함", async () => {
    const testFile = path.join(tempDir, "useToast.ts");
    const originalContent = `function useToast() {
  toast("안녕하세요");
  alert("테스트 메시지");
}`;

    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.ts"),
    });

    const modifiedContent = fs.readFileSync(testFile, "utf-8");
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    // 유니코드 이스케이프 때문에 정확한 문자열 매칭 대신 패턴 체크
    expect(modifiedContent).toMatch(/toast\s*\(\s*t\s*\(/);
    expect(modifiedContent).toMatch(/alert\s*\(\s*t\s*\(/);
    // 한국어 문자열이 t()로 감싸졌는지 확인 (유니코드 이스케이프 고려)
    // \uC548\uB155\uD558\uC138\uC694 = "안녕하세요"
    expect(modifiedContent).toMatch(
      /t\([^)]*\\uC548\\uB155\\uD558\\uC138\\uC694/
    );
    // \uD14C\uC2A4\uD2B8 \uBA54\uC2DC\uC9C0 = "테스트 메시지"
    expect(modifiedContent).toMatch(/t\([^)]*\\uD14C\\uC2A4\\uD2B8/);
  });

  it("서버 컴포넌트는 useTranslation 훅을 추가하지 않아야 함", async () => {
    const testFile = path.join(tempDir, "ServerComponent.tsx");
    const originalContent = `async function ServerComponent() {
  const { t } = await getServerTranslation();
  return <div>안녕하세요</div>;
}`;

    setFile(testFile, originalContent);

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
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

    setFile(testFile, originalContent);

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
    expect(modifiedContent).toContain('const text = "안녕하세요"');
    expect(modifiedContent).not.toContain('t("안녕하세요")');
  });

  it("Next.js 환경에서 client 모드일 때만 'use client'를 추가해야 함", async () => {
    const testFile = path.join(tempDir, "ClientComp.tsx");
    const originalContent = `function ClientComp() {
  return <div>안녕하세요</div>;
}`;
    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      mode: "client",
      framework: "nextjs",
    });

    const modified = fs.readFileSync(testFile, "utf-8");
    expect(modified).toMatch(/["']use client["']/);
    expect(modified).toContain("useTranslation");
    expect(modified).toContain("t(");
  });

  it("React 환경에서 client 모드일 때는 'use client'를 추가하지 않아야 함", async () => {
    const testFile = path.join(tempDir, "ClientReact.tsx");
    const originalContent = `function ClientReact() {
  return <div>안녕하세요</div>;
}`;
    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      mode: "client",
      framework: "react",
    });

    const modified = fs.readFileSync(testFile, "utf-8");
    expect(modified).not.toMatch(/["']use client["']/);
    expect(modified).toContain("useTranslation");
    expect(modified).toContain("t(");
  });

  it("server 모드에서는 getServerTranslation 기반으로 t 바인딩을 생성해야 함", async () => {
    const testFile = path.join(tempDir, "ServerComp.tsx");
    const originalContent = `function ServerComp() {
  return <div>안녕하세요</div>;
}`;
    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      mode: "server",
    });

    const modified = fs.readFileSync(testFile, "utf-8");
    expect(modified).toContain("await getServerTranslation");
    expect(modified).toContain("const { t } =");
    expect(modified).toContain("t(");
  });

  it("serverTranslationFunction 커스텀 함수명을 사용해야 함", async () => {
    const testFile = path.join(tempDir, "ServerCustom.tsx");
    const originalContent = `function ServerCustom() {
  return <div>안녕하세요</div>;
}`;
    fs.writeFileSync(testFile, originalContent, "utf-8");

    await runTranslationWrapper({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
      mode: "server",
      serverTranslationFunction: "getServerT",
    });

    const modified = fs.readFileSync(testFile, "utf-8");
    expect(modified).toContain("await getServerT");
    expect(modified).toContain("import { getServerT } from");
  });
});
