// Components
export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export type {
  I18nProviderProps,
  I18nContextType,
  ExtractI18nKeys,
  NamespaceTranslations,
} from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
export type { I18NexusDevtoolsProps } from "./components/I18NexusDevtools";

// Hooks
export {
  useTranslation,
  useDynamicTranslation,
  useLanguageSwitcher,
} from "./hooks/useTranslation";
export type {
  UseTranslationReturn,
  UseDynamicTranslationReturn,
  UseLanguageSwitcherReturn,
  TranslationVariables,
  TranslationStyles,
  VariableStyle,
  TranslationFunction,
} from "./hooks/useTranslation";

// Type-safe translation utilities
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

// Utils
export {
  setCookie,
  getCookie,
  deleteCookie,
  getAllCookies,
} from "./utils/cookie";
export type { CookieOptions } from "./utils/cookie";

// Language Manager
export {
  LanguageManager,
  defaultLanguageManager,
} from "./utils/languageManager";
export type {
  LanguageConfig,
  LanguageManagerOptions,
} from "./utils/languageManager";

// Type utilities
export { defineConfig } from "./utils/types";
export type { ExtractLanguages } from "./utils/types";

// Type-safe i18n creator (automatic key inference)
export { createI18n } from "./utils/createI18n";
export type {
  CreateI18nReturn,
  ExtractNamespaces,
  ExtractNamespaceKeys,
} from "./utils/createI18n";
