// Type-safe i18n creator with namespace support (RECOMMENDED)
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

// Legacy Provider (deprecated - use createI18n instead)
/**
 * @deprecated I18nProvider는 더 이상 필요하지 않습니다.
 * createI18n을 사용하면 Provider 없이도 i18n을 사용할 수 있습니다.
 *
 * @example
 * ```typescript
 * // ❌ 레거시 방식 (권장하지 않음)
 * <I18nProvider initialLanguage="ko" translations={translations}>
 *   <App />
 * </I18nProvider>
 *
 * // ✅ 권장 방식 - Provider 없이 사용
 * const i18n = createI18n(translations, { fallbackNamespace: "common" });
 * function App() {
 *   const { t } = i18n.useTranslation();
 *   return <div>{t("welcome")}</div>;
 * }
 * ```
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
 *
 * @example
 * ```typescript
 * // ❌ 레거시 방식 (권장하지 않음)
 * import { useTranslation } from 'i18nexus';
 * const { t } = useTranslation();
 *
 * // ✅ 권장 방식 - Provider 불필요
 * import { createI18n } from 'i18nexus';
 * const i18n = createI18n(translations, { fallbackNamespace: "common" });
 * const { t } = i18n.useTranslation();
 * ```
 */
export { useLanguageSwitcher } from "./hooks/useTranslation";
export type {
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

// Dynamic translation utilities
export {
  createDynamicTranslation,
  buildTranslationParams,
  buildConditionalTranslation,
  mapToTranslationParams,
} from "./utils/dynamicTranslation";

