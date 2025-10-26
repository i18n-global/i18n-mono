#!/usr/bin/env node

import * as fs from "fs";
import * as pathLib from "path";

export interface I18nexusConfig {
  languages: string[];
  defaultLanguage: string;
  localesDir: string;
  sourcePattern: string;
  translationImportSource: string;
  constantPatterns?: string[]; // 상수 패턴 필터링
  googleSheets?: {
    spreadsheetId: string;
    credentialsPath: string;
    sheetName: string;
  };
}

const DEFAULT_CONFIG: I18nexusConfig = {
  languages: ["en", "ko"],
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
  translationImportSource: "i18nexus",
  constantPatterns: [], // 기본값: 모든 상수 허용
  googleSheets: {
    spreadsheetId: "",
    credentialsPath: "./credentials.json",
    sheetName: "Translations",
  },
};

/**
 * i18nexus.config.json 파일을 로드합니다.
 * 파일이 없으면 기본 설정을 반환합니다.
 */
export function loadConfig(
  configPath: string = "i18nexus.config.json",
  options?: { silent?: boolean }
): I18nexusConfig {
  const absolutePath = pathLib.resolve(process.cwd(), configPath);

  if (!fs.existsSync(absolutePath)) {
    if (!options?.silent) {
      console.log(
        "⚠️  i18nexus.config.json not found, using default configuration"
      );
      console.log("💡 Run 'i18n-sheets init' to create a config file");
    }
    return DEFAULT_CONFIG;
  }

  try {
    // JSON 파일 로드
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const config = JSON.parse(fileContent);

    // 기본값과 병합
    return {
      ...DEFAULT_CONFIG,
      ...config,
      googleSheets: {
        ...DEFAULT_CONFIG.googleSheets,
        ...(config.googleSheets || {}),
      },
    };
  } catch (error) {
    if (!options?.silent) {
      console.warn(
        `⚠️  Failed to load ${configPath}, using default configuration:`,
        error
      );
    }
    return DEFAULT_CONFIG;
  }
}

/**
 * i18nexus.config.json 파일을 조용히 로드합니다 (로그 출력 없음).
 * 서버 환경에서 사용하기 적합합니다.
 */
export function loadConfigSilently(
  configPath: string = "i18nexus.config.json"
): I18nexusConfig {
  return loadConfig(configPath, { silent: true });
}
