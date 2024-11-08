#!/usr/bin/env node

import { runTranslationExtractor, ExtractorConfig } from "../scripts/extractor/index";
import { loadConfig } from "../scripts/config-loader";

const args = process.argv.slice(2);

// i18nexus.config.js에서 설정 로드
const projectConfig = loadConfig();
const config: Partial<ExtractorConfig> = {
  sourcePattern: projectConfig.sourcePattern,
  outputDir: projectConfig.localesDir,
  languages: projectConfig.languages,
};

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
    case "--format":
    case "-f":
      const format = args[++i];
      if (format !== "json" && format !== "csv") {
        console.error(`Invalid format: ${format}. Use 'json' or 'csv'`);
        process.exit(1);
      }
      config.outputFormat = format as "json" | "csv";
      break;
    case "--languages":
    case "-l":
      config.languages = args[++i].split(",").map((l) => l.trim());
      break;
    case "--force":
      config.force = true;
      break;
    case "--dry-run":
      config.dryRun = true;
      break;
    case "--help":
    case "-h":
      console.log(`
Usage: i18n-extractor [options]

t() 함수 호출에서 번역 키를 추출하여 언어별 JSON 파일 또는 CSV 파일을 생성합니다.

Options:
  -p, --pattern <pattern>     소스 파일 패턴 (기본값: "src/**/*.{js,jsx,ts,tsx}")
  -o, --output <file>         CSV 출력 파일명 (기본값: "extracted-translations.json")
  -d, --output-dir <dir>      출력 디렉토리 (기본값: "./locales")
  -f, --format <format>       출력 형식: json|csv (기본값: "json")
  -l, --languages <langs>     언어 목록 (쉼표로 구분, 기본값: "en,ko")
  --force                     Force 모드: 기존 번역을 모두 덮어씀 (기본: 새 키만 추가)
  --dry-run                   실제 파일 생성 없이 미리보기
  -h, --help                  도움말 표시

Examples:
  i18n-extractor                                  # en.json, ko.json에 새 키만 추가
  i18n-extractor --force                          # 모든 키를 덮어쓰기
  i18n-extractor -p "app/**/*.tsx"                # App 디렉토리에서 추출
  i18n-extractor -l "en,ko,ja"                    # 3개 언어 파일 생성
  i18n-extractor -f csv -o "translations.csv"     # 구글 시트용 CSV 형식으로 출력
  i18n-extractor --dry-run                        # 추출 결과 미리보기
  
Features:
  - t() 함수 호출에서 번역 키 자동 추출
  - JSON: 각 언어별 파일 생성 (en.json, ko.json 등)
  - 기본 모드: 기존 번역 유지하며 새 키만 추가
  - Force 모드: 모든 번역을 새로 추출된 키로 덮어씀
  - CSV: 구글 시트 호환 형식 출력 (Key, English, Korean)
  - 중복 키 감지 및 보고
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
