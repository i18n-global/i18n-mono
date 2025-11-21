"use client";

import { useTranslation } from "i18nexus";

export default function CLIPage() {
  const { t } = useTranslation();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30">
          <span className="text-white font-bold text-2xl">⚡</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-4">
          {t("CLI Tools")}
        </h1>
        <p className="text-xl text-slate-300">
          {t("텍스트 래핑 및 번역 관리를 위한 강력한 자동화 도구")}
        </p>
      </div>

      {/* Installation */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{t("설치")}</h2>
        <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg border border-slate-800">
          <code>npm install -D i18nexus-tools</code>
        </pre>
      </section>

      {/* i18n-wrapper Tool */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-purple-950/50 to-purple-900/30 rounded-2xl border border-purple-800/50 p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-2xl">🔧</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">i18n-wrapper</h2>
              <p className="text-purple-300 mt-1">{t("자동 텍스트 래핑")}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 text-lg">
            {t("한국어 텍스트를 자동으로 t()로 감싸고 import를 추가합니다")}
          </p>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("기본 사용법")}
            </h3>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
              <code>{`# Wrap all Korean text in app directory
npx i18n-wrapper --pattern "app/**/*.tsx"

# Preview changes without modifying
npx i18n-wrapper --dry-run

# Target specific files
npx i18n-wrapper --pattern "app/page.tsx"`}</code>
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center mb-3">
                <span className="text-red-400 mr-2">📝</span>
                <h4 className="font-semibold text-white">{t("이전")}</h4>
              </div>
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
                <code>{t("export default function Welcome() {\n  return (\n    <div>\n      <h1>\uD658\uC601\uD569\uB2C8\uB2E4</h1>\n      <p>i18nexus \uC0AC\uC6A9\uBC95</p>\n    </div>\n  );\n}")






                  }</code>
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex items-center mb-3">
                <span className="text-green-400 mr-2">✨</span>
                <h4 className="font-semibold text-white">{t("이후")}</h4>
              </div>
              <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
                <code>{t("import { useTranslation } from \"i18nexus\";\n\nexport default function Welcome() {\n  const { t } = useTranslation();\n  return (\n    <div>\n      <h1>{t(\"\uD658\uC601\uD569\uB2C8\uB2E4\")}</h1>\n      <p>{t(\"i18nexus \uC0AC\uC6A9\uBC95\")}</p>\n    </div>\n  );\n}")









                  }</code>
              </pre>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-800/50 rounded-xl p-6 mt-6">
            <h4 className="font-semibold text-purple-300 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              {t("스마트 감지")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("JSX 요소 내 한국어 텍스트 감지")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("문자열 리터럴 내 한국어 감지")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("템플릿 리터럴 내 한국어 감지")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("이미 래핑된 텍스트 건너뛰기")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("코드 포매팅 보존")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* i18n-extractor Tool */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-green-950/50 to-emerald-900/30 rounded-2xl border border-green-800/50 p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-green-500/30">
              <span className="text-white font-bold text-2xl">🔍</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">i18n-extractor</h2>
              <p className="text-green-300 mt-1">{t("스마트 키 추출")}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 text-lg">
            {t("번역 키를 추출하고 기존 파일과 지능적으로 병합합니다")}
          </p>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("기본 사용법")}
            </h3>
            <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm border border-slate-800">
              <code>{`# Extract and merge with existing translations
npx i18n-extractor -p "app/**/*.tsx" -d "./lib/translations"

# Generate specific language files
npx i18n-extractor -l "en,ko,ja"

# Preview without modifying
npx i18n-extractor --dry-run`}</code>
            </pre>
          </div>

          <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-green-300 mb-3 flex items-center">
              <span className="mr-2">✨</span>
              {t("스마트 병합 기능")}
            </h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("기존 번역 모두 보존")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("코드에서 새 키만 추가")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("알파벳 순으로 키 정렬")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>{t("상세한 통계 표시")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Google Sheets Integration */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-yellow-950/50 to-orange-900/30 rounded-2xl border border-yellow-800/50 p-8">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-500/30">
              <span className="text-white font-bold text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {t("Google Sheets 연동")}
              </h2>
              <p className="text-yellow-300 mt-1">{t("팀 협업")}</p>
            </div>
          </div>

          <p className="text-slate-300 mb-6 text-lg">
            {t("팀 협업을 위해 Google Sheets와 번역을 동기화합니다")}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                <span className="mr-2">📤</span>
                {t("업로드")}
              </h3>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>{`npx i18n-upload \\
  --spreadsheet-id "YOUR_ID" \\
  --credentials "./credentials.json"`}</code>
              </pre>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                <span className="mr-2">📥</span>
                {t("다운로드")}
              </h3>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>{`npx i18n-download \\
  --spreadsheet-id "YOUR_ID" \\
  --credentials "./credentials.json"`}</code>
              </pre>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-300 mb-3 flex items-center">
              <span className="mr-2">⚙️</span>
              {t("설정 필요")}
            </h4>
            <ol className="space-y-2 text-slate-300 text-sm list-decimal list-inside">
              <li>{t("Google Cloud 프로젝트 생성")}</li>
              <li>{t("Google Sheets API 활성화")}</li>
              <li>{t("서비스 계정 생성")}</li>
              <li>{t("인증 정보 JSON 다운로드")}</li>
              <li>{t("서비스 계정과 시트 공유")}</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Complete Workflow */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {t("전체 워크플로우")}
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-blue-500/30">
              1
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-blue-300 text-lg mb-2">
                {t("한국어 텍스트 감싸기")}
              </h3>
              <p className="text-slate-400 mb-3">
                {t("코드에 하드코딩된 한국어 문자열을 자동으로 감쌉니다")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>npx i18n-wrapper --pattern "app/**/*.tsx"</code>
              </pre>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-indigo-500/30">
              2
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-indigo-300 text-lg mb-2">
                {t("키 추출")}
              </h3>
              <p className="text-slate-400 mb-3">
                {t("래핑된 텍스트에서 번역 파일을 생성합니다")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>
                  npx i18n-extractor -p "app/**/*.tsx" -d "./lib/translations"
                </code>
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-purple-500/30">
              3
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-purple-300 text-lg mb-2">
                {t("번역")}
              </h3>
              <p className="text-slate-400 mb-3">
                {t("en.json 파일에 영어 번역을 추가합니다")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>{t("// lib/translations/en.json\n{\n  \"\uD658\uC601\uD569\uB2C8\uB2E4\": \"Welcome\",\n  \"\uC2DC\uC791\uD558\uAE30\": \"Get Started\"\n}")



                  }</code>
              </pre>
            </div>
          </div>

          {/* Step 4 (Optional) */}
          <div className="flex items-start opacity-75">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg shadow-yellow-500/30">
              4
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-yellow-300 text-lg mb-2">
                {t("Sheets와 동기화")}{" "}
                <span className="text-sm text-slate-500">
                  ({t("선택사항")})
                </span>
              </h3>
              <p className="text-slate-400 mb-3">
                {t("팀 번역을 위해 Google Sheets에 업로드합니다")}
              </p>
              <pre className="bg-slate-950 text-slate-300 p-3 rounded-lg text-xs border border-slate-800">
                <code>npx i18n-upload --spreadsheet-id "YOUR_ID"</code>
              </pre>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-green-500/30">
              <span className="text-xl">✓</span>
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-semibold text-green-300 text-lg mb-2">
                {t("완료!")}
              </h3>
              <p className="text-slate-400">
                {t("앱이 완전히 국제화되었으며 배포할 준비가 되었습니다")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>);

}