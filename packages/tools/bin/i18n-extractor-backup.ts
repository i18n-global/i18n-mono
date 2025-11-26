#!/usr/bin/env node

import { runTranslationExtractor, ExtractorConfig } from "../scripts/extractor/index";

const args = process.argv.slice(2);
const config: Partial<ExtractorConfig> = {};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--pattern":
    case "-p":
      config.sourcePattern = args[++i];
      break;
    case "--output":
    case "-o":
      config.outputFile = args[++i];
      break;
    case "--output-dir":
    case "-d":
      config.outputDir = args[++i];
      break;
    case "--namespace":
    case "-n":
      config.namespace = args[++i];
      break;
    case "--include-lines":
    case "-l":
      config.includeLineNumbers = true;
      break;
    case "--include-files":
    case "-f":
      config.includeFilePaths = true;
      break;
    case "--no-sort":
      config.sortKeys = false;
      break;
    case "--dry-run":
      config.dryRun = true;
      break;
    case "--help":
    case "-h":
      console.log(`
Usage: i18n-extractor [options]

Extracts translation keys from t() function calls and generates JSON files.

Options:
  -p, --pattern <pattern>     Source file pattern (default: "src/**/*.{js,jsx,ts,tsx}")
  -o, --output <file>         Output filename (default: "extracted-translations.json")
  -d, --output-dir <dir>      Output directory (default: "./locales")
  -n, --namespace <ns>        Filter by namespace prefix
  -l, --include-lines         Include line numbers in output
  -f, --include-files         Include file paths in output
  --no-sort                   Don't sort keys alphabetically
  --dry-run                   Preview output without writing files
  -h, --help                  Show this help message

Examples:
  i18n-extractor                                    # Extract from src/**
  i18n-extractor -p "app/**/*.tsx" -o "app-keys.json"  # Custom pattern and output
  i18n-extractor -n "home" -l -f                   # Extract 'home' namespace with metadata
  i18n-extractor --dry-run                         # Preview extraction

Features:
  - Extracts keys from t() and useTranslation().t() calls
  - Supports namespace filtering
  - Includes file locations and line numbers (optional)
  - Generates structured JSON for translation workflows
  - Supports Google Sheets import format
      `);
      process.exit(0);
      break;
    default:
      console.error(`Unknown option: ${args[i]}`);
      process.exit(1);
  }
}

runTranslationExtractor(config).catch((error) => {
  console.error("❌ Translation extraction failed:", error);
  process.exit(1);
});
