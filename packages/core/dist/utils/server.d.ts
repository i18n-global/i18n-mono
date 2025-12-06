/** Next.js App Router 서버 컴포넌트용 유틸리티 */
/** Accept-Language 헤더 파싱하여 가장 적합한 언어 반환 */
export declare function parseAcceptLanguage(acceptLanguage: string, availableLanguages: string[]): string | null;
/** 서버 컴포넌트에서 쿠키/헤더로 언어 감지 */
export declare function getServerLanguage(headers: Headers, options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
}): string;
/** 쿠키 헤더 문자열 파싱 */
export declare function parseCookies(cookieHeader: string | null): Record<string, string>;
/** 서버 번역에서 사용하는 변수 타입 */
export type ServerTranslationVariables = Record<string, string | number>;
/** 서버 컴포넌트용 번역 함수 생성 */
export declare function createServerTranslation(language: string, translations: Record<string, Record<string, string>>): (key: string, variables?: ServerTranslationVariables | string, fallback?: string) => string;
/** 타입 안전한 서버 번역 객체 반환 */
export declare function getServerTranslations<T extends Record<string, Record<string, string>>>(language: string, translations: T): Record<string, string>;
/** 디렉토리에서 번역 파일 동적 로드 */
export declare function loadTranslations(localesDir: string): Promise<Record<string, Record<string, string>>>;
/** 서버 번역 컨텍스트 생성 (설정 자동 로드, 헤더 자동 감지) */
export interface GetTranslationOptions {
    localesDir?: string;
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
    /** Disable automatic namespace inference */
    disableAutoInference?: boolean;
    /** Use fallback namespace on error */
    useFallbackOnError?: boolean;
    /** Disable caching (useful for development) */
    disableCache?: boolean;
}
export interface GetTranslationReturn<NS extends string = string> {
    /** Type-safe translation function */
    t: (key: string, variables?: Record<string, string | number>, fallback?: string) => string;
    /** Current language */
    language: string;
    /** Language alias (react-i18next compatibility) */
    lng: string;
    /** Current namespace */
    namespace: NS;
    /** Translations object */
    translations: Record<string, Record<string, string>>;
    /** Current language dictionary */
    dict: Record<string, string>;
}
/**
 * Get server-side translation function with namespace support
 *
 * Features:
 * - Automatic namespace inference from file path
 * - Falls back to config.fallbackNamespace if inference fails
 * - Translation caching for performance
 * - Clear error messages
 *
 * @example
 * ```tsx
 * // Automatic namespace inference
 * export default async function Page() {
 *   const { t } = await getTranslation();
 *   return <h1>{t("title")}</h1>;
 * }
 *
 * // Explicit namespace
 * export default async function Page() {
 *   const { t } = await getTranslation<"home">("home");
 *   return <h1>{t("title")}</h1>;
 * }
 * ```
 */
export declare function getTranslation<NS extends string = string>(namespace?: NS, options?: GetTranslationOptions): Promise<GetTranslationReturn<NS>>;
/**
 * Invalidate translation cache
 * Useful for development or when translations are updated
 */
export declare function invalidateCache(namespace?: string, language?: string): void;
/**
 * @deprecated Use getTranslation() instead
 */
export declare function createServerI18n(options?: {
    localesDir?: string;
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
    translations?: Record<string, Record<string, string>>;
}): Promise<GetTranslationReturn<string>>;
/** 미리 로드된 번역으로 서버 i18n 컨텍스트 생성 */
export declare function createServerI18nWithTranslations(headers: Headers, translations: Record<string, Record<string, string>>, options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
}): {
    t: (key: string, variables?: ServerTranslationVariables | string, fallback?: string) => string;
    language: string;
    translations: Record<string, Record<string, string>>;
    dict: Record<string, string>;
};
//# sourceMappingURL=server.d.ts.map