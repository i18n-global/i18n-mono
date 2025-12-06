/** Next.js App Router 서버 컴포넌트용 유틸리티 */

import * as fs from "fs";
import * as path from "path";
import { loadConfigSilently as loadFullConfig } from "./config-loader";
import { inferNamespaceFromCallSite } from "./callsite-inference";
import {
  getCachedTranslations,
  cacheTranslations,
  invalidateCache as invalidateTranslationCache,
} from "./translation-cache";

type LocalConfig = {
  localesDir?: string;
  defaultLanguage?: string;
};

/** 프로젝트 루트에서 i18nexus 설정 파일 로드 (조용히) */
async function loadConfigSilently(): Promise<LocalConfig | null> {
  try {
    const configPath = path.resolve(process.cwd(), "i18nexus.config.json");
    if (fs.existsSync(configPath)) {
      const raw = await fs.promises.readFile(configPath, "utf8");
      try {
        return JSON.parse(raw) as LocalConfig;
      } catch {
        return null;
      }
    }

    const altPath = path.resolve(process.cwd(), "i18nexus.config.js");
    if (fs.existsSync(altPath)) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

/** Accept-Language 헤더 파싱하여 가장 적합한 언어 반환 */
export function parseAcceptLanguage(
  acceptLanguage: string,
  availableLanguages: string[],
): string | null {
  if (!acceptLanguage || !availableLanguages.length) {
    return null;
  }

  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";");
      const code = parts[0].toLowerCase();
      const quality = parts[1] ? parseFloat(parts[1].split("=")[1]) : 1.0;
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of languages) {
    if (availableLanguages.includes(code)) {
      return code;
    }

    const primaryLang = code.split("-")[0];
    if (availableLanguages.includes(primaryLang)) {
      return primaryLang;
    }

    const match = availableLanguages.find((lang) =>
      lang.toLowerCase().startsWith(primaryLang),
    );
    if (match) {
      return match;
    }
  }

  return null;
}

/** 서버 컴포넌트에서 쿠키/헤더로 언어 감지 */
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

  return defaultLanguage;
}

/** 쿠키 헤더 문자열 파싱 */
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

/** 서버 번역에서 사용하는 변수 타입 */
export type ServerTranslationVariables = Record<string, string | number>;

/** 서버 번역 문자열의 변수 치환 */
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

/** 서버 컴포넌트용 번역 함수 생성 */
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
    if (typeof variables === "string") {
      return currentTranslations[key] || variables || key;
    }

    const translatedText = currentTranslations[key] || fallback || key;
    return interpolateServer(translatedText, variables);
  };
}

/** 타입 안전한 서버 번역 객체 반환 */
export function getServerTranslations<
  T extends Record<string, Record<string, string>>,
>(language: string, translations: T): T[keyof T] {
  return (translations[language] || translations["en"] || {}) as T[keyof T];
}

/** 디렉토리에서 번역 파일 동적 로드 */
export async function loadTranslations(
  localesDir: string,
): Promise<Record<string, Record<string, string>>> {
  try {
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
  t: (
    key: string,
    variables?: Record<string, string | number>,
    fallback?: string,
  ) => string;
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
export async function getTranslation<NS extends string = string>(
  namespace?: NS,
  options?: GetTranslationOptions,
): Promise<GetTranslationReturn<NS>> {
  // 1. Load config
  let config;
  try {
    config = await loadFullConfig();
  } catch {
    config = null;
  }

  const localesDir = options?.localesDir || config?.localesDir || "./locales";
  const defaultLanguage =
    options?.defaultLanguage || config?.defaultLanguage || "en";
  const cookieName = options?.cookieName || "i18n-language";
  const availableLanguages = options?.availableLanguages || [];

  // 2. Get current language from headers
  let headersInstance: Headers;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { headers } = await import("next/headers");
    headersInstance = await headers();
  } catch {
    headersInstance = new Headers();
  }

  const language = getServerLanguage(headersInstance, {
    cookieName,
    defaultLanguage,
    availableLanguages,
  });

  // 3. Determine namespace (priority order)
  let resolvedNamespace = namespace;

  // Try automatic inference if no namespace provided
  if (!resolvedNamespace && !options?.disableAutoInference) {
    try {
      const inferred = inferNamespaceFromCallSite(config);
      if (inferred) {
        resolvedNamespace = inferred as NS;
      }
    } catch (error) {
      // Inference failed, continue to fallback
      console.warn("⚠️  Failed to infer namespace from call site:", error);
    }
  }

  // Fallback to config.fallbackNamespace
  if (!resolvedNamespace && config?.fallbackNamespace) {
    resolvedNamespace = config.fallbackNamespace as NS;
  }

  // Final fallback to "common"
  if (!resolvedNamespace) {
    resolvedNamespace = "common" as NS;
  }

  // 4. Check cache first
  if (!options?.disableCache) {
    const cached = getCachedTranslations(resolvedNamespace, language);
    if (cached) {
      const t = createServerTranslation(language, cached);
      const dict = getServerTranslations(language, cached);

      return {
        t,
        language,
        lng: language,
        namespace: resolvedNamespace,
        translations: cached,
        dict,
      };
    }
  }

  // 5. Load translations
  let translations: Record<string, Record<string, string>>;

  try {
    const nsTranslations = await import(
      `${localesDir}/${resolvedNamespace}/${language}.json`
    );
    translations = { [resolvedNamespace]: nsTranslations.default };
  } catch (error) {
    // Handle namespace not found
    if (
      options?.useFallbackOnError &&
      config?.fallbackNamespace &&
      config.fallbackNamespace !== resolvedNamespace
    ) {
      console.warn(
        `⚠️  Namespace '${resolvedNamespace}' not found, using fallback '${config.fallbackNamespace}'`,
      );

      try {
        const fallbackTranslations = await import(
          `${localesDir}/${config.fallbackNamespace}/${language}.json`
        );
        translations = {
          [config.fallbackNamespace]: fallbackTranslations.default,
        };
        resolvedNamespace = config.fallbackNamespace as NS;
      } catch (fallbackError) {
        throw new Error(
          `Failed to load namespace '${resolvedNamespace}' and fallback '${config.fallbackNamespace}':\n` +
            `  Primary error: ${error}\n` +
            `  Fallback error: ${fallbackError}\n\n` +
            `Please ensure the namespace files exist at:\n` +
            `  - ${localesDir}/${resolvedNamespace}/${language}.json\n` +
            `  - ${localesDir}/${config.fallbackNamespace}/${language}.json`,
        );
      }
    } else {
      throw new Error(
        `Failed to load namespace '${resolvedNamespace}' for language '${language}':\n` +
          `  Error: ${error}\n\n` +
          `Please ensure the file exists at:\n` +
          `  ${localesDir}/${resolvedNamespace}/${language}.json\n\n` +
          `Tips:\n` +
          `  - Run 'npx i18n-extractor' to generate translation files\n` +
          `  - Check that the namespace name matches your folder structure\n` +
          `  - Set fallbackNamespace in i18nexus.config.json for automatic fallback`,
      );
    }
  }

  // 6. Cache translations
  if (!options?.disableCache) {
    cacheTranslations(resolvedNamespace, language, translations);
  }

  // 7. Create translation function
  const t = createServerTranslation(language, translations);
  const dict = getServerTranslations(language, translations);

  return {
    t,
    language,
    lng: language,
    namespace: resolvedNamespace,
    translations,
    dict,
  };
}

/**
 * Invalidate translation cache
 * Useful for development or when translations are updated
 */
export function invalidateCache(namespace?: string, language?: string): void {
  invalidateTranslationCache(namespace, language);
}

/**
 * @deprecated Use getTranslation() instead
 */
export async function createServerI18n(options?: {
  localesDir?: string;
  cookieName?: string;
  defaultLanguage?: string;
  availableLanguages?: string[];
  translations?: Record<string, Record<string, string>>;
}) {
  return getTranslation(undefined, options);
}

/** 미리 로드된 번역으로 서버 i18n 컨텍스트 생성 */
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
