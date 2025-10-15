"use client";

import { useTranslation } from "i18nexus";

export default function CLIPage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30">
          <span className="text-white font-bold text-2xl">⚡</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
          CLI Tools
        </h1>
        <p className="text-xl text-slate-300">
          {t("Powerful automation tools for wrapping text and managing translations")}
        </p>
      </div>

      {/* Installation */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{t("Installation")}</h2>
        <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg border border-slate-800">
          <code>npm install -D i18nexus-tools</code>
        </pre>
      </section>

      {/* i18n-wrapper Tool */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-2xl border border-purple-800/50 p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-2xl">🔧</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">i18n-wrapper</h2>
              <p className="text-purple-300 mt-1">{t("Automatic Text Wrapping")}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 text-lg">
            {t("Automatically wraps Korean text with t() and adds imports")}
          </p>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">{t("Basic Usage")}</h3>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
              <code>{`# Wrap all Korean text in app directory
npx i18n-wrapper --pattern "app/**/*.tsx"

# Preview changes without modifying
npx i18n-wrapper --dry-run

# Target specific files
npx i18n-wrapper --pattern "app/page.tsx"`}</code>
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center mb-3">
                <span className="text-red-400 mr-2">📝</span>
                <h4 className="font-semibold text-white">{t("Before")}</h4>
              </div>
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
                <code>{`export default function Welcome() {
  return (
    <div>
      <h1>환영합니다</h1>
      <p>i18nexus 사용법</p>
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center mb-3">
                <span className="text-green-400 mr-2">✨</span>
                <h4 className="font-semibold text-white">{t("After")}</h4>
              </div>
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
                <code>{`import { useTranslation } from "i18nexus";

export default function Welcome() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("i18nexus 사용법")}</p>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-800/50 rounded-xl p-6 mt-6">
            <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              {t("Smart Detection")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Detects Korean text in JSX elements")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Detects Korean in string literals")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Detects Korean in template literals")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Skips already wrapped text")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Preserves code formatting")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* i18n-extractor Tool */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-green-950/50 to-emerald-900/30 rounded-2xl border border-green-800/50 p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/30">
              <span className="text-white font-bold text-2xl">🔍</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">i18n-extractor</h2>
              <p className="text-green-300 mt-1">{t("Smart Key Extraction")}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 text-lg">
            {t("Extract translation keys and merge with existing files intelligently")}
          </p>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">{t("Basic Usage")}</h3>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
              <code>{`# Extract and merge with existing translations
npx i18n-extractor -p "app/**/*.tsx" -d "./lib/translations"

# Generate specific language files
npx i18n-extractor -l "en,ko,ja"

# Preview without modifying
npx i18n-extractor --dry-run`}</code>
            </pre>
          </div>

          <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-green-300 mb-3 flex items-center">
              <span className="mr-2">✨</span>
              {t("Smart Merging Features")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Preserves all existing translations")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Adds only new keys from code")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Sorts keys alphabetically")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Shows detailed statistics")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Google Sheets Integration */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-yellow-950/50 to-orange-900/30 rounded-2xl border border-yellow-800/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-500/30">
              <span className="text-white font-bold text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {t("Google Sheets Integration")}
              </h2>
              <p className="text-yellow-300 mt-1">{t("Team Collaboration")}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 text-lg">
            {t("Sync translations with Google Sheets for team collaboration")}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                <span className="mr-2">📤</span>
                {t("Upload")}
              </h3>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>{`npx i18n-upload \\
  --spreadsheet-id "YOUR_ID" \\
  --credentials "./credentials.json"`}</code>
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                <span className="mr-2">📥</span>
                {t("Download")}
              </h3>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>{`npx i18n-download \\
  --spreadsheet-id "YOUR_ID" \\
  --credentials "./credentials.json"`}</code>
              </pre>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2">⚙️</span>
              {t("Setup Required")}
            </h4>
            <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
              <li>{t("Create Google Cloud project")}</li>
              <li>{t("Enable Google Sheets API")}</li>
              <li>{t("Create Service Account")}</li>
              <li>{t("Download credentials JSON")}</li>
              <li>{t("Share Sheet with service account")}</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Complete Workflow */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {t("Complete Workflow")}
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-blue-500/30">
              1
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-blue-300 text-lg mb-2">
                {t("Wrap Korean Text")}
              </h3>
              <p className="text-slate-400 mb-3">
                {t("Automatically wrap hardcoded Korean strings in your code")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>npx i18n-wrapper --pattern "app/**/*.tsx"</code>
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-indigo-500/30">
              2
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-indigo-300 text-lg mb-2">
                {t("Extract Keys")}
              </h3>
              <p className="text-slate-400 mb-3">
                {t("Generate translation files from wrapped text")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>npx i18n-extractor -p "app/**/*.tsx" -d "./lib/translations"</code>
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-purple-500/30">
              3
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-purple-300 text-lg mb-2">
                {t("Translate")}
              </h3>
              <p className="text-slate-400 mb-3">
                {t("Add English translations to en.json file")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>{`// lib/translations/en.json
{
  "환영합니다": "Welcome",
  "시작하기": "Get Started"
}`}</code>
              </pre>
            </div>
          </div>

          {/* Step 4 (Optional) */}
          <div className="flex items-start opacity-75">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-yellow-500/30">
              4
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-yellow-300 text-lg mb-2">
                {t("Sync with Sheets")} <span className="text-sm text-slate-500">({t("Optional")})</span>
              </h3>
              <p className="text-slate-400 mb-3">
                {t("Upload to Google Sheets for team translation")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>npx i18n-upload --spreadsheet-id "YOUR_ID"</code>
              </pre>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-green-500/30">
              <span className="text-xl">✓</span>
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-green-300 text-lg mb-2">
                {t("Done!")}
              </h3>
              <p className="text-slate-400">
                {t("Your app is fully internationalized and ready to deploy")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}