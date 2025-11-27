/**
 * Create i18n instance with automatic configuration from i18nexus.config.json
 *
 * This utility automatically reads fallback namespace from i18nexus.config.json
 * and applies it to createI18n, making it easier to use fallback namespace
 * without manually specifying it.
 *
 * @example
 * ```typescript
 * import { createI18nWithConfig } from 'i18nexus/config';
 * import { translations } from './locales';
 *
 * // Automatically reads fallbackNamespace from i18nexus.config.json
 * const i18n = createI18nWithConfig(translations);
 *
 * // Now you can use without namespace
 * const { t } = i18n.useTranslation();
 * t("welcome"); // ✅ Works if fallbackNamespace is set in config
 * ```
 */

import { createI18n, CreateI18nOptions } from "./createI18n";
import type { NamespaceTranslations } from "../components/I18nProvider";
import {
  loadI18nexusConfig,
  loadI18nexusConfigSilently,
} from "./config-loader";

/**
 * Create i18n instance with automatic configuration from i18nexus.config.json
 *
 * @param translations - Your translation object with namespaces
 * @param options - Optional configuration (overrides config file)
 * @param configPath - Path to i18nexus.config.json (default: "i18nexus.config.json")
 * @returns Fully typed Provider and hooks
 *
 * @example
 * ```typescript
 * import { createI18nWithConfig } from 'i18nexus/config';
 * import { translations } from './locales';
 *
 * // Automatically reads fallbackNamespace from i18nexus.config.json
 * const i18n = createI18nWithConfig(translations);
 *
 * // With override
 * const i18n = createI18nWithConfig(translations, {
 *   fallbackNamespace: "custom" // Overrides config file
 * });
 * ```
 */
export function createI18nWithConfig<
  TTranslations extends NamespaceTranslations,
>(
  translations: TTranslations,
  options?: CreateI18nOptions<TTranslations>,
  configPath: string = "i18nexus.config.json",
) {
  // Load config from i18nexus.config.json (silently)
  const config = loadI18nexusConfigSilently(configPath);

  // Merge config file settings with provided options
  // Options take precedence over config file
  const mergedOptions: CreateI18nOptions<TTranslations> = {
    fallbackNamespace:
      (options?.fallbackNamespace ?? (config?.fallbackNamespace as any)) ||
      undefined,
    enableFallback: options?.enableFallback ?? config?.enableFallback ?? true,
  };

  return createI18n(translations, mergedOptions);
}

/**
 * Create i18n instance with automatic configuration (synchronous)
 * For client-side usage where config is already loaded
 *
 * @param translations - Your translation object with namespaces
 * @param config - Pre-loaded configuration object
 * @param options - Optional configuration (overrides config)
 * @returns Fully typed Provider and hooks
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
      (options?.fallbackNamespace ?? (config?.fallbackNamespace as any)) ||
      undefined,
    enableFallback: options?.enableFallback ?? config?.enableFallback ?? true,
  };

  return createI18n(translations, mergedOptions);
}

// Re-export for convenience
export {
  loadI18nexusConfig,
  loadI18nexusConfigSilently,
} from "./config-loader";
export type { I18nexusConfig } from "./config-loader";
