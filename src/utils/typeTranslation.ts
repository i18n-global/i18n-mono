import React from "react";

/**
 * Type-safe translation utilities with compile-time key validation
 *
 * @example
 * ```typescript
 * // 1. Define translations with const assertion
 * const translations = {
 *   en: {
 *     welcome: "Welcome",
 *     greeting: "Hello {{name}}",
 *   },
 *   ko: {
 *     welcome: "환영합니다",
 *     greeting: "안녕하세요 {{name}}",
 *   },
 * } as const;
 *
 * // 2. Extract type for valid keys
 * type AppTranslationKeys = ExtractTranslationKeys<typeof translations>;
 * // Result: "welcome" | "greeting"
 *
 * // 3. Create typed translation function
 * const t = createTypedTranslation(translations["en"]);
 *
 * // 4. Use with full type safety
 * t("welcome");           // ✅ OK
 * t("greeting", { name: "John" }); // ✅ OK
 * t("invalid");           // ❌ Compile error: '"invalid"' is not assignable
 * ```
 */

/**
 * Extract all translation keys from a translation object
 * Works with any language's translation dict
 *
 * @example
 * ```typescript
 * type Keys = ExtractTranslationKeys<typeof translations>;
 * // "welcome" | "greeting" | ...
 * ```
 */
export type ExtractTranslationKeys<
  T extends Record<string, Record<string, string>>,
> = keyof T[keyof T] & string;

/**
 * Extract valid keys from a single language dictionary
 *
 * @example
 * ```typescript
 * const en = { welcome: "Welcome", greeting: "Hello" };
 * type Keys = ExtractLanguageKeys<typeof en>;
 * // "welcome" | "greeting"
 * ```
 */
export type ExtractLanguageKeys<T extends Record<string, string>> = keyof T &
  string;

/**
 * Create a type-safe translation function that validates keys at compile time
 *
 * @param translations - Translation dictionary for a specific language
 * @returns Type-safe translation function
 *
 * @example
 * ```typescript
 * const en = { greeting: "Hello {{name}}" };
 * const t = createTypedTranslation(en);
 *
 * t("greeting", { name: "World" }); // ✅ OK - key is valid
 * t("invalid");                      // ❌ Error - key not in type
 * ```
 */
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

/**
 * Create a type-safe multi-language translation function
 *
 * @param translationDict - Dictionary with language codes as keys
 * @returns Function that returns type-safe t() for a specific language
 *
 * @example
 * ```typescript
 * const translations = {
 *   en: { greeting: "Hello {{name}}" },
 *   ko: { greeting: "안녕하세요 {{name}}" },
 * } as const;
 *
 * const getTypedT = createMultiLangTypedTranslation(translations);
 *
 * // Get typed translator for English
 * const tEn = getTypedT("en");
 * tEn("greeting", { name: "World" }); // ✅ OK
 * tEn("invalid");                      // ❌ Error
 *
 * // Get typed translator for Korean
 * const tKo = getTypedT("ko");
 * tKo("greeting", { name: "철수" });   // ✅ OK
 * ```
 */
export function createMultiLangTypedTranslation<
  T extends Record<string, Record<string, string>>,
>(translationDict: T) {
  return <L extends keyof T>(language: L) => {
    const langTranslations = translationDict[language];
    return createTypedTranslation(langTranslations);
  };
}

/**
 * Type-safe translation function with variable interpolation and styles
 *
 * @example
 * ```typescript
 * const en = { count: "Count: {{count}}" };
 * const t = createTypedTranslationWithStyles(en);
 *
 * const result = t("count", { count: 5 }, { count: { color: "red" } });
 * // Returns: <>Count: <span style={{color: "red"}}>5</span></>
 * ```
 */
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

    // If styles provided, return JSX with styled spans
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

    // Without styles, return plain string with interpolation
    return text.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
      const value = variables[variableName];
      return value !== undefined ? String(value) : match;
    });
  };

  return translateWithStyles;
}

/**
 * Validate that all translation keys match across all languages
 * Use this to catch mismatches at runtime (e.g., in tests)
 *
 * @example
 * ```typescript
 * const translations = {
 *   en: { greeting: "Hello", farewell: "Goodbye" },
 *   ko: { greeting: "안녕", farewell: "안녕히" },
 * };
 *
 * validateTranslationKeys(translations); // ✅ All keys match
 *
 * const broken = {
 *   en: { greeting: "Hello" },
 *   ko: { greeting: "안녕", extra: "추가" }, // Missing in en
 * };
 * validateTranslationKeys(broken); // ❌ Throws error
 * ```
 */
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

    // Check for missing keys
    for (const key of baseKeys) {
      if (!currentKeys.has(key)) {
        throw new Error(
          `Missing key "${key}" in language "${lang}". ` +
            `Found in "${firstLang}" but not in "${lang}".`,
        );
      }
    }

    // Check for extra keys
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

/**
 * Get all possible translation keys with autocomplete support
 *
 * @example
 * ```typescript
 * const en = { greeting: "Hello", farewell: "Goodbye" };
 * const keys = getTranslationKeyList(en);
 * // ["greeting", "farewell"]
 *
 * // Use for runtime key validation
 * if (keys.includes(userKey)) {
 *   t(userKey as any); // Safe after validation
 * }
 * ```
 */
export function getTranslationKeyList<T extends Record<string, string>>(
  translations: T,
): Array<ExtractLanguageKeys<T>> {
  return Object.keys(translations) as Array<ExtractLanguageKeys<T>>;
}
