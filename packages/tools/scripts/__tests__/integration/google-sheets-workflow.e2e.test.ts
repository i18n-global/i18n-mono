/**
 * Google Sheets 통합 E2E 테스트
 * upload → download 워크플로우 (mock 사용)
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

describe("Google Sheets 통합 E2E", () => {
  let tempDir: string;
  let mockSheets: any;
  let uploadedData: any[] = [];

  beforeEach(() => {
    tempDir = createTempDir();
    uploadedData = [];

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
          update: jest.fn().mockImplementation((params: any) => {
            // 업로드된 데이터 저장
            if (params.requestBody?.values) {
              uploadedData.push(...params.requestBody.values);
            }
            return Promise.resolve({});
          }),
        },
      },
    };

    (google.sheets as jest.Mock).mockReturnValue(mockSheets);

    // 기본 mock 응답 설정
    (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
      data: {
        properties: { timeZone: "Asia/Seoul" },
        sheets: [
          { properties: { title: "common" } },
          { properties: { title: "dashboard" } },
        ],
      },
    } as any);
  });

  afterEach(() => {
    cleanupDir(tempDir);
    jest.clearAllMocks();
    uploadedData = [];
  });

  it("업로드 후 다운로드 시 데이터가 일치해야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      locales: {
        common: {
          "ko.json": JSON.stringify(
            { "common.key1": "공통 키1", "common.key2": "공통 키2" },
            null,
            2,
          ),
          "en.json": JSON.stringify(
            { "common.key1": "Common Key1", "common.key2": "Common Key2" },
            null,
            2,
          ),
        },
      },
    });

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

    createTestConfig(projectDir, {
      localesDir: "./locales",
      googleSheets: {
        spreadsheetId: "test-spreadsheet-id",
        credentialsPath: "./credentials.json",
        sheetName: "Translations",
      },
    });

    // 1. 업로드
    (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
      data: { values: [["Key", "English", "Korean"]] },
    } as any);

    const uploadResult = await runCLICommand("i18n-upload", [], projectDir);
    expect(uploadResult.exitCode).toBe(0);
    expect(mockSheets.spreadsheets.values.update).toHaveBeenCalled();

    // 2. 다운로드를 위한 mock 설정 (업로드한 데이터 반환)
    (mockSheets.spreadsheets.values.get as jest.Mock)
      .mockResolvedValueOnce({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["common.key1", "Common Key1", "공통 키1"],
            ["common.key2", "Common Key2", "공통 키2"],
          ],
        },
      } as any)
      .mockResolvedValueOnce({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["common.key1", "Common Key1", "공통 키1"],
            ["common.key2", "Common Key2", "공통 키2"],
          ],
        },
      } as any);

    // 다운로드 디렉토리 초기화
    const downloadDir = path.join(tempDir, "download-test");
    fs.mkdirSync(downloadDir, { recursive: true });

    // 다운로드 실행 (다른 디렉토리에)
    const downloadResult = await runCLICommand(
      "i18n-download",
      ["--locales-dir", downloadDir],
      projectDir,
    );

    expect(downloadResult.exitCode).toBe(0);

    // 다운로드된 파일 확인
    const downloadedKoFile = path.join(downloadDir, "common", "ko.json");
    const downloadedEnFile = path.join(downloadDir, "common", "en.json");

    expect(fileExists(downloadedKoFile)).toBe(true);
    expect(fileExists(downloadedEnFile)).toBe(true);

    const downloadedKoData = readJsonFile(downloadedKoFile);
    const downloadedEnData = readJsonFile(downloadedEnFile);

    // 원본 데이터와 일치해야 함
    expect(downloadedKoData["common.key1"]).toBe("공통 키1");
    expect(downloadedKoData["common.key2"]).toBe("공통 키2");
    expect(downloadedEnData["common.key1"]).toBe("Common Key1");
    expect(downloadedEnData["common.key2"]).toBe("Common Key2");
  });

  it("다중 네임스페이스 업로드 및 다운로드가 작동해야 함", async () => {
    const projectDir = createTestProject(tempDir, {
      locales: {
        common: {
          "ko.json": JSON.stringify({ "common.key": "공통" }, null, 2),
          "en.json": JSON.stringify({ "common.key": "Common" }, null, 2),
        },
        dashboard: {
          "ko.json": JSON.stringify({ "dashboard.title": "대시보드" }, null, 2),
          "en.json": JSON.stringify(
            { "dashboard.title": "Dashboard" },
            null,
            2,
          ),
        },
      },
    });

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

    createTestConfig(projectDir, {
      localesDir: "./locales",
      googleSheets: {
        spreadsheetId: "test-spreadsheet-id",
        credentialsPath: "./credentials.json",
        sheetName: "Translations",
      },
    });

    // 업로드
    (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
      data: { values: [["Key", "English", "Korean"]] },
    } as any);

    const uploadResult = await runCLICommand("i18n-upload", [], projectDir);
    expect(uploadResult.exitCode).toBe(0);

    // 다운로드 mock 설정
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

    const downloadDir = path.join(tempDir, "download-test");
    fs.mkdirSync(downloadDir, { recursive: true });

    const downloadResult = await runCLICommand(
      "i18n-download",
      ["--locales-dir", downloadDir],
      projectDir,
    );

    expect(downloadResult.exitCode).toBe(0);

    // 모든 네임스페이스가 다운로드되었는지 확인
    expect(fileExists(path.join(downloadDir, "common", "ko.json"))).toBe(true);
    expect(fileExists(path.join(downloadDir, "common", "en.json"))).toBe(true);
    expect(fileExists(path.join(downloadDir, "dashboard", "ko.json"))).toBe(
      true,
    );
    expect(fileExists(path.join(downloadDir, "dashboard", "en.json"))).toBe(
      true,
    );
  });
});
