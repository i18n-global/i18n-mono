"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nProviderPage() {
  const { t } = useTranslation();

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
        <span className="text-slate-300">I18nProvider</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          I18nProvider
        </h1>
        <p className="text-xl text-slate-400">
          {t(
            "React Context provider with cookie-based language persistence and SSR support"
          )}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("Overview")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-blue-400 bg-slate-950 px-2 py-1 rounded">
              I18nProvider
            </code>
            {t(
              " is the root component that provides internationalization context to your entire application. It manages language state, handles cookie persistence, and ensures zero hydration mismatch in SSR."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Cookie-based language persistence")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Zero hydration mismatch in Next.js")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Type-safe language management")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Automatic language detection from cookies")}
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

        {/* Props */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {t("Props")}
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <code className="text-green-400 text-lg">initialLanguage</code>
                <span className="text-sm text-slate-500">
                  {t("string (required)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t(
                  "The initial language code to use. Should match one of the keys in translations object."
                )}
              </p>
              <pre className="bg-slate-950 rounded-lg p-3 mt-2 overflow-x-auto">
                <code className="text-sm text-slate-400">
                  initialLanguage="ko"
                </code>
              </pre>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <code className="text-green-400 text-lg">translations</code>
                <span className="text-sm text-slate-500">
                  {t("object (required)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t(
                  "Object containing translation keys and values for all supported languages."
                )}
              </p>
              <pre className="bg-slate-950 rounded-lg p-3 mt-2 overflow-x-auto">
                <code className="text-sm text-slate-400">{`translations={{
  en: { "Welcome": "Welcome" },
  ko: { "Welcome": "환영합니다" }
}}`}</code>
              </pre>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <code className="text-green-400 text-lg">children</code>
                <span className="text-sm text-slate-500">
                  {t("ReactNode (required)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t(
                  "Your application components that need access to translations."
                )}
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <code className="text-green-400 text-lg">
                  languageManagerOptions
                </code>
                <span className="text-sm text-slate-500">
                  {t("object (optional)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t("Additional configuration for language management.")}
              </p>
              <pre className="bg-slate-950 rounded-lg p-3 mt-2 overflow-x-auto">
                <code className="text-sm text-slate-400">{`languageManagerOptions={{
  defaultLanguage: "ko",
  availableLanguages: [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "en", name: "English", flag: "🇺🇸" }
  ]
}}`}</code>
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
            {t("Basic Setup (Client Components Only)")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">{`// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { translations } from "@/lib/i18n";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <I18nProvider 
          initialLanguage="ko" 
          translations={translations}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}`}</code>
          </pre>
        </div>

        {/* SSR Usage */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-green-400 mb-4">
            {t("Server-Side Rendering (Next.js App Router)")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">{`// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { getServerLanguage } from "i18nexus/server";
import { headers } from "next/headers";
import { translations } from "@/lib/i18n";

export default async function RootLayout({ children }) {
  // Read language from cookie on server
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  return (
    <html lang={language}>
      <body>
        <I18nProvider 
          initialLanguage={language} 
          translations={translations}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}`}</code>
          </pre>
          <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300">
              <strong>💡 {t("Why this matters")}:</strong>{" "}
              {t(
                "By reading the language from cookies on the server, you ensure that the initial HTML matches what the client expects, preventing hydration mismatches."
              )}
            </p>
          </div>
        </div>

        {/* Advanced Usage */}
        <div>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            {t("Advanced Configuration")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
            <code className="text-sm text-slate-300">{`// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { translations } from "@/lib/i18n";

const languageManagerOptions = {
  defaultLanguage: "ko",
  availableLanguages: [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ],
  cookieOptions: {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
    sameSite: "lax",
  }
};

export default function RootLayout({ children }) {
  return (
    <I18nProvider 
      initialLanguage="ko" 
      translations={translations}
      languageManagerOptions={languageManagerOptions}
    >
      {children}
    </I18nProvider>
  );
}`}</code>
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
              {t("Do: Place at the root of your app")}
            </h4>
            <p className="text-slate-300">
              {t(
                "Always wrap your entire application with I18nProvider at the root layout level to ensure all components have access to translations."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("Do: Use server-side language detection")}
            </h4>
            <p className="text-slate-300">
              {t(
                "For Next.js applications, always read the language from cookies on the server to prevent hydration mismatches."
              )}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("Don't: Nest multiple providers")}
            </h4>
            <p className="text-slate-300">
              {t(
                "Avoid nesting I18nProvider components. Use only one provider at the root level."
              )}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("Don't: Change initialLanguage dynamically")}
            </h4>
            <p className="text-slate-300">
              {t(
                "The initialLanguage prop should be set once. Use changeLanguage() from useLanguageSwitcher to change languages dynamically."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* See Also */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">{t("See Also")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/i18nexus/use-translation"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              useTranslation →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Learn how to use translations in your components")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus/use-language-switcher"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              useLanguageSwitcher →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Learn how to change languages dynamically")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
