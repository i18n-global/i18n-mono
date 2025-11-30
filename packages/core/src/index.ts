// 타입 안전한 i18n 생성 (네임스페이스 지원, 권장)
export { createI18n } from "./utils/createI18n";
export type {
  CreateI18nReturn,
  CreateI18nOptions,
  ExtractNamespaces,
  ExtractNamespaceKeys,
  ExtractAllKeys,
  ExtractFallbackKeys,
  ExtractNamespaceWithFallback,
  NamespaceTranslations,
  ExtractI18nKeys,
  UseTranslationReturn,
} from "./utils/createI18n";

// 레거시 Provider (deprecated - createI18n 사용 권장)
/**
 * @deprecated I18nProvider는 더 이상 필요하지 않습니다.
 * createI18n을 사용하면 Provider 없이도 i18n을 사용할 수 있습니다.
 */
export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type {
  I18nProviderProps,
  I18nContextType,
} from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";

// Hooks
/**
 * @deprecated 직접 useTranslation을 import하는 것은 권장하지 않습니다.
 * createI18n을 사용하여 타입 안전한 i18n 시스템을 생성하세요.
 */
export { useLanguageSwitcher } from "./hooks/useTranslation";
export type {
  TranslationVariables,
  TranslationStyles,
  VariableStyle,
  TranslationFunction,
} from "./hooks/useTranslation";

// 타입 안전한 번역 유틸리티
export {
  createTypedTranslation,
  createTypedTranslationWithStyles,
  createMultiLangTypedTranslation,
  validateTranslationKeys,
  getTranslationKeyList,
} from "./utils/typeTranslation";
export type {
  ExtractTranslationKeys,
  ExtractLanguageKeys,
} from "./utils/typeTranslation";

// 유틸리티
export {
  setCookie,
  getCookie,
  deleteCookie,
  getAllCookies,
} from "./utils/cookie";
export type { CookieOptions } from "./utils/cookie";

// 언어 관리자
export {
  LanguageManager,
  defaultLanguageManager,
} from "./utils/languageManager";
export type {
  LanguageConfig,
  LanguageManagerOptions,
} from "./utils/languageManager";

// 타입 유틸리티
export { defineConfig } from "./utils/types";
export type { ExtractLanguages } from "./utils/types";

// 동적 번역 유틸리티
export {
  createDynamicTranslation,
  buildTranslationParams,
  buildConditionalTranslation,
  mapToTranslationParams,
} from "./utils/dynamicTranslation";
