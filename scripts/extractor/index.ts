#!/usr/bin/env node

import * as fs from "fs";
import * as pathLib from "path";
import { glob } from "glob";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { parseWithBabel } from "../common/ast/parser-utils";
import { COMMON_DEFAULTS } from "../common/default-config";
import { loadConfig } from "../config-loader";
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
import { generateOutputData, writeOutputFile, writeOutputFileWithNamespace } from "./output-generator";
import {
  CONSOLE_MESSAGES,
  STRING_CONSTANTS,
  OUTPUT_FORMATS,
} from "./constants";
import {
  inferNamespace,
  validateNamespace,
  NamespacingConfig,
} from "./namespace-inference";

export interface ExtractorConfig {
  sourcePattern?: string;
  outputFile?: string;
  outputDir?: string;
  namespace?: string; // 레거시: 직접 지정 (namespacing.enabled=false일 때만 사용)
  includeLineNumbers?: boolean;
  includeFilePaths?: boolean;
  sortKeys?: boolean;
  dryRun?: boolean;
  outputFormat?: "json" | "csv";
  languages?: string[]; // 언어 목록 추가
  force?: boolean; // force 모드: 기존 값을 덮어씀
  namespacing?: NamespacingConfig; // 네임스페이스 자동화 설정
  skipValidation?: boolean; // 검증 스킵 (마이그레이션 시 사용)
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
  namespacing: {
    enabled: false,
    basePath: "src/app",
    defaultNamespace: "common",
    framework: "nextjs-app",
    ignorePatterns: [],
  },
  skipValidation: false,
};

// ExtractedKey는 key-extractor.ts에서 import
export type { ExtractedKey } from "./key-extractor";

export class TranslationExtractor {
  private config: Required<ExtractorConfig>;
  private extractedKeys: Map<string, ExtractedKey> = new Map();
  private namespaceKeys: Map<string, Map<string, ExtractedKey>> = new Map(); // namespace -> key -> ExtractedKey

  constructor(config: Partial<ExtractorConfig> = {}) {
    // 프로젝트 config에서 namespacing 설정 로드
    const projectConfig = loadConfig();
    const namespacingConfig = config.namespacing || projectConfig.namespacing;

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      namespacing: namespacingConfig || {
        enabled: false,
        basePath: "src/app",
        defaultNamespace: "common",
        framework: "nextjs-app",
        ignorePatterns: [],
      },
      skipValidation: config.skipValidation || false,
    };
  }

  private parseFile(filePath: string): void {
    try {
      const code = fs.readFileSync(filePath, "utf-8");

      // 네임스페이스 추론
      let namespace: string;
      if (this.config.namespacing.enabled) {
        namespace = inferNamespace(filePath, this.config.namespacing);

        // 네임스페이스 검증 (skipValidation이 false일 때만)
        if (!this.config.skipValidation) {
          const validation = validateNamespace(
            filePath,
            code,
            namespace,
            this.config.namespacing
          );
          if (!validation.valid) {
            console.error(validation.error);
            throw new Error(validation.error);
          }
        }
      } else {
        // 레거시 모드: config에서 직접 지정하거나 defaultNamespace 사용
        namespace = this.config.namespace || this.config.namespacing.defaultNamespace;
      }

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
            this.addExtractedKey(extractedKey, namespace);
          }
        },
      });
    } catch (error) {
      console.warn(CONSOLE_MESSAGES.PARSE_FAILED(filePath), error);
    }
  }

  private addExtractedKey(extractedKey: ExtractedKey, namespace: string): void {
    const { key } = extractedKey;

    // 레거시 모드: 단일 맵에 저장
    if (!this.config.namespacing.enabled) {
      const existingKey = this.extractedKeys.get(key);
      if (!existingKey) {
        this.extractedKeys.set(key, extractedKey);
      }
      return;
    }

    // 네임스페이스별로 키 저장 (정책 3: 키 중복 허용)
    if (!this.namespaceKeys.has(namespace)) {
      this.namespaceKeys.set(namespace, new Map());
    }
    const namespaceMap = this.namespaceKeys.get(namespace)!;
    namespaceMap.set(key, extractedKey);
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

      // 네임스페이스 모드: 각 네임스페이스별로 파일 생성
      if (this.config.namespacing.enabled) {
        for (const [namespace, keysMap] of this.namespaceKeys.entries()) {
          const keys = Array.from(keysMap.values());
          const outputData = generateOutputData(keys, {
            sortKeys: this.config.sortKeys,
            outputFormat: this.config.outputFormat,
            languages: this.config.languages,
            outputDir: this.config.outputDir,
            outputFile: this.config.outputFile,
            force: this.config.force,
            dryRun: this.config.dryRun,
          });

          // 언어 우선 구조로 저장: locales/[lang]/[namespace].json
          writeOutputFileWithNamespace(outputData, {
            outputFormat: this.config.outputFormat,
            languages: this.config.languages!,
            outputDir: this.config.outputDir,
            namespace,
            force: this.config.force,
            dryRun: this.config.dryRun,
          });
        }
      } else {
        // 레거시 모드: 기존 방식 유지
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
      }
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
