/**
 * 출력 생성 로직
 */

import * as fs from "fs";
import * as pathLib from "path";
import { ExtractedKey } from "./key-extractor";
import { escapeCsvValue } from "./extractor-utils";

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
  const csvLines = ["Key,English,Korean"];

  keys.forEach(({ key, defaultValue }) => {
    // CSV 라인: key, 빈값(영어), defaultValue 또는 key(한국어)
    const englishValue = "";
    const koreanValue = defaultValue || key;

    // CSV 이스케이프 처리
    const escapedKey = escapeCsvValue(key);
    const escapedEnglish = escapeCsvValue(englishValue);
    const escapedKorean = escapeCsvValue(koreanValue);

    csvLines.push(`${escapedKey},${escapedEnglish},${escapedKorean}`);
  });

  return csvLines.join("\n");
}

/**
 * index.ts 파일 생성
 */
export function generateIndexFile(
  languages: string[],
  outputDir: string,
  dryRun: boolean
): void {
  const indexPath = pathLib.join(outputDir, "index.ts");

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
    console.log(`📝 Generated index file: ${indexPath}`);
  } else {
    console.log(`📄 Dry run - index file would be written to: ${indexPath}`);
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
    const csvFileName = config.outputFile!.replace(/\.json$/, ".csv");
    const outputPath = pathLib.join(config.outputDir!, csvFileName);
    const content = data; // CSV는 이미 문자열

    if (config.dryRun) {
      console.log("📄 Dry run - output would be written to:", outputPath);
      console.log("📄 Content preview:");
      console.log(content.substring(0, 500) + "...");
      return;
    }

    fs.writeFileSync(outputPath, content);
    console.log(`📝 Extracted translations written to: ${outputPath}`);
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
          console.warn(
            `⚠️  Failed to parse existing ${langFile}, will overwrite`
          );
        }
      }

      let mergedTranslations: { [key: string]: string };

      if (config.force) {
        // Force 모드: 기존 값을 모두 덮어씀
        console.log(
          `🔄 Force mode: Overwriting all translations in ${langFile}`
        );
        mergedTranslations = {};

        Object.keys(data).forEach((key) => {
          if (lang === "ko") {
            // 한국어는 키를 그대로 또는 defaultValue 사용
            mergedTranslations[key] = data[key] || key;
          } else if (lang === "en") {
            // 영어는 빈 문자열
            mergedTranslations[key] = "";
          } else {
            // 기타 언어도 빈 문자열
            mergedTranslations[key] = "";
          }
        });
      } else {
        // 기본 모드: 기존 번역을 유지하고 새로운 키만 추가
        mergedTranslations = { ...existingTranslations };

        let newKeysCount = 0;
        Object.keys(data).forEach((key) => {
          if (!mergedTranslations.hasOwnProperty(key)) {
            newKeysCount++;
            if (lang === "ko") {
              // 한국어는 키를 그대로 또는 defaultValue 사용
              mergedTranslations[key] = data[key] || key;
            } else if (lang === "en") {
              // 영어는 빈 문자열
              mergedTranslations[key] = "";
            } else {
              // 기타 언어도 빈 문자열
              mergedTranslations[key] = "";
            }
          }
        });

        if (newKeysCount > 0) {
          console.log(`➕ Added ${newKeysCount} new keys to ${langFile}`);
        } else {
          console.log(`✓ No new keys to add to ${langFile}`);
        }
      }

      const content = JSON.stringify(mergedTranslations, null, 2);

      if (config.dryRun) {
        console.log(`📄 Dry run - output would be written to: ${langFile}`);
        console.log(`📄 Content preview (${lang}):`);
        console.log(content.substring(0, 500) + "...");
      } else {
        fs.writeFileSync(langFile, content);
        console.log(`📝 Extracted translations written to: ${langFile}`);
      }
    });

    // index.ts 파일 생성
    generateIndexFile(config.languages!, config.outputDir!, config.dryRun!);
  }
}

