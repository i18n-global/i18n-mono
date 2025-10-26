"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nDownloadForcePage() {
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
        <span className="text-slate-300">i18n-download-force</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-6 shadow-lg shadow-red-500/30">
          <span className="text-white font-bold text-2xl">🔄</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4">
          i18n-download-force
        </h1>
        <p className="text-xl text-slate-400">
          {t("Google Sheets의 데이터로 로컬 번역을 완전히 덮어씁니다")}
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-2 border-red-500 rounded-xl p-6 mb-12">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-300 mb-2">
              {t("위험: 데이터 손실 가능")}
            </h3>
            <p className="text-slate-300 text-sm">
              {t(
                "이 명령어는 로컬 번역 파일을 Google Sheets의 데이터로 완전히 덮어씁니다. 로컬에만 있는 번역이 모두 삭제됩니다. 일반적으로 i18n-download를 사용하는 것이 안전합니다."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-red-400 bg-slate-950 px-2 py-1 rounded">
              i18n-download-force
            </code>
            {t(
              "는 Google Sheets를 단일 진실 공급원(Single Source of Truth)으로 사용할 때를 위한 명령어입니다. 로컬 번역 파일을 Sheets의 데이터로 완전히 대체합니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-red-400 mr-2">⚠</span>
              <span className="text-slate-300">
                {t("로컬 번역 완전 덮어쓰기")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">⚠</span>
              <span className="text-slate-300">{t("로컬 전용 번역 삭제")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-400 mr-2">⚠</span>
              <span className="text-slate-300">
                {t("되돌릴 수 없음 (Git 미사용 시)")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("사용 시기")}</h2>
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("Google Sheets를 마스터로 사용")}
            </h4>
            <p className="text-slate-300 text-sm">
              {t(
                "모든 번역 작업이 Google Sheets에서만 이루어지고, 로컬 파일은 단순히 Sheets의 복사본인 경우"
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("로컬 변경사항이 없음을 확신")}
            </h4>
            <p className="text-slate-300 text-sm">
              {t(
                "로컬에서 번역을 직접 수정하지 않고, Sheets에서만 번역을 관리하는 경우"
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("로컬 파일 리셋 필요")}
            </h4>
            <p className="text-slate-300 text-sm">
              {t(
                "로컬 파일이 손상되었거나 문제가 있어서 Sheets의 깨끗한 버전으로 다시 시작하고 싶은 경우"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("사용법")}</h2>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-300 mb-3">
            {t("설정 파일 사용")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
            <code className="text-green-400">npx i18n-download-force</code>
          </pre>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-red-300 mb-3">
            {t("명령줄 옵션 사용")}
          </h3>
          <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
            <code className="text-green-400">
              {`npx i18n-download-force \\
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
            <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-300 mb-2">
                {t("Sheets 데이터 가져오기")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("Google Sheets에서 모든 번역을 읽어옵니다.")}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                {t("로컬 파일 삭제")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("기존 로컬 번역 파일의 내용을 완전히 지웁니다.")}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center text-white font-bold mr-4 shadow-lg">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                {t("Sheets 데이터 쓰기")}
              </h3>
              <p className="text-slate-400 text-sm">
                {t("Sheets의 번역을 로컬 파일에 씁니다. 병합 없음.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Output */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("예제 출력")}</h2>
        <pre className="bg-slate-950 rounded-lg p-6 text-sm border border-slate-800 overflow-x-auto">
          <code className="text-slate-300">
            {`$ npx i18n-download-force --spreadsheet-id "1abc...xyz"

⚠️  WARNING: This will overwrite all local translations!
📊 Reading from Google Sheets...
   Spreadsheet: "i18n Translations"
   Sheet: "Translations"
   ✓ Found 128 translation keys
   Languages: ko, en

🔄 Force overwriting local files...
   ✗ Removed all existing local data
   ✓ locales/ko.json (128 keys)
   ✓ locales/en.json (128 keys)

✅ Force download complete!
   Total keys: 128
   All local files replaced with Sheets data`}
          </code>
        </pre>
      </section>

      {/* Comparison */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("i18n-download와 비교")}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left p-4 text-slate-300 font-semibold">
                  {t("특성")}
                </th>
                <th className="text-center p-4 text-blue-300 font-semibold">
                  i18n-download
                </th>
                <th className="text-center p-4 text-red-300 font-semibold">
                  i18n-download-force
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-800">
                <td className="p-4 text-slate-300">{t("로컬 번역 보존")}</td>
                <td className="p-4 text-center">
                  <span className="text-green-400 text-xl">✓</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-red-400 text-xl">✗</span>
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-4 text-slate-300">{t("스마트 병합")}</td>
                <td className="p-4 text-center">
                  <span className="text-green-400 text-xl">✓</span>
                </td>
                <td className="p-4 text-center">
                  <span className="text-red-400 text-xl">✗</span>
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-4 text-slate-300">{t("안전성")}</td>
                <td className="p-4 text-center text-green-400">
                  {t("안전함")}
                </td>
                <td className="p-4 text-center text-red-400">
                  {t("주의 필요")}
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="p-4 text-slate-300">{t("사용 빈도")}</td>
                <td className="p-4 text-center text-blue-400">
                  {t("자주 사용")}
                </td>
                <td className="p-4 text-center text-orange-400">
                  {t("드물게 사용")}
                </td>
              </tr>
              <tr>
                <td className="p-4 text-slate-300">{t("권장 사용")}</td>
                <td className="p-4 text-center text-green-400">
                  {t("일반적인 경우")}
                </td>
                <td className="p-4 text-center text-red-400">
                  {t("특수한 경우")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Safety Precautions */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("안전 대책")}</h2>
        <div className="space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              {t("실행 전 Git 커밋")}
            </h4>
            <p className="text-slate-300 mb-2">
              {t(
                "명령 실행 전에 현재 상태를 Git에 커밋하세요. 문제가 생기면 되돌릴 수 있습니다."
              )}
            </p>
            <pre className="bg-slate-950 rounded p-2 text-xs mt-2">
              <code className="text-slate-400">
                {`git add locales/
git commit -m "backup before force download"
npx i18n-download-force`}
              </code>
            </pre>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              {t("백업 생성")}
            </h4>
            <p className="text-slate-300">
              {t("로컬 번역 파일을 다른 위치에 백업한 후 명령을 실행하세요.")}
            </p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              {t("Sheets 내용 확인")}
            </h4>
            <p className="text-slate-300">
              {t("Google Sheets의 내용이 올바른지 확인한 후 다운로드하세요.")}
            </p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("모범 사례")}</h2>
        <div className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-2 flex items-center">
              <span className="mr-2">❌</span>
              {t("일반적으로 사용하지 마세요")}
            </h4>
            <p className="text-slate-300">
              {t("대부분의 경우 i18n-download를 사용하는 것이 더 안전합니다.")}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("명확한 워크플로우 정의")}
            </h4>
            <p className="text-slate-300">
              {t(
                "팀에서 Google Sheets를 단일 진실 공급원으로 사용하기로 명확히 합의한 경우에만 사용하세요."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("CI/CD에서 사용")}
            </h4>
            <p className="text-slate-300">
              {t(
                "자동화된 배포 파이프라인에서 Sheets로부터 항상 최신 번역을 가져오는 용도로 사용할 수 있습니다."
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
              {t("안전한 증분 다운로드 방식 알아보기")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus-tools/google-sheets"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-yellow-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">📊</span>
              Google Sheets {t("가이드")} →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("전체 Google Sheets 워크플로우 보기")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
