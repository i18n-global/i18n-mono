"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nexusToolsPage() {
  const { t } = useTranslation();

  const tools = [
    {
      title: t("i18n-wrapper"),
      description: t(
        "Automatically wrap Korean/English text with t() function"
      ),
      icon: "🎁",
      href: "/docs/i18nexus-tools/wrapper",
      color: "blue",
    },
    {
      title: t("i18n-extractor"),
      description: t("Extract translation keys from your codebase"),
      icon: "🔍",
      href: "/docs/i18nexus-tools/extractor",
      color: "green",
    },
    {
      title: t("i18n-upload"),
      description: t("Upload local translations to Google Sheets"),
      icon: "📤",
      href: "/docs/i18nexus-tools/upload",
      color: "purple",
    },
    {
      title: t("i18n-download"),
      description: t("Download translations from Google Sheets (incremental)"),
      icon: "📥",
      href: "/docs/i18nexus-tools/download",
      color: "orange",
    },
    {
      title: t("i18n-download-force"),
      description: t("Force overwrite all translations from Google Sheets"),
      icon: "🔄",
      href: "/docs/i18nexus-tools/download-force",
      color: "red",
    },
    {
      title: t("Google Sheets Setup"),
      description: t("Configure Google Sheets integration"),
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
          {t("홈")}
        </Link>
        <span className="text-slate-500 mx-2">/</span>
        <span className="text-slate-300">
          {t("i18nexus-tools 문서")}
        </span>
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
          {t("코드 변환부터 Google Sheets 통합까지 i18n 워크플로우를 자동화하는 강력한 CLI 도구")}
        </p>
      </div>

      {/* Installation */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <span className="mr-3">📦</span>
          {t("설치")}
        </h2>
        <div className="space-y-4">
          <div>
            <p className="text-slate-400 mb-2">
              {t("전역 설치 (권장)")}:
            </p>
            <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
              <code className="text-green-400">
                npm install -g i18nexus-tools
              </code>
            </div>
          </div>
          <div>
            <p className="text-slate-400 mb-2">
              {t("또는 설치 없이 사용")}:
            </p>
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
          {t("빠른 워크플로우")}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold mr-4">
              1
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">
                {t("설정 파일 생성")}
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
                {t("하드코딩된 문자열 자동 래핑")}
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
                {t("번역 키 추출")}
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
                {t("Google Sheets와 동기화 (선택사항)")}
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
          {t("사용 가능한 도구")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const colors =
              colorClasses[tool.color as keyof typeof colorClasses];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group bg-slate-900 rounded-xl border ${colors.border} p-6 transition-all hover:shadow-lg ${colors.shadow} hover:-translate-y-1`}>
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${colors.bg} ${colors.hover} rounded-lg mb-4 transition-colors`}>
                  <span className="text-2xl">{tool.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-slate-400 mb-4 text-sm">
                  {tool.description}
                </p>
                <div
                  className={`inline-flex items-center ${colors.text} font-medium text-sm`}>
                  {t("문서 보기")}{" "}
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
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("설정 파일")}
        </h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            {t("모든 CLI 도구는 프로젝트 루트의")}{" "}
            <code className="text-blue-400 bg-slate-950 px-2 py-1 rounded">
              i18nexus.config.json
            </code>{" "}
            {t("에서 설정을 읽습니다")}:
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
              <strong>💡 {t("팁")}:</strong>{" "}
              <code className="bg-slate-950 px-2 py-1 rounded">
                npx i18n-sheets init
              </code>{" "}
              {t("를 실행하여 이 파일을 자동으로 생성하세요")}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("주요 기능")}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🤖</span>
              {t("자동화")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("하드코딩된 문자열 자동 감지 및 래핑")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("자동 import 주입")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("공백을 유지한 스마트 키 생성")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🔄</span>
              {t("동기화 및 협업")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("Google Sheets 통합")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("증분 업데이트 (안전)")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("전체 덮어쓰기를 위한 강제 동기화")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              {t("개발자 경험")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("설정 기반, 설정 불필요")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("TypeScript 지원")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("상세한 로깅 및 오류 메시지")}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">📁</span>
              {t("파일 관리")}
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  {t("간단한 파일 구조: locales/en.json, locales/ko.json")}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("기존 번역 보존")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("새 키의 스마트 병합")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
