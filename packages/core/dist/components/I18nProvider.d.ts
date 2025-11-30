import React, { ReactNode } from "react";
import { LanguageManager, LanguageConfig, LanguageManagerOptions } from "../utils/languageManager";
/** 번역 객체에서 키 추출 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> = keyof T[keyof T] & string;
/** 네임스페이스별 번역 구조 */
export type NamespaceTranslations = Record<string, // namespace
Record<string, // language
Record<string, string>>>;
export interface I18nContextType<TLanguage extends string = string, TKeys extends string = string> {
    currentLanguage: TLanguage;
    changeLanguage: (lang: TLanguage) => Promise<void>;
    availableLanguages: LanguageConfig[];
    languageManager: LanguageManager;
    isLoading: boolean;
    translations: Record<string, Record<string, string>>;
    /** 타입 안전한 useTranslation을 위한 번역 키 */
    _translationKeys?: Record<TKeys, true>;
}
export declare const I18nContext: React.Context<I18nContextType<any, any> | null>;
export declare const useI18nContext: <TLanguage extends string = string, TKeys extends string = string>() => I18nContextType<TLanguage, TKeys>;
export interface I18nProviderProps<TLanguage extends string = string, TTranslations extends Record<string, Record<string, string>> = Record<string, Record<string, string>>> {
    children: ReactNode;
    languageManagerOptions?: LanguageManagerOptions;
    translations?: TTranslations;
    onLanguageChange?: (language: TLanguage) => void;
    /** 서버 측 초기 언어 (SSR/Next.js App Router용, hydration 불일치 방지) */
    initialLanguage?: TLanguage;
}
export declare function I18nProvider<TLanguage extends string = string, TTranslations extends Record<string, Record<string, string>> = Record<string, Record<string, string>>>({ children, languageManagerOptions, translations, onLanguageChange, initialLanguage, }: I18nProviderProps<TLanguage, TTranslations>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=I18nProvider.d.ts.map