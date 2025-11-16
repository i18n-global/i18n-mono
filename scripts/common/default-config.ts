/**
 * 중앙화된 기본 설정 값들
 * 모든 설정 파일에서 공통으로 사용되는 기본값을 정의합니다.
 */

/**
 * 공통 기본 설정 값
 */
export const COMMON_DEFAULTS = {
  sourcePattern: "src/**/*.{js,jsx,ts,tsx}",
  translationImportSource: "i18nexus",
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko" as const,
  localesDir: "./locales",
} as const;

/**
 * Google Sheets 기본 설정
 */
export const GOOGLE_SHEETS_DEFAULTS = {
  spreadsheetId: "",
  credentialsPath: "./credentials.json",
  sheetName: "Translations",
} as const;

/**
 * 성능 모니터링 기본 설정
 */
export const PERFORMANCE_MONITORING_DEFAULTS = {
  enablePerformanceMonitoring: process.env.I18N_PERF_MONITOR !== "false",
  sentryDsn: process.env.SENTRY_DSN || "",
} as const;

/**
 * 파서 기본 설정
 */
export const PARSER_DEFAULTS = {
  parserType: "babel" as const,
} as const;

/**
 * Wrapper 기본 설정
 */
export const WRAPPER_DEFAULTS = {
  dryRun: false,
  enablePerformanceMonitoring:
    PERFORMANCE_MONITORING_DEFAULTS.enablePerformanceMonitoring,
  sentryDsn: PERFORMANCE_MONITORING_DEFAULTS.sentryDsn,
  parserType: PARSER_DEFAULTS.parserType,
} as const;

/**
 * ScriptConfig 타입 정의 (wrapper에 사용)
 */
export interface ScriptConfig {
  sourcePattern?: string;
  translationImportSource?: string;
  /**
   * 서버 변환 시 사용할 함수명 (라이브러리별 상이)
   * 기본값: "getServerTranslation"
   */
  serverTranslationFunction?: string;
  dryRun?: boolean;
  /**
   * 성능 모니터링 활성화 여부
   */
  enablePerformanceMonitoring?: boolean;
  /**
   * Sentry DSN (성능 데이터 전송)
   */
  sentryDsn?: string;
  /**
   * 파서 타입 선택 (성능 비교용)
   * - 'babel': @babel/parser 사용 (기본값, 권장)
   * - 'swc': @swc/core 사용 (실험적, 현재 Babel보다 느릴 수 있음)
   *
   * ⚠️ 주의: SWC 옵션은 실험적입니다. SWC AST를 Babel AST로 변환하는 과정에서
   * 성능 오버헤드가 발생할 수 있습니다. 안정성과 성능을 위해 Babel을 권장합니다.
   */
  parserType?: "babel" | "swc";
}

/**
 * ScriptConfig의 완전한 기본 설정 (중앙화)
 */
export const SCRIPT_CONFIG_DEFAULTS: Required<ScriptConfig> = {
  sourcePattern: COMMON_DEFAULTS.sourcePattern,
  translationImportSource: COMMON_DEFAULTS.translationImportSource,
  serverTranslationFunction: "getServerTranslation",
  dryRun: WRAPPER_DEFAULTS.dryRun,
  enablePerformanceMonitoring: WRAPPER_DEFAULTS.enablePerformanceMonitoring,
  sentryDsn: WRAPPER_DEFAULTS.sentryDsn,
  parserType: WRAPPER_DEFAULTS.parserType,
};

