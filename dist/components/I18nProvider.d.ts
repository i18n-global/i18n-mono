import React, { ReactNode } from "react";
import { LanguageManager, LanguageConfig, LanguageManagerOptions } from "../utils/languageManager";
export interface I18nContextType<TLanguage extends string = string> {
    currentLanguage: TLanguage;
    changeLanguage: (lang: TLanguage) => Promise<void>;
    availableLanguages: LanguageConfig[];
    languageManager: LanguageManager;
    isLoading: boolean;
    translations: Record<string, Record<string, string>>;
}
export declare const I18nContext: React.Context<I18nContextType<any> | null>;
export declare const useI18nContext: <TLanguage extends string = string>() => I18nContextType<TLanguage>;
export interface I18nProviderProps<TLanguage extends string = string> {
    children: ReactNode;
    languageManagerOptions?: LanguageManagerOptions;
    translations?: Record<string, Record<string, string>>;
    onLanguageChange?: (language: TLanguage) => void;
    /**
     * Initial language from server-side (for SSR/Next.js App Router)
     * This prevents hydration mismatch by ensuring server and client render with the same language
     */
    initialLanguage?: TLanguage;
}
export declare function I18nProvider<TLanguage extends string = string>({ children, languageManagerOptions, translations, onLanguageChange, initialLanguage, }: I18nProviderProps<TLanguage>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=I18nProvider.d.ts.map