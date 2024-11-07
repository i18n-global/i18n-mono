/**
 * default-config 테스트
 */

import {
  COMMON_DEFAULTS,
  GOOGLE_SHEETS_DEFAULTS,
  PERFORMANCE_MONITORING_DEFAULTS,
  PARSER_DEFAULTS,
  WRAPPER_DEFAULTS,
  SCRIPT_CONFIG_DEFAULTS,
} from "./default-config";

describe("default-config", () => {
  describe("COMMON_DEFAULTS", () => {
    it("기본 설정 값이 올바르게 정의되어 있어야 함", () => {
      expect(COMMON_DEFAULTS.sourcePattern).toBe("src/**/*.{js,jsx,ts,tsx}");
      expect(COMMON_DEFAULTS.translationImportSource).toBe("i18nexus");
      expect(COMMON_DEFAULTS.languages).toEqual(["en", "ko"]);
      expect(COMMON_DEFAULTS.defaultLanguage).toBe("ko");
      expect(COMMON_DEFAULTS.localesDir).toBe("./locales");
    });
  });

  describe("GOOGLE_SHEETS_DEFAULTS", () => {
    it("Google Sheets 기본 설정이 올바르게 정의되어 있어야 함", () => {
      expect(GOOGLE_SHEETS_DEFAULTS.spreadsheetId).toBe("");
      expect(GOOGLE_SHEETS_DEFAULTS.credentialsPath).toBe("./credentials.json");
      expect(GOOGLE_SHEETS_DEFAULTS.sheetName).toBe("Translations");
    });
  });

  describe("PERFORMANCE_MONITORING_DEFAULTS", () => {
    it("성능 모니터링 기본 설정이 올바르게 정의되어 있어야 함", () => {
      expect(typeof PERFORMANCE_MONITORING_DEFAULTS.enablePerformanceMonitoring).toBe(
        "boolean"
      );
      expect(typeof PERFORMANCE_MONITORING_DEFAULTS.sentryDsn).toBe("string");
    });
  });

  describe("PARSER_DEFAULTS", () => {
    it("파서 기본 설정이 올바르게 정의되어 있어야 함", () => {
      expect(PARSER_DEFAULTS.parserType).toBe("babel");
    });
  });

  describe("WRAPPER_DEFAULTS", () => {
    it("Wrapper 기본 설정이 올바르게 정의되어 있어야 함", () => {
      expect(WRAPPER_DEFAULTS.dryRun).toBe(false);
      expect(typeof WRAPPER_DEFAULTS.enablePerformanceMonitoring).toBe("boolean");
      expect(typeof WRAPPER_DEFAULTS.sentryDsn).toBe("string");
      expect(WRAPPER_DEFAULTS.parserType).toBe("babel");
    });
  });

  describe("SCRIPT_CONFIG_DEFAULTS", () => {
    it("ScriptConfig 기본 설정이 모든 필드를 포함해야 함", () => {
      expect(SCRIPT_CONFIG_DEFAULTS.sourcePattern).toBeDefined();
      expect(SCRIPT_CONFIG_DEFAULTS.translationImportSource).toBeDefined();
      expect(SCRIPT_CONFIG_DEFAULTS.dryRun).toBeDefined();
      expect(SCRIPT_CONFIG_DEFAULTS.enablePerformanceMonitoring).toBeDefined();
      expect(SCRIPT_CONFIG_DEFAULTS.sentryDsn).toBeDefined();
      expect(SCRIPT_CONFIG_DEFAULTS.parserType).toBeDefined();
    });

    it("SCRIPT_CONFIG_DEFAULTS가 COMMON_DEFAULTS와 일치해야 함", () => {
      expect(SCRIPT_CONFIG_DEFAULTS.sourcePattern).toBe(
        COMMON_DEFAULTS.sourcePattern
      );
      expect(SCRIPT_CONFIG_DEFAULTS.translationImportSource).toBe(
        COMMON_DEFAULTS.translationImportSource
      );
    });
  });
});

