#!/usr/bin/env node

import { downloadTranslations, DownloadConfig } from "./i18n-download";
import { loadConfig } from "../scripts/config-loader";

// i18nexus.config.json에서 설정 로드
const userConfig = loadConfig();

const args = process.argv.slice(2);
const config: Partial<DownloadConfig> = {
  // config 파일에서 Google Sheets 설정 가져오기
  credentialsPath: userConfig.googleSheets?.credentialsPath,
  spreadsheetId: userConfig.googleSheets?.spreadsheetId,
  localesDir: userConfig.localesDir,
  sheetName: userConfig.googleSheets?.sheetName,
  languages: userConfig.languages,
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
    case "--languages":
      config.languages = args[++i].split(",");
      break;
    case "--help":
    case "-h":
      console.log(`
Usage: i18n-download-force [options]

Force download all translations from Google Sheets, overwriting existing files.

Options:
  -c, --credentials <path>     Path to Google Sheets credentials file (default: "./credentials.json")
  -s, --spreadsheet-id <id>    Google Spreadsheet ID (required)
  -l, --locales-dir <path>     Path to locales directory (default: "./locales")
  -n, --sheet-name <name>      Sheet name (default: "Translations")
  --languages <langs>          Comma-separated list of languages (default: "en,ko")
  -h, --help                   Show this help message

Examples:
  i18n-download-force -s "your-spreadsheet-id"
  i18n-download-force -c "./my-creds.json" -s "your-spreadsheet-id" -l "./translations"
  i18n-download-force -s "your-spreadsheet-id" --languages "en,ko,ja"
      `);
      process.exit(0);
      break;
  }
}

// force 옵션을 true로 설정하여 다운로드
downloadTranslations(config, { force: true }).catch(console.error);
