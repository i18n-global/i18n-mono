import { createI18n } from "i18nexus";

// Lazy loading용 타입 정의
// 실제 translations는 사용 시 동적으로 로드됨
export const translations = {} as const;

// 동적 namespace 로더
async function loadNamespace(namespace: string, lang: string) {
  const module = await import(`./${namespace}/${lang}.json`);
  return module.default;
}

// createI18n with lazy loading
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  lazy: true,
  loadNamespace,
  preloadNamespaces: ["common"], // fallback은 미리 로드
});

// 타입 안전성을 위한 namespace 목록
export type AvailableNamespaces = "admin-dashboard" | "cli" | "common" | "docs-i18nexus" | "docs-i18nexus-provider" | "docs-i18nexus-server-components" | "docs-i18nexus-tools" | "docs-i18nexus-tools-download" | "docs-i18nexus-tools-download-force" | "docs-i18nexus-tools-extractor" | "docs-i18nexus-tools-google-sheets" | "docs-i18nexus-tools-upload" | "docs-i18nexus-tools-wrapper" | "docs-i18nexus-use-language-switcher" | "docs-i18nexus-use-translation" | "getting-started" | "home" | "provider" | "server-example" | "showcase";

// 사용 가능한 언어
export type AvailableLanguages = "en" | "ko";

/**
 * Namespace를 미리 로드하는 헬퍼 함수
 * 성능 최적화를 위해 필요한 namespace만 로드
 * 
 * @example
 * await preloadNamespace("home");
 * const { t } = i18n.useTranslation("home");
 */
export async function preloadNamespace(namespace: AvailableNamespaces) {
  await i18n.loadNamespace(namespace);
}
