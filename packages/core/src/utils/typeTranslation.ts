import React from "react";

/** 타입 안전한 번역 유틸리티 (컴파일 타임 키 검증) */

/** 번역 객체에서 모든 키 추출 */
export type ExtractTranslationKeys<
  T extends Record<string, Record<string, string>>,
> = keyof T[keyof T] & string;

/** 단일 언어 딕셔너리에서 유효한 키 추출 */
export type ExtractLanguageKeys<T extends Record<string, string>> = keyof T &
  string;

/** 타입 안전한 번역 함수 생성 (컴파일 타임 키 검증) */
export function createTypedTranslation<T extends Record<string, string>>(
  translations: T,
) {
  return <K extends ExtractLanguageKeys<T>>(
    key: K,
    variables?: Record<string, string | number>,
  ): string => {
    const text = translations[key as keyof T] || key;

    if (!variables) {
      return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      return value !== undefined ? String(value) : match;
    });
  };
}

/** 타입 안전한 다국어 번역 함수 생성 */
export function createMultiLangTypedTranslation<
  T extends Record<string, Record<string, string>>,
>(translationDict: T) {
  return <L extends keyof T>(language: L) => {
    const langTranslations = translationDict[language];
    return createTypedTranslation(langTranslations);
  };
}

/** 변수 보간 및 스타일 지원 타입 안전 번역 함수 */
export function createTypedTranslationWithStyles<
  T extends Record<string, string>,
>(translations: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const translateWithStyles = <K extends ExtractLanguageKeys<T>>(
    key: K,
    variables?: Record<string, string | number>,
    styles?: Record<string, React.CSSProperties>,
  ): string | React.ReactElement => {
    const text = translations[key as keyof T] || key;

    if (!variables) {
      return text;
    }

    if (styles) {
      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0;
      const regex = /\{\{(\w+)\}\}/g;
      let match;
      let elemKey = 0;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        const variableName = match[1];
        const value = variables[variableName];
        const style = styles[variableName];

        if (value !== undefined) {
          if (style) {
            parts.push(
              React.createElement(
                "span",
                { key: `var-${elemKey++}`, style },
                String(value),
              ),
            );
          } else {
            parts.push(String(value));
          }
        } else {
          parts.push(match[0]);
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return React.createElement(React.Fragment, null, ...parts);
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      return value !== undefined ? String(value) : match;
    });
  };

  return translateWithStyles;
}

/** 모든 언어의 번역 키 일치 여부 검증 (테스트용) */
export function validateTranslationKeys(
  translations: Record<string, Record<string, string>>,
): void {
  const languages = Object.keys(translations);

  if (languages.length === 0) {
    throw new Error("No languages found in translations");
  }

  const firstLang = languages[0];
  const baseKeys = new Set(Object.keys(translations[firstLang]));

  for (const lang of languages.slice(1)) {
    const currentKeys = new Set(Object.keys(translations[lang]));

    for (const key of baseKeys) {
      if (!currentKeys.has(key)) {
        throw new Error(
          `Missing key "${key}" in language "${lang}". ` +
            `Found in "${firstLang}" but not in "${lang}".`,
        );
      }
    }

    for (const key of currentKeys) {
      if (!baseKeys.has(key)) {
        throw new Error(
          `Extra key "${key}" in language "${lang}". ` +
            `Found in "${lang}" but not in "${firstLang}".`,
        );
      }
    }
  }
}

/** 자동완성 지원 번역 키 목록 반환 */
export function getTranslationKeyList<T extends Record<string, string>>(
  translations: T,
): Array<ExtractLanguageKeys<T>> {
  return Object.keys(translations) as Array<ExtractLanguageKeys<T>>;
}
