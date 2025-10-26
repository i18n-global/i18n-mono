import React from "react";
import { I18nProvider, I18NexusDevtools, useTranslation } from "i18nexus";

// Example translations
const translations = {
  en: {
    welcome: "Welcome to i18nexus",
    description: "This is a demo of the devtools",
    counter: "Count: {{count}}",
    styled: "This is {{word}} text",
  },
  ko: {
    welcome: "i18nexus에 오신 것을 환영합니다",
    description: "이것은 개발자 도구 데모입니다",
    counter: "카운트: {{count}}",
    styled: "이것은 {{word}} 텍스트입니다",
  },
  ja: {
    welcome: "i18nexusへようこそ",
    description: "これは開発ツールのデモです",
    counter: "カウント: {{count}}",
    styled: "これは{{word}}テキストです",
  },
};

function ExampleContent() {
  const { t } = useTranslation();
  const [count, setCount] = React.useState(0);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>{t("welcome")}</h1>
      <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "32px" }}>
        {t("description")}
      </p>

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "24px",
        }}>
        <p style={{ fontSize: "20px", marginBottom: "16px" }}>
          {t("counter", { count })}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
          }}>
          Increment
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "24px",
          borderRadius: "12px",
        }}>
        <p style={{ fontSize: "18px" }}>
          {t(
            "styled",
            { word: "styled" },
            { word: { color: "#ef4444", fontWeight: "bold" } }
          )}
        </p>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#fef3c7",
          borderRadius: "8px",
          border: "2px solid #f59e0b",
        }}>
        <p style={{ fontSize: "14px", color: "#92400e" }}>
          💡 <strong>Tip:</strong> Look at the bottom-left corner to see the
          i18nexus devtools! Click on it to open the panel and try changing
          languages.
        </p>
      </div>
    </div>
  );
}

export default function DevtoolsExample() {
  return (
    <I18nProvider
      languageManagerOptions={{
        supportedLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
          { code: "ja", name: "日本語" },
        ],
        defaultLanguage: "en",
        cookieOptions: {
          name: "i18nexus-example",
        },
      }}
      translations={translations}>
      <ExampleContent />

      {/* Add the devtools */}
      <I18NexusDevtools initialIsOpen={false} position="bottom-left" />
    </I18nProvider>
  );
}
