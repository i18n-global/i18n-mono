#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { GoogleSheetsManager } from "../scripts/google-sheets";
import { loadConfig } from "../scripts/config-loader";

export interface UploadConfig {
  credentialsPath?: string;
  spreadsheetId?: string;
  localesDir?: string;
  sheetName?: string;
  autoTranslate?: boolean;
  force?: boolean;
}

const DEFAULT_CONFIG: Required<UploadConfig> = {
  credentialsPath: "./credentials.json",
  spreadsheetId: "",
  localesDir: "./locales",
  sheetName: "Translations",
  autoTranslate: false,
  force: false,
};

export async function uploadTranslations(
  dir: string,
  config: Required<UploadConfig>
) {
  console.log("\n� Starting Google Sheets upload process...\n");

  // Validate configuration
  if (!config.spreadsheetId) {
    console.error("❌ Error: Spreadsheet ID is required");
    console.error(
      "Please provide it via config file or --spreadsheet-id flag\n"
    );
    process.exit(1);
  }

  const sheetsManager = new GoogleSheetsManager({
    credentialsPath: config.credentialsPath,
    spreadsheetId: config.spreadsheetId,
    sheetName: config.sheetName,
  });

  await sheetsManager.authenticate();
  await sheetsManager.uploadTranslations(
    dir,
    config.autoTranslate,
    config.force
  );
}

// CLI 실행 부분
if (require.main === module) {
  // i18nexus.config.json에서 설정 로드
  const userConfig = loadConfig();

  const args = process.argv.slice(2);
  const config: Partial<UploadConfig> = {
    // config 파일에서 Google Sheets 설정 가져오기
    credentialsPath: userConfig.googleSheets?.credentialsPath,
    spreadsheetId: userConfig.googleSheets?.spreadsheetId,
    localesDir: userConfig.localesDir,
    sheetName: userConfig.googleSheets?.sheetName,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--credentials":
      case "-c":
        config.credentialsPath = args[++i];
        break;
      case "--spreadsheet-id":
      case "-s":
        config.spreadsheetId = args[++i];
        break;
      case "--locales-dir":
      case "-l":
        config.localesDir = args[++i];
        break;
      case "--sheet-name":
      case "-n":
        config.sheetName = args[++i];
        break;
      case "--auto-translate":
      case "-a":
        config.autoTranslate = true;
        break;
      case "--force":
      case "-f":
        config.force = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Usage: i18n-upload [options]

Options:
  -c, --credentials <path>     Path to Google Sheets credentials file (default: "./credentials.json")
  -s, --spreadsheet-id <id>    Google Spreadsheet ID (required)
  -l, --locales-dir <path>     Path to locales directory (default: "./locales")
  -n, --sheet-name <name>      Sheet name (default: "Translations")
  -a, --auto-translate         Enable auto-translation mode (English uses GOOGLETRANSLATE formula)
  -f, --force                  Force mode: Clear all existing data and re-upload everything
  -h, --help                   Show this help message

Examples:
  # Basic upload (text only, only new keys)
  i18n-upload -s "your-spreadsheet-id"
  
  # Auto-translate mode (Korean as text, English as GOOGLETRANSLATE formula)
  i18n-upload -s "your-spreadsheet-id" --auto-translate
  
  # Force mode: Clear and re-upload all translations
  i18n-upload -s "your-spreadsheet-id" --force
  
  # With custom paths
  i18n-upload -c "./my-creds.json" -s "your-spreadsheet-id" -l "./translations"
        `);
        process.exit(0);
        break;
    }
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  uploadTranslations(finalConfig.localesDir, finalConfig).catch(console.error);
}
