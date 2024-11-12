/**
 * 출력 생성 로직
 */

import * as fs from "fs";
import * as pathLib from "path";
import { ExtractedKey } from "./key-extractor";
import { escapeCsvValue } from "./extractor-utils";
import {
  CONSOLE_MESSAGES,
  STRING_CONSTANTS,
  CSV_CONSTANTS,
  FILE_EXTENSIONS,
} from "./constants";

export interface OutputConfig {
  sortKeys?: boolean;
  outputFormat?: "json" | "csv";
  languages?: string[];
  outputDir?: string;
  outputFile?: string;
  force?: boolean;
  dryRun?: boolean;
}

/**
 * 출력 데이터 생성
 */
export function generateOutputData(
  keys: ExtractedKey[],
  config: OutputConfig
): any {
  const sortedKeys = config.sortKeys
    ? [...keys].sort((a, b) => a.key.localeCompare(b.key))
    : keys;

  if (config.outputFormat === "csv") {
    return generateGoogleSheetsCSV(sortedKeys);
  }

  // JSON 형식 - 단순화된 구조
  const result: { [key: string]: string } = {};

  sortedKeys.forEach(({ key, defaultValue }) => {
    // key를 그대로 사용하고, defaultValue가 있으면 사용, 없으면 key를 기본값으로
    result[key] = defaultValue || key;
  });

  return result;
}

/**
 * Google Sheets CSV 생성
 */
export function generateGoogleSheetsCSV(keys: ExtractedKey[]): string {
  // CSV 헤더: Key, English, Korean
  const csvLines: string[] = [CSV_CONSTANTS.HEADER];

  keys.forEach(({ key, defaultValue }) => {
    // CSV 라인: key, 빈값(영어), defaultValue 또는 key(한국어)
    const englishValue = STRING_CONSTANTS.EMPTY_STRING;
    const koreanValue = defaultValue || key;

    // CSV 이스케이프 처리
    const escapedKey = escapeCsvValue(key);
    const escapedEnglish = escapeCsvValue(englishValue);
    const escapedKorean = escapeCsvValue(koreanValue);

    csvLines.push(
      `${escapedKey}${CSV_CONSTANTS.SEPARATOR}${escapedEnglish}${CSV_CONSTANTS.SEPARATOR}${escapedKorean}`
    );
  });

  return csvLines.join(CSV_CONSTANTS.NEWLINE);
}

/**
 * index.ts 파일 생성
 */
export function generateIndexFile(
  languages: string[],
  outputDir: string,
  dryRun: boolean
): void {
  const indexPath = pathLib.join(outputDir, STRING_CONSTANTS.INDEX_FILE);

  // Import 문 생성
  const imports = languages
    .map((lang) => `import ${lang} from "./${lang}.json";`)
    .join("\n");

  // Export 객체 생성
  const exportObj = languages.map((lang) => `  ${lang}: ${lang},`).join("\n");

  const content = `${imports}

export const translations = {
${exportObj}
};
`;

  if (!dryRun) {
    fs.writeFileSync(indexPath, content, "utf-8");
  }
}

/**
 * 출력 파일 작성
 */
export function writeOutputFile(
  data: any,
  config: OutputConfig
): void {
  // 디렉토리가 없으면 생성
  if (!fs.existsSync(config.outputDir!)) {
    fs.mkdirSync(config.outputDir!, { recursive: true });
  }

  if (config.outputFormat === "csv") {
    // CSV 파일로 출력
    const csvFileName = config.outputFile!.replace(
      FILE_EXTENSIONS.JSON,
      FILE_EXTENSIONS.CSV
    );
    const outputPath = pathLib.join(config.outputDir!, csvFileName);
    const content = data; // CSV는 이미 문자열

    if (!config.dryRun) {
      fs.writeFileSync(outputPath, content);
    }
  } else {
    // JSON 파일로 출력 - 각 언어별로 파일 생성
    config.languages!.forEach((lang) => {
      const langFile = pathLib.join(config.outputDir!, `${lang}.json`);

      // 기존 번역 파일 읽기 (있다면)
      let existingTranslations: { [key: string]: string } = {};
      if (fs.existsSync(langFile)) {
        try {
          const existingContent = fs.readFileSync(langFile, "utf-8");
          existingTranslations = JSON.parse(existingContent);
        } catch (error) {
          console.warn(CONSOLE_MESSAGES.PARSE_EXISTING_FAILED(langFile));
        }
      }

      let mergedTranslations: { [key: string]: string };

      if (config.force) {
        // Force 모드: 기존 값을 모두 덮어씀
        mergedTranslations = {};

        Object.keys(data).forEach((key) => {
          if (lang === STRING_CONSTANTS.DEFAULT_LANG_KO) {
            // 한국어는 키를 그대로 또는 defaultValue 사용
            mergedTranslations[key] = data[key] || key;
          } else if (lang === STRING_CONSTANTS.DEFAULT_LANG_EN) {
            // 영어는 빈 문자열
            mergedTranslations[key] = STRING_CONSTANTS.EMPTY_STRING;
          } else {
            // 기타 언어도 빈 문자열
            mergedTranslations[key] = STRING_CONSTANTS.EMPTY_STRING;
          }
        });
      } else {
        // 기본 모드: 기존 번역을 유지하고 새로운 키만 추가
        mergedTranslations = { ...existingTranslations };

        let newKeysCount = 0;
        Object.keys(data).forEach((key) => {
          if (!mergedTranslations.hasOwnProperty(key)) {
            newKeysCount++;
            if (lang === STRING_CONSTANTS.DEFAULT_LANG_KO) {
              // 한국어는 키를 그대로 또는 defaultValue 사용
              mergedTranslations[key] = data[key] || key;
            } else if (lang === STRING_CONSTANTS.DEFAULT_LANG_EN) {
              // 영어는 빈 문자열
              mergedTranslations[key] = STRING_CONSTANTS.EMPTY_STRING;
            } else {
              // 기타 언어도 빈 문자열
              mergedTranslations[key] = STRING_CONSTANTS.EMPTY_STRING;
            }
          }
        });
      }

      const content = JSON.stringify(mergedTranslations, null, 2);

      if (!config.dryRun) {
        fs.writeFileSync(langFile, content);
      }
    });

    // index.ts 파일 생성
    generateIndexFile(config.languages!, config.outputDir!, config.dryRun!);
  }
}

