"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";
import DownloadStats from "./components/DownloadStats";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-24">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-lg shadow-blue-500/50">
          <span className="text-white font-bold text-3xl">i18</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 mb-6 leading-tight">
          i18nexus
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 mb-4 font-light">
          {t("Complete React i18n Toolkit")}
        </p>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t(
            "Automate your internationalization workflow with intelligent tools"
          )}
        </p>
      </div>

      {/* Quick Start CTA */}
      <div className="text-center mb-16">
        <Link
          href="/getting-started"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
          <span className="mr-3 text-2xl">🚀</span>
          {t("Getting Started")}
          <span className="ml-3">→</span>
        </Link>
        <p className="text-slate-400 mt-4">
          {t("Complete step-by-step guide to setup i18nexus in your project")}
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <Link
          href="/provider"
          className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <span className="text-3xl">🎨</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {t("I18nProvider")}
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {t(
              "React Context provider with cookie-based language persistence and SSR support"
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("Cookie-based persistence")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("Zero hydration mismatch")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("TypeScript support")}
            </div>
          </div>
          <div className="mt-6 inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300">
            {t("Learn more")}{" "}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          href="/cli"
          className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1">
          <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {t("CLI Tools")}
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {t(
              "Powerful automation tools for wrapping text and managing translations"
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("Auto wrap Korean text")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("Extract translation keys")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("Google Sheets sync")}
            </div>
          </div>
          <div className="mt-6 inline-flex items-center text-indigo-400 font-medium group-hover:text-indigo-300">
            {t("Learn more")}{" "}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Start Section */}
      <section className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl border border-blue-800/50 p-10 mb-20">
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-2xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{t("Quick Start")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t("Install")}
            </h3>
            <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs overflow-x-auto">
              <code>npm install i18nexus</code>
            </pre>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-indigo-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t("Setup Provider")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("Add I18nProvider to layout.tsx")}
            </p>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t("Use Hooks")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("Use useTranslation() in components")}
            </p>
          </div>
        </div>
      </section>

      {/* Why i18nexus Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">
          {t("Why i18nexus?")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-2xl border border-red-900/50 p-8">
            <h3 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
              <span className="mr-2">❌</span>
              {t("Traditional i18n Problems")}
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("Manual text wrapping")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("Hydration issues in SSR")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("Complex configuration")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("Manual file management")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-green-900/50 p-8">
            <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
              <span className="mr-2">✅</span>
              {t("i18nexus Solutions")}
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("Automatic text wrapping with CLI")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("Zero hydration issues")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("Simple setup with defaults")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("Smart file merging")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Project Structure Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-10 mb-20">
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
            <span className="text-white font-bold text-2xl">📁</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {t("Recommended Structure")}
          </h2>
        </div>

        <p className="text-slate-300 mb-6 text-lg">
          {t("This demo follows the recommended Next.js App Router structure:")}
        </p>

        <div className="bg-slate-950 rounded-xl p-6 mb-8 border border-slate-800">
          <pre className="text-slate-300 text-sm font-mono">
            <code>{`app/
├── layout.tsx          # I18nProvider setup (server)
├── page.tsx            # useTranslation() (client)
├── provider/
│   └── page.tsx        # Provider documentation
├── cli/
│   └── page.tsx        # CLI tools documentation
└── components/
    └── Header.tsx      # Language switcher component

lib/
└── translations/
    ├── en.json         # English translations
    └── ko.json         # Korean translations`}</code>
          </pre>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
              <span className="mr-2">🔧</span>
              {t("Server Components")}
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Setup I18nProvider in layout.tsx with cookie detection")}
            </p>
          </div>
          <div className="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">⚡</span>
              {t("Client Components")}
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Use 'use client' with useTranslation() hook")}
            </p>
          </div>
          <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-purple-300 mb-2 flex items-center">
              <span className="mr-2">📄</span>
              {t("Translation Files")}
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Store in lib/translations/ as JSON")}
            </p>
          </div>
        </div>
      </section>

      {/* NPM Download Stats Section */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            {t("Download Statistics")}
          </h2>
          <p className="text-slate-400">
            {t("Real-time download stats from npm registry")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <DownloadStats
            packageName="i18nexus"
            displayName="i18nexus"
            color="blue"
          />
          <DownloadStats
            packageName="i18nexus-tools"
            displayName="i18nexus-tools"
            color="indigo"
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            {t("Data updated hourly from npm public API")}
          </p>
        </div>
      </section>
    </main>
  );
}
