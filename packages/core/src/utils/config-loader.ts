/**
 * Load i18nexus.config.json configuration file
 * This is a standalone implementation that doesn't depend on i18nexus-tools
 */

import * as fs from "fs";
import * as pathLib from "path";

export interface I18nexusConfig {
  /**
   * Supported languages
   */
  languages?: string[];

  /**
   * Default language code
   */
  defaultLanguage?: string;

  /**
   * Directory for translation files
   */
  localesDir?: string;

  /**
   * Source pattern for file matching
   */
  sourcePattern?: string;

  /**
   * Translation import source
   */
  translationImportSource?: string;

  /**
   * Fallback namespace setting
   * Used as default namespace when no namespace is specified in createI18n
   * @example "common"
   */
  fallbackNamespace?: string;

  /**
   * Enable fallback behavior
   * @default true
   */
  enableFallback?: boolean;
}

/**
 * Load i18nexus.config.json configuration file
 *
 * @param configPath - Path to config file (default: "i18nexus.config.json")
 * @param options - Options for loading config
 * @returns Configuration object or null if not found
 *
 * @example
 * ```typescript
 * const config = loadI18nexusConfig();
 * if (config?.fallbackNamespace) {
 *   const i18n = createI18n(translations, {
 *     fallbackNamespace: config.fallbackNamespace
 *   });
 * }
 * ```
 */
export function loadI18nexusConfig(
  configPath: string = "i18nexus.config.json",
  options?: { silent?: boolean },
): I18nexusConfig | null {
  try {
    // Try to resolve from current working directory
    const absolutePath = pathLib.resolve(process.cwd(), configPath);

    if (!fs.existsSync(absolutePath)) {
      if (!options?.silent) {
        console.log(
          `⚠️  ${configPath} not found, fallback namespace will not be auto-applied`,
        );
      }
      return null;
    }

    // Read and parse JSON file
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const config = JSON.parse(fileContent) as I18nexusConfig;

    return {
      fallbackNamespace: config.fallbackNamespace,
      enableFallback: config.enableFallback ?? true,
      languages: config.languages,
      defaultLanguage: config.defaultLanguage,
      localesDir: config.localesDir,
      sourcePattern: config.sourcePattern,
      translationImportSource: config.translationImportSource,
    };
  } catch (error) {
    if (!options?.silent) {
      console.warn(
        `⚠️  Failed to load ${configPath}:`,
        error instanceof Error ? error.message : error,
      );
    }
    return null;
  }
}

/**
 * Load i18nexus.config.json configuration file silently (no console output)
 *
 * @param configPath - Path to config file (default: "i18nexus.config.json")
 * @returns Configuration object or null if not found
 */
export function loadI18nexusConfigSilently(
  configPath: string = "i18nexus.config.json",
): I18nexusConfig | null {
  return loadI18nexusConfig(configPath, { silent: true });
}
