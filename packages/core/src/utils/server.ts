/**
 * Server-side utilities for Next.js App Router
 * Use these functions in Server Components to read language from cookies
 */

import * as fs from "fs";
import * as path from "path";

// Minimal config shape used by server utilities
type LocalConfig = {
  localesDir?: string;
  defaultLanguage?: string;
};

/**
 * Attempt to load i18nexus config silently from the project root.
 * This is a lightweight replacement for the removed `scripts/config-loader`.
 * Returns parsed config object or null if not found or invalid.
 */
async function loadConfigSilently(): Promise<LocalConfig | null> {
  try {
    const configPath = path.resolve(process.cwd(), "i18nexus.config.json");
    if (fs.existsSync(configPath)) {
      const raw = await fs.promises.readFile(configPath, "utf8");
      try {
        return JSON.parse(raw) as LocalConfig;
      } catch {
        // invalid JSON
        return null;
      }
    }

    // try package-level config file (optional)
    const altPath = path.resolve(process.cwd(), "i18nexus.config.js");
    if (fs.existsSync(altPath)) {
      // attempt to dynamically import it (works in ESM)
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore dynamic import
        const mod = await import(altPath);
        return mod && mod.default
          ? (mod.default as LocalConfig)
          : (mod as LocalConfig);
      } catch {
        return null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

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
export function parseAcceptLanguage(
  acceptLanguage: string,
  availableLanguages: string[],
): string | null {
  if (!acceptLanguage || !availableLanguages.length) {
    return null;
  }

  // Parse Accept-Language header into array of {lang, quality}
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";");
      const code = parts[0].toLowerCase();
      const quality = parts[1] ? parseFloat(parts[1].split("=")[1]) : 1.0;
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality); // Sort by quality (higher first)

  // Find best match
  for (const { code } of languages) {
    // Exact match (e.g., "en" === "en")
    if (availableLanguages.includes(code)) {
      return code;
    }

    // Language with region (e.g., "en-US" -> "en")
    const primaryLang = code.split("-")[0];
    if (availableLanguages.includes(primaryLang)) {
      return primaryLang;
    }

    // Check if any available language starts with this code
    const match = availableLanguages.find((lang) =>
      lang.toLowerCase().startsWith(primaryLang),
    );
    if (match) {
      return match;
    }
  }

  return null;
}

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
export function getServerLanguage(
  headers: Headers,
  options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
  },
): string {
  const cookieName = options?.cookieName || "i18n-language";
  const defaultLanguage = options?.defaultLanguage || "en";
  const availableLanguages = options?.availableLanguages || [];

  // 1. Check cookie first (user preference)
  const cookieHeader = headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (decodeURIComponent(name) === cookieName) {
        return decodeURIComponent(value);
      }
    }
  }

  // 2. Check Accept-Language header (browser preference)
  if (availableLanguages.length > 0) {
    const acceptLanguage = headers.get("accept-language");
    if (acceptLanguage) {
      const detectedLang = parseAcceptLanguage(
        acceptLanguage,
        availableLanguages,
      );
      if (detectedLang) {
        return detectedLang;
      }
    }
  }

  // 3. Fallback to default language
  return defaultLanguage;
}

/**
 * Parse cookies from cookie header string
 */
export function parseCookies(
  cookieHeader: string | null,
): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};
  const cookieArray = cookieHeader.split(";");

  for (const cookie of cookieArray) {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
}

/**
 * Variables for string interpolation in server translations
 */
export type ServerTranslationVariables = Record<string, string | number>;

/**
 * Replace variables in a server translation string
 * @param text - Text with {{variable}} placeholders
 * @param variables - Object with variable values
 * @returns Text with variables replaced
 */
function interpolateServer(
  text: string,
  variables?: ServerTranslationVariables,
): string {
  if (!variables) {
    return text;
  }

  return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
    const value = variables[variableName];
    return value !== undefined ? String(value) : match;
  });
}

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
export function createServerTranslation(
  language: string,
  translations: Record<string, Record<string, string>>,
) {
  const currentTranslations =
    translations[language] || translations["en"] || {};

  return function translate(
    key: string,
    variables?: ServerTranslationVariables | string,
    fallback?: string,
  ): string {
    // Handle legacy fallback parameter (2nd parameter as string)
    if (typeof variables === "string") {
      return currentTranslations[key] || variables || key;
    }

    // Get translated text
    const translatedText = currentTranslations[key] || fallback || key;

    // Apply variable interpolation if variables provided
    return interpolateServer(translatedText, variables);
  };
}

/**
 * Get server-side translations object with type safety
 *
 * @example Basic usage
 * ```tsx
 * import { getServerTranslations } from 'i18nexus/server';
 * import { translations } from '@/lib/i18n';
 *
 * export default async function ServerPage() {
 *   const headersList = await headers();
 *   const language = getServerLanguage(headersList);
 *   const dict = getServerTranslations(language, translations);
 *
 *   return <h1>{dict["welcome"]}</h1>;  // ✅ Type-safe!
 * }
 * ```
 *
 * @example With type inference
 * ```tsx
 * const translations = {
 *   en: { welcome: "Welcome", logout: "Logout" },
 *   ko: { welcome: "환영합니다", logout: "로그아웃" }
 * } as const;
 *
 * const dict = getServerTranslations("en", translations);
 * dict.welcome;  // ✅ Autocomplete works!
 * dict.invalid;  // ❌ TypeScript error
 * ```
 */
export function getServerTranslations<
  T extends Record<string, Record<string, string>>,
>(language: string, translations: T): T[keyof T] {
  return (translations[language] || translations["en"] || {}) as T[keyof T];
}

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
export async function loadTranslations(
  localesDir: string,
): Promise<Record<string, Record<string, string>>> {
  try {
    // Try to import the index file
    const indexPath = path.resolve(process.cwd(), localesDir, "index");
    const module = await import(indexPath);
    return module.translations || {};
  } catch (error) {
    console.warn(
      `Failed to load translations from ${localesDir}/index:`,
      error,
    );
    return {};
  }
}

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
export async function createServerI18n(options?: {
  localesDir?: string;
  cookieName?: string;
  defaultLanguage?: string;
  availableLanguages?: string[];
  translations?: Record<string, Record<string, string>>;
}) {
  // Load config from i18nexus.config.json (silently if not found)
  let config;
  try {
    config = await loadConfigSilently();
  } catch {
    // Config not found, use defaults
    config = null;
  }

  // Merge config with options (options take precedence)
  const localesDir = options?.localesDir || config?.localesDir || "./locales";
  const defaultLanguage =
    options?.defaultLanguage || config?.defaultLanguage || "en";
  const cookieName = options?.cookieName || "i18n-language";
  const availableLanguages = options?.availableLanguages || [];

  // Auto-detect headers in Next.js environment
  let headersInstance: Headers;
  try {
    // Dynamically import Next.js headers
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - next/headers is an optional peer dependency
    const { headers } = await import("next/headers");
    headersInstance = await headers();
  } catch {
    // Not in Next.js environment or headers not available
    // Create empty Headers object as fallback
    headersInstance = new Headers();
  }

  const language = getServerLanguage(headersInstance, {
    cookieName,
    defaultLanguage,
    availableLanguages,
  });

  // Use provided translations or load from directory
  const translations =
    options?.translations || (await loadTranslations(localesDir));

  const t = createServerTranslation(language, translations);
  const dict = getServerTranslations(language, translations);

  return {
    t,
    language,
    translations,
    dict,
  };
}

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
export function createServerI18nWithTranslations(
  headers: Headers,
  translations: Record<string, Record<string, string>>,
  options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
  },
) {
  const language = getServerLanguage(headers, options);
  const t = createServerTranslation(language, translations);
  const dict = getServerTranslations(language, translations);

  return {
    t,
    language,
    translations,
    dict,
  };
}
