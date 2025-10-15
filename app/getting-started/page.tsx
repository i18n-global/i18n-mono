"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function GettingStartedPage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <span className="mr-2">←</span>
          {t("Back to Home")}
        </Link>
        <h1 className="text-5xl font-bold text-white mb-4">
          {t("Getting Started")}
        </h1>
        <p className="text-xl text-slate-300">
          {t("Complete step-by-step guide to setup i18nexus in your project")}
        </p>
      </div>

      {/* Installation */}
      <section className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl border border-blue-800/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">1</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{t("Installation")}</h2>
        </div>

        <div className="bg-slate-950 rounded-xl p-6 mb-4">
          <code className="text-green-400">npm install i18nexus</code>
        </div>

        <p className="text-slate-300 text-sm">
          {t("This will install both the React components and CLI tools")}
        </p>
      </section>

      {/* Step 2: Initialize Project */}
      <section className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 rounded-2xl border border-purple-800/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">2</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Initialize Project")}
          </h2>
        </div>

        <div className="bg-slate-950 rounded-xl p-6 mb-4">
          <code className="text-green-400">npx i18n-sheets init</code>
        </div>

        <div className="space-y-3 text-slate-300">
          <p className="font-semibold text-white">{t("This will create")}:</p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start">
              <span className="text-purple-400 mr-3">•</span>
              <code className="bg-slate-900 px-2 py-1 rounded text-sm">
                i18nexus.config.json
              </code>
              <span className="ml-2">
                - {t("Configuration file for your project")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-400 mr-3">•</span>
              <code className="bg-slate-900 px-2 py-1 rounded text-sm">
                locales/
              </code>
              <span className="ml-2">
                - {t("Directory for translation files (ko.json, en.json)")}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Step 3: Setup I18nProvider */}
      <section className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-2xl border border-green-800/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">3</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Setup I18nProvider")}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-slate-300 mb-3">
              <strong className="text-white">
                {t("For Next.js App Router")}:
              </strong>{" "}
              {t("Add to your root layout.tsx")}
            </p>
            <div className="bg-slate-950 rounded-xl p-6 overflow-x-auto">
              <pre className="text-sm">
                <code className="text-slate-300">
                  {`// app/layout.tsx
import { headers } from "next/headers";
import { I18nProvider } from "i18nexus";
import { getServerLanguage } from "i18nexus/server";
import { translations } from "@/lib/i18n";

export default async function RootLayout({ children }) {
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
}`}
                </code>
              </pre>
            </div>
          </div>

          <div>
            <p className="text-slate-300 mb-3">
              <strong className="text-white">{t("Translation file")}:</strong>{" "}
              {t("Create lib/i18n.ts")}
            </p>
            <div className="bg-slate-950 rounded-xl p-6 overflow-x-auto">
              <pre className="text-sm">
                <code className="text-slate-300">
                  {`// lib/i18n.ts
import en from "../locales/en.json";
import ko from "../locales/ko.json";

export const translations = {
  en,
  ko,
};`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Wrap Text */}
      <section className="bg-gradient-to-br from-orange-950/50 to-red-950/50 rounded-2xl border border-orange-800/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">4</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Wrap Korean Text")}
          </h2>
        </div>

        <div className="bg-slate-950 rounded-xl p-6 mb-4">
          <code className="text-green-400">npx i18n-wrapper</code>
        </div>

        <div className="space-y-4 text-slate-300">
          <p>{t("This will automatically wrap all Korean text with t()")}</p>

          <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-xl p-6">
            <h3 className="text-yellow-400 font-semibold mb-3 flex items-center">
              <span className="mr-2">⚠️</span>
              {t("Important: Check for Server Components")}
            </h3>
            <div className="space-y-3">
              <p className="text-sm">
                {t(
                  "After running i18n-wrapper, some files may have errors because:"
                )}
              </p>
              <ol className="space-y-2 ml-6 text-sm">
                <li>
                  <strong className="text-white">
                    1. {t("Server Components")}:
                  </strong>
                  <br />
                  {t(
                    "If the file is a Server Component (no &apos;use client&apos;), you need to use server utilities instead of hooks"
                  )}
                </li>
                <li>
                  <strong className="text-white">
                    2. {t("Fix manually")}:
                  </strong>
                  <br />
                  {t(
                    "Check the error and decide whether to add &apos;use client&apos; or use createServerTranslation()"
                  )}
                </li>
              </ol>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                {t("For Client Components")}
              </h4>
              <pre className="text-xs overflow-x-auto">
                <code className="text-slate-300">
                  {`"use client";
import { useTranslation } from "i18nexus";

export default function Page() {
  const { t } = useTranslation();
  return <div>{t("안녕하세요")}</div>;
}`}
                </code>
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="text-blue-400 mr-2">✓</span>
                {t("For Server Components")}
              </h4>
              <pre className="text-xs overflow-x-auto">
                <code className="text-slate-300">
                  {`import { headers } from "next/headers";
import { getServerLanguage, 
  createServerTranslation } from "i18nexus/server";

export default async function Page() {
  const lang = getServerLanguage(await headers());
  const t = createServerTranslation(lang, translations);
  return <div>{t("안녕하세요")}</div>;
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Step 5: Extract Keys */}
      <section className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-2xl border border-cyan-800/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">5</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Extract Translation Keys")}
          </h2>
        </div>

        <div className="bg-slate-950 rounded-xl p-6 mb-4">
          <code className="text-green-400">npx i18n-extractor</code>
        </div>

        <div className="space-y-4 text-slate-300">
          <p>
            {t("This will scan your code and create/update translation files")}
          </p>

          <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-6">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center">
              <span className="mr-2">💡</span>
              {t("App Directory Note")}
            </h3>
            <p className="text-sm">
              {t(
                "If you're using Next.js App Router, use the -p flag to specify the correct directory"
              )}
              :
            </p>
            <div className="bg-slate-950 rounded-lg p-4 mt-3">
              <code className="text-green-400 text-sm">
                npx i18n-extractor -p &quot;app/**/*.tsx&quot;
              </code>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white mb-2">
              {t("Result files")}:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-cyan-400 mr-3">→</span>
                <code className="bg-slate-900 px-2 py-1 rounded text-sm">
                  locales/ko.json
                </code>
                <span className="ml-2">
                  - {t("Korean translations (auto-filled)")}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyan-400 mr-3">→</span>
                <code className="bg-slate-900 px-2 py-1 rounded text-sm">
                  locales/en.json
                </code>
                <span className="ml-2">
                  - {t("English translations (needs manual translation)")}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step 6: Add English Translations */}
      <section className="bg-gradient-to-br from-violet-950/50 to-purple-950/50 rounded-2xl border border-violet-800/50 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white font-bold text-xl">6</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Add English Translations")}
          </h2>
        </div>

        <div className="space-y-4 text-slate-300">
          <p>{t("Open locales/en.json and add English translations")}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-2">
                {t("Before (auto-generated)")}:
              </p>
              <div className="bg-slate-950 rounded-xl p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-slate-300">
                    {`{
  "안녕하세요": "안녕하세요",
  "환영합니다": "환영합니다"
}`}
                  </code>
                </pre>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-2">
                {t("After (translated)")}:
              </p>
              <div className="bg-slate-950 rounded-xl p-4">
                <pre className="text-xs overflow-x-auto">
                  <code className="text-slate-300">
                    {`{
  "안녕하세요": "Hello",
  "환영합니다": "Welcome"
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional: Google Sheets */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center mr-4">
            <span className="text-white text-2xl">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Optional: Google Sheets Integration")}
          </h2>
        </div>

        <div className="space-y-4 text-slate-300">
          <p>{t("For team collaboration, you can sync with Google Sheets")}</p>

          <div className="space-y-3">
            <div className="bg-slate-950 rounded-xl p-4">
              <p className="text-sm text-slate-400 mb-2">
                {t("Upload translations")}:
              </p>
              <code className="text-green-400">
                npx i18n-sheets upload -s YOUR_SPREADSHEET_ID
              </code>
            </div>

            <div className="bg-slate-950 rounded-xl p-4">
              <p className="text-sm text-slate-400 mb-2">
                {t("Download translations")}:
              </p>
              <code className="text-green-400">
                npx i18n-sheets download -s YOUR_SPREADSHEET_ID
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Done */}
      <section className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-2xl border border-green-800/50 p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <span className="text-white font-bold text-4xl">✓</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">{t("Done!")}</h2>
          <p className="text-xl text-slate-300 mb-6">
            {t("Your app is fully internationalized and ready to deploy")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/provider"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
              {t("Learn more about I18nProvider")} →
            </Link>
            <Link
              href="/cli"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors">
              {t("Explore CLI Tools")} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
