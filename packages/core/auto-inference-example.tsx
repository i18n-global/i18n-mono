/**
 * Example demonstrating automatic type inference with createI18n
 *
 * This shows how translation keys are automatically inferred without
 * manual type annotations.
 */

import React from "react";
import { createI18n, useDynamicTranslation } from "./src/index";

// ✅ Step 1: Define translations with 'as const' for literal types
const translations = {
  common: {
    en: {
      welcome: "Welcome",
      goodbye: "Goodbye",
      greeting: "Hello {{name}}",
    },
    ko: {
      welcome: "환영합니다",
      goodbye: "안녕히 가세요",
      greeting: "안녕하세요 {{name}}",
    },
  },
  menu: {
    en: {
      home: "Home",
      about: "About",
      contact: "Contact",
    },
    ko: {
      home: "홈",
      about: "소개",
      contact: "연락처",
    },
  },
  error: {
    en: {
      notfound: "Page not found",
      servererror: "Server error",
    },
    ko: {
      notfound: "페이지를 찾을 수 없습니다",
      servererror: "서버 오류",
    },
  },
} as const;

// Dynamic translations (no type safety)
const dynamicTranslations = {
  en: {
    "item.type.0": "League",
    "item.type.1": "Cup",
    "error.404": "Not Found",
  },
  ko: {
    "item.type.0": "리그",
    "item.type.1": "컵",
    "error.404": "찾을 수 없음",
  },
};

// ✅ Step 2: Create typed i18n system with fallback namespace
const i18n = createI18n(translations, {
  fallbackNamespace: "common", // ✅ Set fallback namespace
});

// ✅ Step 3: Use in your app
function App() {
  return (
    <i18n.I18nProvider
      dynamicTranslations={dynamicTranslations}
      languageManagerOptions={{
        defaultLanguage: "en",
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
        ],
      }}
    >
      <Header />
      <Navigation />
      <Content />
      <ErrorExample />
      <DynamicExample />
      <SimplifiedExample />
    </i18n.I18nProvider>
  );
}

// ✅ Step 4: Use in components - FULLY TYPED!
function Header() {
  // No manual type annotation needed!
  const { t, currentLanguage } = i18n.useTranslation("common");

  return (
    <header>
      <h1>{t("welcome")}</h1>
      {/* ✅ Autocomplete shows: "welcome" | "goodbye" | "greeting" */}

      <p>{t("greeting", { name: "World" })}</p>
      {/* ✅ Variables work perfectly */}

      {/* ❌ This would be a TypeScript error: */}
      {/* t("invalid"); */}

      <span>Current: {currentLanguage}</span>
    </header>
  );
}

function Navigation() {
  // Different namespace = different keys!
  const { t } = i18n.useTranslation("menu");

  return (
    <nav>
      <a href="/">{t("home")}</a>
      {/* ✅ Autocomplete shows: "home" | "about" | "contact" */}

      <a href="/about">{t("about")}</a>
      <a href="/contact">{t("contact")}</a>

      {/* ❌ This would be a TypeScript error: */}
      {/* t("welcome"); */}
      {/* "welcome" is in "common", not "menu" */}
    </nav>
  );
}

function Content() {
  // Can use multiple namespaces in one component!
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");

  return (
    <div>
      <h2>{tCommon("welcome")}</h2>
      <p>Navigate to: {tMenu("about")}</p>
    </div>
  );
}

function SimplifiedExample() {
  // ✅ NEW: No namespace needed! Access all keys
  const { t } = i18n.useTranslation();

  return (
    <div>
      <h2>{t("welcome")}</h2>
      {/* ✅ Autocomplete shows ALL keys from ALL namespaces */}

      <nav>
        <a href="/">{t("home")}</a>
        {/* ✅ Works! "home" is from "menu" namespace */}

        <a href="/about">{t("about")}</a>
        {/* ✅ Works! "about" is from "menu" namespace */}
      </nav>

      <p>{t("notfound")}</p>
      {/* ✅ Works! "notfound" is from "error" namespace */}

      {/* ❌ This would be a TypeScript error: */}
      {/* t("invalid"); */}
      {/* Because "invalid" doesn't exist in any namespace */}
    </div>
  );
}

function ErrorExample() {
  const { t } = i18n.useTranslation("error");

  return (
    <div>
      <p>{t("notfound")}</p>
      {/* ✅ Autocomplete shows: "notfound" | "servererror" */}
    </div>
  );
}

function DynamicExample() {
  // For truly dynamic keys, use useDynamicTranslation
  const { t: tDynamic } = useDynamicTranslation();

  const items = [
    { type: 0, label: "item.type.0" },
    { type: 1, label: "item.type.1" },
  ];

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {tDynamic(item.label)}
          {/* ✅ Accepts any string */}
        </div>
      ))}

      <p>{tDynamic(`error.404`)}</p>
      {/* ✅ Runtime concatenation works */}
    </div>
  );
}

// ✅ Type inference verification
type Namespaces = Parameters<typeof i18n.useTranslation>[0];
// Should be: "common" | "menu" | "error"

type CommonKeys = Parameters<
  ReturnType<typeof i18n.useTranslation<"common">>["t"]
>[0];
// Should be: "welcome" | "goodbye" | "greeting"

type MenuKeys = Parameters<
  ReturnType<typeof i18n.useTranslation<"menu">>["t"]
>[0];
// Should be: "home" | "about" | "contact"

console.log("✅ Type inference example compiled successfully!");

export default App;
