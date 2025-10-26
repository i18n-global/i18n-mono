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
          {t("완전한 React i18n 툴킷")}
        </p>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {t("지능형 도구로 다국어화 작업을 자동화하세요")}
        </p>
      </div>

      {/* Quick Start CTA */}
      <div className="text-center mb-16">
        <Link
          href="/getting-started"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105">
          <span className="mr-3 text-2xl">🚀</span>
          {t("시작하기")}
          <span className="ml-3">→</span>
        </Link>
        <p className="text-slate-400 mt-4">
          {t("프로젝트에 i18nexus를 설정하는 완전한 단계별 가이드")}
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
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

      {/* Quick Start Section */}
      <section className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl border border-blue-800/50 p-10 mb-20">
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

      {/* Why i18nexus Section */}
      <section className="mb-20">
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

      {/* Project Structure Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-10 mb-20">
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
            <code>{`app/
├── layout.tsx          # I18nProvider 설정 (서버)
├── page.tsx            # useTranslation() (클라이언트)
├── provider/
│   └── page.tsx        # Provider 문서
├── cli/
│   └── page.tsx        # CLI 도구 문서
└── components/
    └── Header.tsx      # 언어 전환 컴포넌트

lib/
└── translations/
    ├── en.json         # 영어 번역
    └── ko.json         # 한국어 번역`}</code>
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

      {/* NPM Download Stats Section */}
      <section className="mb-20">
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
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">{t("문서")}</h2>
          <p className="text-slate-400">
            {t("상세한 사용법과 API 레퍼런스를 확인하세요")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
      </section>
    </main>
  );
}
