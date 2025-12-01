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
import {
  generateOutputData,
  writeOutputFile,
  writeOutputFileWithNamespace,
  generateNamespaceIndexFile,
} from "./output-generator";
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
import {
  generateTypeDefinitions,
  readExtractedTranslations,
  type ExtractedTranslations,
} from "./type-generator";

export interface ExtractorConfig {
  sourcePattern?: string;
  outputFile?: string;
  outputDir?: string;
  namespace?: string; // 레거시: 직접 지정 (namespacing.enabled=false일 때만 사용)
  translationImportSource?: string; // e.g., "i18nexus", "react-i18next"
  includeLineNumbers?: boolean;
  includeFilePaths?: boolean;
  sortKeys?: boolean;
  dryRun?: boolean;
  outputFormat?: "json" | "csv";
  languages?: string[]; // 언어 목록 추가
  force?: boolean; // force 모드: 기존 값을 덮어씀
  namespacing?: NamespacingConfig; // 네임스페이스 자동화 설정
  skipValidation?: boolean; // 검증 스킵 (마이그레이션 시 사용)
  lazy?: boolean; // lazy loading 활성화 여부
  useI18nexusLibrary?: boolean; // i18nexus 라이브러리 사용 여부
  namespaceStrategy?: "full" | "page-based" | "single"; // 네임스페이스 전략
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
  translationImportSource: COMMON_DEFAULTS.translationImportSource,
  force: false, // 기본값: 기존 번역 유지
  lazy: false, // 기본값: eager loading
  useI18nexusLibrary: true, // 기본값: i18nexus 라이브러리 사용
  namespaceStrategy: "full", // 기본값: full
  namespacing: {
    enabled: false, // 기본값: false (레거시 모드)
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
    // 프로젝트 config에서 namespacing 및 lazy 설정 로드
    const projectConfig = loadConfig();
    const namespacingConfig = config.namespacing || projectConfig.namespacing;
    const lazyConfig =
      config.lazy !== undefined ? config.lazy : projectConfig.lazy;
    const translationImportSource =
      config.translationImportSource || projectConfig.translationImportSource;

    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      namespacing: namespacingConfig || DEFAULT_CONFIG.namespacing,
      skipValidation: config.skipValidation || false,
      lazy: lazyConfig !== undefined ? lazyConfig : false, // 기본값 false
      translationImportSource:
        translationImportSource || DEFAULT_CONFIG.translationImportSource,
    };
  }

  private parseFile(filePath: string): void {
    try {
      const code = fs.readFileSync(filePath, "utf-8");

      // 네임스페이스 추론 (우선순위 기반)
      let namespace: string;
      if (this.config.namespacing.enabled) {
        // 개선: useTranslation() 우선, 파일 경로는 대체
        const { inferNamespaceFromFile } = require("./namespace-inference");
        namespace = inferNamespaceFromFile(
          filePath,
          code,
          this.config.namespacing
        );

        // 네임스페이스 검증 (skipValidation이 false일 때만)
        if (!this.config.skipValidation) {
          // useTranslation()이 있는 경우 검증 스킵 (이미 올바른 네임스페이스)
          const { findUseTranslationCalls } = require("./namespace-inference");
          const useTranslationCalls = findUseTranslationCalls(filePath, code);
          const hasExplicitNamespace = useTranslationCalls.length > 0 && useTranslationCalls[0].namespace;

          if (!hasExplicitNamespace) {
            // useTranslation()이 없거나 네임스페이스가 명시되지 않은 경우만 검증
            const validation = validateNamespace(
              filePath,
              code,
              namespace,
              this.config.namespacing,
            );
            if (!validation.valid) {
              console.error(validation.error);
              throw new Error(validation.error);
            }
          }
        }
      } else {
        // 레거시 모드: config에서 직접 지정하거나 defaultNamespace 사용
        namespace =
          this.config.namespace || this.config.namespacing.defaultNamespace;
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

    // namespaceStrategy에 따른 처리
    const strategy = this.config.namespaceStrategy || "full";
    const defaultNamespace = this.config.namespacing.defaultNamespace;

    let targetNamespace = namespace;

    if (strategy === "single") {
      // single: 모든 키를 common 네임스페이스에 통합
      targetNamespace = defaultNamespace;
    } else if (strategy === "page-based") {
      // page-based: 페이지 네임스페이스만 유지, 나머지는 common으로
      // basePath 기반인지 확인
      const isPageBased = namespace !== defaultNamespace;
      if (!isPageBased) {
        targetNamespace = defaultNamespace;
      }
      // 페이지 네임스페이스인 경우 그대로 유지
    }
    // strategy === "full": 그대로 사용

    // 네임스페이스별로 키 저장 (정책 3: 키 중복 허용)
    if (!this.namespaceKeys.has(targetNamespace)) {
      this.namespaceKeys.set(targetNamespace, new Map());
    }
    const namespaceMap = this.namespaceKeys.get(targetNamespace)!;
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
          CONSOLE_MESSAGES.NO_FILES_FOUND(this.config.sourcePattern),
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

          // 도메인 우선 구조로 저장: locales/[namespace]/[lang].json
          writeOutputFileWithNamespace(outputData, {
            outputFormat: this.config.outputFormat,
            languages: this.config.languages!,
            outputDir: this.config.outputDir,
            namespace,
            force: this.config.force,
            dryRun: this.config.dryRun,
          });
        }

        // 모든 네임스페이스를 통합하는 index.ts 파일 생성
        const namespaces = Array.from(this.namespaceKeys.keys());
        generateNamespaceIndexFile(
          namespaces,
          this.config.languages,
          this.config.outputDir,
          this.config.namespacing.defaultNamespace,
          this.config.dryRun,
          this.config.lazy, // lazy loading 옵션 전달
          this.config.useI18nexusLibrary ?? true, // useI18nexusLibrary 옵션 전달
        );

        // TypeScript 타입 정의 파일 생성
        if (!this.config.dryRun) {
          this.generateTypeDefinitions();
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

  /**
   * Generate TypeScript type definitions for type-safe translations
   */
  private generateTypeDefinitions(): void {
    try {
      // Read extracted translations from locale files
      const translations = readExtractedTranslations(this.config.outputDir);

      if (Object.keys(translations).length === 0) {
        console.warn("⚠️  No translations found. Skipping type generation.");
        return;
      }

      // Generate type definition file in locales/types
      const typeOutputPath = pathLib.join(
        this.config.outputDir,
        "types",
        "i18nexus.d.ts",
      );

      generateTypeDefinitions(translations, {
        outputPath: typeOutputPath,
        includeJsDocs: true,
        fallbackNamespace: this.config.namespacing.defaultNamespace,
        translationImportSource: this.config.translationImportSource,
      });
    } catch (error) {
      console.error("❌ Failed to generate type definitions:", error);
      // Don't throw - type generation failure shouldn't block extraction
    }
  }
}

export async function runTranslationExtractor(
  config: Partial<ExtractorConfig> = {},
): Promise<void> {
  const extractor = new TranslationExtractor(config);
  await extractor.extract();
}
