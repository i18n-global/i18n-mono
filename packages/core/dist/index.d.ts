export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type { I18nProviderProps, I18nContextType, NamespaceTranslations, NamespaceLoader, } from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";
export { useTranslation, useLanguageSwitcher } from "./hooks/useTranslation";
export type { TranslationVariables, TranslationStyles, VariableStyle, TranslationFunction, UseTranslationReturn, UseLanguageSwitcherReturn, } from "./hooks/useTranslation";
/**
 * @deprecated createI18n은 글로벌 싱글톤 패턴으로 테스트 격리와 SSR에 문제가 있을 수 있습니다.
 * 대신 I18nProvider와 useTranslation을 사용하세요.
 */
export { createI18n } from "./utils/createI18n";
export type { CreateI18nReturn, CreateI18nOptions, ExtractNamespaces, ExtractNamespaceKeys, ExtractAllKeys, ExtractFallbackKeys, ExtractNamespaceWithFallback, ExtractI18nKeys, } from "./utils/createI18n";
export { createTypedTranslation, createTypedTranslationWithStyles, createMultiLangTypedTranslation, validateTranslationKeys, getTranslationKeyList, } from "./utils/typeTranslation";
export type { ExtractTranslationKeys, ExtractLanguageKeys, } from "./utils/typeTranslation";
export { setCookie, getCookie, deleteCookie, getAllCookies, } from "./utils/cookie";
export type { CookieOptions } from "./utils/cookie";
export { LanguageManager, defaultLanguageManager, } from "./utils/languageManager";
export type { LanguageConfig, LanguageManagerOptions, } from "./utils/languageManager";
export { defineConfig } from "./utils/types";
export type { ExtractLanguages } from "./utils/types";
export { createDynamicTranslation, buildTranslationParams, buildConditionalTranslation, mapToTranslationParams, } from "./utils/dynamicTranslation";
//# sourceMappingURL=index.d.ts.map