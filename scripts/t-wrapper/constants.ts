/**
 * t-wrapper 상수 정의
 * 모든 상수를 중앙화하고 Object.freeze로 불변성 보장
 */

// Console 메시지 (에러만 출력)
export const CONSOLE_MESSAGES = Object.freeze({
  ERROR_PROCESSING: (filePath: string) => `❌ Error processing ${filePath}:`,
  FATAL_ERROR: "❌ Fatal error:",
} as const);

// CLI 옵션
export const CLI_OPTIONS = Object.freeze({
  PATTERN: "--pattern",
  PATTERN_SHORT: "-p",
  DRY_RUN: "--dry-run",
  DRY_RUN_SHORT: "-d",
  HELP: "--help",
  HELP_SHORT: "-h",
} as const);

// CLI Help 메시지
export const CLI_HELP = Object.freeze({
  USAGE: `Usage: t-wrapper [options]`,
  OPTIONS: `Options:
  -p, --pattern <pattern>    Source file pattern (default: "src/**/*.{js,jsx,ts,tsx}")
  -d, --dry-run             Preview changes without modifying files
  -h, --help                Show this help message`,
  EXAMPLES: `Examples:
  t-wrapper
  t-wrapper -p "app/**/*.tsx"
  t-wrapper --dry-run`,
} as const);

// 문자열 상수
export const STRING_CONSTANTS = Object.freeze({
  I18N_IGNORE: "i18n-ignore",
  I18N_IGNORE_COMMENT: "// i18n-ignore",
  I18N_IGNORE_BLOCK: "/* i18n-ignore",
  I18N_IGNORE_JSX: "{/* i18n-ignore",
  TRANSLATION_FUNCTION: "t",
  USE_TRANSLATION: "useTranslation",
  GET_SERVER_TRANSLATION: "getServerTranslation",
  USE_CLIENT_DIRECTIVE: "use client",
  COMPLETION_TITLE: "Translation Wrapper Completed",
  DEFAULT_ENV: "production",
  VARIABLE_KIND: "const",
  EXPR_PREFIX: "expr",
  INTERPOLATION_START: "{{",
  INTERPOLATION_END: "}}",
  MEMBER_SEPARATOR: "_",
} as const);

// 정규식 패턴
export const REGEX_PATTERNS = Object.freeze({
  REACT_COMPONENT: /^[A-Z]/,
  REACT_HOOK: /^use[A-Z]/,
  KOREAN_TEXT: /[가-힣]/,
} as const);
