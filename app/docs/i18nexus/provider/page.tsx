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
          {t("홈")}
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
          {t("쿠키 기반 언어 영속성 및 SSR 지원을 갖춘 React Context Provider")}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-blue-400 bg-slate-950 px-2 py-1 rounded">
              I18nProvider
            </code>
            {t(
              "는 전체 애플리케이션에 국제화 컨텍스트를 제공하는 루트 컴포넌트입니다. 언어 상태를 관리하고, 쿠키 영속성을 처리하며, SSR에서 하이드레이션 불일치가 없음을 보장합니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("쿠키 기반 언어 영속성")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Next.js에서 하이드레이션 불일치 제로")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">{t("타입 안전 언어 관리")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("쿠키에서 자동 언어 감지")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("API 레퍼런스")}
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
                  {t("문자열 (필수)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t(
                  "사용할 초기 언어 코드입니다. translations 객체의 키 중 하나와 일치해야 합니다."
                )}
              </p>
              <pre className="bg-slate-950 rounded-lg p-3 mt-2 overflow-x-auto">
                <code className="text-sm text-slate-400">
                  &quot;initialLanguage=&quot;ko&quot;
                </code>
              </pre>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <code className="text-green-400 text-lg">translations</code>
                <span className="text-sm text-slate-500">
                  {t("객체 (필수)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t(
                  "지원되는 모든 언어에 대한 번역 키와 값을 포함하는 객체입니다."
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
                  {t("ReactNode (필수)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t("번역에 접근해야 하는 애플리케이션 컴포넌트들입니다.")}
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <code className="text-green-400 text-lg">
                  languageManagerOptions
                </code>
                <span className="text-sm text-slate-500">
                  {t("객체 (선택사항)")}
                </span>
              </div>
              <p className="text-slate-300">
                {t("언어 관리를 위한 추가 설정입니다.")}
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
        <h2 className="text-3xl font-bold text-white mb-6">{t("사용 예제")}</h2>

        {/* Basic Usage */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            {t("기본 설정 (클라이언트 컴포넌트만)")}
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
            {t("서버 사이드 렌더링 (Next.js App Router)")}
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
              <strong>💡 {t("왜 중요한가")}:</strong>{" "}
              {t(
                "서버에서 쿠키로부터 언어를 읽음으로써, 초기 HTML이 클라이언트가 예상하는 것과 일치하도록 보장하여 하이드레이션 불일치를 방지합니다."
              )}
            </p>
          </div>
        </div>

        {/* Advanced Usage */}
        <div>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            {t("고급 설정")}
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
        <h2 className="text-3xl font-bold text-white mb-6">{t("모범 사례")}</h2>
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("권장: 앱의 루트에 배치")}
            </h4>
            <p className="text-slate-300">
              {t(
                "모든 컴포넌트가 번역에 접근할 수 있도록 루트 레이아웃 레벨에서 항상 전체 애플리케이션을 I18nProvider로 감싸세요."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("권장: 서버 사이드 언어 감지 사용")}
            </h4>
            <p className="text-slate-300">
              {t(
                "Next.js 애플리케이션의 경우, 하이드레이션 불일치를 방지하기 위해 항상 서버에서 쿠키로부터 언어를 읽으세요."
              )}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("비권장: 여러 provider 중첩")}
            </h4>
            <p className="text-slate-300">
              {t(
                "I18nProvider 컴포넌트를 중첩하지 마세요. 루트 레벨에서 하나의 provider만 사용하세요."
              )}
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("비권장: initialLanguage를 동적으로 변경")}
            </h4>
            <p className="text-slate-300">
              {t(
                "initialLanguage prop은 한 번만 설정해야 합니다. 언어를 동적으로 변경하려면 useLanguageSwitcher의 changeLanguage()를 사용하세요."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* See Also */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">{t("참고 자료")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/i18nexus/use-translation"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              useTranslation →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("컴포넌트에서 번역을 사용하는 방법 알아보기")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus/use-language-switcher"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              useLanguageSwitcher →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("언어를 동적으로 변경하는 방법 알아보기")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
