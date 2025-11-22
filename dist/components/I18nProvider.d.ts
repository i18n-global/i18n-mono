import React, { ReactNode } from "react";
import { LanguageManager, LanguageConfig, LanguageManagerOptions } from "../utils/languageManager";
/**
 * Extract translation keys from a namespace's translations
 * @example
 * type Keys = ExtractI18nKeys<typeof translations["common"]>;
 * // "greeting" | "farewell" | "welcome"
 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> = keyof T[keyof T] & string;
/**
 * Namespace-based translation structure
 * @example
 * {
 *   common: { en: { welcome: "Welcome" }, ko: { welcome: "환영합니다" } },
 *   menu: { en: { home: "Home" }, ko: { home: "홈" } },
 *   dynamic: { en: { ... }, ko: { ... } }
 * }
 */
export type NamespaceTranslations = Record<string, Record<string, Record<string, string>>>;
export interface I18nContextType<TLanguage extends string = string, TKeys extends string = string> {
    currentLanguage: TLanguage;
    changeLanguage: (lang: TLanguage) => Promise<void>;
    availableLanguages: LanguageConfig[];
    languageManager: LanguageManager;
    isLoading: boolean;
    /**
     * Namespace-based translations
     * @example
     * {
     *   common: { en: { welcome: "Welcome" }, ko: { welcome: "환영합니다" } },
     *   menu: { en: { home: "Home" }, ko: { home: "홈" } }
     * }
     */
    translations: NamespaceTranslations;
    /**
     * Dynamic translations (separate from static namespaces)
     */
    dynamicTranslations: Record<string, Record<string, string>>;
    /**
     * Valid translation keys extracted from translations
     * This is used for type-safe useTranslation
     */
    _translationKeys?: Record<TKeys, true>;
}
export declare const I18nContext: React.Context<I18nContextType<any, any> | null>;
export declare const useI18nContext: <TLanguage extends string = string, TKeys extends string = string>() => I18nContextType<TLanguage, TKeys>;
export interface I18nProviderProps<TLanguage extends string = string, TTranslations extends NamespaceTranslations = NamespaceTranslations> {
    children: ReactNode;
    languageManagerOptions?: LanguageManagerOptions;
    /**
     * Namespace-based translations
     * @example
     * {
     *   common: { en: { welcome: "Welcome" }, ko: { welcome: "환영합니다" } },
     *   menu: { en: { home: "Home" }, ko: { home: "홈" } }
     * }
     */
    translations?: TTranslations;
    /**
     * Dynamic translations (optional, separate from static namespaces)
     * @example
     * {
     *   en: { "item.type.0": "League", "error.404": "Not Found" },
     *   ko: { "item.type.0": "리그", "error.404": "찾을 수 없음" }
     * }
     */
    dynamicTranslations?: Record<string, Record<string, string>>;
    onLanguageChange?: (language: TLanguage) => void;
    /**
     * Initial language from server-side (for SSR/Next.js App Router)
     * This prevents hydration mismatch by ensuring server and client render with the same language
     */
    initialLanguage?: TLanguage;
}
export declare function I18nProvider<TLanguage extends string = string, TTranslations extends NamespaceTranslations = NamespaceTranslations>({ children, languageManagerOptions, translations, dynamicTranslations, onLanguageChange, initialLanguage, }: I18nProviderProps<TLanguage, TTranslations>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=I18nProvider.d.ts.map