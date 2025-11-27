export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type { I18nProviderProps, I18nContextType, ExtractI18nKeys, NamespaceTranslations, } from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";
/**
 * @deprecated 직접 useTranslation을 import하는 것은 권장하지 않습니다.
 * createI18n을 사용하여 타입 안전한 i18n 시스템을 생성하세요.
 *
 * @example
 * ```typescript
 * // ❌ 레거시 방식 (권장하지 않음)
 * import { useTranslation } from 'i18nexus';
 * const { t } = useTranslation();
 *
 * // ✅ 권장 방식
 * import { createI18n } from 'i18nexus';
 * const i18n = createI18n(translations, { fallbackNamespace: "common" });
 * const { t } = i18n.useTranslation();
 * ```
 */
export { useLanguageSwitcher } from "./hooks/useTranslation";
export type { UseTranslationReturn, UseLanguageSwitcherReturn, TranslationVariables, TranslationStyles, VariableStyle, TranslationFunction, } from "./hooks/useTranslation";
export { createTypedTranslation, createTypedTranslationWithStyles, createMultiLangTypedTranslation, validateTranslationKeys, getTranslationKeyList, } from "./utils/typeTranslation";
export type { ExtractTranslationKeys, ExtractLanguageKeys, } from "./utils/typeTranslation";
export { setCookie, getCookie, deleteCookie, getAllCookies, } from "./utils/cookie";
export type { CookieOptions } from "./utils/cookie";
export { LanguageManager, defaultLanguageManager, } from "./utils/languageManager";
export type { LanguageConfig, LanguageManagerOptions, } from "./utils/languageManager";
export { defineConfig } from "./utils/types";
export type { ExtractLanguages } from "./utils/types";
export { createDynamicTranslation, buildTranslationParams, buildConditionalTranslation, mapToTranslationParams, } from "./utils/dynamicTranslation";
export { createI18n } from "./utils/createI18n";
export type { CreateI18nReturn, CreateI18nOptions, ExtractNamespaces, ExtractNamespaceKeys, ExtractAllKeys, ExtractFallbackKeys, ExtractNamespaceWithFallback, } from "./utils/createI18n";
//# sourceMappingURL=index.d.ts.map