"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";
import DownloadStats from "./components/DownloadStats";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section - Enhanced with stronger value proposition */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Logo Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-2xl shadow-blue-500/50 hover:scale-110 transition-transform">
            <span className="text-white font-bold text-4xl">i18</span>
          </div>

          {/* Main Headline - Why Statement */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 mb-6 leading-tight">
            {t("글로벌 앱, 번역 혼돈 끝")}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-3xl text-slate-300 mb-6 font-light max-w-4xl mx-auto">
            {t("더 이상 수동 번역 관리에 시간을 낭비하지 마세요")}
          </p>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("자동화된 워크플로우로 다국어 지원을 1분 안에 설정하세요")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/getting-started"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all hover:scale-105 group">
              {t("무료로 시작하기")}
              <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/docs/i18nexus"
              className="inline-flex items-center px-10 py-5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-lg rounded-2xl border-2 border-slate-700 hover:border-blue-500 transition-all">
              {t("문서 보기")}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-8 justify-center items-center text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span>{t("5분 설치")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span>{t("무료 오픈소스")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-xl">✓</span>
              <span>{t("TypeScript 지원")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof Section - Moved to top */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              {t("신뢰받는 i18n 솔루션")}
            </h2>
            <p className="text-slate-400">
              {t("전 세계 개발자들이 선택한 번역 관리 도구")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
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

          <div className="flex flex-wrap gap-8 justify-center items-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-1">100+</div>
              <div className="text-sm text-slate-400">{t("프로젝트 사용")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-1">⭐ 1k+</div>
              <div className="text-sm text-slate-400">GitHub Stars</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-1">24/7</div>
              <div className="text-sm text-slate-400">{t("오픈소스 지원")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Dark background to emphasize pain points */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
              <span className="text-red-400 font-semibold">{t("기존 방식의 문제")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("이런 고민, 하고 계신가요?")}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              {t("전통적인 i18n 방식은 개발 속도를 늦추고 유지보수를 어렵게 만듭니다")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-red-900/30 p-8 hover:border-red-500/50 transition-colors">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">😰</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-3">
                {t("수동 텍스트 래핑")}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {t("모든 텍스트를 일일이 t() 함수로 감싸는 반복 작업. 실수하면 번역이 누락됩니다.")}
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-red-900/30 p-8 hover:border-red-500/50 transition-colors">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🐛</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-3">
                {t("하이드레이션 오류")}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {t("SSR 환경에서 서버와 클라이언트 언어가 달라 발생하는 hydration mismatch 에러.")}
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-red-900/30 p-8 hover:border-red-500/50 transition-colors">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">📁</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-3">
                {t("복잡한 파일 관리")}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {t("여러 JSON 파일을 수동으로 관리하고 동기화해야 하는 번거로움.")}
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur rounded-2xl border border-red-900/30 p-8 hover:border-red-500/50 transition-colors">
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-3">
                {t("복잡한 설정")}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {t("i18next 설정, 라우팅, 미들웨어 등 초기 셋업이 복잡하고 시간이 오래 걸립니다.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section - Bright background for positive transformation */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full mb-6">
              <span className="text-green-600 font-semibold">{t("i18nexus 솔루션")}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t("모든 문제를 한 번에 해결합니다")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("i18nexus는 자동화와 최적화로 번역 관리의 모든 고민을 끝냅니다")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                {t("CLI로 자동 텍스트 래핑")}
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                {t("i18n-wrapper CLI가 코드를 분석해 자동으로 번역 함수를 적용합니다.")}
              </p>
              <pre className="bg-slate-100 text-slate-800 p-3 rounded-lg text-xs overflow-x-auto">
                <code>$ npx i18nexus-tools wrapper</code>
              </pre>
            </div>

            <div className="bg-white rounded-2xl border border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 mb-3">
                {t("하이드레이션 문제 제로")}
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {t("쿠키 기반 언어 관리로 서버와 클라이언트가 항상 동일한 언어를 사용합니다.")}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-purple-600 mb-3">
                {t("Google Sheets 연동")}
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {t("번역 파일을 Google Sheets로 관리하고 자동 동기화할 수 있습니다.")}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                {t("기본값으로 간단한 설정")}
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {t("3줄의 코드만으로 즉시 시작. 복잡한 설정은 필요 없습니다.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase - Enhanced grid with visual hierarchy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t("핵심 기능")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("개발자를 위해 설계된 완전한 i18n 도구 모음")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("자동 번역 래핑")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("CLI가 자동으로 텍스트를 감지하고 번역 함수를 적용합니다")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("타입 안전성")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("TypeScript 완벽 지원으로 컴파일 타임 오류 방지")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("실시간 동기화")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("Google Sheets와 양방향 자동 동기화")}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {t("SSR 최적화")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("Next.js App Router와 완벽 호환, 하이드레이션 안정성")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Demo Section - Enhanced with real usage examples */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t("정말 1분이면 됩니다")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("복잡한 설정 없이 3단계로 즉시 시작하세요")}
            </p>
          </div>

          <div className="space-y-8">
            {/* Step 1: Install */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {t("설치")} <span className="text-slate-400 text-base font-normal">({t("10초")})</span>
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {t("npm으로 i18nexus를 설치합니다")}
                  </p>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">
                    <code className="text-sm font-mono">$ npm install i18nexus</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2: Setup Provider */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {t("Provider 설정")} <span className="text-slate-400 text-base font-normal">({t("30초")})</span>
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {t("layout.tsx에 I18nProvider를 추가합니다")}
                  </p>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">
                    <code className="text-sm font-mono">{`// app/layout.tsx
import { I18nProvider } from 'i18nexus';
import { translations } from '@/locales';

export default function RootLayout({ children }) {
  return (
    <I18nProvider translations={translations}>
      {children}
    </I18nProvider>
  );
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3: Use Hook */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {t("사용하기")} <span className="text-slate-400 text-base font-normal">({t("20초")})</span>
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {t("컴포넌트에서 useTranslation() 훅을 사용합니다")}
                  </p>
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">
                    <code className="text-sm font-mono">{`// app/page.tsx
"use client";
import { useTranslation } from 'i18nexus';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("안녕하세요!")}</h1>
      <p>{t("다국어 지원이 활성화되었습니다")}</p>
    </div>
  );
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Completion Badge */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-center text-white shadow-2xl">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">{t("완료!")}</h3>
              <p className="text-green-50 text-lg">
                {t("이제 다국어 지원이 활성화되었습니다")}
              </p>
            </div>
          </div>

          {/* CTA After Code Demo */}
          <div className="text-center mt-12">
            <Link
              href="/getting-started"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
              {t("상세 가이드 보기")}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Old Feature Cards - Will be removed */}
      <div className="hidden grid md:grid-cols-2 gap-8 mb-20">
        <Link
          href="/docs/i18nexus"
          className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
          <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <span className="text-3xl">🎨</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {t("i18nexus 라이브러리")}
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {t("I18nProvider, 훅, 서버 컴포넌트를 지원하는 React 라이브러리")}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("쿠키 기반 영속성")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("하이드레이션 불일치 제로")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("TypeScript 지원")}
            </div>
          </div>
          <div className="mt-6 inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300">
            {t("문서 보기")}{" "}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>

        <Link
          href="/docs/i18nexus-tools"
          className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1">
          <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {t("CLI 도구")}
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {t("텍스트 래핑과 번역 관리를 위한 강력한 자동화 도구")}
          </p>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("한국어 텍스트 자동 래핑")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("번역 키 추출")}
            </div>
            <div className="flex items-center text-sm text-slate-300">
              <span className="text-green-400 mr-2">✓</span>
              {t("Google Sheets 동기화")}
            </div>
          </div>
          <div className="mt-6 inline-flex items-center text-indigo-400 font-medium group-hover:text-indigo-300">
            {t("문서 보기")}{" "}
            <span className="ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      </div>

      {/* Quick Start Section - Replaced by Code Demo, hidden */}
      <section className="hidden bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl border border-blue-800/50 p-10 mb-20">
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-2xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{t("빠른 시작")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t("설치")}
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
              {t("Provider 설정")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("layout.tsx에 I18nProvider 추가")}
            </p>
          </div>

          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t("훅 사용")}
            </h3>
            <p className="text-sm text-slate-400">
              {t("컴포넌트에서 useTranslation() 사용")}
            </p>
          </div>
        </div>
      </section>

      {/* Why i18nexus Section - Replaced by Problem/Solution, hidden */}
      <section className="hidden mb-20">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">
          {t("왜 i18nexus인가?")}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-2xl border border-red-900/50 p-8">
            <h3 className="text-xl font-semibold text-red-400 mb-6 flex items-center">
              <span className="mr-2">❌</span>
              {t("전통적인 i18n 문제점")}
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("수동 텍스트 래핑")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("SSR에서의 하이드레이션 문제")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("복잡한 설정")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-0.5">•</span>
                <span>{t("수동 파일 관리")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-green-900/50 p-8">
            <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
              <span className="mr-2">✅</span>
              {t("i18nexus 솔루션")}
            </h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("CLI로 자동 텍스트 래핑")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("하이드레이션 문제 제로")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("기본값으로 간단한 설정")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-0.5">•</span>
                <span>{t("스마트 파일 병합")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Project Structure Section - Hidden for cleaner flow */}
      <section className="hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-10 mb-20">
        <div className="flex items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
            <span className="text-white font-bold text-2xl">📁</span>
          </div>
          <h2 className="text-3xl font-bold text-white">{t("권장 구조")}</h2>
        </div>

        <p className="text-slate-300 mb-6 text-lg">
          {t("이 데모는 권장되는 Next.js App Router 구조를 따릅니다:")}
        </p>

        <div className="bg-slate-950 rounded-xl p-6 mb-8 border border-slate-800">
          <pre className="text-slate-300 text-sm font-mono">
            <code>{`
├── locales/
│   ├── index.ts            
│   ├── en.json             # 영어 번역
│   └── ko.json             # 한국어 번역
└── i18nexus.config.json    # i18nexus 설정 파일`}</code>
          </pre>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-950/30 border border-blue-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
              <span className="mr-2">🔧</span>
              {t("서버 컴포넌트")}
            </h4>
            <p className="text-slate-400 text-sm">
              {t("layout.tsx에서 쿠키 감지와 함께 I18nProvider 설정")}
            </p>
          </div>
          <div className="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-indigo-300 mb-2 flex items-center">
              <span className="mr-2">⚡</span>
              {t("클라이언트 컴포넌트")}
            </h4>
            <p className="text-slate-400 text-sm">
              {t("useTranslation() 훅과 함께 'use client' 사용")}
            </p>
          </div>
          <div className="bg-purple-950/30 border border-purple-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-purple-300 mb-2 flex items-center">
              <span className="mr-2">📄</span>
              {t("번역 파일")}
            </h4>
            <p className="text-slate-400 text-sm">
              {t("lib/translations/에 JSON 형식으로 저장")}
            </p>
          </div>
        </div>
      </section>

      {/* NPM Download Stats Section - Moved to top, hidden here */}
      <section className="hidden mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            {t("다운로드 통계")}
          </h2>
          <p className="text-slate-400">
            {t("npm 레지스트리의 실시간 다운로드 통계")}
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
            {t("npm 공개 API에서 매시간 업데이트되는 데이터")}
          </p>
        </div>
      </section>

      {/* Documentation Links Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("더 알아보기")}</h2>
            <p className="text-lg text-slate-400">
              {t("상세한 사용법과 API 레퍼런스를 확인하세요")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* i18nexus Library Docs */}
          <Link
            href="/docs/i18nexus"
            className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 p-8 transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <span className="text-white font-bold text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {t("i18nexus 라이브러리")}
              </h3>
            </div>
            <p className="text-slate-400 mb-4">
              {t(
                "쿠키 기반 언어 관리 및 SSR 지원을 갖춘 완전한 React i18n 툴킷"
              )}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                I18nProvider
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                useTranslation
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                {t("서버 컴포넌트")}
              </span>
            </div>
            <div className="flex items-center text-blue-400 font-medium">
              {t("문서 보기")}
              <span className="ml-2 group-hover:translate-x-2 transition-transform">
                →
              </span>
            </div>
          </Link>

          {/* i18nexus-tools CLI Docs */}
          <Link
            href="/docs/i18nexus-tools"
            className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 p-8 transition-all hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
                <span className="text-white font-bold text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                i18nexus-tools CLI
              </h3>
            </div>
            <p className="text-slate-400 mb-4">
              {t(
                "코드 변환부터 Google Sheets 통합까지 i18n 워크플로우를 자동화하는 강력한 CLI 도구"
              )}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                i18n-wrapper
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                i18n-extractor
              </span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
                Google Sheets
              </span>
            </div>
            <div className="flex items-center text-indigo-400 font-medium">
              {t("문서 보기")}
              <span className="ml-2 group-hover:translate-x-2 transition-transform">
                →
              </span>
            </div>
          </Link>
        </div>
        </div>
      </section>

      {/* Final CTA Section - Strong call to action */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("지금 바로 시작하세요")}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t("수천 명의 개발자가 i18nexus로 번역 관리를 자동화하고 있습니다")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/getting-started"
              className="inline-flex items-center px-10 py-5 bg-white hover:bg-blue-50 text-blue-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/30 transition-all hover:scale-105 group">
              {t("무료로 시작하기")}
              <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/docs/i18nexus"
              className="inline-flex items-center px-10 py-5 bg-transparent hover:bg-white/10 text-white font-semibold text-lg rounded-2xl border-2 border-white/30 hover:border-white transition-all">
              {t("문서 둘러보기")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center items-center text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-white text-xl">✓</span>
              <span>{t("신용카드 불필요")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-xl">✓</span>
              <span>{t("오픈소스")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-xl">✓</span>
              <span>{t("활발한 커뮤니티")}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
