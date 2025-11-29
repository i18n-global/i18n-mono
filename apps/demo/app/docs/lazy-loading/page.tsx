import { i18n } from "@/locales";
import { CodeBlock } from "@/shared/ui";
import Link from "next/link";

export default async function LazyLoadingPage() {
  const { t } = await i18n.getServerTranslation("docs-lazy-loading");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← {t("홈으로 돌아가기")}
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {t("제목")}
        </h1>

        <p className="text-xl text-slate-300 mb-12">{t("설명")}</p>

        {/* 개요 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            {t("개요 제목")}
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            {t("개요 설명")}
          </p>
        </section>

        {/* 장점 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            {t("장점 제목")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>{t("장점1")}</li>
            <li>{t("장점2")}</li>
            <li>{t("장점3")}</li>
            <li>{t("장점4")}</li>
          </ul>
        </section>

        {/* 설정 방법 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">
            {t("설정 제목")}
          </h2>

          <div className="space-y-8">
            {/* 단계 1 */}
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-300">
                {t("설정 단계1 제목")}
              </h3>
              <p className="text-slate-300 mb-4">{t("설정 단계1 설명")}</p>
              <CodeBlock language="json">{`{
  "languages": ["en", "ko"],
  "localesDir": "./locales",
  "fallbackNamespace": "common",
  "lazy": true
}`}</CodeBlock>
            </div>

            {/* 단계 2 */}
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-300">
                {t("설정 단계2 제목")}
              </h3>
              <p className="text-slate-300 mb-4">{t("설정 단계2 설명")}</p>
              <CodeBlock language="bash">{`npx i18n-extractor`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* 생성된 구조 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            {t("생성된 구조 제목")}
          </h2>
          <p className="text-slate-300 mb-4">{t("생성된 구조 설명")}</p>
          <CodeBlock language="typescript">{`import { createI18n } from "i18nexus";

// 타입 안전성을 위해 모든 translations를 import (타입 정보만 사용)
import type common_en from "./common/en.json";
import type common_ko from "./common/ko.json";
import type home_en from "./home/en.json";
import type home_ko from "./home/ko.json";

// 타입 안전성을 위한 전체 translations 구조 (런타임에는 빈 객체, 타입만 제공)
export const translations = {
  common: {
    en: {} as typeof common_en,
    ko: {} as typeof common_ko,
  },
  home: {
    en: {} as typeof home_en,
    ko: {} as typeof home_ko,
  },
} as const;

// 동적 namespace 로더 - 실제로 필요할 때만 로드
async function loadNamespace(namespace: string, lang: string) {
  const module = await import(\`./\${namespace}/\${lang}.json\`);
  return module.default;
}

// createI18n with lazy loading + 타입 안전성
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  lazy: true,
  loadNamespace,
  preloadNamespaces: ["common"], // fallback namespace는 미리 로드
});`}</CodeBlock>
        </section>

        {/* 사용 예제 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-purple-300">
            {t("사용 예제 제목")}
          </h2>
          <p className="text-slate-300 mb-4">{t("사용 예제 설명")}</p>

          {/* 서버 컴포넌트 */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-3 text-blue-300">
              {t("서버 컴포넌트 제목")}
            </h3>
            <CodeBlock language="tsx">{`import { i18n } from "@/locales";

export default async function HomePage() {
  // home namespace가 자동으로 로드됩니다
  const { t } = await i18n.getServerTranslation("home");

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("설명")}</p>
    </div>
  );
}`}</CodeBlock>
          </div>

          {/* 클라이언트 컴포넌트 */}
          <div>
            <h3 className="text-2xl font-semibold mb-3 text-blue-300">
              {t("클라이언트 컴포넌트 제목")}
            </h3>
            <CodeBlock language="tsx">{`"use client";

import { i18n } from "@/locales";

export function ProductCard() {
  // product namespace가 처음 사용 시 자동으로 로드됩니다
  const { t } = i18n.useTranslation("product");

  return (
    <div>
      <h2>{t("제품명")}</h2>
      <p>{t("가격")}</p>
    </div>
  );
}`}</CodeBlock>
          </div>
        </section>

        {/* 프리로드 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            {t("프리로드 제목")}
          </h2>
          <p className="text-slate-300 mb-4">{t("프리로드 설명")}</p>
          <CodeBlock language="tsx">{`"use client";

import { i18n } from "@/locales";
import { useEffect } from "react";

export function ProductPage() {
  useEffect(() => {
    // 필요한 namespace를 미리 로드
    i18n.loadNamespace("product");
  }, []);

  const { t } = i18n.useTranslation("product");

  return (
    <div>
      <h1>{t("제품 목록")}</h1>
    </div>
  );
}`}</CodeBlock>
        </section>

        {/* 주의사항 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            {t("주의사항 제목")}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>{t("주의사항1")}</li>
            <li>{t("주의사항2")}</li>
            <li>{t("주의사항3")}</li>
          </ul>
        </section>

        {/* Eager Loading */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            {t("eager loading 제목")}
          </h2>
          <p className="text-slate-300 mb-4">{t("eager loading 설명")}</p>
          <CodeBlock language="json">{`{
  "languages": ["en", "ko"],
  "localesDir": "./locales",
  "fallbackNamespace": "common",
  "lazy": false
}`}</CodeBlock>
        </section>

        {/* 관련 문서 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-purple-300">
            관련 문서
          </h2>
          <div className="space-y-2">
            <Link
              href="/docs/i18nexus"
              className="block text-blue-400 hover:text-blue-300 transition-colors"
            >
              → i18nexus 소개
            </Link>
            <Link
              href="/docs/i18nexus-tools/extractor"
              className="block text-blue-400 hover:text-blue-300 transition-colors"
            >
              → i18n-extractor 사용법
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

