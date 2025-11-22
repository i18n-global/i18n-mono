/**
 * Server-side utilities for Next.js App Router
 * Use these functions in Server Components to read language from cookies
 */
/**
 * Parse Accept-Language header and return best matching language
 * @param acceptLanguage - Accept-Language header value
 * @param availableLanguages - List of supported language codes
 * @returns Best matching language code or null
 *
 * @example
 * ```tsx
 * parseAcceptLanguage("ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7", ["en", "ko"])
 * // Returns: "ko"
 * ```
 */
export declare function parseAcceptLanguage(acceptLanguage: string, availableLanguages: string[]): string | null;
/**
 * Get language from cookies in Next.js App Router Server Components
 * Falls back to Accept-Language header if no cookie is set
 *
 * @example Basic usage
 * ```tsx
 * import { headers } from 'next/headers';
 * import { getServerLanguage } from 'i18nexus/server';
 *
 * export default async function RootLayout({ children }) {
 *   const headersList = await headers();
 *   const language = getServerLanguage(headersList);
 *
 *   return (
 *     <I18nProvider initialLanguage={language}>
 *       {children}
 *     </I18nProvider>
 *   );
 * }
 * ```
 *
 * @example With Accept-Language detection
 * ```tsx
 * const language = getServerLanguage(headersList, {
 *   availableLanguages: ["en", "ko", "ja"],
 *   defaultLanguage: "en"
 * });
 * ```
 */
export declare function getServerLanguage(headers: Headers, options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
}): string;
/**
 * Parse cookies from cookie header string
 */
export declare function parseCookies(cookieHeader: string | null): Record<string, string>;
/**
 * Variables for string interpolation in server translations
 */
export type ServerTranslationVariables = Record<string, string | number>;
/**
 * Create server-side translation function for use in Server Components
 *
 * @example Basic usage
 * ```tsx
 * import { createServerTranslation } from 'i18nexus/server';
 * import { translations } from '@/lib/i18n';
 *
 * export default async function ServerPage() {
 *   const headersList = await headers();
 *   const language = getServerLanguage(headersList);
 *   const t = createServerTranslation(language, translations);
 *
 *   return <h1>{t("Welcome")}</h1>;
 * }
 * ```
 *
 * @example With variables
 * ```tsx
 * const t = createServerTranslation(language, translations);
 * return <p>{t("환영합니다 {{count}}", { count: 5 })}</p>;
 * ```
 */
export declare function createServerTranslation(language: string, translations: Record<string, Record<string, string>>): (key: string, variables?: ServerTranslationVariables | string, fallback?: string) => string;
/**
 * Get server-side translations object
 *
 * @example
 * ```tsx
 * import { getServerTranslations } from 'i18nexus/server';
 * import { translations } from '@/lib/i18n';
 *
 * export default async function ServerPage() {
 *   const headersList = await headers();
 *   const language = getServerLanguage(headersList);
 *   const dict = getServerTranslations(language, translations);
 *
 *   return <h1>{dict["Welcome"]}</h1>;
 * }
 * ```
 */
export declare function getServerTranslations(language: string, translations: Record<string, Record<string, string>>): Record<string, string>;
/**
 * Load translations from a directory (for use with auto-generated index.ts)
 * This function attempts to dynamically import translations from the specified directory
 *
 * @example
 * ```tsx
 * import { loadTranslations } from 'i18nexus/server';
 *
 * // In your setup file or at the top level
 * const translations = await loadTranslations('./locales');
 * ```
 */
export declare function loadTranslations(localesDir: string): Promise<Record<string, Record<string, string>>>;
/**
 * Create a server-side translation context with auto-loaded translations
 * Automatically loads config from i18nexus.config.json and detects headers in Next.js
 * Supports Accept-Language header for automatic language detection
 *
 * @example Simple usage (no parameters needed in Next.js!)
 * ```tsx
 * import { createServerI18n } from 'i18nexus/server';
 *
 * export default async function ServerPage() {
 *   const { t, language } = await createServerI18n();
 *
 *   return <h1>{t("Welcome")}</h1>;
 * }
 * ```
 *
 * @example With Accept-Language detection
 * ```tsx
 * const { t, language } = await createServerI18n({
 *   availableLanguages: ["en", "ko", "ja"],
 *   defaultLanguage: "en"
 * });
 * // Will automatically detect user's browser language from Accept-Language header
 * ```
 *
 * @example With custom options (overrides config)
 * ```tsx
 * const { t, language } = await createServerI18n({
 *   localesDir: './custom/locales'
 * });
 * ```
 */
export declare function createServerI18n(options?: {
    localesDir?: string;
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
    translations?: Record<string, Record<string, string>>;
}): Promise<{
    t: (key: string, variables?: ServerTranslationVariables | string, fallback?: string) => string;
    language: string;
    translations: Record<string, Record<string, string>>;
    dict: Record<string, string>;
}>;
/**
 * Create a simple server-side i18n context with pre-loaded translations
 * This is useful when you want to pass translations explicitly
 * Supports Accept-Language header for automatic language detection
 *
 * @example Basic usage
 * ```tsx
 * import { createServerI18nWithTranslations } from 'i18nexus/server';
 * import { headers } from 'next/headers';
 * import { translations } from '@/lib/i18n';
 *
 * export default async function ServerPage() {
 *   const headersList = await headers();
 *   const { t, language } = createServerI18nWithTranslations(headersList, translations);
 *
 *   return <h1>{t("Welcome")}</h1>;
 * }
 * ```
 *
 * @example With Accept-Language detection
 * ```tsx
 * const { t, language } = createServerI18nWithTranslations(
 *   headersList,
 *   translations,
 *   {
 *     availableLanguages: ["en", "ko", "ja"],
 *     defaultLanguage: "en"
 *   }
 * );
 * ```
 */
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
/**
 * Create dynamic translation function for server-side use
 * Accepts any string key without type checking - use for runtime dynamic keys
 *
 * @example
 * ```tsx
 * import { headers } from 'next/headers';
 * import { getServerLanguage, getDynamicTranslation } from 'i18nexus/server';
 * import { dynamicTranslations } from '@/lib/i18n';
 *
 * export default async function ServerPage() {
 *   const headersList = await headers();
 *   const language = getServerLanguage(headersList);
 *   const tDynamic = getDynamicTranslation(language, dynamicTranslations);
 *
 *   const errorCode = "404";
 *   return <p>{tDynamic(`error.${errorCode}`)}</p>;
 * }
 * ```
 *
 * @param language - Current language code
 * @param dynamicTranslations - Dynamic translations object
 */
export declare function getDynamicTranslation(language: string, dynamicTranslations: Record<string, Record<string, string>>): (key: string, variables?: ServerTranslationVariables, fallback?: string) => string;
//# sourceMappingURL=server.d.ts.map