"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nWrapperPage() {
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
          href="/docs/i18nexus-tools"
          className="text-blue-400 hover:text-blue-300">
          {t("i18nexus-tools")}
        </Link>
        <span className="text-slate-500 mx-2">/</span>
        <span className="text-slate-300">i18n-wrapper</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/30">
          <span className="text-white font-bold text-2xl">🔧</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4">
          i18n-wrapper
        </h1>
        <p className="text-xl text-slate-400">
          {t("한국어 텍스트를 자동으로 t()로 감싸고 import를 추가합니다")}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-purple-400 bg-slate-950 px-2 py-1 rounded">
              i18n-wrapper
            </code>
            {t(
              "는 코드에서 하드코딩된 한국어 텍스트를 자동으로 감지하여 t() 함수로 래핑하고, 필요한 import 문을 추가하는 CLI 도구입니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("JSX 요소 내 한국어 텍스트 자동 감지")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("문자열 리터럴 및 템플릿 리터럴 지원")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("이미 래핑된 텍스트 자동 건너뛰기")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("useTranslation import 자동 추가")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">{t("코드 포매팅 보존")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("설치")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <div className="mb-4">
            <p className="text-slate-300 mb-2">{t("전역 설치 (권장)")}:</p>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
              <code className="text-green-400">
                npm install -g i18nexus-tools
              </code>
            </pre>
          </div>
          <div>
            <p className="text-slate-300 mb-2">{t("또는 npx로 직접 실행")}:</p>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
              <code className="text-blue-400">npx i18n-wrapper</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("기본 사용법")}
        </h2>

        <div className="space-y-6">
          {/* Basic Command */}
          <div>
            <h3 className="text-xl font-semibold text-purple-400 mb-3">
              {t("전체 앱 디렉토리 처리")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
              <code className="text-green-400">
                npx i18n-wrapper --pattern "app/**/*.tsx"
              </code>
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              {t(
                "app 디렉토리 내 모든 .tsx 파일에서 한국어 텍스트를 래핑합니다."
              )}
            </p>
          </div>

          {/* Dry Run */}
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              {t("미리보기 모드")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
              <code className="text-green-400">npx i18n-wrapper --dry-run</code>
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              {t(
                "파일을 수정하지 않고 어떤 변경사항이 있을지 미리 확인합니다."
              )}
            </p>
          </div>

          {/* Specific Files */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              {t("특정 파일만 처리")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
              <code className="text-green-400">
                npx i18n-wrapper --pattern "app/page.tsx"
              </code>
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              {t("단일 파일만 처리합니다.")}
            </p>
          </div>
        </div>
      </section>

      {/* Before/After Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("변환 예제")}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-red-400 text-2xl mr-2">📝</span>
              <h3 className="text-xl font-semibold text-red-400">
                {t("이전")}
              </h3>
            </div>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-red-500/30 overflow-x-auto">
              <code className="text-slate-300">{t("export default function Welcome() {\n  return (\n    <div>\n      <h1>\uD658\uC601\uD569\uB2C8\uB2E4</h1>\n      <p>i18nexus \uC0AC\uC6A9\uBC95</p>\n      <button>\uC2DC\uC791\uD558\uAE30</button>\n    </div>\n  );\n}")







                }</code>
            </pre>
          </div>

          {/* After */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-green-400 text-2xl mr-2">✨</span>
              <h3 className="text-xl font-semibold text-green-400">
                {t("이후")}
              </h3>
            </div>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-green-500/30 overflow-x-auto">
              <code className="text-slate-300">{t("import { useTranslation } from \"i18nexus\";\n\nexport default function Welcome() {\n  const { t } = useTranslation();\n  return (\n    <div>\n      <h1>{t(\"\uD658\uC601\uD569\uB2C8\uB2E4\")}</h1>\n      <p>{t(\"i18nexus \uC0AC\uC6A9\uBC95\")}</p>\n      <button>{t(\"\uC2DC\uC791\uD558\uAE30\")}</button>\n    </div>\n  );\n}")










                }</code>
            </pre>
          </div>
        </div>

        {/* Complex Example */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            {t("복잡한 예제")}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                {t("이전")}:
              </h4>
              <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
                <code className="text-slate-300">{t("const title = \"\uC81C\uBAA9\";\nconst msg = \\`\uC548\uB155\uD558\uC138\uC694 \\${name}\uB2D8\\`;\n\nreturn (\n  <div title=\"\uD234\uD301 \uD14D\uC2A4\uD2B8\">\n    <p>{\"\uBB38\uC790\uC5F4\"}</p>\n  </div>\n);")






                  }</code>
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">
                {t("이후")}:
              </h4>
              <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
                <code className="text-slate-300">{t("const { t } = useTranslation();\nconst title = t(\"\uC81C\uBAA9\");\nconst msg = t(\\`\uC548\uB155\uD558\uC138\uC694 \\${name}\uB2D8\\`);\n\nreturn (\n  <div title={t(\"\uD234\uD301 \uD14D\uC2A4\uD2B8\")}>\n    <p>{t(\"\uBB38\uC790\uC5F4\")}</p>\n  </div>\n);")







                  }</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("명령어 옵션")}
        </h2>
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-purple-400 text-lg">--pattern, -p</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t("처리할 파일의 glob 패턴을 지정합니다.")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm">
              <code className="text-slate-400">
                --pattern "app/**/*.{`{ts,tsx}`}"
              </code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-purple-400 text-lg">--dry-run</code>
              <span className="text-sm text-slate-500">{t("플래그")}</span>
            </div>
            <p className="text-slate-300">
              {t("실제로 파일을 수정하지 않고 변경사항만 미리 확인합니다.")}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-purple-400 text-lg">--help, -h</code>
              <span className="text-sm text-slate-500">{t("플래그")}</span>
            </div>
            <p className="text-slate-300">{t("도움말 메시지를 표시합니다.")}</p>
          </div>
        </div>
      </section>

      {/* Smart Detection */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("스마트 감지 기능")}
        </h2>
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-700/50 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">
            {t("자동으로 처리되는 경우")}:
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✓</span>
              <div>
                <strong>{t("JSX 텍스트 노드")}</strong>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-1 border border-slate-800">
                  <code>{t("<div>\uD55C\uAD6D\uC5B4 \uD14D\uC2A4\uD2B8</div> \u2192 <div>{t(\"\uD55C\uAD6D\uC5B4 \uD14D\uC2A4\uD2B8\")}</div>")}</code>
                </pre>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✓</span>
              <div>
                <strong>{t("JSX 속성값")}</strong>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-1 border border-slate-800">
                  <code>{t("<div title=\"\uC81C\uBAA9\"> \u2192 <div title={t(\"\uC81C\uBAA9\")}>")}</code>
                </pre>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✓</span>
              <div>
                <strong>{t("문자열 리터럴")}</strong>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-1 border border-slate-800">
                  <code>{t("const text = \"\uC548\uB155\"; \u2192 const text = t(\"\uC548\uB155\");")}</code>
                </pre>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 mt-1">✓</span>
              <div>
                <strong>{t("템플릿 리터럴")}</strong>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-1 border border-slate-800">
                  <code>{t("const msg = \\`\uC548\uB155 \\${name}\\`; \u2192 const msg = t(\\`\uC548\uB155 \\${name}\\`);")}</code>
                </pre>
              </div>
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-purple-300 mb-4 mt-6">
            {t("자동으로 건너뛰는 경우")}:
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">⊗</span>
              <span>{t("이미 t()로 래핑된 텍스트")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">⊗</span>
              <span>{t("영어만 포함된 텍스트")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">⊗</span>
              <span>{t("숫자나 특수문자만 포함된 텍스트")}</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-3">⊗</span>
              <span>{t("주석 내부의 텍스트")}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("모범 사례")}</h2>
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("먼저 dry-run으로 확인하기")}
            </h4>
            <p className="text-slate-300 mb-2">
              {t(
                "실제 파일을 수정하기 전에 --dry-run 옵션으로 변경사항을 미리 확인하세요."
              )}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm">
              <code className="text-green-400">npx i18n-wrapper --dry-run</code>
            </pre>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("버전 관리 시스템 사용")}
            </h4>
            <p className="text-slate-300">
              {t(
                "Git 등의 버전 관리를 사용하여 변경사항을 되돌릴 수 있도록 준비하세요."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("작은 범위부터 시작")}
            </h4>
            <p className="text-slate-300">
              {t(
                "처음에는 단일 파일이나 작은 디렉토리부터 시작하여 결과를 확인하세요."
              )}
            </p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              {t("수동 검토 필요")}
            </h4>
            <p className="text-slate-300">
              {t(
                "자동 변환 후에는 항상 변경된 파일들을 검토하여 의도하지 않은 변경이 없는지 확인하세요."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-6">{t("다음 단계")}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/i18nexus-tools/extractor"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-green-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">🔍</span>
              i18n-extractor →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("래핑된 텍스트에서 번역 키를 추출하세요")}
            </p>
          </Link>
          <Link
            href="/cli"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">⚡</span>
              {t("전체 워크플로우")} →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("전체 CLI 도구 워크플로우 보기")}
            </p>
          </Link>
        </div>
      </section>
    </main>);

}