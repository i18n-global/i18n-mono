// Context 기반 Provider 및 Hooks (권장)
export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type {
  I18nProviderProps,
  I18nContextType,
  NamespaceTranslations,
  NamespaceLoader,
} from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";

// Hooks
export { useTranslation, useLanguageSwitcher } from "./hooks/useTranslation";
export type {
  TranslationVariables,
  TranslationStyles,
  VariableStyle,
  TranslationFunction,
  UseTranslationReturn,
  UseLanguageSwitcherReturn,
} from "./hooks/useTranslation";

// 레거시 API 제거됨 (v3.3.1+)
// createI18n, createI18nWithConfig는 제거되었습니다.
// I18nProvider와 useTranslation을 사용하세요.

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

// 서버 유틸리티는 "i18nexus/server"에서만 import 가능
// import { getTranslation } from "i18nexus/server";
// 클라이언트 번들에 fs 모듈이 포함되는 것을 방지하기 위해 메인 export에서 제거됨
