import { createI18n } from "i18nexus";

import enAdminDashboard from "./admin-dashboard/en.json";
import koAdminDashboard from "./admin-dashboard/ko.json";
import enCli from "./cli/en.json";
import koCli from "./cli/ko.json";
import enCommon from "./common/en.json";
import koCommon from "./common/ko.json";
import enDocsI18nexus from "./docs-i18nexus/en.json";
import koDocsI18nexus from "./docs-i18nexus/ko.json";
import enDocsI18nexusProvider from "./docs-i18nexus-provider/en.json";
import koDocsI18nexusProvider from "./docs-i18nexus-provider/ko.json";
import enDocsI18nexusServerComponents from "./docs-i18nexus-server-components/en.json";
import koDocsI18nexusServerComponents from "./docs-i18nexus-server-components/ko.json";
import enDocsI18nexusTools from "./docs-i18nexus-tools/en.json";
import koDocsI18nexusTools from "./docs-i18nexus-tools/ko.json";
import enDocsI18nexusToolsDownload from "./docs-i18nexus-tools-download/en.json";
import koDocsI18nexusToolsDownload from "./docs-i18nexus-tools-download/ko.json";
import enDocsI18nexusToolsDownloadForce from "./docs-i18nexus-tools-download-force/en.json";
import koDocsI18nexusToolsDownloadForce from "./docs-i18nexus-tools-download-force/ko.json";
import enDocsI18nexusToolsExtractor from "./docs-i18nexus-tools-extractor/en.json";
import koDocsI18nexusToolsExtractor from "./docs-i18nexus-tools-extractor/ko.json";
import enDocsI18nexusToolsGoogleSheets from "./docs-i18nexus-tools-google-sheets/en.json";
import koDocsI18nexusToolsGoogleSheets from "./docs-i18nexus-tools-google-sheets/ko.json";
import enDocsI18nexusToolsUpload from "./docs-i18nexus-tools-upload/en.json";
import koDocsI18nexusToolsUpload from "./docs-i18nexus-tools-upload/ko.json";
import enDocsI18nexusToolsWrapper from "./docs-i18nexus-tools-wrapper/en.json";
import koDocsI18nexusToolsWrapper from "./docs-i18nexus-tools-wrapper/ko.json";
import enDocsI18nexusUseLanguageSwitcher from "./docs-i18nexus-use-language-switcher/en.json";
import koDocsI18nexusUseLanguageSwitcher from "./docs-i18nexus-use-language-switcher/ko.json";
import enDocsI18nexusUseTranslation from "./docs-i18nexus-use-translation/en.json";
import koDocsI18nexusUseTranslation from "./docs-i18nexus-use-translation/ko.json";
import enError from "./error.tsx/en.json";
import koError from "./error.tsx/ko.json";
import enGettingStarted from "./getting-started/en.json";
import koGettingStarted from "./getting-started/ko.json";
import enHome from "./home/en.json";
import koHome from "./home/ko.json";
import enProvider from "./provider/en.json";
import koProvider from "./provider/ko.json";
import enServerExample from "./server-example/en.json";
import koServerExample from "./server-example/ko.json";

// i18nexus는 namespace가 최상위인 구조를 기대합니다
// { namespace: { language: { key: value } } }
export const translations = {
  "admin-dashboard": {
    en: enAdminDashboard,
    ko: koAdminDashboard,
  },
  cli: {
    en: enCli,
    ko: koCli,
  },
  common: {
    en: enCommon,
    ko: koCommon,
  },
  "docs-i18nexus": {
    en: enDocsI18nexus,
    ko: koDocsI18nexus,
  },
  "docs-i18nexus-provider": {
    en: enDocsI18nexusProvider,
    ko: koDocsI18nexusProvider,
  },
  "docs-i18nexus-server-components": {
    en: enDocsI18nexusServerComponents,
    ko: koDocsI18nexusServerComponents,
  },
  "docs-i18nexus-tools": {
    en: enDocsI18nexusTools,
    ko: koDocsI18nexusTools,
  },
  "docs-i18nexus-tools-download": {
    en: enDocsI18nexusToolsDownload,
    ko: koDocsI18nexusToolsDownload,
  },
  "docs-i18nexus-tools-download-force": {
    en: enDocsI18nexusToolsDownloadForce,
    ko: koDocsI18nexusToolsDownloadForce,
  },
  "docs-i18nexus-tools-extractor": {
    en: enDocsI18nexusToolsExtractor,
    ko: koDocsI18nexusToolsExtractor,
  },
  "docs-i18nexus-tools-google-sheets": {
    en: enDocsI18nexusToolsGoogleSheets,
    ko: koDocsI18nexusToolsGoogleSheets,
  },
  "docs-i18nexus-tools-upload": {
    en: enDocsI18nexusToolsUpload,
    ko: koDocsI18nexusToolsUpload,
  },
  "docs-i18nexus-tools-wrapper": {
    en: enDocsI18nexusToolsWrapper,
    ko: koDocsI18nexusToolsWrapper,
  },
  "docs-i18nexus-use-language-switcher": {
    en: enDocsI18nexusUseLanguageSwitcher,
    ko: koDocsI18nexusUseLanguageSwitcher,
  },
  "docs-i18nexus-use-translation": {
    en: enDocsI18nexusUseTranslation,
    ko: koDocsI18nexusUseTranslation,
  },
  "error.tsx": {
    en: enError,
    ko: koError,
  },
  "getting-started": {
    en: enGettingStarted,
    ko: koGettingStarted,
  },
  home: {
    en: enHome,
    ko: koHome,
  },
  provider: {
    en: enProvider,
    ko: koProvider,
  },
  "server-example": {
    en: enServerExample,
    ko: koServerExample,
  },
} as const;

// createI18n으로 i18n 객체 생성
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});
