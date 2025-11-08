"use client";

import React from "react";
import { useI18nContext } from "../components/I18nProvider";
import type { LanguageConfig } from "../utils/languageManager";

/**
 * Variables for string interpolation
 */
export type TranslationVariables = Record<string, string | number>;

/**
 * Style configuration for a variable
 */
export type VariableStyle = React.CSSProperties;

/**
 * Styles for variables in translation
 */
export type TranslationStyles = Record<string, VariableStyle>;

/**
 * Translation function overloads for type safety
 */
export interface TranslationFunction<K extends string = string> {
  /**
   * Translation with styles - returns React element
   * @param key - Translation key to look up
   * @param variables - Object with variables for string interpolation
   * @param styles - Object with styles for variables
   * @returns React element with styled variables
   * @example
   * t("개수 : {{count}} 입니다", { count: 5 }, { count: { color: 'red', fontWeight: 'bold' } })
   * // Returns: <>개수 : <span style={{...}}>5</span> 입니다</>
   */
  (
    key: K,
    variables: TranslationVariables,
    styles: TranslationStyles
  ): React.ReactElement;

  /**
   * Translation without styles - returns string
   * @param key - Translation key to look up
   * @param variables - Optional object with variables for string interpolation
   * @returns Translated string with interpolated variables
   * @example
   * t("Hello {{name}}", { name: "World" })
   * // Returns: "Hello World"
   */
  (key: K, variables?: TranslationVariables): string;
}

/**
 * Return type for useTranslation hook
 */
export interface UseTranslationReturn<K extends string = string> {
  /**
   * Translation function with type guards
   * - Returns React.ReactElement when styles are provided
   * - Returns string when styles are not provided
   *
   * When K is specified, only those keys are allowed:
   * ```typescript
   * const { t } = useTranslation<"greeting" | "farewell">();
   * t("greeting");   // ✅ OK
   * t("invalid");    // ❌ TypeScript Error
   * ```
   */
  t: TranslationFunction<K>;
  /**
   * Current language code (e.g., 'en', 'ko')
   */
  currentLanguage: string;
  /**
   * Whether translations are ready to use
   */
  isReady: boolean;
}

/**
 * Replace variables in a translation string
 * @param text - Text with {{variable}} placeholders
 * @param variables - Object with variable values
 * @returns Text with variables replaced
 */
const interpolate = (
  text: string,
  variables?: TranslationVariables
): string => {
  if (!variables) {
    return text;
  }

  return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
    const value = variables[variableName];
    return value !== undefined ? String(value) : match;
  });
};

/**
 * Replace variables in a translation string with React elements (with styles)
 * @param text - Text with {{variable}} placeholders
 * @param variables - Object with variable values
 * @param styles - Object with styles for variables
 * @returns React elements with styled variables
 */
const interpolateWithStyles = (
  text: string,
  variables: TranslationVariables,
  styles: TranslationStyles
): React.ReactElement => {
  // Split text by variable placeholders
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
            String(value)
          )
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
};

/**
 * Hook to access translation function and current language
 *
 * Usage 1: Auto-detect keys from I18nProvider translations (Recommended!)
 * ```typescript
 * <I18nProvider translations={{ en: { greeting: "Hello" } }}>
 *   const { t } = useTranslation();  // t automatically typed!
 *   t("greeting");   // ✅ OK
 *   t("invalid");    // ❌ Compile error
 * </I18nProvider>
 * ```
 *
 * Usage 2: Explicit key specification
 * ```typescript
 * const { t } = useTranslation<"greeting" | "farewell">();
 * t("greeting");   // ✅ OK
 * t("invalid");    // ❌ TypeScript Error
 * ```
 *
 * Usage 3: No type safety (backward compatible)
 * ```typescript
 * const { t } = useTranslation();
 * t("any-key");    // ✅ No type checking
 * ```
 */
export function useTranslation<
  K extends string = string,
>(): UseTranslationReturn<K> {
  // Extract K from context if not explicitly provided
  // This enables automatic type inference from I18nProvider
  const context = useI18nContext<string, K>();
  const { currentLanguage, isLoading, translations } = context;

  // i18nexus 자체 번역 시스템 사용
  const translate = ((
    key: K,
    variables?: TranslationVariables,
    styles?: TranslationStyles
  ): string | React.ReactElement => {
    const currentTranslations = translations[currentLanguage] || {};
    const translatedText = currentTranslations[key as unknown as string] || key;

    // If styles are provided, return React elements
    if (styles && variables) {
      return interpolateWithStyles(translatedText, variables, styles);
    }

    // Otherwise return string
    return interpolate(translatedText, variables);
  }) as TranslationFunction<K>;

  return {
    t: translate,
    currentLanguage,
    isReady: !isLoading,
  };
}

/**
 * Return type for useLanguageSwitcher hook
 */
export interface UseLanguageSwitcherReturn {
  /**
   * Current language code (e.g., 'en', 'ko')
   */
  currentLanguage: string;
  /**
   * List of available language configurations
   */
  availableLanguages: LanguageConfig[];
  /**
   * Change the current language
   * @param lang - Language code to switch to
   * @returns Promise that resolves when language is changed
   */
  changeLanguage: (lang: string) => Promise<void>;
  /**
   * Alias for changeLanguage - Switch to a specific language
   * @param lang - Language code to switch to
   * @returns Promise that resolves when language is changed
   */
  switchLng: (lang: string) => Promise<void>;
  /**
   * Switch to the next available language in the list
   */
  switchToNextLanguage: () => Promise<void>;
  /**
   * Switch to the previous language in the list
   */
  switchToPreviousLanguage: () => Promise<void>;
  /**
   * Get language configuration for a specific language code
   * @param code - Language code (defaults to current language)
   */
  getLanguageConfig: (code?: string) => LanguageConfig | undefined;
  /**
   * Detect the user's browser language
   * @returns Browser language code or null if not detected
   */
  detectBrowserLanguage: () => string | null;
  /**
   * Reset language to default
   */
  resetLanguage: () => void;
  /**
   * Whether language is currently being changed
   */
  isLoading: boolean;
}

/**
 * Hook to access language switching functionality
 */
export const useLanguageSwitcher = (): UseLanguageSwitcherReturn => {
  const {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    languageManager,
    isLoading,
  } = useI18nContext();

  const switchToNextLanguage = async () => {
    const languageCodes = availableLanguages.map((lang) => lang.code);
    const currentIndex = languageCodes.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languageCodes.length;
    const nextLanguage = languageCodes[nextIndex];
    await changeLanguage(nextLanguage);
  };

  const switchToPreviousLanguage = async () => {
    const languageCodes = availableLanguages.map((lang) => lang.code);
    const currentIndex = languageCodes.indexOf(currentLanguage);
    const prevIndex =
      currentIndex === 0 ? languageCodes.length - 1 : currentIndex - 1;
    const prevLanguage = languageCodes[prevIndex];
    await changeLanguage(prevLanguage);
  };

  const getLanguageConfig = (code?: string) => {
    return languageManager.getLanguageConfig(code || currentLanguage);
  };

  const detectBrowserLanguage = () => {
    return languageManager.detectBrowserLanguage();
  };

  const resetLanguage = () => {
    languageManager.reset();
  };

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    switchLng: changeLanguage, // Alias for better compatibility
    switchToNextLanguage,
    switchToPreviousLanguage,
    getLanguageConfig,
    detectBrowserLanguage,
    resetLanguage,
    isLoading,
  };
};
