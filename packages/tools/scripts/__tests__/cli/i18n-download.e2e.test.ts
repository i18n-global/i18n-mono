/**
 * i18n-download CLI E2E 테스트
 * Google Sheets 다운로드 CLI 명령어 실행 검증 (mock 사용)
 */

import * as fs from "fs";
import * as path from "path";
import { google } from "googleapis";
import {
  runCLICommand,
  createTestProject,
  createTestConfig,
  createTempDir,
  cleanupDir,
  fileExists,
  readJsonFile,
  listDirectories,
} from "../cli-test-utils";

// googleapis mock
jest.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    sheets: jest.fn(),
  },
}));

describe("i18n-download CLI E2E", () => {
  let tempDir: string;
  let mockSheets: any;

  beforeEach(() => {
    tempDir = createTempDir();

    // Mock Google Auth
    (google.auth.GoogleAuth as unknown as jest.Mock).mockImplementation(() => ({
      getClient: jest.fn().mockResolvedValue({}),
    }));

    // Mock Sheets API
    mockSheets = {
      spreadsheets: {
        get: jest.fn(),
        values: {
          get: jest.fn(),
        },
      },
    };

    (google.sheets as jest.Mock).mockReturnValue(mockSheets);

    // 기본 mock 응답 설정
    (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
      data: {
        sheets: [
          { properties: { title: "common", sheetId: 0 } },
          { properties: { title: "dashboard", sheetId: 1 } },
        ],
      },
    } as any);
  });

  afterEach(() => {
    cleanupDir(tempDir);
    jest.clearAllMocks();
  });

  describe("기본 실행", () => {
    it("모든 시트를 자동으로 다운로드해야 함", async () => {
      const projectDir = createTestProject(tempDir, {});

      // credentials 파일 생성
      fs.writeFileSync(
        path.join(projectDir, "credentials.json"),
        JSON.stringify({
          type: "service_account",
          project_id: "test",
          private_key:
            "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
          client_email: "test@test.iam.gserviceaccount.com",
        }),
      );

      // 각 시트의 데이터 mock
      (mockSheets.spreadsheets.values.get as jest.Mock)
        .mockResolvedValueOnce({
          data: {
            values: [
              ["Key", "English", "Korean"],
              ["common.key", "Common", "공통"],
            ],
          },
        } as any)
        .mockResolvedValueOnce({
          data: {
            values: [
              ["Key", "English", "Korean"],
              ["dashboard.title", "Dashboard", "대시보드"],
            ],
          },
        } as any);

      createTestConfig(projectDir, {
        localesDir: "./locales",
        googleSheets: {
          spreadsheetId: "test-spreadsheet-id",
          credentialsPath: "./credentials.json",
          sheetName: "Translations",
        },
      });

      const result = await runCLICommand("i18n-download", [], projectDir);

      expect(result.exitCode).toBe(0);
      // 각 네임스페이스별로 파일이 생성되어야 함
      expect(
        fileExists(path.join(projectDir, "locales", "common", "en.json")),
      ).toBe(true);
      expect(
        fileExists(path.join(projectDir, "locales", "common", "ko.json")),
      ).toBe(true);
      expect(
        fileExists(path.join(projectDir, "locales", "dashboard", "en.json")),
      ).toBe(true);
      expect(
        fileExists(path.join(projectDir, "locales", "dashboard", "ko.json")),
      ).toBe(true);
    });

    it("다운로드된 파일의 내용이 올바르게 저장되어야 함", async () => {
      const projectDir = createTestProject(tempDir, {});

      fs.writeFileSync(
        path.join(projectDir, "credentials.json"),
        JSON.stringify({
          type: "service_account",
          project_id: "test",
          private_key:
            "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
          client_email: "test@test.iam.gserviceaccount.com",
        }),
      );

      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [{ properties: { title: "common" } }],
        },
      } as any);

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["test.key", "Test Value", "테스트 값"],
          ],
        },
      } as any);

      createTestConfig(projectDir, {
        localesDir: "./locales",
        googleSheets: {
          spreadsheetId: "test-spreadsheet-id",
          credentialsPath: "./credentials.json",
          sheetName: "Translations",
        },
      });

      const result = await runCLICommand("i18n-download", [], projectDir);

      expect(result.exitCode).toBe(0);
      const enData = readJsonFile(
        path.join(projectDir, "locales", "common", "en.json"),
      );
      const koData = readJsonFile(
        path.join(projectDir, "locales", "common", "ko.json"),
      );

      expect(enData["test.key"]).toBe("Test Value");
      expect(koData["test.key"]).toBe("테스트 값");
    });
  });

  describe("옵션 테스트", () => {
    it("--languages 옵션으로 지정한 언어만 다운로드해야 함", async () => {
      const projectDir = createTestProject(tempDir, {});

      fs.writeFileSync(
        path.join(projectDir, "credentials.json"),
        JSON.stringify({
          type: "service_account",
          project_id: "test",
          private_key:
            "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
          client_email: "test@test.iam.gserviceaccount.com",
        }),
      );

      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [{ properties: { title: "common" } }],
        },
      } as any);

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [
            ["Key", "English", "Japanese"],
            ["test.key", "Test", "テスト"],
          ],
        },
      } as any);

      createTestConfig(projectDir, {
        localesDir: "./locales",
        languages: ["en", "ja"],
        googleSheets: {
          spreadsheetId: "test-spreadsheet-id",
          credentialsPath: "./credentials.json",
          sheetName: "Translations",
        },
      });

      const result = await runCLICommand(
        "i18n-download",
        ["--languages", "en,ja"],
        projectDir,
      );

      expect(result.exitCode).toBe(0);
      expect(
        fileExists(path.join(projectDir, "locales", "common", "en.json")),
      ).toBe(true);
      expect(
        fileExists(path.join(projectDir, "locales", "common", "ja.json")),
      ).toBe(true);
      expect(
        fileExists(path.join(projectDir, "locales", "common", "ko.json")),
      ).toBe(false);
    });
  });

  describe("에러 처리", () => {
    it("spreadsheet ID가 없으면 에러를 반환해야 함", async () => {
      const projectDir = createTestProject(tempDir, {});

      createTestConfig(projectDir, {
        localesDir: "./locales",
        googleSheets: {
          spreadsheetId: "",
          credentialsPath: "./credentials.json",
          sheetName: "Translations",
        },
      });

      const result = await runCLICommand("i18n-download", [], projectDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr || result.stdout).toContain("Spreadsheet ID");
    });

    it("credentials 파일이 없으면 에러를 반환해야 함", async () => {
      const projectDir = createTestProject(tempDir, {});

      createTestConfig(projectDir, {
        localesDir: "./locales",
        googleSheets: {
          spreadsheetId: "test-id",
          credentialsPath: "./nonexistent.json",
          sheetName: "Translations",
        },
      });

      const result = await runCLICommand("i18n-download", [], projectDir);

      expect(result.exitCode).toBe(1);
      expect(result.stderr || result.stdout).toContain("Credentials file");
    });
  });
});
