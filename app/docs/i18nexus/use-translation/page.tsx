"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";
import { useState } from "react";

export default function UseTranslationPage() {
  const { t } = useTranslation();
  const [demoKey, setDemoKey] = useState("Welcome");

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          {t("Home")}
        </Link>
        <span className="text-slate-500 mx-2">/</span>
        <Link
          href="/docs/i18nexus"
          className="text-blue-400 hover:text-blue-300">
          {t("i18nexus")}
        </Link>
        <span className="text-slate-500 mx-2">/</span>
        <span className="text-slate-300">useTranslation</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          useTranslation
        </h1>
        <p className="text-xl text-slate-400">
          {t(
            "React hook for accessing translation functions in client components"
          )}
        </p>
      </div>

      {/* Live Demo */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          <span className="mr-2">🎮</span>
          {t("Interactive Demo")}
        </h2>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t("Translation Key")}:
            </label>
            <input
              type="text"
              value={demoKey}
              onChange={(e) => setDemoKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter a translation key"
            />
          </div>
          <div className="bg-slate-950 rounded-lg p-6 border border-slate-700">
            <div className="text-sm text-slate-500 mb-2">{t("Result")}:</div>
            <div className="text-2xl font-bold text-white">{t(demoKey)}</div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            <p>
              💡 {t("Try entering: Welcome, Getting Started, CLI Tools, etc.")}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("Overview")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-blue-400 bg-slate-950 px-2 py-1 rounded">
              useTranslation
            </code>
            {t(
              " is a React hook that provides access to the translation function (t) and current language state. It can only be used in Client Components."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Simple API with t() function")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Automatic re-rendering on language change")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Fallback to key if translation missing")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Type-safe with TypeScript")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("API Reference")}
        </h2>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {t("Return Value")}
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="mb-2">
                <code className="text-green-400 text-lg">
                  t(key: string): string
                </code>
              </div>
              <p className="text-slate-300 mb-2">
                {t(
                  "Translation function that returns the translated string for the given key."
                )}
              </p>
              <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
                <code className="text-sm text-slate-400">{`const { t } = useTranslation();
const welcomeText = t("Welcome"); // "환영합니다" or "Welcome"`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <div className="mb-2">
                <code className="text-green-400 text-lg">
                  currentLanguage: string
                </code>
              </div>
              <p className="text-slate-300 mb-2">
                {t("The currently active language code.")}
              </p>
              <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
                <code className="text-sm text-slate-400">{`const { currentLanguage } = useTranslation();
console.log(currentLanguage); // "ko" or "en"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("Usage Examples")}
        </h2>

        {/* Basic Usage */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            {t("Basic Usage")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">{`"use client";

import { useTranslation } from "i18nexus";

export default function Welcome() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t("Welcome")}</h1>
      <p>{t("This is a simple example")}</p>
    </div>
  );
}`}</code>
          </pre>
        </div>

        {/* Dynamic Keys */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-green-400 mb-4">
            {t("Dynamic Translation Keys")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">{`"use client";

import { useTranslation } from "i18nexus";

export default function StatusMessage({ status }) {
  const { t } = useTranslation();
  
  // Dynamically construct translation keys
  const message = t(\`status.\${status}\`);
  
  return <div>{message}</div>;
}

// Translations:
// "status.success": "작업이 성공했습니다"
// "status.error": "오류가 발생했습니다"
// "status.pending": "처리 중입니다"`}</code>
          </pre>
        </div>

        {/* With Language Display */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            {t("Displaying Current Language")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">{`"use client";

import { useTranslation } from "i18nexus";

export default function LanguageDisplay() {
  const { t, currentLanguage } = useTranslation();
  
  return (
    <div>
      <p>{t("Current language")}: {currentLanguage}</p>
      <p>{t("Welcome to our app")}</p>
    </div>
  );
}`}</code>
          </pre>
        </div>

        {/* Complex Component */}
        <div>
          <h3 className="text-xl font-semibold text-orange-400 mb-4">
            {t("Real-World Example")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">
              {`"use client";

import { useTranslation } from "i18nexus";

interface Product {
  id: string;
  nameKey: string;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  
  return (
    <div className="product-card">
      <h2>{t(product.nameKey)}</h2>
      <p className="price">
        {t("Price")}: ${"$"}{product.price}
      </p>
      <button>
        {t("Add to cart")}
      </button>
    </div>
  );
}`}
            </code>
          </pre>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("Best Practices")}
        </h2>
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("Do: Use descriptive keys")}
            </h4>
            <p className="text-slate-300 mb-2">
              {t(
                "Use clear, descriptive translation keys that indicate the content."
              )}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
              <code className="text-sm text-slate-400">{`// Good
t("user.profile.edit.button")
t("error.network.timeout")

// Avoid
t("btn1")
t("msg")`}</code>
            </pre>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("Do: Handle missing translations gracefully")}
            </h4>
            <p className="text-slate-300">
              {t(
                "i18nexus automatically returns the key if translation is missing, making debugging easier."
              )}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("Don't: Use in Server Components")}
            </h4>
            <p className="text-slate-300 mb-2">
              {t(
                "useTranslation is a client-side hook. For Server Components, use createServerTranslation()."
              )}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
              <code className="text-sm text-slate-400">{`// ❌ Wrong - Server Component
export default async function Page() {
  const { t } = useTranslation(); // Error!
}

// ✅ Correct - Client Component
"use client";
export default function Page() {
  const { t } = useTranslation(); // Works!
}`}</code>
            </pre>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("Don't: Construct keys with complex logic")}
            </h4>
            <p className="text-slate-300">
              {t("Keep translation key logic simple and predictable.")}
            </p>
          </div>
        </div>
      </section>

      {/* See Also */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">{t("See Also")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/i18nexus/provider"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              I18nProvider →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Learn how to set up the translation provider")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus/server-components"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              Server Components →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Learn how to use translations in Server Components")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
