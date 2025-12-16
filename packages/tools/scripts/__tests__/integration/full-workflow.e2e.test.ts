/**
 * 전체 워크플로우 통합 E2E 테스트
 * extractor → type → clean-legacy
 */

import * as path from "path";
import {
  runCLICommand,
  createTestProject,
  createTestConfig,
  createTempDir,
  cleanupDir,
  fileExists,
  readJsonFile,
  readFileContent,
} from "../cli-test-utils";

describe("전체 워크플로우 통합 E2E", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  it("extractor → type → clean-legacy 전체 워크플로우가 작동해야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      src: {
        "Component.tsx": `
          import { useTranslation } from "i18nexus";
          
          export default function Component() {
            const { t } = useTranslation();
            return (
              <div>
                <h1>{t("welcome.title")}</h1>
                <p>{t("welcome.description")}</p>
                <button>{t("button.save")}</button>
              </div>
            );
          }
        `,
      },
    });

    createTestConfig(projectDir, {
      sourcePattern: "src/**/*.{ts,tsx}",
      localesDir: "./locales",
      fallbackNamespace: "common",
      namespacing: {
        enabled: false,
        basePath: "",
        defaultNamespace: "common",
      },
    });

    // 1. extractor 실행 - 키 추출
    const extractResult = await runCLICommand("i18n-extractor", [], projectDir);
    expect(extractResult.exitCode).toBe(0);

    // 번역 파일 확인 (레거시 모드)
    const koFile = path.join(projectDir, "locales", "ko.json");
    expect(fileExists(koFile)).toBe(true);

    let koData = readJsonFile(koFile);
    expect(koData).toHaveProperty("welcome.title");
    expect(koData).toHaveProperty("welcome.description");
    expect(koData).toHaveProperty("button.save");

    // 2. type 생성
    const typeResult = await runCLICommand("i18n-type", [], projectDir);
    expect(typeResult.exitCode).toBe(0);

    const typeFile = path.join(projectDir, "locales", "types", "i18nexus.d.ts");
    expect(fileExists(typeFile)).toBe(true);

    // 3. 소스 코드에서 일부 키 제거 (시뮬레이션)
    // 실제로는 파일을 수정하지만, 여기서는 번역 파일에 미사용 키를 추가
    koData["unused.key"] = "사용 안 됨";
    const enFile = path.join(projectDir, "locales", "en.json");
    const enData = readJsonFile(enFile);
    enData["unused.key"] = "Unused";

    // 번역 파일 다시 저장
    const fs = require("fs");
    fs.writeFileSync(koFile, JSON.stringify(koData, null, 2), "utf-8");
    fs.writeFileSync(enFile, JSON.stringify(enData, null, 2), "utf-8");

    // 4. clean-legacy 실행 - 미사용 키 제거
    const cleanResult = await runCLICommand(
      "i18n-clean-legacy",
      [],
      projectDir,
    );
    expect(cleanResult.exitCode).toBe(0);

    // 미사용 키가 제거되었는지 확인
    koData = readJsonFile(koFile);
    expect(koData).not.toHaveProperty("unused.key");
    // 사용 중인 키는 유지되어야 함
    expect(koData).toHaveProperty("welcome.title");
    expect(koData).toHaveProperty("welcome.description");
    expect(koData).toHaveProperty("button.save");
  });

  it("유효하지 않은 값(N/A)을 가진 키도 제거되어야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      src: {
        "Component.tsx": `
          import { useTranslation } from "i18nexus";
          
          export default function Component() {
            const { t } = useTranslation();
            return <div>{t("valid.key")}</div>;
          }
        `,
      },
    });

    createTestConfig(projectDir, {
      namespacing: {
        enabled: false,
        basePath: "",
        defaultNamespace: "common",
      },
    });

    // extractor 실행
    await runCLICommand("i18n-extractor", [], projectDir);

    // type 생성
    await runCLICommand("i18n-type", [], projectDir);

    // 번역 파일에 유효하지 않은 값 추가 (레거시 모드)
    const koFile = path.join(projectDir, "locales", "ko.json");
    const koData = readJsonFile(koFile);
    koData["invalid.key"] = "N/A";
    koData["another.invalid"] = "_N/A";

    const fs = require("fs");
    fs.writeFileSync(koFile, JSON.stringify(koData, null, 2), "utf-8");

    // clean-legacy 실행
    const cleanResult = await runCLICommand(
      "i18n-clean-legacy",
      [],
      projectDir,
    );
    expect(cleanResult.exitCode).toBe(0);

    // 유효하지 않은 키가 제거되었는지 확인
    const finalKoData = readJsonFile(koFile);
    expect(finalKoData).not.toHaveProperty("invalid.key");
    expect(finalKoData).not.toHaveProperty("another.invalid");
    expect(finalKoData).toHaveProperty("valid.key");
  });

  it("백업 파일이 생성되어야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      src: {
        "Component.tsx": `
          import { useTranslation } from "i18nexus";
          
          export default function Component() {
            const { t } = useTranslation();
            return <div>{t("test.key")}</div>;
          }
        `,
      },
    });

    createTestConfig(projectDir, {
      namespacing: {
        enabled: false,
        basePath: "",
        defaultNamespace: "common",
      },
    });

    // extractor 실행
    await runCLICommand("i18n-extractor", [], projectDir);

    // type 생성
    await runCLICommand("i18n-type", [], projectDir);

    // 번역 파일에 미사용 키 추가 (레거시 모드)
    const koFile = path.join(projectDir, "locales", "ko.json");
    const koData = readJsonFile(koFile);
    koData["unused"] = "사용 안 됨";

    const fs = require("fs");
    fs.writeFileSync(koFile, JSON.stringify(koData, null, 2), "utf-8");

    // clean-legacy 실행 (백업 생성)
    const cleanResult = await runCLICommand(
      "i18n-clean-legacy",
      [],
      projectDir,
    );
    expect(cleanResult.exitCode).toBe(0);

    // 백업 파일이 생성되었는지 확인 (레거시 모드)
    const backupFiles = fs
      .readdirSync(path.join(projectDir, "locales"), {
        recursive: true,
      })
      .filter((f: string) => f.includes(".backup"));

    expect(backupFiles.length).toBeGreaterThan(0);
  });
});
