export { createI18n } from "./utils/createI18n";
export type { CreateI18nReturn, CreateI18nOptions, ExtractNamespaces, ExtractNamespaceKeys, ExtractAllKeys, ExtractFallbackKeys, ExtractNamespaceWithFallback, NamespaceTranslations, ExtractI18nKeys, UseTranslationReturn, } from "./utils/createI18n";
/**
 * @deprecated I18nProvider는 더 이상 필요하지 않습니다.
 * createI18n을 사용하면 Provider 없이도 i18n을 사용할 수 있습니다.
 */
export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type { I18nProviderProps, I18nContextType, } from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";
/**
 * @deprecated 직접 useTranslation을 import하는 것은 권장하지 않습니다.
 * createI18n을 사용하여 타입 안전한 i18n 시스템을 생성하세요.
 */
export { useLanguageSwitcher } from "./hooks/useTranslation";
export type { TranslationVariables, TranslationStyles, VariableStyle, TranslationFunction, } from "./hooks/useTranslation";
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