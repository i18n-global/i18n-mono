"use client";

import { useTranslation, useLanguageSwitcher } from "i18nexus";

export default function ProviderPage() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } =
    useLanguageSwitcher();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-2xl">🎨</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-4">
          I18nProvider
        </h1>
        <p className="text-xl text-slate-300">
          {t(
            "React Context provider with cookie-based language persistence and SSR support"
          )}
        </p>
      </div>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          {t("Key Features")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 border border-blue-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🍪</span>
            </div>
            <h3 className="font-semibold text-blue-300 mb-2">
              {t("Cookie Persistence")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("Automatically saves language choice")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/50 to-indigo-900/30 border border-indigo-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="font-semibold text-indigo-300 mb-2">
              {t("SSR Ready")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("Perfect Next.js compatibility")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 border border-purple-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-purple-300 mb-2">
              {t("Zero Hydration")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("No layout shift on load")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-950/50 to-pink-900/30 border border-pink-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📘</span>
            </div>
            <h3 className="font-semibold text-pink-300 mb-2">
              {t("TypeScript")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("Full type safety included")}
            </p>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          {t("Basic Setup")}
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900/50 to-transparent px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-sm">
                  1
                </span>
                {t("Server Layout (app/layout.tsx)")}
              </h3>
            </div>
            <div className="p-6">
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm border border-slate-800">
                <code>{`import { I18nProvider } from "i18nexus";
import { cookies } from "next/headers";

export default function RootLayout({ children }) {
  const language = cookies().get("i18n-language")?.value || "ko";

  return (
    <html lang={language}>
      <body>
        <I18nProvider
          initialLanguage={language}
          languageManagerOptions={{
            defaultLanguage: "ko",
            availableLanguages: [
              { code: "ko", name: "한국어", flag: "🇰🇷" },
              { code: "en", name: "English", flag: "🇺🇸" },
            ],
          }}
          translations={{
            ko: { "환영합니다": "환영합니다" },
            en: { "환영합니다": "Welcome" },
          }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}`}</code>
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900/50 to-transparent px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-indigo-300 flex items-center">
                <span className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3 text-sm">
                  2
                </span>
                {t("Client Component (app/page.tsx)")}
              </h3>
            </div>
            <div className="p-6">
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm border border-slate-800">
                <code>{`"use client";

import { useTranslation, useLanguageSwitcher } from "i18nexus";

export default function HomePage() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <button onClick={() => changeLanguage("en")}>
        English
      </button>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">{t("Live Demo")}</h2>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Language Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("Current Language")}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30">
                  {currentLanguage.toUpperCase()}
                </div>
                <p className="text-slate-300 text-lg">
                  {
                    availableLanguages.find((l) => l.code === currentLanguage)
                      ?.name
                  }
                </p>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("Switch Language")}
              </h3>
              <div className="flex gap-4">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      currentLanguage === lang.code
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    }`}>
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="text-sm">{lang.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-400 text-center mt-4">
                💡 {t("Try switching - saved in cookies!")}
              </p>
            </div>
          </div>

          {/* Translation Examples */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("Translation Examples")}
            </h3>
            <div className="grid gap-3">
              {[
                t("환영합니다"),
                t("Quick Start"),
                t("Why i18nexus?"),
                t("Cookie Persistence"),
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-sm font-mono">
                    {`t("${["환영합니다", "Quick Start", "Why i18nexus?", "Cookie Persistence"][i]}")`}
                  </span>
                  <span className="text-white font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8">
          {t("API Reference")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">
              useTranslation()
            </h3>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm mb-4 border border-slate-800">
              <code>{`const { t } = useTranslation();

// Simple usage
t("key")
t("한국어 텍스트")`}</code>
            </pre>
            <p className="text-slate-400 text-sm">
              {t(
                "Hook for accessing translation function in client components"
              )}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4">
              useLanguageSwitcher()
            </h3>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm mb-4 border border-slate-800">
              <code>{`const {
  currentLanguage,
  changeLanguage,
  availableLanguages,
} = useLanguageSwitcher();

changeLanguage("en")`}</code>
            </pre>
            <p className="text-slate-400 text-sm">
              {t("Hook for language switching and state management")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
