export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type { I18nProviderProps, I18nContextType, NamespaceTranslations, NamespaceLoader, } from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";
export { useTranslation, useLanguageSwitcher } from "./hooks/useTranslation";
export type { TranslationVariables, TranslationStyles, VariableStyle, TranslationFunction, UseTranslationReturn, UseLanguageSwitcherReturn, } from "./hooks/useTranslation";
export { createTypedTranslation, createTypedTranslationWithStyles, createMultiLangTypedTranslation, validateTranslationKeys, getTranslationKeyList, } from "./utils/typeTranslation";
export type { ExtractTranslationKeys, ExtractLanguageKeys, } from "./utils/typeTranslation";
export { setCookie, getCookie, deleteCookie, getAllCookies, } from "./utils/cookie";
export type { CookieOptions } from "./utils/cookie";
export { LanguageManager, defaultLanguageManager, } from "./utils/languageManager";
export type { LanguageConfig, LanguageManagerOptions, } from "./utils/languageManager";
export { defineConfig } from "./utils/types";
export type { ExtractLanguages } from "./utils/types";
export { createDynamicTranslation, buildTranslationParams, buildConditionalTranslation, mapToTranslationParams, } from "./utils/dynamicTranslation";
export { getTranslation, getServerLanguage, createServerTranslation, getServerTranslations, parseAcceptLanguage, parseCookies, invalidateCache, } from "./utils/server";
export type { GetTranslationReturn, GetTranslationOptions, ServerTranslationVariables, } from "./utils/server";
//# sourceMappingURL=index.d.ts.map