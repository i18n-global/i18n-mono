/**
 * Google Sheets CSV 관련 기능 테스트
 */

import * as fs from "fs";
import * as path from "path";
import { GoogleSheetsManager } from "./google-sheets";
import {
  createTempDir,
  cleanupTempDir,
  createTempFile,
  fileExists,
  readFileContent,
  readJsonFile,
} from "./__tests__/test-utils";
import { google } from "googleapis";

// googleapis mock
jest.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    sheets: jest.fn(),
  },
}));

describe("GoogleSheetsManager - CSV 기능", () => {
  let tempDir: string;
  let manager: GoogleSheetsManager;

  beforeEach(() => {
    tempDir = createTempDir();
    manager = new GoogleSheetsManager({
      credentialsPath: path.join(tempDir, "credentials.json"),
      spreadsheetId: "test-spreadsheet-id",
      sheetName: "TestSheet",
    });

    // Mock credentials
    fs.writeFileSync(
      path.join(tempDir, "credentials.json"),
      JSON.stringify({
        type: "service_account",
        project_id: "test-project",
        private_key_id: "test-key-id",
        private_key:
          "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
        client_email: "test@test.iam.gserviceaccount.com",
      }),
    );

    // Mock Google Auth
    (google.auth.GoogleAuth as unknown as jest.Mock).mockImplementation(() => ({
      getClient: jest.fn().mockResolvedValue({}),
    }));

    // Mock Sheets API
    const mockSheets = {
      spreadsheets: {
        get: jest.fn() as jest.MockedFunction<any>,
        values: {
          get: jest.fn() as jest.MockedFunction<any>,
          update: jest.fn() as jest.MockedFunction<any>,
        },
      },
    };

    (google.sheets as jest.Mock).mockReturnValue(mockSheets);
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe("readTranslationsFromCSV", () => {
    it("CSV 파일에서 번역 데이터를 읽어야 함", async () => {
      const csvPath = path.join(tempDir, "translations.csv");
      const csvContent = `Key,English,Korean
welcome.title,Welcome,환영합니다
button.save,Save,저장`;

      fs.writeFileSync(csvPath, csvContent, "utf-8");

      const translations = await manager.readTranslationsFromCSV(csvPath);

      expect(translations).toHaveLength(2);
      expect(translations[0].key).toBe("welcome.title");
      expect(translations[0].en).toBe("Welcome");
      expect(translations[0].ko).toBe("환영합니다");
    });

    it("CSV 파일이 없으면 에러를 발생시켜야 함", async () => {
      const csvPath = path.join(tempDir, "nonexistent.csv");

      await expect(manager.readTranslationsFromCSV(csvPath)).rejects.toThrow(
        "CSV file not found",
      );
    });

    it("빈 CSV 파일은 빈 배열을 반환해야 함", async () => {
      const csvPath = path.join(tempDir, "empty.csv");
      fs.writeFileSync(csvPath, "Key,English,Korean\n", "utf-8");

      const translations = await manager.readTranslationsFromCSV(csvPath);

      expect(translations).toEqual([]);
    });

    it("따옴표로 감싸진 값은 올바르게 파싱해야 함", async () => {
      const csvPath = path.join(tempDir, "translations.csv");
      const csvContent = `Key,English,Korean
"key,with,commas","Hello, World","안녕, 세상"`;

      fs.writeFileSync(csvPath, csvContent, "utf-8");

      const translations = await manager.readTranslationsFromCSV(csvPath);

      expect(translations[0].key).toBe("key,with,commas");
      expect(translations[0].en).toBe("Hello, World");
    });

    it("이스케이프된 따옴표를 올바르게 처리해야 함", async () => {
      const csvPath = path.join(tempDir, "translations.csv");
      const csvContent = `Key,English,Korean
test,"Hello ""World""","안녕 ""세상"""`;

      fs.writeFileSync(csvPath, csvContent, "utf-8");

      const translations = await manager.readTranslationsFromCSV(csvPath);

      expect(translations[0].en).toBe('Hello "World"');
      expect(translations[0].ko).toBe('안녕 "세상"');
    });

    it("헤더 형식이 잘못되어도 경고만 출력하고 계속 진행해야 함", async () => {
      const csvPath = path.join(tempDir, "translations.csv");
      const csvContent = `Wrong,Header,Format
key,value1,value2`;

      fs.writeFileSync(csvPath, csvContent, "utf-8");

      // 에러가 발생하지 않아야 함
      await expect(
        manager.readTranslationsFromCSV(csvPath),
      ).resolves.not.toThrow();
    });
  });

  describe("saveTranslationsToCSV", () => {
    it("번역 데이터를 CSV 형식으로 저장해야 함", async () => {
      const csvPath = path.join(tempDir, "output.csv");
      const translations = [
        { key: "welcome.title", en: "Welcome", ko: "환영합니다" },
        { key: "button.save", en: "Save", ko: "저장" },
      ];

      await manager.saveTranslationsToCSV(csvPath, translations);

      expect(fileExists(csvPath)).toBe(true);
      const content = readFileContent(csvPath);
      expect(content).toContain("Key,English,Korean");
      expect(content).toContain("welcome.title");
      expect(content).toContain("Welcome");
      expect(content).toContain("환영합니다");
    });

    it("쉼표가 포함된 값은 이스케이프 처리해야 함", async () => {
      const csvPath = path.join(tempDir, "output.csv");
      const translations = [
        { key: "test", en: "Hello, World", ko: "안녕, 세상" },
      ];

      await manager.saveTranslationsToCSV(csvPath, translations);

      const content = readFileContent(csvPath);
      expect(content).toContain('"Hello, World"');
      expect(content).toContain('"안녕, 세상"');
    });

    it("따옴표가 포함된 값은 이스케이프 처리해야 함", async () => {
      const csvPath = path.join(tempDir, "output.csv");
      const translations = [
        { key: "test", en: 'Hello "World"', ko: '안녕 "세상"' },
      ];

      await manager.saveTranslationsToCSV(csvPath, translations);

      const content = readFileContent(csvPath);
      expect(content).toContain('"Hello ""World"""');
    });

    it("디렉토리가 없으면 자동으로 생성해야 함", async () => {
      const deepPath = path.join(tempDir, "deep", "nested", "output.csv");
      const translations = [{ key: "test", en: "Test", ko: "테스트" }];

      await manager.saveTranslationsToCSV(deepPath, translations);

      expect(fileExists(deepPath)).toBe(true);
    });
  });

  describe("convertCSVToLocalTranslations", () => {
    it("CSV 파일을 로컬 JSON 번역 파일로 변환해야 함", async () => {
      const csvPath = path.join(tempDir, "translations.csv");
      const localesDir = path.join(tempDir, "locales");

      const csvContent = `Key,English,Korean
welcome.title,Welcome,환영합니다
button.save,Save,저장`;

      fs.writeFileSync(csvPath, csvContent, "utf-8");

      await manager.convertCSVToLocalTranslations(csvPath, localesDir, [
        "en",
        "ko",
      ]);

      const enFile = path.join(localesDir, "en.json");
      const koFile = path.join(localesDir, "ko.json");

      expect(fileExists(enFile)).toBe(true);
      expect(fileExists(koFile)).toBe(true);

      const enData = readJsonFile(enFile);
      const koData = readJsonFile(koFile);

      expect(enData["welcome.title"]).toBe("Welcome");
      expect(koData["welcome.title"]).toBe("환영합니다");
    });

    it("네임스페이스가 설정되어 있으면 해당 디렉토리에 저장해야 함", async () => {
      const namespaceManager = new GoogleSheetsManager({
        credentialsPath: path.join(tempDir, "credentials.json"),
        spreadsheetId: "test-id",
        sheetName: "TestSheet",
        namespace: "common",
      });

      const csvPath = path.join(tempDir, "translations.csv");
      const localesDir = path.join(tempDir, "locales");

      const csvContent = `Key,English,Korean
key,Value,값`;

      fs.writeFileSync(csvPath, csvContent, "utf-8");

      await namespaceManager.convertCSVToLocalTranslations(
        csvPath,
        localesDir,
        ["en", "ko"],
      );

      const enFile = path.join(localesDir, "common", "en.json");
      expect(fileExists(enFile)).toBe(true);
    });

    it("빈 CSV 파일은 변환하지 않아야 함", async () => {
      const csvPath = path.join(tempDir, "empty.csv");
      const localesDir = path.join(tempDir, "locales");

      fs.writeFileSync(csvPath, "Key,English,Korean\n", "utf-8");

      await manager.convertCSVToLocalTranslations(csvPath, localesDir, [
        "en",
        "ko",
      ]);

      // 파일이 생성되지 않아야 함
      const enFile = path.join(localesDir, "en.json");
      expect(fileExists(enFile)).toBe(false);
    });
  });

  describe("getStatus", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("스프레드시트 상태 정보를 반환해야 함", async () => {
      const mockSheets = (manager as any).sheets;
      if (mockSheets) {
        (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
          data: {
            properties: { timeZone: "Asia/Seoul" },
          },
        } as any);
        (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
          data: {
            values: [
              ["Key", "English", "Korean"],
              ["test.key", "Test", "테스트"],
            ],
          },
        } as any);

        const status = await manager.getStatus();

        expect(status.spreadsheetId).toBe("test-spreadsheet-id");
        expect(status.sheetName).toBe("TestSheet");
        expect(status.totalRows).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("syncTranslations", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("로컬과 원격 간 양방향 동기화를 수행해야 함", async () => {
      const localesDir = path.join(tempDir, "locales");
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify({ "local.key": "Local Value" }, null, 2),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify({ "local.key": "로컬 값" }, null, 2),
      );

      // Mock 설정
      const mockSheets = (manager as any).sheets;
      if (mockSheets) {
        // downloadTranslations 호출 (2번: 로컬과 원격 비교)
        (mockSheets.spreadsheets.values.get as jest.Mock)
          .mockResolvedValueOnce({
            data: {
              values: [
                ["Key", "English", "Korean"],
                ["remote.key", "Remote", "원격"],
              ],
            },
          } as any)
          .mockResolvedValueOnce({
            data: {
              values: [
                ["Key", "English", "Korean"],
                ["remote.key", "Remote", "원격"],
              ],
            },
          } as any);
        (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
          {} as any,
        );
      }

      // 동기화 실행
      await expect(manager.syncTranslations(localesDir)).resolves.not.toThrow();
    });
  });
});
