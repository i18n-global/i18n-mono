/**
 * Dynamic translation wrapper utility
 *
 * Solves the problem of using dynamic variable names in translations
 *
 * Problem:
 * ```typescript
 * t("{{championshipTypes[championshipType]}}은 {{matchCount[championshipType]}}개 팀 필요", {
 *   championshipTypes[championshipType]: championshipTypes[championshipType],  // ❌ Invalid syntax
 * })
 * ```
 *
 * Solution:
 * ```typescript
 * const msg = createDynamicTranslation(
 *   t("{{type}}은 {{count}}개 팀 필요"),
 *   { type: championshipTypes[championshipType], count: matchCounts[championshipType] }
 * );
 * ```
 */

import type { TranslationVariables } from "../hooks/useTranslation";

type DynamicVariables = Record<string, unknown>;

/**
 * Create a dynamic translation by wrapping variable substitution
 * Useful for when you need to compute variables from arrays or objects
 *
 * @param translatedText - The already translated text with {{variable}} placeholders
 * @param variables - Object with computed variable values
 * @returns Substituted text
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 *
 * const championshipTypes = ["League", "Cup", "Group"];
 * const matchCounts = [0, 8, 4];
 *
 * // ✅ Compute first, then pass to t()
 * const type = championshipTypes[championshipType];
 * const count = matchCounts[championshipType];
 *
 * const message = t("{{type}}은 정확히 {{count}}개 팀 필요", {
 *   type,
 *   count: String(count),
 * });
 * ```
 */
export function createDynamicTranslation(
  translatedText: string,
  variables: DynamicVariables,
): string {
  if (!translatedText || !variables) {
    return translatedText;
  }

  return translatedText.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
    const value = variables[variableName];
    return value !== undefined && value !== null ? String(value) : match;
  });
}

/**
 * Alternative: Build translation parameters dynamically
 * Useful when you need to map arrays/objects to translation parameters
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 *
 * const championshipData = {
 *   league: { type: "League", count: 0 },
 *   cup: { type: "Cup", count: 8 },
 *   group: { type: "Group", count: 4 },
 * };
 *
 * // Build params from data
 * const params = buildTranslationParams(championshipData[championshipType]);
 *
 * const message = t("{{type}}은 정확히 {{count}}개 팀 필요", params);
 * ```
 */
export function buildTranslationParams(
  data: Record<string, unknown>,
): TranslationVariables {
  const params: TranslationVariables = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      params[key] = typeof value === "string" ? value : String(value);
    }
  }

  return params;
}

/**
 * Conditional translation builder
 * Choose translation based on condition and provide parameters
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 *
 * const message = buildConditionalTranslation(
 *   championshipType === "league",
 *   {
 *     true: ["leagueDescription", {}],
 *     false: ["cupDescription", { count: String(teamCount) }],
 *   }
 * );
 * ```
 */
export function buildConditionalTranslation(
  condition: boolean,
  options: {
    true: [key: string, params?: TranslationVariables];
    false: [key: string, params?: TranslationVariables];
  },
): [key: string, params?: TranslationVariables] {
  return condition ? options.true : options.false;
}

/**
 * Map array values to translation parameters by key
 * Useful for batch variable substitution
 *
 * @example
 * ```typescript
 * const { t } = useTranslation();
 *
 * const values = ["League", 0, true];
 * const keyMap = ["type", "count", "isRestricted"];
 *
 * const params = mapToTranslationParams(values, keyMap);
 * // Result: { type: "League", count: "0", isRestricted: "true" }
 *
 * const message = t("{{type}} - Count: {{count}}", params);
 * ```
 */
export function mapToTranslationParams(
  values: unknown[],
  keys: string[],
): TranslationVariables {
  const params: TranslationVariables = {};

  for (let i = 0; i < Math.min(values.length, keys.length); i++) {
    const value = values[i];
    if (value !== null && value !== undefined) {
      params[keys[i]] = typeof value === "string" ? value : String(value);
    }
  }

  return params;
}
