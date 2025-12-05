/**
 * i18nexus.config.json에서 설정을 자동으로 읽어 i18n 인스턴스 생성
 */
import { createI18n, CreateI18nOptions } from "./createI18n";
import type { NamespaceTranslations } from "../components/I18nProvider";
import { loadI18nexusConfigSilently } from "./config-loader";

/**
 * i18nexus.config.json에서 fallbackNamespace를 자동으로 읽어 적용
 * @param translations - 번역 객체
 * @param options - 옵션 (config 파일보다 우선)
 * @param configPath - 설정 파일 경로 (기본: "i18nexus.config.json")
 */
export function createI18nWithConfig<
  TTranslations extends NamespaceTranslations,
>(
  translations: TTranslations,
  options?: CreateI18nOptions<TTranslations>,
  configPath: string = "i18nexus.config.json",
) {
  const config = loadI18nexusConfigSilently(configPath);

  // 옵션이 config 파일보다 우선
  const mergedOptions: CreateI18nOptions<TTranslations> = {
    fallbackNamespace:
      (options?.fallbackNamespace ??
        (config?.fallbackNamespace as keyof TTranslations | undefined)) ||
      undefined,
    enableFallback: options?.enableFallback ?? config?.enableFallback ?? true,
  };

  return createI18n(translations, mergedOptions);
}

/**
 * 동기 방식으로 i18n 인스턴스 생성 (이미 로드된 config 사용)
 */
export function createI18nWithConfigSync<
  TTranslations extends NamespaceTranslations,
>(
  translations: TTranslations,
  config?: { fallbackNamespace?: string; enableFallback?: boolean } | null,
  options?: CreateI18nOptions<TTranslations>,
) {
  const mergedOptions: CreateI18nOptions<TTranslations> = {
    fallbackNamespace:
      (options?.fallbackNamespace ??
        (config?.fallbackNamespace as keyof TTranslations | undefined)) ||
      undefined,
    enableFallback: options?.enableFallback ?? config?.enableFallback ?? true,
  };

  return createI18n(translations, mergedOptions);
}

export { loadI18nexusConfigSilently } from "./config-loader";
export type { I18nexusConfig } from "./config-loader";
