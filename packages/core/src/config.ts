/**
 * Configuration utilities for i18nexus
 *
 * This module provides utilities to load configuration from i18nexus.config.json
 * and create i18n instances with automatic configuration.
 *
 * @example
 * ```typescript
 * import { createI18nWithConfig } from 'i18nexus/config';
 * import { translations } from './locales';
 *
 * // Automatically reads fallbackNamespace from i18nexus.config.json
 * const i18n = createI18nWithConfig(translations);
 * ```
 */

export {
  createI18nWithConfig,
  createI18nWithConfigSync,
} from "./utils/createI18nWithConfig";
export {
  loadI18nexusConfig,
  loadI18nexusConfigSilently,
} from "./utils/config-loader";
export type { I18nexusConfig } from "./utils/config-loader";
