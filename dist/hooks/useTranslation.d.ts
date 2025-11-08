import React from "react";
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
    (key: K, variables: TranslationVariables, styles: TranslationStyles): React.ReactElement;
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
 * Hook to access translation function and current language
 *
 * Basic usage (no type safety):
 * ```typescript
 * const { t } = useTranslation();
 * t("any-key"); // No type checking
 * ```
 *
 * For type-safe keys, specify the valid keys as a generic parameter:
 * ```typescript
 * const { t } = useTranslation<"greeting" | "farewell">();
 * t("greeting");   // ✅ OK
 * t("invalid");    // ❌ Type error: '"invalid"' is not assignable to '"greeting" | "farewell"'
 * ```
 */
export declare const useTranslation: <K extends string = string>() => UseTranslationReturn<K>;
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
export declare const useLanguageSwitcher: () => UseLanguageSwitcherReturn;
//# sourceMappingURL=useTranslation.d.ts.map