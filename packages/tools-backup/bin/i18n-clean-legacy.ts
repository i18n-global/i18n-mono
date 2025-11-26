#!/usr/bin/env node

import { runCleanLegacy } from "../scripts/clean-legacy";
import { loadConfig } from "../scripts/config-loader";

export interface CleanLegacyCliConfig {
  sourcePattern?: string;
  localesDir?: string;
  languages?: string;
  dryRun?: boolean;
  noBackup?: boolean;
}

async function main() {
  // config 파일에서 설정 로드
  const userConfig = loadConfig();

  const args = process.argv.slice(2);
  const config: CleanLegacyCliConfig = {
    sourcePattern: userConfig.sourcePattern,
    localesDir: userConfig.localesDir,
    languages: userConfig.languages?.join(","),
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--pattern":
      case "-p":
        config.sourcePattern = args[++i];
        break;
      case "--locales-dir":
      case "-d":
        config.localesDir = args[++i];
        break;
      case "--languages":
      case "-l":
        config.languages = args[++i];
        break;
      case "--dry-run":
        config.dryRun = true;
        break;
      case "--no-backup":
        config.noBackup = true;
        break;
      case "--help":
      case "-h":
        console.log(`
Usage: i18n-clean-legacy [options]

Clean up unused and invalid translation keys from locale files.
This tool analyzes your source code to find actively used translation keys,
then removes unused keys and keys with invalid values from your locale files.

Options:
  -p, --pattern <pattern>       Source file pattern (default: "src/**/*.{js,jsx,ts,tsx}")
  -d, --locales-dir <path>      Path to locales directory (default: "./locales")
  -l, --languages <langs>       Comma-separated list of languages (default: "en,ko")
  --dry-run                     Show what would be removed without modifying files
  --no-backup                   Skip creating backup files
  -h, --help                    Show this help message

Examples:
  # Basic usage (uses config from i18nexus.config.json)
  i18n-clean-legacy

  # Dry run to preview changes
  i18n-clean-legacy --dry-run

  # Custom pattern and languages
  i18n-clean-legacy -p "app/**/*.tsx" -l "en,ko,ja"

  # Without backup files
  i18n-clean-legacy --no-backup

What it does:
  1. Extracts all t() calls from your source code
  2. Compares with existing locale files
  3. Removes unused keys (exists in locale but not in code)
  4. Removes keys with invalid values (N/A, empty strings)
  5. Reports missing keys (used in code but not in locale)
  6. Creates backup files before modifications (unless --no-backup)

Invalid values:
  - "_N/A"
  - "N/A"
  - "" (empty string)
  - null
  - undefined
        `);
        process.exit(0);
        break;
    }
  }

  await runCleanLegacy({
    sourcePattern: config.sourcePattern,
    localesDir: config.localesDir,
    languages: config.languages?.split(","),
    dryRun: config.dryRun,
    backup: !config.noBackup,
  });
}

main().catch((error) => {
  console.error("❌ Clean legacy failed:", error);
  process.exit(1);
});
