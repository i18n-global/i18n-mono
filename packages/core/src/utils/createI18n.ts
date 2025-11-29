/**
 * Type-safe i18n creator with automatic namespace key inference
 *
 * This utility creates a fully typed i18n system where translation keys
 * are automatically inferred from your translation files.
 *
 * @example
 * ```typescript
 * // 1. Define your translations
 * const translations = {
 *   common: {
 *     en: { welcome: "Welcome", goodbye: "Goodbye" },
 *     ko: { welcome: "환영합니다", goodbye: "안녕" }
 *   },
 *   menu: {
 *     en: { home: "Home", about: "About" },
 *     ko: { home: "홈", about: "소개" }
 *   }
 * } as const;
 *
 * // 2. Create typed i18n system - no Provider needed!
 * const i18n = createI18n(translations, { fallbackNamespace: "common" });
 *
 * // 3. Use in components - FULLY TYPED!
 * function MyComponent() {
 *   const { t, language } = i18n.useTranslation("common");
 *   return (
 *     <div>
 *       <h1>{t("welcome")}</h1>
 *       <button onClick={() => i18n.changeLanguage('en')}>English</button>
 *     </div>
 *   );
 * }
 * ```
 */

import React from "react";
import {
  LanguageManager,
  LanguageManagerOptions,
  LanguageConfig,
} from "./languageManager";

/**
 * Extract translation keys from a translations object
 * @example
 * type Keys = ExtractI18nKeys<typeof translations>;
 * // "greeting" | "farewell" | "welcome"
 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> =
  keyof T[keyof T] & string;

/**
 * Namespace translations structure
 * Record<namespace, Record<language, Record<key, value>>>
 */
export type NamespaceTranslations = Record<
  string, // namespace
  Record<
    string, // language
    Record<string, string> // key: value
  >
>;

/**
 * Translation function return type
 */
export interface UseTranslationReturn<K extends string = string> {
  t: (
    key: K,
    variables?: Record<string, string | number>,
    styles?: Record<string, React.CSSProperties>,
  ) => string | React.ReactElement;
  currentLanguage: string;
  isReady: boolean;
}

/**
 * Extract namespace names from translations object
 */
export type ExtractNamespaces<T extends NamespaceTranslations> = keyof T &
  string;

/**
 * Extract keys from a specific namespace
 */
export type ExtractNamespaceKeys<
  T extends NamespaceTranslations,
  NS extends keyof T,
> = ExtractI18nKeys<T[NS]>;

/**
 * Extract all keys from all namespaces (Union type)
 */
export type ExtractAllKeys<T extends NamespaceTranslations> = {
  [K in keyof T]: ExtractNamespaceKeys<T, K>;
}[keyof T];

/**
 * Extract keys from fallback namespace
 */
export type ExtractFallbackKeys<
  T extends NamespaceTranslations,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, Fallback>;

/**
 * Extract keys from specific namespace + fallback namespace
 */
export type ExtractNamespaceWithFallback<
  T extends NamespaceTranslations,
  NS extends keyof T,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, NS> | ExtractFallbackKeys<T, Fallback>;

/**
 * Namespace loader function type for lazy loading
 */
export type NamespaceLoader = (
  namespace: string,
  language: string,
) => Promise<Record<string, string>>;

/**
 * Options for createI18n
 */
export interface CreateI18nOptions<
  TTranslations extends NamespaceTranslations,
  Fallback extends keyof TTranslations = keyof TTranslations,
> {
  /**
   * Fallback namespace to use when namespace is not specified
   * @default undefined (no fallback)
   */
  fallbackNamespace?: Fallback;

  /**
   * Enable fallback behavior
   * @default true
   */
  enableFallback?: boolean;

  /**
   * Enable lazy loading of namespaces
   * When true, namespaces are loaded on-demand instead of all at once
   * @default false
   */
  lazy?: boolean;

  /**
   * Namespace loader function for lazy loading
   * Required when lazy: true
   * @param namespace - The namespace to load
   * @param language - The language to load
   * @returns Promise resolving to translations for that namespace+language
   */
  loadNamespace?: NamespaceLoader;

  /**
   * Preload specific namespaces on initialization
   * Only used when lazy: true
   * @default []
   */
  preloadNamespaces?: Array<keyof TTranslations>;

  /**
   * Language manager configuration
   * Handles cookie/localStorage sync, language detection, etc.
   */
  languageManager?: LanguageManagerOptions;
}

/**
 * Create a type-safe i18n system with automatic key inference
 *
 * @param translations - Your translation object with namespaces
 * @param options - Optional configuration for fallback namespace and language manager
 * @returns Fully typed i18n object with hooks and utilities
 *
 * @example
 * ```typescript
 * const translations = {
 *   common: { en: { ... }, ko: { ... } },
 *   menu: { en: { ... }, ko: { ... } }
 * } as const;
 *
 * // Create i18n with language manager
 * export const i18n = createI18n(translations, { 
 *   fallbackNamespace: "common",
 *   languageManager: {
 *     defaultLanguage: 'ko',
 *     availableLanguages: [
 *       { code: 'ko', name: '한국어' },
 *       { code: 'en', name: 'English' }
 *     ]
 *   }
 * });
 *
 * // Use directly without Provider
 * function MyComponent() {
 *   const { t, language } = i18n.useTranslation("common");
 *   return (
 *     <div>
 *       <h1>{t("welcome")}</h1>
 *       <button onClick={() => i18n.changeLanguage('en')}>English</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function createI18n<
  TTranslations extends NamespaceTranslations,
  Fallback extends keyof TTranslations = keyof TTranslations,
>(
  translations: TTranslations,
  options?: CreateI18nOptions<TTranslations, Fallback>,
) {
  const fallbackNamespace = options?.fallbackNamespace;
  const enableFallback = options?.enableFallback !== false;
  const lazy = options?.lazy ?? false;
  const loadNamespace = options?.loadNamespace;
  const preloadNamespaces = options?.preloadNamespaces ?? [];

  // Validate lazy mode configuration
  if (lazy && !loadNamespace) {
    throw new Error(
      "createI18n: loadNamespace function is required when lazy mode is enabled",
    );
  }

  // Create global language manager instance
  const languageManager = new LanguageManager(options?.languageManager);

  // Global state for language (client-side only)
  let currentLanguage: string | null = null;
  const languageListeners = new Set<(language: string) => void>();

  // Get current language (lazy initialization)
  function getCurrentLanguage(): string {
    if (typeof window === "undefined") {
      // Server-side: return default
      return languageManager.getCurrentLanguage();
    }
    if (currentLanguage === null) {
      currentLanguage = languageManager.getCurrentLanguage();
    }
    return currentLanguage;
  }

  // Loaded namespaces cache (for lazy mode)
  const loadedNamespaces = new Map<
    string,
    Record<string, Record<string, string>>
  >();

  // Helper functions for string interpolation
  function interpolate(
    text: string,
    variables?: Record<string, string | number>,
  ): string {
    if (!variables) {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      return value !== undefined ? String(value) : match;
    });
  }

  function interpolateWithStyles(
    text: string,
    variables: Record<string, string | number>,
    styles: Record<string, React.CSSProperties>,
  ): React.ReactElement {
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    const regex = /\{\{(\w+)\}\}/g;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the variable
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const variableName = match[1];
      const value = variables[variableName];
      const style = styles[variableName];

      if (value !== undefined) {
        if (style) {
          // Wrap with span if style is provided
          parts.push(
            React.createElement(
              "span",
              { key: `var-${key++}`, style: style },
              String(value),
            ),
          );
        } else {
          // Just add the value as string
          parts.push(String(value));
        }
      } else {
        // Keep placeholder if value not found
        parts.push(match[0]);
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return React.createElement(React.Fragment, null, ...parts);
  }

  // Flatten translations for current language
  function getFlattenedTranslations(language: string): Record<string, string> {
    const flattened: Record<string, string> = {};
    
    if (lazy) {
      // Lazy mode: only use loaded namespaces
      loadedNamespaces.forEach((nsData) => {
        if (nsData[language]) {
          Object.assign(flattened, nsData[language]);
        }
      });
    } else {
      // Eager mode: flatten all namespaces
      Object.keys(translations).forEach((ns) => {
        const nsData = translations[ns];
        if (nsData && nsData[language]) {
          Object.assign(flattened, nsData[language]);
        }
      });
    }
    
    return flattened;
  }

  /**
   * Typed useTranslation hook - no Provider needed!
   * Automatically subscribes to language changes and provides translation function
   *
   * @param namespace - Optional namespace to use (e.g., "common", "menu")
   *                   If not provided, returns all keys from all namespaces
   * @returns Translation function with auto-completed keys
   *
   * @example
   * ```typescript
   * // Without namespace - access all keys
   * function MyComponent() {
   *   const { t, language } = i18n.useTranslation();
   *   return <div>{t("welcome")}</div>;
   * }
   *
   * // With namespace - access specific namespace + fallback keys
   * function MenuComponent() {
   *   const { t } = i18n.useTranslation("menu");
   *   return <nav>{t("home")}</nav>;
   * }
   * ```
   */
  function useTranslation<
    NS extends ExtractNamespaces<TTranslations> | undefined = undefined,
  >(
    namespace?: NS,
  ): UseTranslationReturn<
    NS extends undefined
      ? ExtractAllKeys<TTranslations>
      : Fallback extends keyof TTranslations
        ? ExtractNamespaceWithFallback<TTranslations, NonNullable<NS>, Fallback>
        : ExtractNamespaceKeys<TTranslations, NonNullable<NS>>
  > {
    // Client-side only - subscribe to language changes
    const [language, setLanguage] = React.useState<string>(() => 
      getCurrentLanguage()
    );

    React.useEffect(() => {
      // Update if language changed externally
      const current = getCurrentLanguage();
      if (current !== language) {
        setLanguage(current);
      }

      // Subscribe to language changes
      const unsubscribe = languageManager.addLanguageChangeListener(
        (newLang) => {
          currentLanguage = newLang;
          setLanguage(newLang);
          // Notify all other listeners
          languageListeners.forEach((listener) => {
            try {
              listener(newLang);
            } catch (error) {
              console.error("Error in language listener:", error);
            }
          });
        }
      );

      return unsubscribe;
    }, []);

    // Get translations for current language
    const flattenedTranslations = React.useMemo(
      () => getFlattenedTranslations(language),
      [language]
    );

    // Create translation function
    const translate = React.useCallback(
      (
        key: any,
        variables?: Record<string, string | number>,
        styles?: Record<string, React.CSSProperties>,
      ): any => {
        const text = flattenedTranslations[key] || key;

        // If styles are provided, return React elements
        if (styles && variables) {
          return interpolateWithStyles(text, variables, styles);
        }

        // Otherwise return string
        return interpolate(text, variables);
      },
      [flattenedTranslations]
    );

    return {
      t: translate as any,
      currentLanguage: language,
      isReady: true,
    };
  }

  /**
   * Server-side translation function for Next.js Server Components
   * Automatically detects language from headers and returns typed translation function
   *
   * @param namespace - Optional namespace to use (e.g., "common", "menu")
   * @returns Promise with translation function and language info
   *
   * @example Basic usage (auto-detects language from headers)
   * ```tsx
   * import { headers } from 'next/headers';
   * import { i18n } from '@/locales';
   *
   * export default async function ServerPage() {
   *   const { t } = await i18n.getServerTranslation("common");
   *   return <h1>{t("welcome")}</h1>;
   * }
   * ```
   *
   * @example Without namespace (uses all keys)
   * ```tsx
   * const { t, language } = await i18n.getServerTranslation();
   * ```
   */
  async function getServerTranslation<
    NS extends ExtractNamespaces<TTranslations> | undefined = undefined,
  >(namespace?: NS) {
    // Try to import Next.js headers dynamically
    let headersList: Headers;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - next/headers is an optional peer dependency
      const { headers } = await import("next/headers");
      headersList = await headers();
    } catch {
      // Not in Next.js environment, use empty Headers
      headersList = new Headers();
    }

    // Get language from headers (using server utility)
    let language = "en";
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - import server utils
      const { getServerLanguage } = await import("./server");
      language = getServerLanguage(headersList);
    } catch {
      // Fallback to simple cookie parsing
      const cookieHeader = headersList.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split("=");
          if (decodeURIComponent(name) === "i18n-language") {
            language = decodeURIComponent(value);
            break;
          }
        }
      }
    }

    // Flatten translations for the detected language
    const flattenedTranslations: Record<string, string> = {};

    if (namespace) {
      // Load specific namespace + fallback
      const nsData = translations[namespace];
      const fallbackData = fallbackNamespace
        ? translations[fallbackNamespace]
        : null;

      if (nsData && nsData[language]) {
        Object.assign(flattenedTranslations, nsData[language]);
      }
      if (
        enableFallback &&
        fallbackData &&
        fallbackData[language] &&
        namespace !== (fallbackNamespace as any)
      ) {
        Object.assign(flattenedTranslations, fallbackData[language]);
      }
    } else {
      // Load all namespaces
      Object.keys(translations).forEach((ns) => {
        const nsData = translations[ns];
        if (nsData && nsData[language]) {
          Object.assign(flattenedTranslations, nsData[language]);
        }
      });
    }

    // Create translation function
    function t(
      key: NS extends undefined
        ? ExtractAllKeys<TTranslations>
        : Fallback extends keyof TTranslations
          ? ExtractNamespaceWithFallback<
              TTranslations,
              NonNullable<NS>,
              Fallback
            >
          : ExtractNamespaceKeys<TTranslations, NonNullable<NS>>,
      variables?: Record<string, string | number>,
    ): string {
      const text = flattenedTranslations[key as string] || (key as string);

      // Simple variable interpolation
      if (!variables) {
        return text;
      }

      return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
        const value = variables[variableName];
        return value !== undefined ? String(value) : match;
      });
    }

    return {
      t,
      language,
      translations: flattenedTranslations,
    };
  }

  return {
    /**
     * Typed useTranslation - auto-infers keys from namespace
     * No Provider needed!
     */
    useTranslation,

    /**
     * Server-side translation with auto language detection
     */
    getServerTranslation,

    /**
     * Change current language
     * @param lang - Language code to switch to
     * @returns Promise that resolves when language is changed
     * 
     * @example
     * ```typescript
     * <button onClick={() => i18n.changeLanguage('en')}>
     *   Switch to English
     * </button>
     * ```
     */
    changeLanguage: async (lang: string): Promise<void> => {
      if (typeof window === "undefined") {
        console.warn("changeLanguage() is only available on client-side");
        return;
      }
      
      const success = languageManager.setLanguage(lang);
      if (success) {
        currentLanguage = lang;
      }
    },

    /**
     * Get current language
     */
    getCurrentLanguage,

    /**
     * Get available languages
     */
    getAvailableLanguages: (): LanguageConfig[] => {
      return languageManager.getAvailableLanguages();
    },

    /**
     * Get language configuration for a specific language
     */
    getLanguageConfig: (code: string): LanguageConfig | undefined => {
      return languageManager.getLanguageConfig(code);
    },

    /**
     * Detect browser's preferred language
     */
    detectBrowserLanguage: (): string | null => {
      return languageManager.detectBrowserLanguage();
    },

    /**
     * Reset language to default
     */
    resetLanguage: (): void => {
      languageManager.reset();
      currentLanguage = null;
    },

    /**
     * Original translations object (for reference)
     */
    translations,

    /**
     * Configuration options
     */
    options: {
      fallbackNamespace,
      enableFallback,
      lazy,
      preloadNamespaces,
    },

    /**
     * Load a namespace dynamically (lazy mode only)
     * @param namespace - The namespace to load
     * @returns Promise that resolves when namespace is loaded
     */
    loadNamespace: async (namespace: keyof TTranslations) => {
      if (!lazy) {
        console.warn("loadNamespace() is only available in lazy mode");
        return;
      }
      if (!loadNamespace) {
        throw new Error("loadNamespace function not configured");
      }

      // Already loaded
      if (loadedNamespaces.has(namespace as string)) {
        return;
      }

      // Load for all languages
      const languages = Object.keys(translations[namespace] || {});
      const promises = languages.map(async (lang) => {
        const data = await loadNamespace(namespace as string, lang);
        return { lang, data };
      });

      const results = await Promise.all(promises);
      const nsData: Record<string, Record<string, string>> = {};
      results.forEach(({ lang, data }) => {
        nsData[lang] = data;
      });

      loadedNamespaces.set(namespace as string, nsData);
    },
  };
}

/**
 * Helper type to infer the return type of createI18n
 * Useful for exporting types from your i18n setup file
 *
 * @example
 * ```typescript
 * const i18n = createI18n(translations);
 * export type I18n = CreateI18nReturn<typeof translations>;
 * ```
 */
export type CreateI18nReturn<T extends NamespaceTranslations> = ReturnType<
  typeof createI18n<T>
>;
