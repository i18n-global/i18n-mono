import { createI18n } from "i18nexus";

// 타입 안전성을 위해 모든 translations를 import (타입 정보만 사용)
import type adminDashboard_en from "./admin-dashboard/en.json";
import type adminDashboard_ko from "./admin-dashboard/ko.json";
import type cli_en from "./cli/en.json";
import type cli_ko from "./cli/ko.json";
import type common_en from "./common/en.json";
import type common_ko from "./common/ko.json";
import type docsI18nexus_en from "./docs-i18nexus/en.json";
import type docsI18nexus_ko from "./docs-i18nexus/ko.json";
import type docsI18nexusProvider_en from "./docs-i18nexus-provider/en.json";
import type docsI18nexusProvider_ko from "./docs-i18nexus-provider/ko.json";
import type docsI18nexusServerComponents_en from "./docs-i18nexus-server-components/en.json";
import type docsI18nexusServerComponents_ko from "./docs-i18nexus-server-components/ko.json";
import type docsI18nexusTools_en from "./docs-i18nexus-tools/en.json";
import type docsI18nexusTools_ko from "./docs-i18nexus-tools/ko.json";
import type docsI18nexusToolsDownload_en from "./docs-i18nexus-tools-download/en.json";
import type docsI18nexusToolsDownload_ko from "./docs-i18nexus-tools-download/ko.json";
import type docsI18nexusToolsDownloadForce_en from "./docs-i18nexus-tools-download-force/en.json";
import type docsI18nexusToolsDownloadForce_ko from "./docs-i18nexus-tools-download-force/ko.json";
import type docsI18nexusToolsExtractor_en from "./docs-i18nexus-tools-extractor/en.json";
import type docsI18nexusToolsExtractor_ko from "./docs-i18nexus-tools-extractor/ko.json";
import type docsI18nexusToolsGoogleSheets_en from "./docs-i18nexus-tools-google-sheets/en.json";
import type docsI18nexusToolsGoogleSheets_ko from "./docs-i18nexus-tools-google-sheets/ko.json";
import type docsI18nexusToolsUpload_en from "./docs-i18nexus-tools-upload/en.json";
import type docsI18nexusToolsUpload_ko from "./docs-i18nexus-tools-upload/ko.json";
import type docsI18nexusToolsWrapper_en from "./docs-i18nexus-tools-wrapper/en.json";
import type docsI18nexusToolsWrapper_ko from "./docs-i18nexus-tools-wrapper/ko.json";
import type docsI18nexusUseLanguageSwitcher_en from "./docs-i18nexus-use-language-switcher/en.json";
import type docsI18nexusUseLanguageSwitcher_ko from "./docs-i18nexus-use-language-switcher/ko.json";
import type docsI18nexusUseTranslation_en from "./docs-i18nexus-use-translation/en.json";
import type docsI18nexusUseTranslation_ko from "./docs-i18nexus-use-translation/ko.json";
import type errorTsx_en from "./error.tsx/en.json";
import type errorTsx_ko from "./error.tsx/ko.json";
import type gettingStarted_en from "./getting-started/en.json";
import type gettingStarted_ko from "./getting-started/ko.json";
import type home_en from "./home/en.json";
import type home_ko from "./home/ko.json";
import type provider_en from "./provider/en.json";
import type provider_ko from "./provider/ko.json";
import type serverExample_en from "./server-example/en.json";
import type serverExample_ko from "./server-example/ko.json";

// 타입 안전성을 위한 전체 translations 구조 (런타임에는 빈 객체, 타입만 제공)
export const translations = {
  "admin-dashboard": {
    en: {} as typeof adminDashboard_en,
    ko: {} as typeof adminDashboard_ko,
  },
  cli: {
    en: {} as typeof cli_en,
    ko: {} as typeof cli_ko,
  },
  common: {
    en: {} as typeof common_en,
    ko: {} as typeof common_ko,
  },
  "docs-i18nexus": {
    en: {} as typeof docsI18nexus_en,
    ko: {} as typeof docsI18nexus_ko,
  },
  "docs-i18nexus-provider": {
    en: {} as typeof docsI18nexusProvider_en,
    ko: {} as typeof docsI18nexusProvider_ko,
  },
  "docs-i18nexus-server-components": {
    en: {} as typeof docsI18nexusServerComponents_en,
    ko: {} as typeof docsI18nexusServerComponents_ko,
  },
  "docs-i18nexus-tools": {
    en: {} as typeof docsI18nexusTools_en,
    ko: {} as typeof docsI18nexusTools_ko,
  },
  "docs-i18nexus-tools-download": {
    en: {} as typeof docsI18nexusToolsDownload_en,
    ko: {} as typeof docsI18nexusToolsDownload_ko,
  },
  "docs-i18nexus-tools-download-force": {
    en: {} as typeof docsI18nexusToolsDownloadForce_en,
    ko: {} as typeof docsI18nexusToolsDownloadForce_ko,
  },
  "docs-i18nexus-tools-extractor": {
    en: {} as typeof docsI18nexusToolsExtractor_en,
    ko: {} as typeof docsI18nexusToolsExtractor_ko,
  },
  "docs-i18nexus-tools-google-sheets": {
    en: {} as typeof docsI18nexusToolsGoogleSheets_en,
    ko: {} as typeof docsI18nexusToolsGoogleSheets_ko,
  },
  "docs-i18nexus-tools-upload": {
    en: {} as typeof docsI18nexusToolsUpload_en,
    ko: {} as typeof docsI18nexusToolsUpload_ko,
  },
  "docs-i18nexus-tools-wrapper": {
    en: {} as typeof docsI18nexusToolsWrapper_en,
    ko: {} as typeof docsI18nexusToolsWrapper_ko,
  },
  "docs-i18nexus-use-language-switcher": {
    en: {} as typeof docsI18nexusUseLanguageSwitcher_en,
    ko: {} as typeof docsI18nexusUseLanguageSwitcher_ko,
  },
  "docs-i18nexus-use-translation": {
    en: {} as typeof docsI18nexusUseTranslation_en,
    ko: {} as typeof docsI18nexusUseTranslation_ko,
  },
  "error.tsx": {
    en: {} as typeof errorTsx_en,
    ko: {} as typeof errorTsx_ko,
  },
  "getting-started": {
    en: {} as typeof gettingStarted_en,
    ko: {} as typeof gettingStarted_ko,
  },
  home: {
    en: {} as typeof home_en,
    ko: {} as typeof home_ko,
  },
  provider: {
    en: {} as typeof provider_en,
    ko: {} as typeof provider_ko,
  },
  "server-example": {
    en: {} as typeof serverExample_en,
    ko: {} as typeof serverExample_ko,
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
});
