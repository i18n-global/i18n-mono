#!/usr/bin/env node

import * as fs from "fs";
import * as pathLib from "path";
import { glob } from "glob";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { COMMON_DEFAULTS } from "./common/default-config";

export interface ExtractorConfig {
  sourcePattern?: string;
  outputFile?: string;
  outputDir?: string;
  namespace?: string;
  includeLineNumbers?: boolean;
  includeFilePaths?: boolean;
  sortKeys?: boolean;
  dryRun?: boolean;
  outputFormat?: "json" | "csv";
  languages?: string[]; // 언어 목록 추가
  force?: boolean; // force 모드: 기존 값을 덮어씀
}

const DEFAULT_CONFIG: Required<ExtractorConfig> = {
  sourcePattern: COMMON_DEFAULTS.sourcePattern,
  outputFile: "extracted-translations.json",
  outputDir: COMMON_DEFAULTS.localesDir,
  namespace: "",
  includeLineNumbers: false,
  includeFilePaths: false,
  sortKeys: true,
  dryRun: false,
  outputFormat: "json",
  languages: [...COMMON_DEFAULTS.languages], // 기본 언어
  force: false, // 기본값: 기존 번역 유지
};

export interface ExtractedKey {
  key: string;
  defaultValue?: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export class TranslationExtractor {
  private config: Required<ExtractorConfig>;
  private extractedKeys: Map<string, ExtractedKey> = new Map();

  constructor(config: Partial<ExtractorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private parseFile(filePath: string): void {
    try {
      const code = fs.readFileSync(filePath, "utf-8");

      const ast = parser.parse(code, {
        sourceType: "module",
        plugins: [
          "jsx",
          "typescript",
          "decorators-legacy",
          "classProperties",
          "objectRestSpread",
          "asyncGenerators",
          "functionBind",
          "exportDefaultFrom",
          "exportNamespaceFrom",
          "dynamicImport",
        ],
      });

      // t() 호출 추출
      traverse(ast, {
        CallExpression: (path) => {
          this.extractTranslationKey(path, filePath);
        },
      });
    } catch (error) {
      console.warn(`⚠️  Failed to parse ${filePath}:`, error);
    }
  }

  private extractTranslationKey(
    path: NodePath<t.CallExpression>,
    filePath: string
  ): void {
    const { node } = path;

    // t() 함수 호출 감지
    if (!this.isTFunction(node.callee)) {
      return;
    }

    const firstArg = node.arguments[0];

    // Case 1: t("문자열") - 직접 문자열
    if (t.isStringLiteral(firstArg)) {
      this.addExtractedKey(firstArg.value, node, filePath);
      return;
    }

  }

  private addExtractedKey(
    key: string,
    node: t.CallExpression,
    filePath: string,
    source?: string
  ): void {
    const loc = node.loc;

    const extractedKey: ExtractedKey = {
      key,
      defaultValue: this.getDefaultValue(
        node.arguments.filter(
          (arg): arg is t.Expression =>
            !t.isArgumentPlaceholder(arg) && !t.isSpreadElement(arg)
        )
      ),
    };

    if (this.config.includeFilePaths) {
      extractedKey.filePath = pathLib.relative(process.cwd(), filePath);
    }

    if (this.config.includeLineNumbers && loc) {
      extractedKey.lineNumber = loc.start.line;
      extractedKey.columnNumber = loc.start.column;
    }

    // 중복 키 처리
    const existingKey = this.extractedKeys.get(key);
    if (existingKey) {
      console.log(
        `🔄 Duplicate key found: "${key}" ${source ? `from ${source}` : ""}`
      );
    } else {
      this.extractedKeys.set(key, extractedKey);
      if (source) {
        console.log(`   ✅ Extracted from ${source}: "${key}"`);
      }
    }
  }


  private isTFunction(callee: t.Expression | t.V8IntrinsicIdentifier): boolean {
    // t() 직접 호출
    if (t.isIdentifier(callee, { name: "t" })) {
      return true;
    }

    // useTranslation().t 형태의 호출
    if (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.property, { name: "t" })
    ) {
      return true;
    }

    return false;
  }

  private getDefaultValue(args: t.Expression[]): string | undefined {
    // 두 번째 인수가 옵션 객체인 경우 defaultValue 추출
    if (args.length > 1 && t.isObjectExpression(args[1])) {
      const defaultValueProp = args[1].properties.find(
        (prop) =>
          t.isObjectProperty(prop) &&
          t.isIdentifier(prop.key, { name: "defaultValue" }) &&
          t.isStringLiteral(prop.value)
      );

      if (defaultValueProp && t.isObjectProperty(defaultValueProp)) {
        return (defaultValueProp.value as t.StringLiteral).value;
      }
    }

    return undefined;
  }

  private generateOutputData(): any {
    const keys = Array.from(this.extractedKeys.values());

    if (this.config.sortKeys) {
      keys.sort((a, b) => a.key.localeCompare(b.key));
    }

    if (this.config.outputFormat === "csv") {
      return this.generateGoogleSheetsCSV(keys);
    }

    // JSON 형식 - 단순화된 구조
    const result: { [key: string]: string } = {};

    keys.forEach(({ key, defaultValue }) => {
      // key를 그대로 사용하고, defaultValue가 있으면 사용, 없으면 key를 기본값으로
      result[key] = defaultValue || key;
    });

    return result;
  }

  private generateGoogleSheetsCSV(keys: ExtractedKey[]): string {
    // CSV 헤더: Key, English, Korean
    const csvLines = ["Key,English,Korean"];

    keys.forEach(({ key, defaultValue }) => {
      // CSV 라인: key, 빈값(영어), defaultValue 또는 key(한국어)
      const englishValue = "";
      const koreanValue = defaultValue || key;

      // CSV 이스케이프 처리
      const escapedKey = this.escapeCsvValue(key);
      const escapedEnglish = this.escapeCsvValue(englishValue);
      const escapedKorean = this.escapeCsvValue(koreanValue);

      csvLines.push(`${escapedKey},${escapedEnglish},${escapedKorean}`);
    });

    return csvLines.join("\n");
  }

  private escapeCsvValue(value: string): string {
    // CSV에서 특수 문자가 포함된 경우 따옴표로 감싸고, 따옴표는 두 번 반복
    if (
      value.includes(",") ||
      value.includes('"') ||
      value.includes("\n") ||
      value.includes("\r")
    ) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  private generateIndexFile(): void {
    const indexPath = pathLib.join(this.config.outputDir, "index.ts");

    // Import 문 생성
    const imports = this.config.languages
      .map((lang) => `import ${lang} from "./${lang}.json";`)
      .join("\n");

    // Export 객체 생성
    const exportObj = this.config.languages
      .map((lang) => `  ${lang}: ${lang},`)
      .join("\n");

    const content = `${imports}

export const translations = {
${exportObj}
};
`;

    if (!this.config.dryRun) {
      fs.writeFileSync(indexPath, content, "utf-8");
      console.log(`📝 Generated index file: ${indexPath}`);
    } else {
      console.log(`📄 Dry run - index file would be written to: ${indexPath}`);
    }
  }

  private writeOutputFile(data: any): void {
    // 디렉토리가 없으면 생성
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    if (this.config.outputFormat === "csv") {
      // CSV 파일로 출력
      const csvFileName = this.config.outputFile.replace(/\.json$/, ".csv");
      const outputPath = pathLib.join(this.config.outputDir, csvFileName);
      const content = data; // CSV는 이미 문자열

      if (this.config.dryRun) {
        console.log("📄 Dry run - output would be written to:", outputPath);
        console.log("📄 Content preview:");
        console.log(content.substring(0, 500) + "...");
        return;
      }

      fs.writeFileSync(outputPath, content);
      console.log(`📝 Extracted translations written to: ${outputPath}`);
    } else {
      // JSON 파일로 출력 - 각 언어별로 파일 생성
      this.config.languages.forEach((lang) => {
        const langFile = pathLib.join(this.config.outputDir, `${lang}.json`);

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

        if (this.config.force) {
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

        if (this.config.dryRun) {
          console.log(`📄 Dry run - output would be written to: ${langFile}`);
          console.log(`📄 Content preview (${lang}):`);
          console.log(content.substring(0, 500) + "...");
        } else {
          fs.writeFileSync(langFile, content);
          console.log(`📝 Extracted translations written to: ${langFile}`);
        }
      });

      // index.ts 파일 생성
      this.generateIndexFile();
    }
  }

  /**
   * 추출된 키 목록 반환 (clean-legacy에서 사용)
   */
  public getExtractedKeys(): ExtractedKey[] {
    return Array.from(this.extractedKeys.values());
  }

  /**
   * 키만 분석하고 파일은 쓰지 않음 (clean-legacy용)
   */
  public async extractKeysOnly(): Promise<ExtractedKey[]> {
    try {
      const files = await glob(this.config.sourcePattern);

      if (files.length === 0) {
        return [];
      }

      // 파일 분석
      files.forEach((file) => {
        this.parseFile(file);
      });

      return this.getExtractedKeys();
    } catch (error) {
      console.error("❌ Key extraction failed:", error);
      throw error;
    }
  }

  public async extract(): Promise<void> {
    console.log("🔍 Starting translation key extraction...");
    console.log(`📁 Pattern: ${this.config.sourcePattern}`);

    try {
      const files = await glob(this.config.sourcePattern);

      if (files.length === 0) {
        console.warn(
          "⚠️  No files found matching pattern:",
          this.config.sourcePattern
        );
        return;
      }

      console.log(`📂 Found ${files.length} files to analyze`);

      // 파일 분석
      files.forEach((file) => {
        console.log(`📄 Analyzing: ${file}`);
        this.parseFile(file);
      });

      // 결과 생성
      const outputData = this.generateOutputData();

      console.log(
        `🔑 Found ${this.extractedKeys.size} unique translation keys`
      );

      // 출력 파일 작성
      this.writeOutputFile(outputData);

      console.log("✅ Translation extraction completed");
    } catch (error) {
      console.error("❌ Extraction failed:", error);
      throw error;
    }
  }
}

export async function runTranslationExtractor(
  config: Partial<ExtractorConfig> = {}
): Promise<void> {
  const extractor = new TranslationExtractor(config);
  await extractor.extract();
}
