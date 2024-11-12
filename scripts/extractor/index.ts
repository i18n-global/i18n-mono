#!/usr/bin/env node

import * as fs from "fs";
import * as pathLib from "path";
import { glob } from "glob";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { parseWithBabel } from "../common/ast/parser-utils";
import { COMMON_DEFAULTS } from "../common/default-config";
import {
  isTFunction,
  getDefaultValue,
  escapeCsvValue,
} from "./extractor-utils";
import {
  extractTranslationKey,
  createExtractedKey,
  ExtractedKey,
} from "./key-extractor";
import { generateOutputData, writeOutputFile } from "./output-generator";
import {
  CONSOLE_MESSAGES,
  STRING_CONSTANTS,
  OUTPUT_FORMATS,
} from "./constants";

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
  outputFile: STRING_CONSTANTS.DEFAULT_OUTPUT_FILE,
  outputDir: COMMON_DEFAULTS.localesDir,
  namespace: STRING_CONSTANTS.DEFAULT_NAMESPACE,
  includeLineNumbers: false,
  includeFilePaths: false,
  sortKeys: true,
  dryRun: false,
  outputFormat: OUTPUT_FORMATS.JSON,
  languages: [...COMMON_DEFAULTS.languages], // 기본 언어
  force: false, // 기본값: 기존 번역 유지
};

// ExtractedKey는 key-extractor.ts에서 import
export type { ExtractedKey } from "./key-extractor";

export class TranslationExtractor {
  private config: Required<ExtractorConfig>;
  private extractedKeys: Map<string, ExtractedKey> = new Map();

  constructor(config: Partial<ExtractorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private parseFile(filePath: string): void {
    try {
      const code = fs.readFileSync(filePath, "utf-8");

      // 확장 플러그인을 사용하여 파싱 (extractor는 더 많은 플러그인 필요)
      const ast = parseWithBabel(code, {
        sourceType: "module",
        extendedPlugins: true,
      });

      // t() 호출 추출
      traverse(ast, {
        CallExpression: (path) => {
          const extractedKey = extractTranslationKey(path, filePath, {
            includeFilePaths: this.config.includeFilePaths,
            includeLineNumbers: this.config.includeLineNumbers,
          });
          if (extractedKey) {
            this.addExtractedKey(extractedKey);
          }
        },
      });
    } catch (error) {
      console.warn(CONSOLE_MESSAGES.PARSE_FAILED(filePath), error);
    }
  }

  private addExtractedKey(extractedKey: ExtractedKey): void {
    const { key } = extractedKey;

    // 중복 키 처리
    const existingKey = this.extractedKeys.get(key);
    if (!existingKey) {
      this.extractedKeys.set(key, extractedKey);
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
      console.error(CONSOLE_MESSAGES.KEY_EXTRACTION_FAILED, error);
      throw error;
    }
  }

  public async extract(): Promise<void> {
    try {
      const files = await glob(this.config.sourcePattern);

      if (files.length === 0) {
        console.warn(
          CONSOLE_MESSAGES.NO_FILES_FOUND(this.config.sourcePattern)
        );
        return;
      }

      // 파일 분석
      files.forEach((file) => {
        this.parseFile(file);
      });

      // 결과 생성
      const keys = Array.from(this.extractedKeys.values());
      const outputData = generateOutputData(keys, {
        sortKeys: this.config.sortKeys,
        outputFormat: this.config.outputFormat,
        languages: this.config.languages,
        outputDir: this.config.outputDir,
        outputFile: this.config.outputFile,
        force: this.config.force,
        dryRun: this.config.dryRun,
      });

      // 출력 파일 작성
      writeOutputFile(outputData, {
        outputFormat: this.config.outputFormat,
        languages: this.config.languages,
        outputDir: this.config.outputDir,
        outputFile: this.config.outputFile,
        force: this.config.force,
        dryRun: this.config.dryRun,
      });
    } catch (error) {
      console.error(CONSOLE_MESSAGES.EXTRACTION_FAILED, error);
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
