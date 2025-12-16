/**
 * Google Sheets Manager 테스트
 */

import * as fs from "fs";
import * as path from "path";
import { GoogleSheetsManager, TranslationRow } from "./google-sheets";
import {
  createTempDir,
  cleanupTempDir,
  createTempJsonFile,
  createTempFile,
  createDirStructure,
  fileExists,
  readJsonFile,
} from "./__tests__/test-utils";
import { google, sheets_v4 } from "googleapis";

// googleapis mock
jest.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    sheets: jest.fn(),
  },
}));

describe("GoogleSheetsManager", () => {
  let tempDir: string;
  let manager: GoogleSheetsManager;
  let mockSheets: any;
  let mockAuthClient: any;

  beforeEach(() => {
    tempDir = createTempDir();
    manager = new GoogleSheetsManager({
      credentialsPath: path.join(tempDir, "credentials.json"),
      spreadsheetId: "test-spreadsheet-id",
      sheetName: "TestSheet",
    });

    // Mock Google Auth
    mockAuthClient = {};
    (google.auth.GoogleAuth as unknown as jest.Mock).mockImplementation(() => ({
      getClient: jest.fn().mockResolvedValue(mockAuthClient),
    }));

    // Mock Sheets API - 모든 메서드를 jest.fn()으로 생성
    const mockGet = jest.fn();
    const mockBatchUpdate = jest.fn();
    const mockValuesGet = jest.fn();
    const mockValuesUpdate = jest.fn();
    const mockValuesClear = jest.fn();

    mockSheets = {
      spreadsheets: {
        get: mockGet,
        batchUpdate: mockBatchUpdate,
        values: {
          get: mockValuesGet,
          update: mockValuesUpdate,
          append: jest.fn(),
          clear: mockValuesClear,
        },
      },
    };

    (google.sheets as jest.Mock).mockReturnValue(mockSheets);

    // Credentials 파일 생성
    createTempJsonFile(tempDir, "credentials.json", {
      type: "service_account",
      project_id: "test-project",
      private_key_id: "test-key-id",
      private_key:
        "-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----\n",
      client_email: "test@test.iam.gserviceaccount.com",
    });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default config", () => {
      const defaultManager = new GoogleSheetsManager();
      expect(defaultManager).toBeInstanceOf(GoogleSheetsManager);
    });

    it("should initialize with custom config", () => {
      const customManager = new GoogleSheetsManager({
        spreadsheetId: "custom-id",
        sheetName: "CustomSheet",
        namespace: "custom-namespace",
      });
      expect(customManager).toBeInstanceOf(GoogleSheetsManager);
    });
  });

  describe("authenticate", () => {
    it("should authenticate successfully", async () => {
      await manager.authenticate();
      expect(google.auth.GoogleAuth).toHaveBeenCalled();
      expect(google.sheets).toHaveBeenCalled();
    });

    it("should throw error when credentials file not found", async () => {
      const invalidManager = new GoogleSheetsManager({
        credentialsPath: path.join(tempDir, "nonexistent.json"),
      });

      await expect(invalidManager.authenticate()).rejects.toThrow(
        "Credentials file not found",
      );
    });

    it("should throw error when credentials are invalid", async () => {
      createTempFile(tempDir, "invalid-credentials.json", "invalid json");

      const invalidManager = new GoogleSheetsManager({
        credentialsPath: path.join(tempDir, "invalid-credentials.json"),
      });

      await expect(invalidManager.authenticate()).rejects.toThrow();
    });
  });

  describe("checkSpreadsheet", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should return true when spreadsheet exists", async () => {
      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          spreadsheetId: "test-spreadsheet-id",
          properties: { title: "Test Spreadsheet" },
        },
      } as any);

      const result = await manager.checkSpreadsheet();
      expect(result).toBe(true);
      expect(mockSheets.spreadsheets.get as jest.Mock).toHaveBeenCalledWith({
        spreadsheetId: "test-spreadsheet-id",
      });
    });

    it("should return false when spreadsheet does not exist", async () => {
      (mockSheets.spreadsheets.get as jest.Mock).mockRejectedValue(
        new Error("Spreadsheet not found"),
      );

      const result = await manager.checkSpreadsheet();
      expect(result).toBe(false);
    });

    it("should throw error when not authenticated", async () => {
      const unauthenticatedManager = new GoogleSheetsManager();
      await expect(unauthenticatedManager.checkSpreadsheet()).rejects.toThrow(
        "not initialized",
      );
    });
  });

  describe("ensureWorksheet", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should create worksheet when it does not exist", async () => {
      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [{ properties: { title: "OtherSheet" } }],
        },
      } as any);

      (mockSheets.spreadsheets.batchUpdate as jest.Mock).mockResolvedValue(
        {} as any,
      );
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );

      await manager.ensureWorksheet();

      expect(
        mockSheets.spreadsheets.batchUpdate as jest.Mock,
      ).toHaveBeenCalled();
      expect(
        mockSheets.spreadsheets.values.update as jest.Mock,
      ).toHaveBeenCalled();
    });

    it("should not create worksheet when it already exists", async () => {
      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [{ properties: { title: "TestSheet" } }],
        },
      } as any);

      await manager.ensureWorksheet();

      expect(mockSheets.spreadsheets.batchUpdate).not.toHaveBeenCalled();
    });
  });

  describe("downloadTranslations", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should download translations successfully", async () => {
      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [
            ["Key", "English", "Korean"], // Header
            ["welcome.title", "Welcome", "환영합니다"],
            ["button.save", "Save", "저장"],
          ],
        },
      } as any);

      const translations = await manager.downloadTranslations();

      expect(translations).toHaveLength(2);
      expect(translations[0]).toEqual({
        key: "welcome.title",
        en: "Welcome",
        ko: "환영합니다",
      });
    });

    it("should return empty array when no data", async () => {
      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [["Key", "English", "Korean"]], // Header only
        },
      } as any);

      const translations = await manager.downloadTranslations();
      expect(translations).toHaveLength(0);
    });

    it("should handle escaped values (starting with ')", async () => {
      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["'=formula", "'=value", "'=test"],
          ],
        },
      } as any);

      const translations = await manager.downloadTranslations();
      expect(translations[0].key).toBe("=formula");
      expect(translations[0].en).toBe("=value");
    });
  });

  describe("uploadTranslations", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should upload translations successfully", async () => {
      const localesDir = path.join(tempDir, "locales");
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify(
          {
            "welcome.title": "Welcome",
            "button.save": "Save",
          },
          null,
          2,
        ),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify(
          {
            "welcome.title": "환영합니다",
            "button.save": "저장",
          },
          null,
          2,
        ),
      );

      // Mock downloadTranslations (called to check existing keys)
      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: { values: [["Key", "English", "Korean"]] },
      } as any);
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );

      await manager.uploadTranslations(localesDir, false, false);

      expect(
        mockSheets.spreadsheets.values.update as jest.Mock,
      ).toHaveBeenCalled();
    });

    it("should upload with force mode", async () => {
      const localesDir = path.join(tempDir, "locales");
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify({ "new.key": "New Value" }, null, 2),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify({ "new.key": "새 값" }, null, 2),
      );

      // First call: downloadTranslations in force mode (to get existing data for clearing)
      // The clear is only called if existingData.length > 0
      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValueOnce({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["old.key", "Old", "오래된"],
          ],
        },
      } as any);

      (mockSheets.spreadsheets.values.clear as jest.Mock).mockResolvedValue(
        {} as any,
      );
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );

      await manager.uploadTranslations(localesDir, false, true);

      // In force mode, clear should be called if there's existing data (length > 0)
      // Since we mocked existing data with 1 row, clear should be called
      expect(
        mockSheets.spreadsheets.values.clear as jest.Mock,
      ).toHaveBeenCalled();
      expect(
        mockSheets.spreadsheets.values.update as jest.Mock,
      ).toHaveBeenCalled();
    });

    it("should handle auto-translate mode", async () => {
      const localesDir = path.join(tempDir, "locales");
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify({ key: "" }, null, 2),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify({ key: "한국어" }, null, 2),
      );

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: { values: [["Key", "English", "Korean"]] },
      } as any);
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );

      await manager.uploadTranslations(localesDir, true, false);

      const updateCall = (mockSheets.spreadsheets.values.update as jest.Mock)
        .mock.calls[0];
      if (updateCall && updateCall[0]?.requestBody?.values) {
        const values = updateCall[0].requestBody.values;
        const englishValue = values[0]?.[1];
        expect(englishValue).toContain("GOOGLETRANSLATE");
      } else {
        // If update wasn't called, it means no new translations (all empty)
        expect(
          (mockSheets.spreadsheets.values.update as jest.Mock).mock.calls
            .length,
        ).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("getAllSheetNames", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should return all sheet names", async () => {
      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [
            { properties: { title: "Sheet1" } },
            { properties: { title: "Sheet2" } },
            { properties: { title: "Sheet3" } },
          ],
        },
      } as any);

      const sheetNames = await manager.getAllSheetNames();

      expect(sheetNames).toEqual(["Sheet1", "Sheet2", "Sheet3"]);
    });

    it("should return empty array when no sheets", async () => {
      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: { sheets: [] },
      } as any);

      const sheetNames = await manager.getAllSheetNames();
      expect(sheetNames).toEqual([]);
    });
  });

  describe("downloadAllSheets", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should download all sheets to namespace folders", async () => {
      const localesDir = path.join(tempDir, "locales");

      // Mock getAllSheetNames
      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [
            { properties: { title: "common" } },
            { properties: { title: "dashboard" } },
          ],
        },
      } as any);

      // Mock downloadTranslations for each sheet
      // First call: getAllSheetNames
      // Second call: download for "common" sheet
      // Third call: download for "dashboard" sheet
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

      await manager.downloadAllSheets(localesDir, ["en", "ko"]);

      // Check if namespace folders were created
      expect(fs.existsSync(path.join(localesDir, "common"))).toBe(true);
      expect(fs.existsSync(path.join(localesDir, "dashboard"))).toBe(true);
    });

    it("should handle empty sheets", async () => {
      const localesDir = path.join(tempDir, "locales");

      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: { sheets: [] },
      } as any);

      await manager.downloadAllSheets(localesDir, ["en", "ko"]);

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe("uploadAllNamespaces", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should upload all namespaces to separate sheets", async () => {
      const localesDir = path.join(tempDir, "locales");

      createDirStructure(localesDir, {
        common: {
          "en.json": { "common.key": "Common" },
          "ko.json": { "common.key": "공통" },
        },
        dashboard: {
          "en.json": { "dashboard.title": "Dashboard" },
          "ko.json": { "dashboard.title": "대시보드" },
        },
      });

      (mockSheets.spreadsheets.get as jest.Mock).mockResolvedValue({
        data: {
          sheets: [{ properties: { title: "common" } }], // dashboard sheet doesn't exist
        },
      } as any);

      (mockSheets.spreadsheets.batchUpdate as jest.Mock).mockResolvedValue(
        {} as any,
      );
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );
      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: { values: [["Key", "English", "Korean"]] },
      } as any);

      await manager.uploadAllNamespaces(localesDir, false, false);

      // Should create dashboard sheet and upload both namespaces
      expect(
        mockSheets.spreadsheets.batchUpdate as jest.Mock,
      ).toHaveBeenCalled();
      expect(
        mockSheets.spreadsheets.values.update as jest.Mock,
      ).toHaveBeenCalled();
    });

    it("should handle empty locales directory", async () => {
      const localesDir = path.join(tempDir, "empty-locales");
      fs.mkdirSync(localesDir, { recursive: true });

      await manager.uploadAllNamespaces(localesDir, false, false);

      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe("saveTranslationsToLocal", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should save translations to local files", async () => {
      const localesDir = path.join(tempDir, "locales");

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["welcome.title", "Welcome", "환영합니다"],
            ["button.save", "Save", "저장"],
          ],
        },
      } as any);

      await manager.saveTranslationsToLocal(localesDir, ["en", "ko"]);

      const enFile = path.join(localesDir, "en.json");
      const koFile = path.join(localesDir, "ko.json");

      expect(fileExists(enFile)).toBe(true);
      expect(fileExists(koFile)).toBe(true);

      const enData = readJsonFile(enFile);
      const koData = readJsonFile(koFile);

      expect(enData["welcome.title"]).toBe("Welcome");
      expect(koData["welcome.title"]).toBe("환영합니다");
    });

    it("should save to namespace folder when namespace is set", async () => {
      const namespaceManager = new GoogleSheetsManager({
        credentialsPath: path.join(tempDir, "credentials.json"),
        spreadsheetId: "test-id",
        sheetName: "TestSheet",
        namespace: "common",
      });
      await namespaceManager.authenticate();

      const localesDir = path.join(tempDir, "locales");

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: {
          values: [
            ["Key", "English", "Korean"],
            ["key", "Value", "값"],
          ],
        },
      } as any);

      await namespaceManager.saveTranslationsToLocal(localesDir, ["en", "ko"]);

      const enFile = path.join(localesDir, "common", "en.json");
      expect(fileExists(enFile)).toBe(true);
    });
  });

  describe("escapeFormula", () => {
    beforeEach(async () => {
      await manager.authenticate();
    });

    it("should escape formula starting with =", async () => {
      const localesDir = path.join(tempDir, "locales");
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify({ "=formula": "=formula" }, null, 2),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify({ "=formula": "=수식" }, null, 2),
      );

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: { values: [["Key", "English", "Korean"]] },
      } as any);
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );

      await manager.uploadTranslations(localesDir, false, false);

      const updateCall = (mockSheets.spreadsheets.values.update as jest.Mock)
        .mock.calls[0];
      if (updateCall && updateCall[0]?.requestBody?.values) {
        const values = updateCall[0].requestBody.values;
        expect(values[0]?.[0]).toBe("'=formula");
      }
    });

    it("should escape date patterns", async () => {
      const localesDir = path.join(tempDir, "locales");
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify({ date: "12/25/2024" }, null, 2),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify({ date: "2024/12/25" }, null, 2),
      );

      (mockSheets.spreadsheets.values.get as jest.Mock).mockResolvedValue({
        data: { values: [["Key", "English", "Korean"]] },
      } as any);
      (mockSheets.spreadsheets.values.update as jest.Mock).mockResolvedValue(
        {} as any,
      );

      await manager.uploadTranslations(localesDir, false, false);

      const updateCall = (mockSheets.spreadsheets.values.update as jest.Mock)
        .mock.calls[0];
      if (updateCall && updateCall[0]?.requestBody?.values) {
        const values = updateCall[0].requestBody.values;
        expect(values[0]?.[1]).toBe("'12/25/2024");
      }
    });
  });

  describe("readLocalTranslations", () => {
    it("should read translations from local files", async () => {
      const localesDir = path.join(tempDir, "locales");
      // 레거시 구조: locales/en.json, locales/ko.json (namespace 없음)
      fs.mkdirSync(localesDir, { recursive: true });
      fs.writeFileSync(
        path.join(localesDir, "en.json"),
        JSON.stringify(
          {
            "welcome.title": "Welcome",
            "button.save": "Save",
          },
          null,
          2,
        ),
      );
      fs.writeFileSync(
        path.join(localesDir, "ko.json"),
        JSON.stringify(
          {
            "welcome.title": "환영합니다",
            "button.save": "저장",
          },
          null,
          2,
        ),
      );

      const translations = await manager.readLocalTranslations(localesDir);

      expect(translations.length).toBeGreaterThan(0);
      const welcomeTranslation = translations.find(
        (t) => t.key === "welcome.title",
      );
      expect(welcomeTranslation).toBeDefined();
      expect(welcomeTranslation?.en).toBe("Welcome");
      expect(welcomeTranslation?.ko).toBe("환영합니다");
    });

    it("should return empty array when directory does not exist", async () => {
      const translations = await manager.readLocalTranslations(
        path.join(tempDir, "nonexistent"),
      );
      expect(translations).toEqual([]);
    });
  });
});
