import React, { ReactNode } from "react";
import { LanguageManager, LanguageConfig, LanguageManagerOptions } from "../utils/languageManager";
/** 번역 객체에서 키 추출 */
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> = keyof T[keyof T] & string;
/** 네임스페이스별 번역 구조 */
export type NamespaceTranslations = Record<string, // namespace
Record<string, // language
Record<string, string>>>;
/** Lazy loading용 네임스페이스 로더 타입 */
export type NamespaceLoader = (namespace: string, language: string) => Promise<Record<string, string>>;
/** 네임스페이스에서 키 추출 */
export type ExtractNamespaceKeys<TTranslations extends NamespaceTranslations, NS extends keyof TTranslations> = TTranslations[NS] extends Record<string, infer Translations> ? Translations extends Record<string, string> ? keyof Translations & string : never : never;
/** Fallback 네임스페이스 포함 키 추출 */
export type ExtractKeysWithFallback<TTranslations extends NamespaceTranslations, NS extends keyof TTranslations, Fallback extends keyof TTranslations> = ExtractNamespaceKeys<TTranslations, NS> | ExtractNamespaceKeys<TTranslations, Fallback>;
export interface I18nContextType<TTranslations extends NamespaceTranslations = NamespaceTranslations> {
    currentLanguage: string;
    changeLanguage: (lang: string) => Promise<void>;
    availableLanguages: LanguageConfig[];
    languageManager: LanguageManager;
    isLoading: boolean;
    /** 네임스페이스별 번역 데이터 (타입 추론에 사용) */
    namespaceTranslations: TTranslations;
    /** 로드된 네임스페이스 (런타임 데이터) */
    loadedNamespaces: Map<string, Record<string, Record<string, string>>>;
    /** Lazy loading 활성화 여부 */
    lazy?: boolean;
    /** 네임스페이스 로더 함수 */
    loadNamespace?: NamespaceLoader;
    /** Fallback 네임스페이스 */
    fallbackNamespace?: keyof TTranslations;
    /** 타입 정보 (런타임에는 사용하지 않음) */
    _type?: TTranslations;
}
export declare const I18nContext: React.Context<I18nContextType<any> | null>;
export declare const useI18nContext: <TTranslations extends NamespaceTranslations = NamespaceTranslations>() => I18nContextType<TTranslations>;
export interface I18nProviderProps<TTranslations extends NamespaceTranslations = NamespaceTranslations> {
    children: ReactNode;
    languageManagerOptions?: LanguageManagerOptions;
    /** 네임스페이스별 번역 구조 (타입 추론에 사용, lazy일 경우 빈 객체 가능) */
    translations?: TTranslations;
    onLanguageChange?: (language: string) => void;
    /** 서버 측 초기 언어 (SSR/Next.js App Router용, hydration 불일치 방지) */
    initialLanguage?: string;
    /** Lazy loading용 네임스페이스 로더 (제공 시 자동으로 lazy=true) */
    loadNamespace?: NamespaceLoader;
    /** Fallback 네임스페이스 (lazy 모드에서 자동 프리로드) */
    fallbackNamespace?: keyof TTranslations;
    /** 추가로 미리 로드할 네임스페이스 목록 */
    preloadNamespaces?: Array<keyof TTranslations>;
}
export declare function I18nProvider<TTranslations extends NamespaceTranslations = NamespaceTranslations>({ children, languageManagerOptions, translations, onLanguageChange, initialLanguage, loadNamespace, fallbackNamespace, preloadNamespaces, }: I18nProviderProps<TTranslations>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=I18nProvider.d.ts.map