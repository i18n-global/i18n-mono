import { headers } from "next/headers";
import { getServerLanguage, createServerTranslation } from "i18nexus/server";
import { translations } from "@/lib/i18n";
import Link from "next/link";

// ✅ Server Component - "use client" 없음!
export default async function ServerExamplePage() {
  // 1. 서버에서 쿠키를 읽어 현재 언어 가져오기
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  // 2. 서버 번역 함수 생성
  const t = createServerTranslation(language, translations);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6">
          <span className="mr-2">←</span>
          {t("Back to Home")}
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">
          {t("Server Component Example")}
        </h1>
        <p className="text-lg text-slate-300">
          {t(
            "This page is a Server Component - no 'use client' directive needed!"
          )}
        </p>
      </div>

      {/* Benefits */}
      <section className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-2xl border border-green-800/50 p-8 mb-8">
        <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
          <span className="mr-3 text-3xl">✅</span>
          {t("Server Component Benefits")}
        </h2>
        <ul className="space-y-4 text-slate-300">
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">
                {t("Smaller JavaScript bundle")}
              </strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("No React Context or hooks sent to client")}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">{t("Faster initial load")}</strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("Translations rendered on server")}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">{t("Better SEO")}</strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("Fully rendered HTML with correct language")}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">
                {t("No hydration mismatch")}
              </strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("Server and client always in sync")}
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Code Example */}
      <section className="bg-slate-900 rounded-2xl border border-slate-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          {t("How to use")}
        </h2>
        <div className="bg-slate-950 rounded-xl p-6 mb-4 border border-slate-800">
          <pre className="text-slate-300 text-sm font-mono overflow-x-auto">
            <code>{`import { headers } from "next/headers";
import { getServerLanguage, createServerTranslation } from "i18nexus/server";
import { translations } from "@/lib/i18n";

// ✅ Server Component (기본값)
export default async function Page() {
  // 1. 쿠키에서 언어 가져오기
  const headersList = await headers();
  const language = getServerLanguage(headersList);
  
  // 2. 번역 함수 생성
  const t = createServerTranslation(language, translations);
  
  // 3. 사용!
  return <h1>{t("Welcome")}</h1>;
}`}</code>
          </pre>
        </div>
      </section>

      {/* Comparison */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 rounded-2xl border border-blue-800/50 p-6">
          <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
            <span className="mr-2">🖥️</span>
            {t("Server Components")}
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("Use createServerTranslation()")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("Smaller bundle size")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("Better performance")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>{t("No language switching")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">✗</span>
              <span>{t("No client interactivity")}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-2xl border border-purple-800/50 p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            {t("Client Components")}
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("Use useTranslation() hook")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("Dynamic language switching")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("Full interactivity")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">⚠</span>
              <span>{t("Larger bundle size")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">⚠</span>
              <span>{t("Needs 'use client'")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Current State */}
      <section className="mt-8 bg-slate-900 rounded-2xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          {t("Current State")}
        </h2>
        <div className="space-y-3 text-slate-300">
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg">
            <span className="font-semibold">{t("Current Language")}:</span>
            <span className="text-blue-400 font-mono">{language}</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg">
            <span className="font-semibold">{t("Component Type")}:</span>
            <span className="text-green-400 font-mono">Server Component</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg">
            <span className="font-semibold">{t("Translation Method")}:</span>
            <span className="text-purple-400 font-mono">
              createServerTranslation()
            </span>
          </div>
        </div>
      </section>

      {/* Note */}
      <div className="mt-8 bg-yellow-950/30 border border-yellow-800/50 rounded-xl p-6">
        <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
          <span className="mr-2">💡</span>
          {t("Note")}
        </h3>
        <p className="text-slate-300 text-sm">
          {t(
            "To change language on this page, use the language switcher in the header (Client Component) and the page will reload with the new language from the cookie."
          )}
        </p>
      </div>
    </main>
  );
}
