// Context 기반 Provider 및 Hooks (권장)
export { I18nProvider, useI18nContext } from "./components/I18nProvider";
export { I18NexusDevtools } from "./components/I18NexusDevtools";
// Hooks
export { useTranslation, useLanguageSwitcher } from "./hooks/useTranslation";
// 레거시 API (deprecated - Provider + useTranslation 사용 권장)
/**
 * @deprecated createI18n은 글로벌 싱글톤 패턴으로 테스트 격리와 SSR에 문제가 있을 수 있습니다.
 * 대신 I18nProvider와 useTranslation을 사용하세요.
 */
export { createI18n } from "./utils/createI18n";
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