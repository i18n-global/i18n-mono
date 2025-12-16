/**
 * i18n-type CLI E2E 테스트
 * 타입 생성 CLI 명령어 실행 검증
 */

import * as path from "path";
import {
  runCLICommand,
  createTestProject,
  createTestConfig,
  createTempDir,
  cleanupDir,
  fileExists,
  readFileContent,
} from "../cli-test-utils";

describe("i18n-type CLI E2E", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  describe("기본 실행", () => {
    it("번역 파일에서 타입 정의를 생성해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        locales: {
          common: {
            "en.json": JSON.stringify(
              { "welcome.title": "Welcome", "button.save": "Save" },
              null,
              2,
            ),
            "ko.json": JSON.stringify(
              { "welcome.title": "환영합니다", "button.save": "저장" },
              null,
              2,
            ),
          },
        },
      });

      createTestConfig(projectDir, {
        localesDir: "./locales",
        fallbackNamespace: "common",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(0);
      const typeFile = path.join(
        projectDir,
        "locales",
        "types",
        "i18nexus.d.ts",
      );
      expect(fileExists(typeFile)).toBe(true);

      const typeContent = readFileContent(typeFile);
      expect(typeContent).toContain("CommonKeys");
      expect(typeContent).toContain("welcome.title");
      expect(typeContent).toContain("button.save");
    });

    it("여러 네임스페이스의 타입을 생성해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        locales: {
          common: {
            "en.json": JSON.stringify({ "common.key": "Common" }, null, 2),
            "ko.json": JSON.stringify({ "common.key": "공통" }, null, 2),
          },
          dashboard: {
            "en.json": JSON.stringify(
              { "dashboard.title": "Dashboard" },
              null,
              2,
            ),
            "ko.json": JSON.stringify(
              { "dashboard.title": "대시보드" },
              null,
              2,
            ),
          },
        },
      });

      createTestConfig(projectDir, {
        localesDir: "./locales",
        fallbackNamespace: "common",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(0);
      const typeFile = path.join(
        projectDir,
        "locales",
        "types",
        "i18nexus.d.ts",
      );
      const typeContent = readFileContent(typeFile);

      expect(typeContent).toContain("CommonKeys");
      expect(typeContent).toContain("DashboardKeys");
      expect(typeContent).toContain("TranslationNamespace");
    });
  });

  describe("fallback namespace", () => {
    it("fallback namespace 키가 모든 네임스페이스에 포함되어야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        locales: {
          common: {
            "en.json": JSON.stringify({ "common.key": "Common" }, null, 2),
            "ko.json": JSON.stringify({ "common.key": "공통" }, null, 2),
          },
          dashboard: {
            "en.json": JSON.stringify(
              { "dashboard.title": "Dashboard" },
              null,
              2,
            ),
            "ko.json": JSON.stringify(
              { "dashboard.title": "대시보드" },
              null,
              2,
            ),
          },
        },
      });

      createTestConfig(projectDir, {
        localesDir: "./locales",
        fallbackNamespace: "common",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(0);
      const typeFile = path.join(
        projectDir,
        "locales",
        "types",
        "i18nexus.d.ts",
      );
      const typeContent = readFileContent(typeFile);

      // useTranslation의 반환 타입에 CommonKeys가 포함되어야 함
      // DashboardKeys 타입 자체가 아니라 useTranslation("dashboard")의 반환 타입에 포함됨
      expect(typeContent).toContain("DashboardKeys");
      expect(typeContent).toContain("CommonKeys");
      expect(typeContent).toMatch(/UseTranslationReturn<.*CommonKeys/);
    });
  });

  describe("에러 처리", () => {
    it("locales 디렉토리가 없으면 에러를 반환해야 함", async () => {
      const projectDir = createTestProject(tempDir, {});

      createTestConfig(projectDir, {
        localesDir: "./nonexistent",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr || result.stdout).toContain("No translation files");
    });

    it("번역 파일이 없으면 에러를 반환해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        locales: {},
      });

      createTestConfig(projectDir, {
        localesDir: "./locales",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr || result.stdout).toContain("No translation files");
    });
  });

  describe("타입 파일 내용 검증", () => {
    it("생성된 타입 파일에 module augmentation이 포함되어야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        locales: {
          common: {
            "en.json": JSON.stringify({ "test.key": "Test" }, null, 2),
            "ko.json": JSON.stringify({ "test.key": "테스트" }, null, 2),
          },
        },
      });

      createTestConfig(projectDir, {
        localesDir: "./locales",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(0);
      const typeFile = path.join(
        projectDir,
        "locales",
        "types",
        "i18nexus.d.ts",
      );
      const typeContent = readFileContent(typeFile);

      // Module augmentation이 포함되어야 함
      expect(typeContent).toContain("declare module");
      expect(typeContent).toContain("useTranslation");
      expect(typeContent).toContain("getTranslation");
    });

    it("생성된 타입 파일에 JSDoc 주석이 포함되어야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        locales: {
          common: {
            "en.json": JSON.stringify({ "test.key": "Test" }, null, 2),
            "ko.json": JSON.stringify({ "test.key": "테스트" }, null, 2),
          },
        },
      });

      createTestConfig(projectDir, {
        localesDir: "./locales",
      });

      const result = await runCLICommand("i18n-type", [], projectDir);

      expect(result.exitCode).toBe(0);
      const typeFile = path.join(
        projectDir,
        "locales",
        "types",
        "i18nexus.d.ts",
      );
      const typeContent = readFileContent(typeFile);

      // JSDoc 주석이 포함되어야 함
      expect(typeContent).toContain("/**");
      expect(typeContent).toContain("Auto-generated");
    });
  });
});
