// Context 기반 Provider 및 Hooks (권장)
export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
// Hooks
export { useTranslation, useLanguageSwitcher } from "./hooks/useTranslation";
// 레거시 API 제거됨 (v3.3.1+)
// createI18n, createI18nWithConfig는 제거되었습니다.
// I18nProvider와 useTranslation을 사용하세요.
// 타입 안전한 번역 유틸리티
export { createTypedTranslation, createTypedTranslationWithStyles, createMultiLangTypedTranslation, validateTranslationKeys, getTranslationKeyList, } from "./utils/typeTranslation";
// 유틸리티
export { setCookie, getCookie, deleteCookie, getAllCookies, } from "./utils/cookie";
// 언어 관리자
export { LanguageManager, defaultLanguageManager, } from "./utils/languageManager";
// 타입 유틸리티
export { defineConfig } from "./utils/types";
// 동적 번역 유틸리티
export { createDynamicTranslation, buildTranslationParams, buildConditionalTranslation, mapToTranslationParams, } from "./utils/dynamicTranslation";
//# sourceMappingURL=index.js.map