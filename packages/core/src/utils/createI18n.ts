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
export type ExtractNamespaces<T extends NamespaceTranslations> = keyof T & string;

/**
 * Extract keys from a specific namespace
 */
export type ExtractNamespaceKeys<
  T extends NamespaceTranslations,
  NS extends keyof T
> = ExtractI18nKeys<T[NS]>;

/**
 * Create a type-safe i18n system with automatic key inference
 *
 * @param translations - Your translation object with namespaces
 * @returns Fully typed Provider and hooks
 *
 * @example
 * ```typescript
 * const translations = {
 *   common: { en: { ... }, ko: { ... } },
 *   menu: { en: { ... }, ko: { ... } }
 * } as const;
 *
 * const i18n = createI18n(translations);
 *
 * // In your app
 * <i18n.I18nProvider>
 *   <App />
 * </i18n.I18nProvider>
 *
 * // In components
 * const { t } = i18n.useTranslation("common");  // Auto-typed!
 * ```
 */
export function createI18n<
  TTranslations extends NamespaceTranslations
>(translations: TTranslations) {
  /**
   * Typed I18nProvider component
   * Wraps the base provider with your translation types
   */
  function TypedI18nProvider<TLanguage extends string = string>(
    props: Omit<BaseI18nProviderProps<TLanguage, TTranslations>, 'translations'> & {
      translations?: TTranslations;
      dynamicTranslations?: Record<string, Record<string, string>>;
    }
  ) {
    return React.createElement(BaseI18nProvider<TLanguage, TTranslations>, {
      ...props,
      translations: props.translations || translations,
    } as BaseI18nProviderProps<TLanguage, TTranslations>);
  }

  /**
   * Typed useTranslation hook
   * Automatically infers keys based on the namespace
   *
   * @param namespace - The namespace to use (e.g., "common", "menu")
   * @returns Translation function with auto-completed keys
   *
   * @example
   * ```typescript
   * const { t } = useTranslation("common");
   * t("welcome");  // ✅ Autocomplete works!
   * t("invalid");  // ❌ TypeScript error
   * ```
   */
  function useTranslation<NS extends ExtractNamespaces<TTranslations>>(
    namespace: NS
  ): UseTranslationReturn<ExtractNamespaceKeys<TTranslations, NS>> {
    return useTranslationBase<ExtractNamespaceKeys<TTranslations, NS>>(namespace);
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
export type CreateI18nReturn<T extends NamespaceTranslations> = ReturnType<typeof createI18n<T>>;
