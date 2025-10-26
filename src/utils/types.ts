/**
 * Type utilities for i18nexus
 */

/**
 * Minimal I18nexus config type used by the library's helpers.
 * Keep this minimal to avoid coupling to external loader implementations.
 */
export interface I18nexusConfig<
  TLanguages extends readonly string[] = readonly string[],
> {
  languages: TLanguages;
  defaultLanguage: TLanguages[number];
  localesDir?: string;
  sourcePattern?: string;
  translationImportSource?: string;
}

/**
 * Extract language union type from config
 * @example
 * ```typescript
 * // i18nexus.config.ts
 * export const config = {
 *   languages: ["en", "ko", "ja"] as const,
 *   defaultLanguage: "en",
 *   // ... other config
 * } as const;
 *
 * // In your app
 * import { config } from "./i18nexus.config";
 * import type { ExtractLanguages } from "i18nexus";
 *
 * type AppLanguages = ExtractLanguages<typeof config>; // "en" | "ko" | "ja"
 * ```
 */
export type ExtractLanguages<T extends I18nexusConfig<readonly string[]>> =
  T["languages"][number];

/**
 * Helper to create a strictly typed i18nexus config
 * @example
 * ```typescript
 * import { defineConfig } from "i18nexus";
 *
 * export const config = defineConfig({
 *   languages: ["en", "ko", "ja"] as const,
 *   defaultLanguage: "en",
 *   localesDir: "./locales",
 *   sourcePattern: "src/**\/*.{ts,tsx}",
 *   translationImportSource: "i18nexus",
 * });
 *
 * export type AppLanguages = ExtractLanguages<typeof config>;
 * ```
 */
export function defineConfig<TLanguages extends readonly string[]>(
  config: I18nexusConfig<TLanguages>,
): I18nexusConfig<TLanguages> {
  return config;
}
