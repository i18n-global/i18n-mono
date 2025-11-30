import { createI18n } from "i18nexus";

// 타입 안전성을 위해 모든 translations를 import (타입 정보만 사용)
import type enAdminDashboard from "./admin-dashboard/en.json";
import type koAdminDashboard from "./admin-dashboard/ko.json";
import type enCli from "./cli/en.json";
import type koCli from "./cli/ko.json";
import type enCommon from "./common/en.json";
import type koCommon from "./common/ko.json";
import type enDocsI18nexus from "./docs-i18nexus/en.json";
import type koDocsI18nexus from "./docs-i18nexus/ko.json";
import type enDocsI18nexusProvider from "./docs-i18nexus-provider/en.json";
import type koDocsI18nexusProvider from "./docs-i18nexus-provider/ko.json";
import type enDocsI18nexusServerComponents from "./docs-i18nexus-server-components/en.json";
import type koDocsI18nexusServerComponents from "./docs-i18nexus-server-components/ko.json";
import type enDocsI18nexusTools from "./docs-i18nexus-tools/en.json";
import type koDocsI18nexusTools from "./docs-i18nexus-tools/ko.json";
import type enDocsI18nexusToolsDownload from "./docs-i18nexus-tools-download/en.json";
import type koDocsI18nexusToolsDownload from "./docs-i18nexus-tools-download/ko.json";
import type enDocsI18nexusToolsDownloadForce from "./docs-i18nexus-tools-download-force/en.json";
import type koDocsI18nexusToolsDownloadForce from "./docs-i18nexus-tools-download-force/ko.json";
import type enDocsI18nexusToolsExtractor from "./docs-i18nexus-tools-extractor/en.json";
import type koDocsI18nexusToolsExtractor from "./docs-i18nexus-tools-extractor/ko.json";
import type enDocsI18nexusToolsGoogleSheets from "./docs-i18nexus-tools-google-sheets/en.json";
import type koDocsI18nexusToolsGoogleSheets from "./docs-i18nexus-tools-google-sheets/ko.json";
import type enDocsI18nexusToolsUpload from "./docs-i18nexus-tools-upload/en.json";
import type koDocsI18nexusToolsUpload from "./docs-i18nexus-tools-upload/ko.json";
import type enDocsI18nexusToolsWrapper from "./docs-i18nexus-tools-wrapper/en.json";
import type koDocsI18nexusToolsWrapper from "./docs-i18nexus-tools-wrapper/ko.json";
import type enDocsI18nexusUseLanguageSwitcher from "./docs-i18nexus-use-language-switcher/en.json";
import type koDocsI18nexusUseLanguageSwitcher from "./docs-i18nexus-use-language-switcher/ko.json";
import type enDocsI18nexusUseTranslation from "./docs-i18nexus-use-translation/en.json";
import type koDocsI18nexusUseTranslation from "./docs-i18nexus-use-translation/ko.json";
import type enGettingStarted from "./getting-started/en.json";
import type koGettingStarted from "./getting-started/ko.json";
import type enHome from "./home/en.json";
import type koHome from "./home/ko.json";
import type enProvider from "./provider/en.json";
import type koProvider from "./provider/ko.json";
import type enServerExample from "./server-example/en.json";
import type koServerExample from "./server-example/ko.json";
import type enShowcase from "./showcase/en.json";
import type koShowcase from "./showcase/ko.json";

// 타입 안전성을 위한 전체 translations 구조 (런타임에는 빈 객체, 타입만 제공)
export const translations = {
  "admin-dashboard": {
    en: {} as typeof enAdminDashboard,
    ko: {} as typeof koAdminDashboard,
  },
  cli: {
    en: {} as typeof enCli,
    ko: {} as typeof koCli,
  },
  common: {
    en: {} as typeof enCommon,
    ko: {} as typeof koCommon,
  },
  "docs-i18nexus": {
    en: {} as typeof enDocsI18nexus,
    ko: {} as typeof koDocsI18nexus,
  },
  "docs-i18nexus-provider": {
    en: {} as typeof enDocsI18nexusProvider,
    ko: {} as typeof koDocsI18nexusProvider,
  },
  "docs-i18nexus-server-components": {
    en: {} as typeof enDocsI18nexusServerComponents,
    ko: {} as typeof koDocsI18nexusServerComponents,
  },
  "docs-i18nexus-tools": {
    en: {} as typeof enDocsI18nexusTools,
    ko: {} as typeof koDocsI18nexusTools,
  },
  "docs-i18nexus-tools-download": {
    en: {} as typeof enDocsI18nexusToolsDownload,
    ko: {} as typeof koDocsI18nexusToolsDownload,
  },
  "docs-i18nexus-tools-download-force": {
    en: {} as typeof enDocsI18nexusToolsDownloadForce,
    ko: {} as typeof koDocsI18nexusToolsDownloadForce,
  },
  "docs-i18nexus-tools-extractor": {
    en: {} as typeof enDocsI18nexusToolsExtractor,
    ko: {} as typeof koDocsI18nexusToolsExtractor,
  },
  "docs-i18nexus-tools-google-sheets": {
    en: {} as typeof enDocsI18nexusToolsGoogleSheets,
    ko: {} as typeof koDocsI18nexusToolsGoogleSheets,
  },
  "docs-i18nexus-tools-upload": {
    en: {} as typeof enDocsI18nexusToolsUpload,
    ko: {} as typeof koDocsI18nexusToolsUpload,
  },
  "docs-i18nexus-tools-wrapper": {
    en: {} as typeof enDocsI18nexusToolsWrapper,
    ko: {} as typeof koDocsI18nexusToolsWrapper,
  },
  "docs-i18nexus-use-language-switcher": {
    en: {} as typeof enDocsI18nexusUseLanguageSwitcher,
    ko: {} as typeof koDocsI18nexusUseLanguageSwitcher,
  },
  "docs-i18nexus-use-translation": {
    en: {} as typeof enDocsI18nexusUseTranslation,
    ko: {} as typeof koDocsI18nexusUseTranslation,
  },
  "getting-started": {
    en: {} as typeof enGettingStarted,
    ko: {} as typeof koGettingStarted,
  },
  home: {
    en: {} as typeof enHome,
    ko: {} as typeof koHome,
  },
  provider: {
    en: {} as typeof enProvider,
    ko: {} as typeof koProvider,
  },
  "server-example": {
    en: {} as typeof enServerExample,
    ko: {} as typeof koServerExample,
  },
  showcase: {
    en: {} as typeof enShowcase,
    ko: {} as typeof koShowcase,
  },
} as const;

// 동적 namespace 로더 - 실제로 필요할 때만 로드
async function loadNamespace(namespace: string, lang: string) {
  const module = await import(`./${namespace}/${lang}.json`);
  return module.default;
}

// createI18n with lazy loading + 타입 안전성
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  lazy: true,
  loadNamespace,
  preloadNamespaces: ["common"], // fallback namespace는 미리 로드
  languageManager: {
    defaultLanguage: "ko",
    availableLanguages: [
      { code: "ko", name: "한국어", flag: "🇰🇷" },
      { code: "en", name: "English", flag: "🇺🇸" },
    ],
    cookieName: "i18n-language",
    enableAutoDetection: true,
    enableLocalStorage: true,
  },
});
