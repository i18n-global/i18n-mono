/** 동적 변수명을 사용한 번역 래퍼 유틸리티 */

import type { TranslationVariables } from "../hooks/useTranslation";

type DynamicVariables = Record<string, unknown>;

/** 동적 번역 생성 (배열/객체에서 계산된 변수 사용) */
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

/** 번역 파라미터 동적 생성 (배열/객체 매핑) */
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

/** 조건부 번역 빌더 */
export function buildConditionalTranslation(
  condition: boolean,
  options: {
    true: [key: string, params?: TranslationVariables];
    false: [key: string, params?: TranslationVariables];
  },
): [key: string, params?: TranslationVariables] {
  return condition ? options.true : options.false;
}

/** 배열 값을 키로 매핑하여 번역 파라미터 생성 */
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
