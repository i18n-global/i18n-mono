#!/usr/bin/env node

import { Command } from "commander";
import {
  GoogleSheetsManager,
  GoogleSheetsConfig,
} from "../scripts/google-sheets";
import { loadConfig } from "../scripts/config-loader";
import { generateNamespaceIndexFile } from "../scripts/extractor/output-generator";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

const program = new Command();

// i18nexus.config.js에서 설정 로드 (init 명령 제외)
let projectConfig: ReturnType<typeof loadConfig> | null = null;
try {
  if (!process.argv.includes("init")) {
    projectConfig = loadConfig();
  }
} catch (error) {
  // init 명령이 아닐 때만 경고
  if (!process.argv.includes("init")) {
    console.warn("⚠️  Could not load config, using command line options");
  }
}

program
  .name("i18n-sheets")
  .description("Google Sheets integration for i18n translations")
  .version("1.0.0");

// 공통 옵션들
const addCommonOptions = (cmd: Command) => {
  return cmd
    .option(
      "-c, --credentials <path>",
      "Path to Google service account credentials JSON file",
      projectConfig?.googleSheets?.credentialsPath || "./credentials.json"
    )
    .option(
      "-s, --spreadsheet <id>",
      "Google Spreadsheet ID",
      projectConfig?.googleSheets?.spreadsheetId
    )
    .option(
      "-w, --worksheet <name>",
      "Worksheet name",
      projectConfig?.googleSheets?.sheetName || "Translations"
    )
    .option(
      "-l, --locales <dir>",
      "Locales directory",
      projectConfig?.localesDir || "./locales"
    );
};

// 환경 설정 확인
const checkConfig = (options: any): GoogleSheetsConfig => {
  const spreadsheetId =
    options.spreadsheet || projectConfig?.googleSheets?.spreadsheetId;
  const credentialsPath =
    options.credentials ||
    projectConfig?.googleSheets?.credentialsPath ||
    "./credentials.json";

  if (!spreadsheetId) {
    console.error(
      "❌ Spreadsheet ID is required. Use -s option, set in i18nexus.config.js, or set GOOGLE_SPREADSHEET_ID environment variable."
    );
    process.exit(1);
  }

  if (!fs.existsSync(credentialsPath)) {
    console.error(`❌ Credentials file not found: ${credentialsPath}`);
    console.error(
      "Please download your Google Service Account key file and specify its path with -c option or in i18nexus.config.js."
    );
    process.exit(1);
  }

  return {
    credentialsPath,
    spreadsheetId,
    sheetName: options.worksheet,
  };
};

// 업로드 명령
addCommonOptions(
  program
    .command("upload")
    .description("Upload local translation files to Google Sheets")
    .option("-f, --force", "Force upload even if keys already exist")
).action(async (options) => {
  try {
    console.log("📤 Starting upload to Google Sheets...");

    const config = checkConfig(options);
    const manager = new GoogleSheetsManager(config);

    await manager.authenticate();
    await manager.ensureWorksheet();
    await manager.uploadTranslations(options.locales);

    console.log("✅ Upload completed successfully");
  } catch (error) {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  }
});

// 다운로드 명령
addCommonOptions(
  program
    .command("download")
    .description("Download translations from Google Sheets to local files")
    .option(
      "--languages <langs>",
      "Comma-separated list of languages",
      projectConfig?.languages.join(",") || "en,ko"
    )
).action(async (options) => {
  try {
    console.log("📥 Starting download from Google Sheets...");

    const config = checkConfig(options);
    const manager = new GoogleSheetsManager(config);
    const languages = options.languages.split(",").map((l: string) => l.trim());

    await manager.authenticate();
    await manager.saveTranslationsToLocal(options.locales, languages);

    // index.ts 생성
    const indexPath = path.join(options.locales, "index.ts");
    const imports = languages
      .map((lang: string) => `import ${lang} from "./${lang}.json";`)
      .join("\n");
    const exportObj = languages
      .map((lang: string) => `  ${lang}: ${lang},`)
      .join("\n");
    const indexContent = `${imports}

export const translations = {
${exportObj}
};
`;
    fs.writeFileSync(indexPath, indexContent);
    console.log(`📝 Generated ${indexPath}`);

    console.log("✅ Download completed successfully");
  } catch (error) {
    console.error("❌ Download failed:", error);
    process.exit(1);
  }
});

// 동기화 명령
addCommonOptions(
  program
    .command("sync")
    .description("Bidirectional sync between local files and Google Sheets")
).action(async (options) => {
  try {
    console.log("🔄 Starting bidirectional sync...");

    const config = checkConfig(options);
    const manager = new GoogleSheetsManager(config);

    await manager.authenticate();
    await manager.ensureWorksheet();
    await manager.syncTranslations(options.locales);

    console.log("✅ Sync completed successfully");
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
});

// 상태 확인 명령
addCommonOptions(
  program
    .command("status")
    .description("Show Google Sheets status and statistics")
).action(async (options) => {
  try {
    console.log("📊 Checking Google Sheets status...");

    const config = checkConfig(options);
    const manager = new GoogleSheetsManager(config);

    await manager.authenticate();
    const status = await manager.getStatus();

    console.log("\n📋 Google Sheets Status:");
    console.log(`   Spreadsheet ID: ${status.spreadsheetId}`);
    console.log(`   Worksheet: ${status.sheetName}`);
    console.log(`   Total translations: ${status.totalRows}`);

    // 로컬 파일 상태도 확인
    if (fs.existsSync(options.locales)) {
      const languages = fs
        .readdirSync(options.locales)
        .filter((item) =>
          fs.statSync(path.join(options.locales, item)).isDirectory()
        );

      console.log(`\n📁 Local Files Status:`);
      console.log(`   Locales directory: ${options.locales}`);
      console.log(`   Languages: ${languages.join(", ")}`);

      languages.forEach((lang) => {
        const langDir = path.join(options.locales, lang);
        const files = fs
          .readdirSync(langDir)
          .filter((f) => f.endsWith(".json"));
        let totalKeys = 0;

        files.forEach((file) => {
          const content = JSON.parse(
            fs.readFileSync(path.join(langDir, file), "utf-8")
          );
          totalKeys += Object.keys(content).length;
        });

        console.log(`   ${lang}: ${totalKeys} keys in ${files.length} files`);
      });
    } else {
      console.log(`\n📁 Local Files Status:`);
      console.log(`   Locales directory not found: ${options.locales}`);
    }
  } catch (error) {
    console.error("❌ Status check failed:", error);
    process.exit(1);
  }
});

// 초기 설정 명령
program
  .command("init")
  .description("Initialize i18nexus project with config and translation files")
  .option("-s, --spreadsheet <id>", "Google Spreadsheet ID (optional)")
  .option(
    "-c, --credentials <path>",
    "Path to credentials file",
    "./credentials.json"
  )
  .option("-l, --locales <dir>", "Locales directory", "./locales")
  .option("--languages <langs>", "Comma-separated list of languages", "en,ko")
  .option(
    "--typescript, --ts",
    "Generate TypeScript config file (.ts) instead of JSON"
  )
  .option(
    "--namespace-location <path>",
    "Namespace location path (e.g., 'page', 'src/pages')",
    "page"
  )
  .option("--fallback-namespace <name>", "Fallback namespace name", "common")
  .option("--no-lazy", "Disable lazy loading (use eager loading instead)")
  .option("--non-interactive", "Skip interactive prompts and use defaults")
  .action(async (options) => {
    try {
      console.log("🚀 Initializing i18nexus project...\n");

      // Interactive prompts (unless --non-interactive is set)
      let useNamespaceStructure = true;

      if (!options.nonInteractive) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const askQuestion = (question: string): Promise<string> =>
          new Promise((resolve) => rl.question(question, resolve));

        // Question: 네임스페이스 별로 나눌래? vs 하나로 합칠래?
        console.log("\n📁 번역 파일을 어떻게 구성하시겠습니까?");
        console.log("");
        console.log("   1️⃣  네임스페이스별로 분리 (권장)");
        console.log("      📂 locales/home/ko.json");
        console.log("      📂 locales/about/ko.json");
        console.log("      📂 locales/common/ko.json");
        console.log("      ✅ 페이지별 lazy loading 가능");
        console.log("      ✅ 대규모 프로젝트에 적합");
        console.log("");
        console.log("   2️⃣  하나로 통합");
        console.log("      📄 locales/ko.json");
        console.log("      📄 locales/en.json");
        console.log("      ✅ 간단한 구조");
        console.log("      ✅ 소규모 프로젝트에 적합");
        console.log("");

        const structureAnswer = await askQuestion("   선택 (1/2) [기본: 1]: ");
        useNamespaceStructure =
          !structureAnswer.trim() || structureAnswer.trim() === "1";

        rl.close();
        console.log("");
      }

      const languages = options.languages
        .split(",")
        .map((l: string) => l.trim());

      // 1. i18nexus.config 파일 생성 (.ts 또는 .json)
      if (options.typescript || options.ts) {
        // TypeScript config 파일 생성
        const languagesArray = languages
          .map((l: string) => `"${l}"`)
          .join(", ");
        const tsContent = `import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: [${languagesArray}] as const,
  defaultLanguage: "${languages[0]}",
  localesDir: "${options.locales}",
  sourcePattern: "src/**/*.{ts,tsx,js,jsx}",
  translationImportSource: "i18nexus",
  fallbackNamespace: "${options.fallbackNamespace || "common"}",
  namespaceLocation: "${options.namespaceLocation || "page"}",
  useNamespaceStructure: ${useNamespaceStructure},${
    options.spreadsheet
      ? `
  googleSheets: {
    spreadsheetId: "${options.spreadsheet}",
    credentialsPath: "${options.credentials}",
    sheetName: "Translations",
  },`
      : ""
  }
});

// Export the language union type for type safety
export type AppLanguages = typeof config.languages[number];
`;
        fs.writeFileSync("i18nexus.config.ts", tsContent);
        console.log("✅ Created i18nexus.config.ts");
        console.log(
          "💡 Use AppLanguages type for type-safe language switching:"
        );
        console.log(
          "   const { changeLanguage } = useLanguageSwitcher<AppLanguages>();"
        );
      } else {
        // JSON config 파일 생성
        const configData: any = {
          languages: languages,
          defaultLanguage: languages[0],
          localesDir: options.locales,
          sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
          translationImportSource: "i18nexus",
          fallbackNamespace: options.fallbackNamespace || "common",
          useNamespaceStructure,
          googleSheets: {
            spreadsheetId: options.spreadsheet || "",
            credentialsPath: options.credentials,
            sheetName: "Translations",
          },
        };

        // 네임스페이스 구조 사용 시에만 namespaceLocation 추가
        if (useNamespaceStructure) {
          configData.namespaceLocation = options.namespaceLocation || "page";
        }

        fs.writeFileSync(
          "i18nexus.config.json",
          JSON.stringify(configData, null, 2)
        );
        console.log("✅ Created i18nexus.config.json");
      }

      // 2. locales 디렉토리 생성
      if (!fs.existsSync(options.locales)) {
        fs.mkdirSync(options.locales, { recursive: true });
        console.log(`✅ Created ${options.locales} directory`);
      }

      const fallbackNamespace = options.fallbackNamespace || "common";

      // 3. 번역 파일 생성
      if (useNamespaceStructure) {
        // 네임스페이스 구조: locales/[namespace]/[lang].json
        const namespaceDir = path.join(options.locales, fallbackNamespace);
        if (!fs.existsSync(namespaceDir)) {
          fs.mkdirSync(namespaceDir, { recursive: true });
          console.log(`✅ Created namespace directory: ${namespaceDir}`);
        }

        // 4. 각 언어별 번역 파일 생성 (네임스페이스 구조)
        languages.forEach((lang: string) => {
          const langFile = path.join(namespaceDir, `${lang}.json`);
          if (!fs.existsSync(langFile)) {
            fs.writeFileSync(langFile, JSON.stringify({}, null, 2));
            console.log(`✅ Created ${langFile}`);
          } else {
            console.log(`⚠️  ${langFile} already exists, skipping...`);
          }
        });

        // 5. index.ts 파일 생성 (네임스페이스 구조 사용 시)
        const indexPath = path.join(options.locales, "index.ts");
        if (!fs.existsSync(indexPath)) {
          generateNamespaceIndexFile(
            [fallbackNamespace],
            languages,
            options.locales,
            fallbackNamespace,
            false, // dryRun
            true // useI18nexusLibrary (네임스페이스 구조면 항상 생성)
          );
          console.log(`✅ Created ${indexPath} (loadNamespace function)`);
        } else {
          console.log(`⚠️  ${indexPath} already exists, skipping...`);
        }
      } else {
        // 플랫 구조: locales/[lang].json
        languages.forEach((lang: string) => {
          const langFile = path.join(options.locales, `${lang}.json`);
          if (!fs.existsSync(langFile)) {
            fs.writeFileSync(langFile, JSON.stringify({}, null, 2));
            console.log(`✅ Created ${langFile}`);
          } else {
            console.log(`⚠️  ${langFile} already exists, skipping...`);
          }
        });

        console.log("\n💡 Flat structure created (no namespaces)");
        console.log(
          "   Use this with libraries like react-i18next, next-intl, etc."
        );
      }

      // 6. Google Sheets 연동 설정 (옵션)
      if (options.spreadsheet) {
        // credentials.json 파일 확인
        if (!fs.existsSync(options.credentials)) {
          console.log("\n📝 Google Service Account Setup:");
          console.log(
            "1. Go to Google Cloud Console (https://console.cloud.google.com/)"
          );
          console.log("2. Create a new project or select existing one");
          console.log("3. Enable Google Sheets API");
          console.log("4. Create a Service Account");
          console.log("5. Download the JSON key file");
          console.log(`6. Save it as '${options.credentials}'`);
          console.log("\n📋 Spreadsheet Setup:");
          console.log("1. Create a new Google Spreadsheet");
          console.log("2. Share it with your service account email");
          console.log("3. Copy the spreadsheet ID from the URL");

          console.log(
            "\n⚠️  Please add the credentials file and try again for Google Sheets integration."
          );
        } else {
          // 설정 테스트
          const config = {
            credentialsPath: options.credentials,
            spreadsheetId: options.spreadsheet,
            sheetName: "Translations",
          };

          const manager = new GoogleSheetsManager(config);
          await manager.authenticate();

          const canAccess = await manager.checkSpreadsheet();
          if (!canAccess) {
            console.error("❌ Cannot access the spreadsheet. Please check:");
            console.error("   1. Spreadsheet ID is correct");
            console.error(
              "   2. Service account has access to the spreadsheet"
            );
          } else {
            await manager.ensureWorksheet();

            // 환경 파일 생성
            const envContent = `# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=${options.spreadsheet}
GOOGLE_CREDENTIALS_PATH=${options.credentials}
`;
            fs.writeFileSync(".env.sheets", envContent);
            console.log("✅ Google Sheets integration configured");
            console.log(`📋 Spreadsheet ID: ${options.spreadsheet}`);
            console.log(`🔑 Credentials: ${options.credentials}`);
          }
        }
      }

      console.log("\n✅ i18nexus project initialized successfully!");

      if (useNamespaceStructure) {
        console.log("\n📝 Project structure:");
        console.log(`   ${options.locales}/`);
        console.log(`   ├── ${fallbackNamespace}/`);
        languages.forEach((lang) => {
          console.log(`   │   ├── ${lang}.json`);
        });
        console.log(`   └── index.ts (loadNamespace function)`);
      } else {
        console.log("\n📝 Project structure:");
        console.log(`   ${options.locales}/`);
        languages.forEach((lang) => {
          console.log(`   ├── ${lang}.json`);
        });
      }

      console.log("\n📝 Next steps:");
      console.log("1. Update i18nexus.config.json with your project settings");
      console.log("2. Run 'npx i18n-wrapper' to wrap hardcoded strings");
      console.log("3. Run 'npx i18n-extractor' to extract translation keys");

      if (options.spreadsheet) {
        console.log(
          "4. Run 'npx i18n-sheets upload' to sync with Google Sheets"
        );
      }
    } catch (error) {
      console.error("❌ Initialization failed:", error);
      process.exit(1);
    }
  });

// 도움말 개선
program.on("--help", () => {
  console.log("");
  console.log("Examples:");
  console.log(
    "  $ i18n-sheets init                                          # Initialize project without Google Sheets"
  );
  console.log(
    "  $ i18n-sheets init -s 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms  # Initialize with Google Sheets"
  );
  console.log(
    "  $ i18n-sheets upload -s 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );
  console.log(
    "  $ i18n-sheets download -s 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );
  console.log(
    "  $ i18n-sheets sync -s 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );
  console.log(
    "  $ i18n-sheets status -s 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
  );
  console.log("");
  console.log("Environment Variables:");
  console.log("  GOOGLE_SPREADSHEET_ID    Google Spreadsheet ID");
  console.log("  GOOGLE_CREDENTIALS_PATH  Path to service account credentials");
  console.log("");
});

// CSV 변환 명령
program
  .command("csv-to-json")
  .description("Convert CSV file to local JSON translation files")
  .option("-f, --csv-file <path>", "Path to CSV file", "./translations.csv")
  .option("-l, --locales <dir>", "Locales directory", "./locales")
  .option("--languages <langs>", "Comma-separated list of languages", "en,ko")
  .action(async (options) => {
    try {
      console.log("📥 Converting CSV to JSON translations...");

      const manager = new GoogleSheetsManager();
      const languages = options.languages
        .split(",")
        .map((l: string) => l.trim());

      await manager.convertCSVToLocalTranslations(
        options.csvFile,
        options.locales,
        languages
      );

      console.log("✅ CSV to JSON conversion completed successfully");
    } catch (error) {
      console.error("❌ CSV conversion failed:", error);
      process.exit(1);
    }
  });

program
  .command("json-to-csv")
  .description("Convert local JSON translation files to CSV file")
  .option("-f, --csv-file <path>", "Output CSV file path", "./translations.csv")
  .option("-l, --locales <dir>", "Locales directory", "./locales")
  .action(async (options) => {
    try {
      console.log("📤 Converting JSON translations to CSV...");

      const manager = new GoogleSheetsManager();

      // 로컬 번역 파일들 읽기
      const translations = await manager.readLocalTranslations(options.locales);

      // CSV로 저장
      await manager.saveTranslationsToCSV(options.csvFile, translations);

      console.log("✅ JSON to CSV conversion completed successfully");
    } catch (error) {
      console.error("❌ JSON to CSV conversion failed:", error);
      process.exit(1);
    }
  });

// 환경 변수에서 기본값 읽기
if (process.env.GOOGLE_SPREADSHEET_ID) {
  program.setOptionValue("spreadsheet", process.env.GOOGLE_SPREADSHEET_ID);
}

if (process.env.GOOGLE_CREDENTIALS_PATH) {
  program.setOptionValue("credentials", process.env.GOOGLE_CREDENTIALS_PATH);
}

program.parse();
