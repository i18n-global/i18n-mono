import { createI18n } from "i18nexus";

// 타입 안전성을 위한 namespace 목록
export type AvailableNamespaces =
  | "admin-dashboard"
  | "cli"
  | "common"
  | "docs-i18nexus"
  | "docs-i18nexus-provider"
  | "docs-i18nexus-server-components"
  | "docs-i18nexus-tools"
  | "docs-i18nexus-tools-download"
  | "docs-i18nexus-tools-download-force"
  | "docs-i18nexus-tools-extractor"
  | "docs-i18nexus-tools-google-sheets"
  | "docs-i18nexus-tools-upload"
  | "docs-i18nexus-tools-wrapper"
  | "docs-i18nexus-use-language-switcher"
  | "docs-i18nexus-use-translation"
  | "getting-started"
  | "home"
  | "provider"
  | "server-example"
  | "showcase";

// 사용 가능한 언어
export type AvailableLanguages = "en" | "ko";

// Lazy loading용 타입 정의 - 실제 타입 구조를 명시
type TranslationStructure = Record<
  AvailableNamespaces,
  Record<AvailableLanguages, Record<string, string>>
>;

// Lazy loading용 빈 translations (타입만 제공)
export const translations = {} as TranslationStructure;

// 동적 namespace 로더
async function loadNamespace(namespace: string, lang: string) {
  const module = await import(`./${namespace}/${lang}.json`);
  return module.default;
}

// createI18n with lazy loading and language manager
export const i18n = createI18n(translations, {
  fallbackNamespace: "common" as AvailableNamespaces,
  lazy: true,
  loadNamespace,
  preloadNamespaces: ["common" as AvailableNamespaces], // fallback은 미리 로드
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

/**
 * Namespace를 미리 로드하는 헬퍼 함수
 * 성능 최적화를 위해 필요한 namespace만 로드
 *
 * @example
 * await preloadNamespace("home");
 * const { t } = i18n.useTranslation("home");
 */
export async function preloadNamespace(namespace: AvailableNamespaces) {
  await i18n.loadNamespace(namespace as any);
}
