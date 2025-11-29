"use client";

import { useLanguageSwitcher } from "i18nexus";

import { i18n } from "@/locales";
import { CodeBlock } from "@/shared/ui";

export default function ProviderPage() {
  const { t } = i18n.useTranslation("provider");
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
          I18nProvider (Deprecated)
        </h1>
        <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4 mb-4">
          <p className="text-yellow-300 text-sm">
            ⚠️ I18nProvider는 더 이상 필요하지 않습니다. createI18n()을 사용하면 Provider 없이도 i18n을 사용할 수 있습니다.
          </p>
        </div>
        <p className="text-xl text-slate-300">
          {t("쿠키 기반 언어 영속성 및 SSR 지원을 갖춘 React Context Provider")}
        </p>
      </div>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">{t("주요 기능")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 border border-blue-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🍪</span>
            </div>
            <h3 className="font-semibold text-blue-300 mb-2">
              {t("쿠키 영속성")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("언어 선택을 자동으로 저장")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/50 to-indigo-900/30 border border-indigo-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="font-semibold text-indigo-300 mb-2">
              {t("SSR 준비 완료")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("완벽한 Next.js 호환성")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 border border-purple-800/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-purple-300 mb-2">
              {t("제로 하이드레이션")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("로드 시 레이아웃 이동 없음")}
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
              {t("완전한 타입 안정성 포함")}
            </p>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">{t("기본 설정")}</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900/50 to-transparent px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-sm">
                  1
                </span>
                {t("서버 레이아웃 (app/layout.tsx)")}
              </h3>
            </div>
            <div className="p-6">
              <CodeBlock language="tsx">
                {`// ❌ 옛날 방식 (Provider 필요)
import { I18nProvider } from "i18nexus";
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
}

// ✅ 새로운 방식 (Provider 불필요)
// locales/index.ts에서 createI18n으로 설정
import { i18n } from "@/locales";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}`}
              </CodeBlock>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900/50 to-transparent px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-indigo-300 flex items-center">
                <span className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3 text-sm">
                  2
                </span>
                {t("클라이언트 컴포넌트 (app/page.tsx)")}
              </h3>
            </div>
            <div className="p-6">
              <CodeBlock language="tsx">
                {`"use client";

import { i18n } from "@/locales";

export default function HomePage() {
  const { t } = i18n.useTranslation("provider");

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <button onClick={() => i18n.changeLanguage("en")}>
        English
      </button>
    </div>
  );
}`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          {t("라이브 데모")}
        </h2>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Language Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t("현재 언어")}
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
                {t("언어 전환")}
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
                    }`}
                  >
                    <div className="text-2xl mb-1">{lang.flag}</div>
                    <div className="text-sm">{lang.name}</div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-400 text-center mt-4">
                💡 {t("전환해보세요 - 쿠키에 저장됩니다!")}
              </p>
            </div>
          </div>

          {/* Translation Examples */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("번역 예제")}
            </h3>
            <div className="grid gap-3">
              {[
                t("환영합니다"),
                t("빠른 시작"),
                t("왜 i18nexus인가?"),
                t("쿠키 영속성"),
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800"
                >
                  <span className="text-slate-500 text-sm font-mono">
                    {`t("${[t("환영합니다"), t("빠른 시작"), t("왜 i18nexus인가?"), t("쿠키 영속성")][i]}")`}
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
          {t("API 레퍼런스")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">
              useTranslation()
            </h3>
            <CodeBlock language="typescript">
              {`const { t } = i18n.useTranslation("provider");

// Simple usage
t("key")
t("한국어 텍스트")`}
            </CodeBlock>
            <p className="text-slate-400 text-sm">
              {t("클라이언트 컴포넌트에서 번역 함수에 접근하기 위한 훅")}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-xl font-semibold text-indigo-300 mb-4">
              i18n.changeLanguage()
            </h3>
            <CodeBlock language="typescript">
              {`// 어디서나 직접 호출 가능
i18n.changeLanguage("en");

// 가능한 언어 목록
const languages = i18n.getAvailableLanguages();

// 현재 언어
const current = i18n.getCurrentLanguage();`}
            </CodeBlock>
            <p className="text-slate-400 text-sm">
              {t("언어 전환 및 상태 관리를 위한 메서드")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
