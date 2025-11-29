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
 * // 2. Create typed i18n system
 * const { I18nProvider, useTranslation } = createI18n(translations);
 *
 * // 3. Use in components - FULLY TYPED!
 * function MyComponent() {
 *   const { t } = useTranslation("common");  // ← No manual type needed!
 *
 *   return <h1>{t("welcome")}</h1>;  // ✅ Autocomplete works!
 *   // t("invalid");  // ❌ TypeScript Error - not in common namespace
 * }
 * ```
 */

import React from "react";
import {
  I18nProvider as BaseI18nProvider,
  I18nProviderProps as BaseI18nProviderProps,
  ExtractI18nKeys,
  NamespaceTranslations,
} from "../components/I18nProvider";
import {
  useTranslation as useTranslationBase,
  UseTranslationReturn,
} from "../hooks/useTranslation";

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
}

/**
 * Create a type-safe i18n system with automatic key inference
 *
 * @param translations - Your translation object with namespaces
 * @param options - Optional configuration for fallback namespace
 * @returns Fully typed Provider and hooks
 *
 * @example
 * ```typescript
 * const translations = {
 *   common: { en: { ... }, ko: { ... } },
 *   menu: { en: { ... }, ko: { ... } }
 * } as const;
 *
 * // With fallback namespace
 * const i18n = createI18n(translations, { fallbackNamespace: "common" });
 *
 * // In your app
 * <i18n.I18nProvider>
 *   <App />
 * </i18n.I18nProvider>
 *
 * // In components
 * const { t } = i18n.useTranslation();  // No namespace needed! Uses all keys
 * const { t: tMenu } = i18n.useTranslation("menu");  // Specific namespace
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

  // Loaded namespaces cache (for lazy mode)
  const loadedNamespaces = new Map<
    string,
    Record<string, Record<string, string>>
  >();

  /**
   * Typed I18nProvider component
   * Wraps the base provider with your translation types
   */
  function TypedI18nProvider<TLanguage extends string = string>(
    props: Omit<
      BaseI18nProviderProps<TLanguage, Record<string, Record<string, string>>>,
      "translations"
    > & {
      translations?: TTranslations;
      dynamicTranslations?: Record<string, Record<string, string>>;
    },
  ) {
    const [loadedTranslations, setLoadedTranslations] = React.useState<
      Record<string, Record<string, string>>
    >(() => {
      if (lazy) {
        // Lazy mode: only load preloaded namespaces initially
        const initial: Record<string, Record<string, string>> = {};
        preloadNamespaces.forEach((ns) => {
          const nsTranslations = (props.translations || translations)[
            ns as string
          ];
          if (nsTranslations) {
            Object.keys(nsTranslations).forEach((lang) => {
              initial[lang] = { ...initial[lang], ...nsTranslations[lang] };
            });
          }
        });
        return initial;
      } else {
        // Eager mode: flatten all namespaces
        return Object.keys(props.translations || translations).reduce(
          (acc, namespace) => {
            const nsTranslations = (props.translations || translations)[
              namespace
            ];
            Object.keys(nsTranslations).forEach((lang) => {
              acc[lang] = { ...acc[lang], ...nsTranslations[lang] };
            });
            return acc;
          },
          {} as Record<string, Record<string, string>>,
        );
      }
    });

    return React.createElement(
      BaseI18nProvider<TLanguage, Record<string, Record<string, string>>>,
      {
        ...props,
        translations: loadedTranslations,
      },
    );
  }

  /**
   * Typed useTranslation hook
   * Automatically infers keys based on the namespace
   *
   * @param namespace - Optional namespace to use (e.g., "common", "menu")
   *                   If not provided, returns all keys from all namespaces
   * @returns Translation function with auto-completed keys
   *
   * @example
   * ```typescript
   * // Without namespace - access all keys
   * const { t } = useTranslation();
   * t("welcome");  // ✅ Works from any namespace
   * t("home");     // ✅ Works from any namespace
   *
   * // With namespace - access specific namespace + fallback keys
   * const { t } = useTranslation("menu");
   * t("home");     // ✅ From menu namespace
   * t("welcome");  // ✅ From fallback namespace (if enabled)
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
    // Note: useTranslationBase doesn't accept namespace parameter
    // All namespaces are already flattened in the provider
    // Type safety is enforced at compile time
    // Runtime fallback behavior is handled by flattening all namespaces
    return useTranslationBase<any>();
  }

  return {
    /**
     * Typed I18nProvider - use this instead of the base provider
     */
    I18nProvider: TypedI18nProvider,

    /**
     * Typed useTranslation - auto-infers keys from namespace
     */
    useTranslation,

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
