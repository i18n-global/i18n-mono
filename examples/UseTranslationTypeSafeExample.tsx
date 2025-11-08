/**
 * Type-Safe useTranslation Hook Example
 *
 * This example demonstrates the new type-safe useTranslation hook
 * where you can specify valid translation keys as a generic parameter.
 *
 * KEY FEATURE: If a key is not in the translations, TypeScript will error!
 */

import React from "react";
import { useTranslation, I18nProvider } from "i18nexus";

// Define your translations with as const for type safety
const translations = {
  en: {
    welcome: "Welcome",
    greeting: "Hello {{name}}",
    farewell: "Goodbye {{name}}",
    count: "Count: {{count}}",
  },
  ko: {
    welcome: "환영합니다",
    greeting: "안녕하세요 {{name}}",
    farewell: "안녕히 가세요 {{name}}",
    count: "개수: {{count}}",
  },
} as const;

// Extract type of valid keys for reuse
type TranslationKey = keyof typeof translations.en;

// ============================================================================
// Example 1: useTranslation WITH type safety
// ============================================================================

function Example1TypeSafe() {
  // ✅ Specifying valid keys as generic parameter
  // Now only "welcome", "greeting", "farewell", "count" are allowed!
  const { t, currentLanguage } = useTranslation<TranslationKey>();

  return (
    <div>
      <h2>Example 1: Type-Safe useTranslation</h2>
      <p>Current Language: {currentLanguage}</p>

      {/* ✅ These compile successfully */}
      <p>{t("welcome")}</p>
      <p>{t("greeting", { name: "Alice" })}</p>
      <p>{t("farewell", { name: "Bob" })}</p>
      <p>{t("count", { count: 42 })}</p>

      {/* ❌ These cause TypeScript compile errors:
          Try uncommenting to see the error!
          
          <p>{t("123")}</p>
          // Error: '"123"' is not assignable to type '"welcome" | "greeting" | "farewell" | "count"'
          
          <p>{t("invalid")}</p>
          // Error: '"invalid"' is not assignable to type ...
          
          <p>{t("greting")}</p>
          // Error: '"greting"' (typo!) is not assignable to type ...
      */}
    </div>
  );
}

// ============================================================================
// Example 2: useTranslation WITHOUT type safety (backward compatible)
// ============================================================================

function Example2NoTypeSafety() {
  // Without specifying a generic parameter, any string is allowed
  // This is backward compatible with old code
  const { t } = useTranslation();

  return (
    <div>
      <h2>Example 2: useTranslation (No Type Constraint)</h2>

      {/* ✅ These compile (no type checking) */}
      <p>{t("welcome")}</p>
      <p>{t("123")}</p>
      <p>{t("any_random_key")}</p>

      {/* No compile errors, but might fail at runtime if key doesn't exist */}
    </div>
  );
}

// ============================================================================
// Example 3: Detailed comparison
// ============================================================================

function Example3Comparison() {
  return (
    <div>
      <h2>Example 3: Type-Safe vs Unsafe Comparison</h2>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "10px" }}>Code</th>
            <th style={{ textAlign: "left", padding: "10px" }}>
              tSafe (Type-Safe)
            </th>
            <th style={{ textAlign: "left", padding: "10px" }}>
              tUnsafe (No Type)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>t(&quot;welcome&quot;)</td>
            <td style={{ padding: "10px" }}>✅ Compiles</td>
            <td style={{ padding: "10px" }}>✅ Compiles</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>t(&quot;123&quot;)</td>
            <td style={{ padding: "10px" }}>❌ Compile Error</td>
            <td style={{ padding: "10px" }}>✅ Compiles</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px" }}>t(&quot;invalid&quot;)</td>
            <td style={{ padding: "10px" }}>❌ Compile Error</td>
            <td style={{ padding: "10px" }}>✅ Compiles</td>
          </tr>
          <tr>
            <td style={{ padding: "10px" }}>t(&quot;greting&quot;) (typo)</td>
            <td style={{ padding: "10px" }}>❌ Compile Error</td>
            <td style={{ padding: "10px" }}>✅ Compiles</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Example 4: Real-world usage in a component
// ============================================================================

interface UserProfileProps {
  name: string;
  messageCount: number;
}

function UserProfile({ name, messageCount }: UserProfileProps) {
  // Type-safe t function - only accepts valid keys
  const { t, currentLanguage } = useTranslation<TranslationKey>();

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px" }}>
      <h3>{t("greeting", { name })}</h3>
      <p>{t("count", { count: messageCount })}</p>
      <p>Language: {currentLanguage}</p>

      {/* This would error at compile time:
          <p>{t("unknown_key")}</p>  // ❌ Error
      */}
    </div>
  );
}

// ============================================================================
// Example 5: With I18nProvider
// ============================================================================

export function AppWithTypeScafeTranslation() {
  return (
    <I18nProvider
      languageManagerOptions={{
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
        ],
        defaultLanguage: "en",
      }}
      translations={translations}>
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1>Type-Safe useTranslation Examples</h1>

        <section style={{ marginBottom: "40px" }}>
          <Example1TypeSafe />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <Example2NoTypeSafety />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <Example3Comparison />
        </section>

        <section style={{ marginBottom: "40px" }}>
          <h2>Example 4: Real-World Usage</h2>
          <UserProfile name="Alice" messageCount={5} />
          <UserProfile name="Bob" messageCount={10} />
        </section>
      </div>
    </I18nProvider>
  );
}

export default AppWithTypeScafeTranslation;
