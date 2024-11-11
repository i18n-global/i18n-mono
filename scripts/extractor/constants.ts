/**
 * extractor 상수 정의
 * 모든 상수를 중앙화하고 Object.freeze로 불변성 보장
 */

// Console 메시지 (에러만 출력)
export const CONSOLE_MESSAGES = Object.freeze({
  PARSE_FAILED: (filePath: string) => `⚠️  Failed to parse ${filePath}:`,
  KEY_EXTRACTION_FAILED: "❌ Key extraction failed:",
  EXTRACTION_FAILED: "❌ Extraction failed:",
  NO_FILES_FOUND: (pattern: string) =>
    `⚠️  No files found matching pattern: ${pattern}`,
  PARSE_EXISTING_FAILED: (filePath: string) =>
    `⚠️  Failed to parse existing ${filePath}, will overwrite`,
} as const);

// 문자열 상수
export const STRING_CONSTANTS = Object.freeze({
  TRANSLATION_FUNCTION: "t",
  DEFAULT_VALUE: "defaultValue",
  CSV_HEADER: "Key,English,Korean",
  CSV_SEPARATOR: ",",
  CSV_NEWLINE: "\n",
  CSV_QUOTE: '"',
  CSV_QUOTE_ESCAPED: '""',
  JSON_EXTENSION: ".json",
  CSV_EXTENSION: ".csv",
  INDEX_FILE: "index.ts",
  DEFAULT_OUTPUT_FILE: "extracted-translations.json",
  DEFAULT_OUTPUT_DIR: "locales",
  DEFAULT_NAMESPACE: "",
  DEFAULT_LANG_KO: "ko",
  DEFAULT_LANG_EN: "en",
  EMPTY_STRING: "",
} as const);

// 파일 확장자
export const FILE_EXTENSIONS = Object.freeze({
  JSON: ".json",
  CSV: ".csv",
  TS: ".ts",
} as const);

// CSV 관련 상수
export const CSV_CONSTANTS = Object.freeze({
  HEADER: "Key,English,Korean",
  SEPARATOR: ",",
  NEWLINE: "\n",
  QUOTE: '"',
  QUOTE_ESCAPED: '""',
  SPECIAL_CHARS: [",", '"', "\n", "\r"],
} as const);

// 출력 형식
export const OUTPUT_FORMATS = Object.freeze({
  JSON: "json" as const,
  CSV: "csv" as const,
} as const);

