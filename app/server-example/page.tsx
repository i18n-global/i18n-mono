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
          {t("홈으로 돌아가기")}
        </Link>
        <h1 className="text-4xl font-bold text-white mb-4">
          {t("서버 컴포넌트 예제")}
        </h1>
        <p className="text-lg text-slate-300">
          {t(
            "이 페이지는 서버 컴포넌트입니다 - 'use client' 지시문이 필요 없습니다!"
          )}
        </p>
      </div>

      {/* Benefits */}
      <section className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-2xl border border-green-800/50 p-8 mb-8">
        <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
          <span className="mr-3 text-3xl">✅</span>
          {t("서버 컴포넌트의 이점")}
        </h2>
        <ul className="space-y-4 text-slate-300">
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">
                {t("더 작은 JavaScript 번들")}
              </strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("클라이언트로 전송되는 React Context나 훅 없음")}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">{t("더 빠른 초기 로딩")}</strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("서버에서 렌더링된 번역")}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">{t("더 나은 SEO")}</strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("올바른 언어로 완전히 렌더링된 HTML")}
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-3 mt-1 text-xl">•</span>
            <div>
              <strong className="text-white">
                {t("하이드레이션 불일치 없음")}
              </strong>
              <p className="text-sm text-slate-400 mt-1">
                {t("서버와 클라이언트가 항상 동기화됨")}
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Code Example */}
      <section className="bg-slate-900 rounded-2xl border border-slate-700 p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{t("사용 방법")}</h2>
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
            {t("서버 컴포넌트")}
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("createServerTranslation() 사용")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("더 작은 번들 크기")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("더 나은 성능")}</span>
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
        </div>

        <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-2xl border border-purple-800/50 p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            {t("클라이언트 컴포넌트")}
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("useTranslation() 훅 사용")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("동적 언어 전환")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>{t("완전한 상호작용")}</span>
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
        </div>
      </section>

      {/* Current State */}
      <section className="mt-8 bg-slate-900 rounded-2xl border border-slate-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">{t("현재 상태")}</h2>
        <div className="space-y-3 text-slate-300">
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg">
            <span className="font-semibold">{t("현재 언어")}:</span>
            <span className="text-blue-400 font-mono">{language}</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg">
            <span className="font-semibold">{t("컴포넌트 타입")}:</span>
            <span className="text-green-400 font-mono">Server Component</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg">
            <span className="font-semibold">{t("번역 방법")}:</span>
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
          {t("참고")}
        </h3>
        <p className="text-slate-300 text-sm">
          {t(
            "이 페이지에서 언어를 변경하려면 헤더의 언어 전환기(클라이언트 컴포넌트)를 사용하세요. 쿠키에서 새 언어로 페이지가 다시 로드됩니다."
          )}
        </p>
      </div>
    </main>
  );
}
