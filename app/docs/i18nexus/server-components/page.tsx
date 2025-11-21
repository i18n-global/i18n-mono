"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function ServerComponentsPage() {
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
        <span className="text-slate-300">Server Components</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Server Components
        </h1>
        <p className="text-xl text-slate-400">
          {t("Next.js 서버 컴포넌트에서 i18nexus 사용하기")}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            {t(
              "Next.js의 서버 컴포넌트에서는 useTranslation 훅을 사용할 수 없습니다. 대신 서버 전용 함수를 사용해야 합니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("더 작은 JavaScript 번들")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("더 빠른 초기 로딩")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("더 나은 SEO")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-400 mr-2">⚠</span>
              <span className="text-slate-300">
                {t("동적 언어 전환 불가")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Server Translation API */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("서버 번역 API")}
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">
              getServerLanguage()
            </h3>
            <p className="text-slate-300 mb-4">
              {t("서버에서 쿠키로부터 현재 언어를 읽어옵니다.")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-800">
              <code className="text-sm text-slate-300">{`import { headers } from "next/headers";
import { getServerLanguage } from "i18nexus/server";

export default async function Page() {
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  console.log(language); // "ko" or "en"
}`}</code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">
              createServerTranslation()
            </h3>
            <p className="text-slate-300 mb-4">
              {t("서버에서 사용할 번역 함수를 생성합니다.")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto border border-slate-800">
              <code className="text-sm text-slate-300">{`import { createServerTranslation } from "i18nexus/server";
import { translations } from "@/locales";

export default async function Page() {
  const language = getServerLanguage(headersList);
  const t = createServerTranslation(language, translations);

  return <h1>{t("Welcome")}</h1>;
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Complete Example */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("완전한 예제")}
        </h2>

        <div className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
          <pre className="text-sm text-slate-300">
            <code>{`import { headers } from "next/headers";
import { getServerLanguage, createServerTranslation } from "i18nexus/server";
import { translations } from "@/locales";

// ✅ 서버 컴포넌트 (기본값)
export default async function ServerPage() {
  // 1. 쿠키에서 언어 가져오기
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  // 2. 번역 함수 생성
  const t = createServerTranslation(language, translations);

  // 3. 번역 사용
  return (
    <div>
      <h1>{t("Welcome")}</h1>
      <p>{t("This is a server component")}</p>
      <p>Current language: {language}</p>
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>

      {/* Benefits vs Trade-offs */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("서버 컴포넌트 vs 클라이언트 컴포넌트")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-950/50 to-blue-900/30 rounded-xl border border-blue-800/50 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <span className="mr-2">🖥️</span>
              {t("서버 컴포넌트")}
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("더 작은 번들 크기")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("더 빠른 초기 로딩")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("더 나은 SEO")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("하이드레이션 불일치 없음")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span>{t("언어 전환 불가")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-red-400 mr-2">✗</span>
                <span>{t("클라이언트 상호작용 불가")}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
              <code className="text-xs text-blue-300">
                createServerTranslation()
              </code>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-xl border border-purple-800/50 p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              {t("클라이언트 컴포넌트")}
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("동적 언어 전환")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("완전한 상호작용")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("React 훅 사용 가능")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("이벤트 핸들러 사용")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">⚠</span>
                <span>{t("더 큰 번들 크기")}</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-400 mr-2">⚠</span>
                <span>{t("'use client' 필요")}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
              <code className="text-xs text-purple-300">
                useTranslation()
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("언제 사용해야 하나요?")}
        </h2>

        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("서버 컴포넌트 사용")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm ml-6">
              <li className="list-disc">{t("정적 콘텐츠 (블로그, 문서)")}</li>
              <li className="list-disc">{t("SEO가 중요한 페이지")}</li>
              <li className="list-disc">{t("초기 로딩 속도가 중요한 경우")}</li>
              <li className="list-disc">{t("사용자 상호작용이 필요 없는 페이지")}</li>
            </ul>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
              <span className="mr-2">⚡</span>
              {t("클라이언트 컴포넌트 사용")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm ml-6">
              <li className="list-disc">{t("언어 선택기/전환 버튼")}</li>
              <li className="list-disc">{t("사용자 입력이 필요한 폼")}</li>
              <li className="list-disc">{t("동적으로 변경되는 콘텐츠")}</li>
              <li className="list-disc">{t("React 훅이 필요한 경우")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Hybrid Approach */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("하이브리드 접근법")}
        </h2>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-4">
          <p className="text-slate-300 mb-4">
            {t("서버 컴포넌트와 클라이언트 컴포넌트를 함께 사용하면 최적의 성능을 얻을 수 있습니다.")}
          </p>
        </div>

        <div className="bg-slate-950 rounded-lg p-6 overflow-x-auto border border-slate-800">
          <pre className="text-sm text-slate-300">
            <code>{`// app/page.tsx (서버 컴포넌트)
import { headers } from "next/headers";
import { getServerLanguage, createServerTranslation } from "i18nexus/server";
import { translations } from "@/locales";
import LanguageSwitcher from "./LanguageSwitcher"; // 클라이언트 컴포넌트

export default async function HomePage() {
  const headersList = await headers();
  const language = getServerLanguage(headersList);
  const t = createServerTranslation(language, translations);

  return (
    <div>
      {/* 클라이언트 컴포넌트: 언어 전환 */}
      <LanguageSwitcher />

      {/* 서버 컴포넌트: 정적 콘텐츠 */}
      <h1>{t("Welcome")}</h1>
      <p>{t("This content is rendered on the server")}</p>
    </div>
  );
}

// app/LanguageSwitcher.tsx (클라이언트 컴포넌트)
"use client";

import { useLanguageSwitcher } from "i18nexus";

export default function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, availableLanguages } =
    useLanguageSwitcher();

  return (
    <div>
      {availableLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}`}</code>
          </pre>
        </div>
      </section>

      {/* Important Notes */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("중요한 참고사항")}
        </h2>

        <div className="space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              {t("하이드레이션 불일치 방지")}
            </h4>
            <p className="text-slate-300 mb-2">
              {t("서버와 클라이언트가 같은 언어를 사용하도록 쿠키에서 언어를 읽어야 합니다.")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
              <code className="text-sm text-slate-400">{`// layout.tsx에서
const headersList = await headers();
const language = getServerLanguage(headersList);

<I18nProvider initialLanguage={language}>`}</code>
            </pre>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
              <span className="mr-2">🔄</span>
              {t("언어 변경 시 페이지 리로드")}
            </h4>
            <p className="text-slate-300">
              {t(
                "서버 컴포넌트는 언어 변경 시 자동으로 업데이트되지 않습니다. 클라이언트 컴포넌트에서 언어를 변경하면 쿠키가 업데이트되고, 페이지를 새로고침하면 서버 컴포넌트도 새 언어로 렌더링됩니다."
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
              {t("클라이언트 컴포넌트에서 번역 사용하기")}
            </p>
          </Link>
          <Link
            href="/server-example"
            className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-green-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2">
              {t("라이브 예제")} →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("서버 컴포넌트 실제 동작 확인하기")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
