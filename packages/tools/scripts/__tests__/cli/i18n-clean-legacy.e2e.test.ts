/**
 * i18n-clean-legacy CLI E2E 테스트
 * 미사용 키 정리 CLI 명령어 실행 검증
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
  listFiles,
} from "../cli-test-utils";

describe("i18n-clean-legacy CLI E2E", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupDir(tempDir);
  });

  describe("기본 실행", () => {
    it("미사용 키를 제거해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("used.key")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            {
              "used.key": "사용됨",
              "unused.key": "사용 안 됨",
            },
            null,
            2,
          ),
          "en.json": JSON.stringify(
            {
              "used.key": "Used",
              "unused.key": "Unused",
            },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir, {
        sourcePattern: "src/**/*.{ts,tsx}",
        localesDir: "./locales",
      });

      const result = await runCLICommand("i18n-clean-legacy", [], projectDir);

      expect(result.exitCode).toBe(0);
      const koData = readJsonFile(path.join(projectDir, "locales", "ko.json"));
      expect(koData["used.key"]).toBeDefined();
      expect(koData["unused.key"]).toBeUndefined();
    });

    it("유효하지 않은 값(N/A)을 가진 키를 제거해야 함", async () => {
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
        locales: {
          "ko.json": JSON.stringify(
            {
              "valid.key": "유효한 값",
              "invalid.key": "N/A",
            },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir);

      const result = await runCLICommand("i18n-clean-legacy", [], projectDir);

      expect(result.exitCode).toBe(0);
      const koData = readJsonFile(path.join(projectDir, "locales", "ko.json"));
      expect(koData["valid.key"]).toBeDefined();
      expect(koData["invalid.key"]).toBeUndefined();
    });
  });

  describe("옵션 테스트", () => {
    it("--dry-run 옵션으로 파일을 수정하지 않아야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("used")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            { used: "사용됨", unused: "사용 안 됨" },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir);

      const originalContent = readJsonFile(
        path.join(projectDir, "locales", "ko.json"),
      );

      const result = await runCLICommand(
        "i18n-clean-legacy",
        ["--dry-run"],
        projectDir,
      );

      expect(result.exitCode).toBe(0);
      const afterContent = readJsonFile(
        path.join(projectDir, "locales", "ko.json"),
      );
      expect(afterContent).toEqual(originalContent);
      // 리포트는 출력되어야 함
      expect(result.stdout.length).toBeGreaterThan(0);
    });

    it("--no-backup 옵션으로 백업 파일을 생성하지 않아야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("used")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            { used: "사용됨", unused: "사용 안 됨" },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir);

      const result = await runCLICommand(
        "i18n-clean-legacy",
        ["--no-backup"],
        projectDir,
      );

      expect(result.exitCode).toBe(0);
      // 백업 파일이 생성되지 않아야 함
      const backupFiles = listFiles(projectDir, true).filter((f) =>
        f.includes(".backup"),
      );
      expect(backupFiles.length).toBe(0);
    });

    it("기본적으로 백업 파일을 생성해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("used")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            { used: "사용됨", unused: "사용 안 됨" },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir);

      const result = await runCLICommand("i18n-clean-legacy", [], projectDir);

      expect(result.exitCode).toBe(0);
      // 백업 파일이 생성되어야 함
      const backupFiles = listFiles(projectDir, true).filter((f) =>
        f.includes(".backup"),
      );
      expect(backupFiles.length).toBeGreaterThan(0);
    });

    it("--pattern 옵션으로 소스 파일 패턴을 지정할 수 있어야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        app: {
          "page.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Page() {
              const { t } = useTranslation();
              return <div>{t("app.key")}</div>;
            }
          `,
        },
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("src.key")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            { "app.key": "앱", "src.key": "소스", unused: "사용 안 됨" },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir);

      const result = await runCLICommand(
        "i18n-clean-legacy",
        ["--pattern", "app/**/*.tsx"],
        projectDir,
      );

      expect(result.exitCode).toBe(0);
      const koData = readJsonFile(path.join(projectDir, "locales", "ko.json"));
      // app.key는 유지, src.key와 unused는 제거되어야 함
      expect(koData["app.key"]).toBeDefined();
      expect(koData["src.key"]).toBeUndefined();
      expect(koData["unused"]).toBeUndefined();
    });
  });

  describe("리포트 출력", () => {
    it("제거된 키에 대한 리포트를 출력해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("used")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            { used: "사용됨", unused1: "사용 안 됨1", unused2: "사용 안 됨2" },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir);

      const result = await runCLICommand("i18n-clean-legacy", [], projectDir);

      expect(result.exitCode).toBe(0);
      // 리포트에 제거된 키 정보가 포함되어야 함
      expect(result.stdout).toMatch(/removed|unused/i);
    });

    it("누락된 키에 대한 리포트를 출력해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("missing.key")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify({}, null, 2),
        },
      });

      createTestConfig(projectDir);

      const result = await runCLICommand("i18n-clean-legacy", [], projectDir);

      expect(result.exitCode).toBe(0);
      // 리포트에 누락된 키 정보가 포함되어야 함
      expect(result.stdout).toMatch(/missing|not found/i);
    });
  });

  describe("다중 언어 처리", () => {
    it("모든 언어 파일에서 미사용 키를 제거해야 함", async () => {
      const projectDir = createTestProject(tempDir, {
        src: {
          "Component.tsx": `
            import { useTranslation } from "i18nexus";
            
            export default function Component() {
              const { t } = useTranslation();
              return <div>{t("used")}</div>;
            }
          `,
        },
        locales: {
          "ko.json": JSON.stringify(
            { used: "사용됨", unused: "사용 안 됨" },
            null,
            2,
          ),
          "en.json": JSON.stringify(
            { used: "Used", unused: "Unused" },
            null,
            2,
          ),
          "ja.json": JSON.stringify(
            { used: "使用", unused: "未使用" },
            null,
            2,
          ),
        },
      });

      createTestConfig(projectDir, {
        languages: ["en", "ko", "ja"],
      });

      const result = await runCLICommand("i18n-clean-legacy", [], projectDir);

      expect(result.exitCode).toBe(0);
      const koData = readJsonFile(path.join(projectDir, "locales", "ko.json"));
      const enData = readJsonFile(path.join(projectDir, "locales", "en.json"));
      const jaData = readJsonFile(path.join(projectDir, "locales", "ja.json"));

      expect(koData).not.toHaveProperty("unused");
      expect(enData).not.toHaveProperty("unused");
      expect(jaData).not.toHaveProperty("unused");
    });
  });
});
