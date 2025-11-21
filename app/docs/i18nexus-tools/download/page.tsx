"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nDownloadPage() {
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
        <span className="text-slate-300">i18n-download</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
          <span className="text-white font-bold text-2xl">📥</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4">
          i18n-download
        </h1>
        <p className="text-xl text-slate-400">
          {t("Google Sheets의 번역을 안전하게 로컬로 다운로드합니다")}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-blue-400 bg-slate-950 px-2 py-1 rounded">
              i18n-download
            </code>
            {t(
              "는 Google Sheets의 번역을 로컬 JSON 파일로 다운로드하는 CLI 도구입니다. 증분 업데이트 방식으로 기존 번역을 보존하며 안전하게 병합합니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">{t("기존 로컬 번역 보존")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("Sheets의 변경사항만 안전하게 병합")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">{t("자동 충돌 해결")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("상세한 변경 내역 표시")}
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
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            {t("설정 파일 사용")}
          </h3>
          <p className="text-slate-400 text-sm mb-3">
            {t("i18nexus.config.json에 Google Sheets 정보가 설정되어 있다면:")}
          </p>
          <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
            <code className="text-green-400">npx i18n-download</code>
          </pre>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">
            {t("명령줄 옵션 사용")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
            <code className="text-green-400">
              {`npx i18n-download \\
  --spreadsheet-id "YOUR_SPREADSHEET_ID" \\
  --credentials "./credentials.json"`}
            </code>
          </pre>
        </div>
      </section>

      {/* How it Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("작동 방식")}</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                {t("Sheets 데이터 가져오기")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("Google Sheets에서 모든 번역 데이터를 읽어옵니다.")}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                {t("로컬 데이터 읽기")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("기존 로컬 번역 파일을 읽어옵니다.")}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                {t("스마트 병합")}
              </h3>
              <p className="text-slate-400 text-sm mb-2">
                {t("두 데이터를 지능적으로 병합합니다:")}
              </p>
              <ul className="space-y-1 text-slate-400 text-sm ml-4">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>{t("Sheets에 있는 키: 값을 업데이트")}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>{t("로컬에만 있는 키: 그대로 유지")}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>{t("Sheets에 새로 추가된 키: 로컬에 추가")}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                {t("파일 저장")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t(
                  "병합된 결과를 로컬 파일에 저장하고 변경 내역을 표시합니다."
                )}
              </p>
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
              <code className="text-blue-400 text-lg">--spreadsheet-id</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300">
              {t("Google Sheets의 Spreadsheet ID (필수)")}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-blue-400 text-lg">--credentials</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300">
              {t("Google Cloud 서비스 계정 인증 정보 JSON 파일 경로 (필수)")}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-blue-400 text-lg">--sheet-name</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300">
              {t('읽을 시트 이름 (기본값: "Translations")')}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-blue-400 text-lg">--locales-dir</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300">
              {t('번역 파일 저장 디렉토리 (기본값: "./locales")')}
            </p>
          </div>
        </div>
      </section>

      {/* Example Output */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("예제 출력")}</h2>
        <pre className="bg-slate-950 rounded-lg p-6 text-sm border border-slate-800 overflow-x-auto">
          <code className="text-slate-300">
            {`$ npx i18n-download --spreadsheet-id "1abc...xyz"

📥 Downloading translations from Google Sheets...

📊 Reading from Sheets...
   Spreadsheet: "i18n Translations"
   Sheet: "Translations"
   ✓ Found 130 translation keys
   Languages: ko, en

📁 Reading local files...
   ✓ locales/ko.json (125 keys)
   ✓ locales/en.json (125 keys)

🔄 Merging translations...
   ✓ Updated: 3 keys
   ✓ Added: 5 new keys
   ✓ Preserved: 122 local keys

💾 Saving files...
   ✓ locales/ko.json (130 keys)
   ✓ locales/en.json (130 keys)

✅ Download complete!
   Total keys: 130
   Changes: +5 new, ~3 updated`}
          </code>
        </pre>
      </section>

      {/* Safety Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("안전 기능")}</h2>
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700/50 p-6">
          <h3 className="text-lg font-semibold text-green-300 mb-4">
            {t("데이터 손실 방지")}
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("로컬 번역 보존")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t("로컬에만 있는 번역 키는 절대 삭제되지 않습니다.")}
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("충돌 자동 해결")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t("같은 키가 양쪽에 있으면 Sheets의 값을 우선합니다.")}
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("백업 권장")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t(
                    "Git 등의 버전 관리를 사용하면 언제든 이전 상태로 복구할 수 있습니다."
                  )}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* vs download-force */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          i18n-download vs i18n-download-force
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center">
              <span className="mr-2">📥</span>
              i18n-download
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>{t("증분 업데이트")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>{t("로컬 번역 보존")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>{t("안전한 병합")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">✓</span>
                <span>{t("일상적으로 사용")}</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-blue-950/50 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 {t("대부분의 경우 이것을 사용하세요")}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-red-300 mb-4 flex items-center">
              <span className="mr-2">🔄</span>
              i18n-download-force
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>{t("전체 덮어쓰기")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>{t("로컬 번역 삭제")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>{t("Sheets = 단일 진실 공급원")}</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 mr-2">•</span>
                <span>{t("주의해서 사용")}</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-red-950/50 rounded-lg">
              <p className="text-xs text-red-300">
                ⚠️ {t("특별한 경우에만 사용하세요")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("모범 사례")}</h2>
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("정기적으로 다운로드")}
            </h4>
            <p className="text-slate-300">
              {t(
                "번역가가 작업을 완료하면 정기적으로 다운로드하여 번역을 최신 상태로 유지하세요."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("Git 커밋")}
            </h4>
            <p className="text-slate-300">
              {t("다운로드 후 변경사항을 Git에 커밋하여 팀원들과 공유하세요.")}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("변경 내역 검토")}
            </h4>
            <p className="text-slate-300">
              {t(
                "다운로드 후 출력되는 변경 내역을 확인하여 예상치 못한 변경이 없는지 검토하세요."
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
            href="/docs/i18nexus-tools/download-force"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-red-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">🔄</span>
              i18n-download-force →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("강제 동기화 옵션 알아보기")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus-tools/upload"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-yellow-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">📤</span>
              i18n-upload →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("로컬 번역을 Sheets로 업로드하는 방법")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
