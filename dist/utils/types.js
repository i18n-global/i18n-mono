/**
 * Type utilities for i18nexus
 */
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
export function defineConfig(config) {
    return config;
}
//# sourceMappingURL=types.js.map