"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nUploadPage() {
  const { t } = useTranslation("docs");

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
        <span className="text-slate-300">i18n-upload</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-6 shadow-lg shadow-yellow-500/30">
          <span className="text-white font-bold text-2xl">📤</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4">i18n-upload</h1>
        <p className="text-xl text-slate-400">
          {t("로컬 번역 파일을 Google Sheets로 업로드합니다")}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-yellow-400 bg-slate-950 px-2 py-1 rounded">
              i18n-upload
            </code>
            {t(
              "는 로컬의 번역 JSON 파일들을 Google Sheets로 업로드하는 CLI 도구입니다. 팀원들과 번역 작업을 협업하기 위한 첫 단계입니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("모든 언어 파일을 한 번에 업로드")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("자동으로 Sheets 포맷 생성")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("기존 Sheets 데이터 완전 대체")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("기본 사용법")}
        </h2>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-3">
            {t("설정 파일 사용")}
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            {t("i18nexus.config.json에 Google Sheets 정보가 설정되어 있다면:")}
          </p>
          <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
            <code className="text-green-400">npx i18n-upload</code>
          </pre>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-3">
            {t("명령줄 옵션 사용")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
            <code className="text-green-400">
              {`npx i18n-upload \\
  --spreadsheet-id "YOUR_SPREADSHEET_ID" \\
  --credentials "./credentials.json"`}
            </code>
          </pre>
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
              <code className="text-yellow-400 text-lg">--spreadsheet-id</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t("Google Sheets의 Spreadsheet ID (필수)")}
            </p>
            <p className="text-slate-400 text-sm">
              {t(
                "Sheets URL에서 확인: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit"
              )}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-yellow-400 text-lg">--credentials</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t("Google Cloud 서비스 계정 인증 정보 JSON 파일 경로 (필수)")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm mt-2">
              <code className="text-slate-400">
                --credentials "./credentials.json"
              </code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-yellow-400 text-lg">--sheet-name</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t('업로드할 시트 이름 (기본값: "Translations")')}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm mt-2">
              <code className="text-slate-400">
                --sheet-name "MyTranslations"
              </code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-yellow-400 text-lg">--locales-dir</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t('번역 파일 디렉토리 (기본값: "./locales")')}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm mt-2">
              <code className="text-slate-400">
                --locales-dir "./src/translations"
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* What happens */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("업로드 프로세스")}
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                {t("로컬 파일 읽기")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("locales 디렉토리의 모든 JSON 파일을 읽어옵니다.")}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                {t("데이터 변환")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t(
                  "JSON 데이터를 Google Sheets 형식으로 변환합니다. 첫 행은 언어 코드, 첫 열은 번역 키가 됩니다."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                {t("Sheets 업데이트")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t(
                  "Google Sheets의 기존 데이터를 지우고 새 데이터로 완전히 대체합니다."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                {t("완료")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("업로드 완료 메시지와 함께 통계를 표시합니다.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("주의사항")}</h2>
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-red-300 mb-3 flex items-center">
            <span className="mr-2">⚠️</span>
            {t("데이터 덮어쓰기")}
          </h4>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>
                {t(
                  "i18n-upload는 Google Sheets의 기존 데이터를 완전히 삭제하고 새 데이터로 대체합니다"
                )}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>
                {t("Sheets에서 직접 수정한 번역이 있다면 먼저 백업하세요")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>
                {t("일반적으로 프로젝트 초기 설정 시 한 번만 사용합니다")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>
                {t(
                  "이후에는 i18n-download를 사용하여 Sheets에서 번역을 가져옵니다"
                )}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Example Output */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("예제 출력")}</h2>
        <pre className="bg-slate-950 rounded-lg p-6 text-sm border border-slate-800 overflow-x-auto">
          <code className="text-slate-300">
            {`$ npx i18n-upload --spreadsheet-id "1abc...xyz"

📤 Uploading translations to Google Sheets...

📁 Reading local files...
   ✓ locales/ko.json (125 keys)
   ✓ locales/en.json (125 keys)

🔄 Converting to Sheets format...
   Languages: ko, en
   Total keys: 125

📊 Updating Google Sheets...
   Spreadsheet: "i18n Translations"
   Sheet: "Translations"
   ✓ Cleared existing data
   ✓ Uploaded 126 rows (including header)

✅ Upload complete!
   🔗 View: https://docs.google.com/spreadsheets/d/1abc...xyz`}
          </code>
        </pre>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("모범 사례")}</h2>
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("초기 설정에만 사용")}
            </h4>
            <p className="text-slate-300">
              {t(
                "프로젝트 시작 시 한 번만 업로드하고, 이후에는 Sheets에서 번역 작업을 진행하세요."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("업로드 전 확인")}
            </h4>
            <p className="text-slate-300">
              {t("로컬 번역 파일이 최신 상태인지 확인 후 업로드하세요.")}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("팀원과 공유")}
            </h4>
            <p className="text-slate-300">
              {t(
                "업로드 후 Sheets URL을 팀원들과 공유하여 함께 번역 작업을 시작하세요."
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
            href="/docs/i18nexus-tools/download"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">📥</span>
              i18n-download →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Sheets에서 번역을 안전하게 다운로드하는 방법")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus-tools/google-sheets"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-yellow-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">📊</span>
              Google Sheets {t("설정")} →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("Google Sheets 초기 설정 가이드 보기")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
