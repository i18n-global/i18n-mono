"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nexusToolsPage() {
  const { t } = useTranslation();

  const tools = [
    {
      title: "i18n-wrapper",
      description: "Automatically wrap Korean/English text with t() function",
      icon: "🎁",
      href: "/docs/i18nexus-tools/wrapper",
      color: "blue",
    },
    {
      title: "i18n-extractor",
      description: "Extract translation keys from your codebase",
      icon: "🔍",
      href: "/docs/i18nexus-tools/extractor",
      color: "green",
    },
    {
      title: "i18n-upload",
      description: "Upload local translations to Google Sheets",
      icon: "📤",
      href: "/docs/i18nexus-tools/upload",
      color: "purple",
    },
    {
      title: "i18n-download",
      description: "Download translations from Google Sheets (incremental)",
      icon: "📥",
      href: "/docs/i18nexus-tools/download",
      color: "orange",
    },
    {
      title: "i18n-download-force",
      description: "Force overwrite all translations from Google Sheets",
      icon: "🔄",
      href: "/docs/i18nexus-tools/download-force",
      color: "red",
    },
    {
      title: "Google Sheets Setup",
      description: "Configure Google Sheets integration",
      icon: "📊",
      href: "/docs/i18nexus-tools/google-sheets",
      color: "indigo",
    },
  ];

  const colorClasses = {
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500/10",
      hover: "hover:bg-blue-500/20",
      text: "text-blue-400",
      shadow: "shadow-blue-500/20",
    },
    green: {
      border: "border-green-500",
      bg: "bg-green-500/10",
      hover: "hover:bg-green-500/20",
      text: "text-green-400",
      shadow: "shadow-green-500/20",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-500/10",
      hover: "hover:bg-purple-500/20",
      text: "text-purple-400",
      shadow: "shadow-purple-500/20",
    },
    orange: {
      border: "border-orange-500",
      bg: "bg-orange-500/10",
      hover: "hover:bg-orange-500/20",
      text: "text-orange-400",
      shadow: "shadow-orange-500/20",
    },
    red: {
      border: "border-red-500",
      bg: "bg-red-500/10",
      hover: "hover:bg-red-500/20",
      text: "text-red-400",
      shadow: "shadow-red-500/20",
    },
    indigo: {
      border: "border-indigo-500",
      bg: "bg-indigo-500/10",
      hover: "hover:bg-indigo-500/20",
      text: "text-indigo-400",
      shadow: "shadow-indigo-500/20",
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/" className="text-blue-400 hover:text-blue-300">
          {t("Home")}
        </Link>
        <span className="text-slate-500 mx-2">/</span>
        <span className="text-slate-300">{t("i18nexus-tools Documentation")}</span>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/50">
          <span className="text-white font-bold text-2xl">⚡</span>
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
          {t("i18nexus-tools")}
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          {t(
            "Powerful CLI tools to automate your i18n workflow - from code transformation to Google Sheets integration"
          )}
        </p>
      </div>

      {/* Installation */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3">📦</span>
          {t("Installation")}
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-slate-400 mb-2">{t("Install globally (recommended)")}:</p>
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
              <code className="text-green-400">npm install -g i18nexus-tools</code>
            </div>
          </div>
          <div>
            <p className="text-slate-400 mb-2">{t("Or use without installing")}:</p>
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
              <code className="text-blue-400">npx i18nexus-tools@latest</code>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Workflow */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 p-8 mb-12">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
          <span className="mr-3">🚀</span>
          {t("Quick Workflow")}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold mr-4">
              1
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                {t("Create config file")}
              </h4>
              <code className="text-sm text-green-400 bg-slate-950 px-3 py-1 rounded">
                npx i18n-sheets init
              </code>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold mr-4">
              2
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                {t("Auto-wrap hardcoded strings")}
              </h4>
              <code className="text-sm text-green-400 bg-slate-950 px-3 py-1 rounded">
                npx i18n-wrapper
              </code>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold mr-4">
              3
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                {t("Extract translation keys")}
              </h4>
              <code className="text-sm text-green-400 bg-slate-950 px-3 py-1 rounded">
                npx i18n-extractor
              </code>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold mr-4">
              4
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                {t("Sync with Google Sheets (optional)")}
              </h4>
              <code className="text-sm text-green-400 bg-slate-950 px-3 py-1 rounded mr-2">
                npx i18n-upload
              </code>
              <code className="text-sm text-blue-400 bg-slate-950 px-3 py-1 rounded">
                npx i18n-download
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8">
          {t("Available Tools")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const colors = colorClasses[tool.color as keyof typeof colorClasses];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group bg-slate-900 rounded-xl border ${colors.border} p-6 transition-all hover:shadow-lg ${colors.shadow} hover:-translate-y-1`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 ${colors.bg} ${colors.hover} rounded-lg mb-4 transition-colors`}>
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t(tool.title)}
                </h3>
                <p className="text-slate-400 mb-4 text-sm">{t(tool.description)}</p>
                <div className={`inline-flex items-center ${colors.text} font-medium text-sm`}>
                  {t("View documentation")}{" "}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Configuration File */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("Configuration File")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            {t("All CLI tools read from")} <code className="text-blue-400 bg-slate-950 px-2 py-1 rounded">i18nexus.config.json</code> {t("in your project root")}:
          </p>
          <pre className="bg-slate-950 rounded-lg p-6 overflow-x-auto">
            <code className="text-sm text-slate-300">{`{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "googleSheets": {
    "spreadsheetId": "your-spreadsheet-id",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}`}</code>
          </pre>
          <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>💡 {t("Tip")}:</strong> {t("Run")} <code className="bg-slate-950 px-2 py-1 rounded">npx i18n-sheets init</code> {t("to automatically create this file")}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">{t("Key Features")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🤖</span>
              {t("Automation")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Auto-detect and wrap hardcoded strings")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Automatic import injection")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Smart key generation with spacing preserved")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🔄</span>
              {t("Sync & Collaboration")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Google Sheets integration")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Incremental updates (safe)")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Force sync for full overwrites")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              {t("Developer Experience")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Config-based, zero setup needed")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("TypeScript support")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Detailed logging and error messages")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">📁</span>
              {t("File Management")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Simple file structure: locales/en.json, locales/ko.json")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Preserves existing translations")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Smart merging of new keys")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
