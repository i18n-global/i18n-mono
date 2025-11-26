import React, { ReactNode } from "react";
import { LanguageManager, LanguageConfig, LanguageManagerOptions } from "../utils/languageManager";
/**
 * Extract translation keys from a translations object
 * @example
 * type Keys = ExtractI18nKeys<typeof translations>;
 * // "greeting" | "farewell" | "welcome"
 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> = keyof T[keyof T] & string;
export interface I18nContextType<TLanguage extends string = string, TKeys extends string = string> {
    currentLanguage: TLanguage;
    changeLanguage: (lang: TLanguage) => Promise<void>;
    availableLanguages: LanguageConfig[];
    languageManager: LanguageManager;
    isLoading: boolean;
    translations: Record<string, Record<string, string>>;
    /**
     * Valid translation keys extracted from translations
     * This is used for type-safe useTranslation
     */
    _translationKeys?: Record<TKeys, true>;
}
export declare const I18nContext: React.Context<I18nContextType<any, any> | null>;
export declare const useI18nContext: <TLanguage extends string = string, TKeys extends string = string>() => I18nContextType<TLanguage, TKeys>;
export interface I18nProviderProps<TLanguage extends string = string, TTranslations extends Record<string, Record<string, string>> = Record<string, Record<string, string>>> {
    children: ReactNode;
    languageManagerOptions?: LanguageManagerOptions;
    translations?: TTranslations;
    onLanguageChange?: (language: TLanguage) => void;
    /**
     * Initial language from server-side (for SSR/Next.js App Router)
     * This prevents hydration mismatch by ensuring server and client render with the same language
     */
    initialLanguage?: TLanguage;
}
export declare function I18nProvider<TLanguage extends string = string, TTranslations extends Record<string, Record<string, string>> = Record<string, Record<string, string>>>({ children, languageManagerOptions, translations, onLanguageChange, initialLanguage, }: I18nProviderProps<TLanguage, TTranslations>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=I18nProvider.d.ts.map