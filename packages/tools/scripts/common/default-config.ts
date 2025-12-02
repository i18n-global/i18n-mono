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
  fallbackNamespace: "common",
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
  enablePerformanceMonitoring:
    PERFORMANCE_MONITORING_DEFAULTS.enablePerformanceMonitoring,
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
  /**
   * 번역 함수 모드 (기능적 선택)
   * - 'client': useTranslation() 사용
   * - 'server': getServerTranslation() 사용
   * - 지정하지 않으면 기존 판단 로직 사용
   *
   * ⚠️ 주의: 이 옵션은 번역 함수 선택만 담당합니다.
   * "use client" 디렉티브는 framework 옵션과 함께 결정됩니다.
   */
  mode?: "client" | "server";
  /**
   * 프레임워크 타입
   * - 'nextjs': Next.js App Router 환경
   *   → mode="client"일 때 "use client" 디렉티브 자동 추가
   * - 'react': React 일반 환경 (Vite, CRA 등)
   *   → "use client" 디렉티브 추가 안 함
   * - 'other' 또는 미지정: 프레임워크 감지 안 함
   *   → "use client" 디렉티브 추가 안 함
   */
  framework?: "nextjs" | "react" | "other";
  /**
   * 성능 모니터링 활성화 여부
   */
  enablePerformanceMonitoring?: boolean;
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
  mode: undefined as unknown as "client" | "server",
  framework: undefined as unknown as "nextjs" | "react" | "other",
  enablePerformanceMonitoring: WRAPPER_DEFAULTS.enablePerformanceMonitoring,
  parserType: WRAPPER_DEFAULTS.parserType,
};
