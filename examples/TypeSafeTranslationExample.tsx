/**
 * Type-Safe Translation Example
 * 
 * This example demonstrates how to use the type-safe translation utilities
 * to catch missing or mismatched translation keys at compile time.
 */

import React from "react";
import {
  I18nProvider,
  useTranslation,
  createTypedTranslation,
  createMultiLangTypedTranslation,
  validateTranslationKeys,
  getTranslationKeyList,
} from "i18nexus";

// ============================================================================
// Example 1: Define type-safe translations with const assertion
// ============================================================================

const translations = {
  en: {
    welcome: "Welcome to i18nexus",
    greeting: "Hello {{name}}",
    farewell: "Goodbye {{name}}, see you next time!",
    count: "You have {{count}} messages",
  },
  ko: {
    welcome: "i18nexus에 오신 것을 환영합니다",
    greeting: "안녕하세요 {{name}}님",
    farewell: "안녕히 가세요 {{name}}, 다음에 뵙겠습니다!",
    count: "{{count}}개의 메시지가 있습니다",
  },
  ja: {
    welcome: "i18nexusへようこそ",
    greeting: "こんにちは {{name}}さん",
    farewell: "さようなら {{name}}さん、また今度ね！",
    count: "{{count}}件のメッセージがあります",
  },
} as const;

// ============================================================================
// Example 2: Runtime validation - catch mismatches between languages
// ============================================================================

// This will throw if keys don't match across languages
try {
  validateTranslationKeys(translations);
  console.log("✅ All translation keys match across all languages!");
} catch (error) {
  console.error("❌ Translation key mismatch:", error);
}

// ============================================================================
// Example 3: Component with I18nProvider
// ============================================================================

function ExampleApp() {
  return (
    <I18nProvider
      languageManagerOptions={{
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
          { code: "ja", name: "日本語" },
        ],
        defaultLanguage: "en",
      }}
      translations={translations}
    >
      <TypeSafeExample />
      <IndividualTranslatorExample />
    </I18nProvider>
  );
}

// ============================================================================
// Example 4: Using type-safe translation within I18nProvider
// ============================================================================

function TypeSafeExample() {
  const { t, currentLanguage } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>

      {/* ✅ These will work - valid keys */}
      <p>{t("greeting", { name: "Alice" })}</p>
      <p>{t("farewell", { name: "Bob" })}</p>
      <p>{t("count", { count: 5 })}</p>

      {/* ❌ These will cause TypeScript compile errors - invalid keys */}
      {/* 
      <p>{t("invalid_key")}</p>  
      <p>{t("nonexistent")}</p>  
      */}

      <p>Current language: {currentLanguage}</p>
    </div>
  );
}

// ============================================================================
// Example 5: Creating individual typed translators (without I18nProvider)
// ============================================================================

function IndividualTranslatorExample() {
  // Create a type-safe translator for English
  const tEn = createTypedTranslation(translations.en);

  // Create a type-safe translator for Korean
  const tKo = createTypedTranslation(translations.ko);

  return (
    <div>
      <h2>Individual Translators</h2>

      {/* ✅ Valid keys work */}
      <p>English: {tEn("greeting", { name: "Charlie" })}</p>
      <p>Korean: {tKo("greeting", { name: "철수" })}</p>

      {/* ❌ Invalid keys cause compile errors */}
      {/* 
      <p>{tEn("invalid")}</p>  
      */}
    </div>
  );
}

// ============================================================================
// Example 6: Multi-language typed translator factory
// ============================================================================

function MultiLangExample() {
  // Create a factory that returns typed translators for any language
  const getT = createMultiLangTypedTranslation(translations);

  // Get translators for specific languages
  const tEn = getT("en");
  const tKo = getT("ko");

  return (
    <div>
      <h2>Multi-Language Factory</h2>

      {/* ✅ Type-safe across all languages */}
      <p>{tEn("welcome")}</p>
      <p>{tKo("welcome")}</p>

      {/* ✅ With variables */}
      <p>{tEn("greeting", { name: "User" })}</p>
      <p>{tKo("greeting", { name: "사용자" })}</p>
    </div>
  );
}

// ============================================================================
// Example 7: With styled variables (advanced)
// ============================================================================

function StyledTranslationExample() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>Styled Variables</h2>

      {/* With styles - returns React.ReactElement */}
      {t(
        "greeting",
        { name: "Alice" },
        {
          name: {
            color: "red",
            fontWeight: "bold",
            fontSize: "18px",
          },
        },
      )}

      {/* Without styles - returns string */}
      <p>{t("greeting", { name: "Bob" })}</p>
    </div>
  );
}

// ============================================================================
// Example 8: Type-safe key list for dynamic lookups
// ============================================================================

function DynamicKeyExample() {
  const validKeys = getTranslationKeyList(translations.en);

  return (
    <div>
      <h2>Valid Translation Keys</h2>
      <ul>
        {validKeys.map((key: string) => (
          <li key={key}>{key}</li>
        ))}
      </ul>

      {/* Safe dynamic lookup */}
      <p>First key value: {translations.en[validKeys[0] as keyof typeof translations.en]}</p>
    </div>
  );
}

export {
  ExampleApp,
  TypeSafeExample,
  IndividualTranslatorExample,
  MultiLangExample,
  StyledTranslationExample,
  DynamicKeyExample,
};
