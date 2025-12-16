/**
 * extractor → type 통합 E2E 테스트
 * 전체 워크플로우 검증
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

describe("extractor → type 통합 E2E", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  it("extractor 실행 후 type 생성까지 전체 워크플로우가 작동해야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      "src/app": {
        common: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation("common");
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
      },
    });

    createTestConfig(projectDir, {
      sourcePattern: "src/**/*.{ts,tsx}",
      localesDir: "./locales",
      fallbackNamespace: "common",
      namespacing: {
        enabled: true,
        basePath: "src/app",
        defaultNamespace: "common",
        strategy: "first-folder",
      },
    });

    // 1. extractor 실행
    const extractResult = await runCLICommand("i18n-extractor", [], projectDir);
    expect(extractResult.exitCode).toBe(0);

    // 번역 파일이 생성되었는지 확인
    expect(
      fileExists(path.join(projectDir, "locales", "common", "ko.json")),
    ).toBe(true);
    expect(
      fileExists(path.join(projectDir, "locales", "common", "en.json")),
    ).toBe(true);

    const koData = readJsonFile(
      path.join(projectDir, "locales", "common", "ko.json"),
    );
    expect(koData["welcome.title"]).toBeDefined();
    expect(koData["welcome.description"]).toBeDefined();
    expect(koData["button.save"]).toBeDefined();

    // 2. type 생성
    const typeResult = await runCLICommand("i18n-type", [], projectDir);
    expect(typeResult.exitCode).toBe(0);

    // 타입 파일이 생성되었는지 확인
    const typeFile = path.join(projectDir, "locales", "types", "i18nexus.d.ts");
    expect(fileExists(typeFile)).toBe(true);

    // 타입 파일 내용 검증
    const typeContent = readFileContent(typeFile);
    expect(typeContent).toContain("CommonKeys");
    expect(typeContent).toContain("welcome.title");
    expect(typeContent).toContain("welcome.description");
    expect(typeContent).toContain("button.save");
  });

  it("fallback namespace가 타입에 포함되어야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      "src/app": {
        common: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation("common");
              return <div>{t("common.key")}</div>;
            }
          `,
        },
        dashboard: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation("dashboard");
              return <div>{t("dashboard.title")}</div>;
            }
          `,
        },
      },
    });

    createTestConfig(projectDir, {
      sourcePattern: "src/**/*.{ts,tsx}",
      localesDir: "./locales",
      fallbackNamespace: "common",
      namespacing: {
        enabled: true,
        basePath: "src/app",
        defaultNamespace: "common",
        strategy: "first-folder",
      },
    });

    // extractor 실행
    await runCLICommand("i18n-extractor", [], projectDir);

    // type 생성
    const typeResult = await runCLICommand("i18n-type", [], projectDir);
    expect(typeResult.exitCode).toBe(0);

    // 타입 파일 검증
    const typeFile = path.join(projectDir, "locales", "types", "i18nexus.d.ts");
    const typeContent = readFileContent(typeFile);

    // DashboardKeys와 CommonKeys가 모두 존재해야 함
    expect(typeContent).toContain("DashboardKeys");
    expect(typeContent).toContain("CommonKeys");
    // useTranslation의 반환 타입에 CommonKeys가 포함되어야 함
    expect(typeContent).toMatch(/UseTranslationReturn<.*CommonKeys/);
  });

  it("여러 네임스페이스의 타입이 모두 생성되어야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      "src/app": {
        common: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation("common");
              return <div>{t("common.key")}</div>;
            }
          `,
        },
        dashboard: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation("dashboard");
              return <div>{t("dashboard.title")}</div>;
            }
          `,
        },
        settings: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation("settings");
              return <div>{t("settings.key")}</div>;
            }
          `,
        },
      },
    });

    createTestConfig(projectDir, {
      sourcePattern: "src/**/*.{ts,tsx}",
      localesDir: "./locales",
      namespacing: {
        enabled: true,
        basePath: "src/app",
        defaultNamespace: "common",
        strategy: "first-folder",
      },
    });

    // extractor 실행
    await runCLICommand("i18n-extractor", [], projectDir);

    // type 생성
    const typeResult = await runCLICommand("i18n-type", [], projectDir);
    expect(typeResult.exitCode).toBe(0);

    // 타입 파일 검증
    const typeFile = path.join(projectDir, "locales", "types", "i18nexus.d.ts");
    const typeContent = readFileContent(typeFile);

    expect(typeContent).toContain("CommonKeys");
    expect(typeContent).toContain("DashboardKeys");
    expect(typeContent).toContain("SettingsKeys");
    expect(typeContent).toContain("TranslationNamespace");
  });
});
