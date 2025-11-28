/**
 * t-wrapper-swc-worker E2E 테스트
 * 실제 파일 시스템을 사용하여 전체 워크플로우 테스트
 */

import * as path from "path";
import { wrapTranslations } from "../wrapper";
import {
  writeFile,
  readFile,
  createTempDir,
  removeDir,
} from "../../t-wrapper/utils/fs-utils";

describe("t-wrapper-swc-worker E2E", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir("i18n-swc-worker-e2e-");
  });

  afterEach(() => {
    removeDir(tempDir);
  });

  it("한국어 문자열을 t() 함수로 변환해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  return <div>안녕하세요</div>;
}`;

    writeFile(testFile, originalContent);

    const result = await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    expect(modifiedContent).not.toBe(originalContent);
    expect(result.processedFiles).toContain(testFile);
  });

  it("템플릿 리터럴을 i18next 형식으로 변환해야 함", async () => {
    const testFile = path.join(tempDir, "Component.tsx");
    const originalContent = `function Component() {
  const name = "홍길동";
  return <div>{\`안녕하세요 \${name}님\`}</div>;
}`;

    writeFile(testFile, originalContent);

    await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    expect(modifiedContent).not.toContain("`안녕하세요 ${name}님`");
  });

  it("여러 파일을 병렬로 처리해야 함", async () => {
    const fileCount = 10;
    const files: string[] = [];

    // 10개의 파일 생성
    for (let i = 0; i < fileCount; i++) {
      const testFile = path.join(tempDir, `Component${i}.tsx`);
      writeFile(
        testFile,
        `function Component${i}() {
  return <div>안녕하세요 ${i}</div>;
}`,
      );
      files.push(testFile);
    }

    const startTime = Date.now();
    const result = await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });
    const endTime = Date.now();

    expect(result.stats.totalFiles).toBe(fileCount);
    expect(result.stats.modifiedFiles).toBe(fileCount);
    expect(result.processedFiles.length).toBe(fileCount);

    // 병렬 처리로 인해 시간이 절약되었는지 확인
    const totalTime = endTime - startTime;
    console.log(`Processed ${fileCount} files in ${totalTime}ms`);
    console.log(
      `Average time per file: ${result.stats.averageTimePerFile.toFixed(2)}ms`,
    );
    console.log(`Worker stats:`, result.stats.workerStats);

    // 모든 파일이 올바르게 변환되었는지 확인
    files.forEach((file) => {
      const content = readFile(file);
      expect(content).toContain("t(");
      expect(content).toContain("useTranslation");
    });
  });

  it("커스텀 훅 내부의 문자열도 변환되어야 함", async () => {
    const testFile = path.join(tempDir, "useToast.ts");
    const originalContent = `function useToast() {
  toast("안녕하세요");
  alert("테스트 메시지");
}`;

    writeFile(testFile, originalContent);

    await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.ts"),
    });

    const modifiedContent = readFile(testFile);
    expect(modifiedContent).toContain("t(");
    expect(modifiedContent).toContain("useTranslation");
    expect(modifiedContent).toMatch(/toast\s*\(\s*t\s*\(/);
    expect(modifiedContent).toMatch(/alert\s*\(\s*t\s*\(/);
  });

  it("서버 컴포넌트는 useTranslation 훅을 추가하지 않아야 함", async () => {
    const testFile = path.join(tempDir, "ServerComponent.tsx");
    const originalContent = `async function ServerComponent() {
  const { t } = await getServerTranslation();
  return <div>안녕하세요</div>;
}`;

    writeFile(testFile, originalContent);

    await wrapTranslations({
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

    writeFile(testFile, originalContent);

    await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    const modifiedContent = readFile(testFile);
    expect(modifiedContent).toContain('const text = "안녕하세요"');
    expect(modifiedContent).not.toContain('t("안녕하세요")');
  });

  it("에러 파일 통계를 올바르게 기록해야 함", async () => {
    const validFile = path.join(tempDir, "Valid.tsx");
    const invalidFile = path.join(tempDir, "Invalid.tsx");

    writeFile(
      validFile,
      `function Valid() {
  return <div>안녕하세요</div>;
}`,
    );

    // 잘못된 구문의 파일
    writeFile(invalidFile, `function Invalid() { return <div>안녕하세요`);

    const result = await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    expect(result.stats.totalFiles).toBe(2);
    expect(result.stats.modifiedFiles).toBe(1); // validFile만 처리
    expect(result.stats.errorFiles).toBe(1); // invalidFile은 에러
  });

  it("성능 통계를 올바르게 반환해야 함", async () => {
    const testFile = path.join(tempDir, "Perf.tsx");
    writeFile(
      testFile,
      `function Perf() {
  return <div>안녕하세요</div>;
}`,
    );

    const result = await wrapTranslations({
      sourcePattern: path.join(tempDir, "**/*.tsx"),
    });

    expect(result.totalTime).toBeGreaterThan(0);
    expect(result.stats.averageTimePerFile).toBeGreaterThan(0);
    expect(result.stats.workerStats.totalWorkers).toBeGreaterThan(0);
    expect(result.stats.workerStats.completedTasks).toBeGreaterThan(0);
  });
});
