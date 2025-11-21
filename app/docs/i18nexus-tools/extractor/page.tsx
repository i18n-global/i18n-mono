"use client";

import { useTranslation } from "i18nexus";
import Link from "next/link";

export default function I18nExtractorPage() {
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
        <span className="text-slate-300">i18n-extractor</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-green-500/30">
          <span className="text-white font-bold text-2xl">🔍</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4">
          i18n-extractor
        </h1>
        <p className="text-xl text-slate-400">
          {t("번역 키를 추출하고 기존 파일과 지능적으로 병합합니다")}
        </p>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("개요")}</h2>
        <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
          <p className="text-slate-300 mb-4">
            <code className="text-green-400 bg-slate-950 px-2 py-1 rounded">
              i18n-extractor
            </code>
            {t(
              "는 코드에서 t() 함수로 래핑된 모든 번역 키를 추출하여 언어별 JSON 파일을 생성하고, 기존 번역과 지능적으로 병합하는 CLI 도구입니다."
            )}
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("코드에서 자동으로 번역 키 추출")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">{t("기존 번역 모두 보존")}</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("새 키만 추가하는 스마트 병합")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("알파벳 순으로 키 정렬")}
              </span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-slate-300">
                {t("상세한 통계 및 보고서")}
              </span>
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
              <code className="text-blue-400">npx i18n-extractor</code>
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
            <h3 className="text-xl font-semibold text-green-400 mb-3">
              {t("기본 추출 및 병합")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
              <code className="text-green-400">
                npx i18n-extractor -p "app/**/*.tsx" -d "./locales"
              </code>
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              {t(
                "app 디렉토리의 모든 .tsx 파일에서 번역 키를 추출하고 locales 폴더에 저장합니다."
              )}
            </p>
          </div>

          {/* Multiple Languages */}
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              {t("특정 언어 파일 생성")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
              <code className="text-green-400">
                npx i18n-extractor -l "en,ko,ja"
              </code>
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              {t("영어, 한국어, 일본어 번역 파일을 생성합니다.")}
            </p>
          </div>

          {/* Dry Run */}
          <div>
            <h3 className="text-xl font-semibold text-purple-400 mb-3">
              {t("미리보기 모드")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800">
              <code className="text-green-400">
                npx i18n-extractor --dry-run
              </code>
            </pre>
            <p className="text-slate-400 text-sm mt-2">
              {t("파일을 수정하지 않고 추출될 키와 통계만 확인합니다.")}
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("작동 방식")}</h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-700/50 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">
                  {t("코드 스캔")}
                </h3>
                <p className="text-slate-300 text-sm">
                  {t(
                    "지정된 패턴의 모든 파일을 스캔하여 t() 함수 호출을 찾습니다."
                  )}
                </p>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-2 border border-slate-800">
                  <code className="text-slate-400">
                    {`// 이런 코드를 찾습니다:
t("환영합니다")
t("시작하기")
t(\`안녕하세요 \${name}님\`)`}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-700/50 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-300 mb-2">
                  {t("키 추출")}
                </h3>
                <p className="text-slate-300 text-sm">
                  {t("t() 함수의 첫 번째 인자를 번역 키로 추출합니다.")}
                </p>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-2 border border-slate-800">
                  <code className="text-slate-400">
                    {`// 추출된 키:
"환영합니다"
"시작하기"
"안녕하세요 \${name}님"`}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700/50 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-300 mb-2">
                  {t("기존 번역과 병합")}
                </h3>
                <p className="text-slate-300 text-sm mb-2">
                  {t(
                    "기존 번역 파일을 읽고, 새로운 키만 추가하며 기존 번역은 모두 보존합니다."
                  )}
                </p>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      {t("기존 파일")}:
                    </p>
                    <pre className="bg-slate-950 rounded p-2 text-xs border border-slate-800">
                      <code className="text-slate-400">
                        {`{
  "안녕": "Hello",
  "환영합니다": "Welcome"
}`}
                      </code>
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      {t("병합 후")}:
                    </p>
                    <pre className="bg-slate-950 rounded p-2 text-xs border border-slate-800">
                      <code className="text-slate-400">
                        {`{
  "안녕": "Hello",
  "시작하기": "시작하기",
  "환영합니다": "Welcome"
}`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/30 border border-orange-700/50 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold mr-4">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-300 mb-2">
                  {t("파일 저장")}
                </h3>
                <p className="text-slate-300 text-sm">
                  {t(
                    "정렬된 키로 각 언어의 JSON 파일을 저장하고 통계를 표시합니다."
                  )}
                </p>
                <pre className="bg-slate-950 rounded p-2 text-xs mt-2 border border-slate-800">
                  <code className="text-green-400">
                    {`✓ 추출 완료
  - 새 키: 5개
  - 기존 키: 120개
  - 총 키: 125개
  - 파일: locales/ko.json, locales/en.json`}
                  </code>
                </pre>
              </div>
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
              <code className="text-green-400 text-lg">--pattern, -p</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t("스캔할 파일의 glob 패턴을 지정합니다.")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm">
              <code className="text-slate-400">
                --pattern "app/**/*.{`{ts,tsx}`}"
              </code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-green-400 text-lg">--directory, -d</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t("번역 파일을 저장할 디렉토리 경로를 지정합니다.")}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm">
              <code className="text-slate-400">--directory "./locales"</code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-green-400 text-lg">--languages, -l</code>
              <span className="text-sm text-slate-500">{t("문자열")}</span>
            </div>
            <p className="text-slate-300 mb-2">
              {t(
                "생성할 언어 파일을 쉼표로 구분하여 지정합니다. 기본값: en,ko"
              )}
            </p>
            <pre className="bg-slate-950 rounded-lg p-3 text-sm">
              <code className="text-slate-400">--languages "en,ko,ja,zh"</code>
            </pre>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-green-400 text-lg">--dry-run</code>
              <span className="text-sm text-slate-500">{t("플래그")}</span>
            </div>
            <p className="text-slate-300">
              {t("실제로 파일을 생성하지 않고 추출될 키와 통계만 표시합니다.")}
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-2">
              <code className="text-green-400 text-lg">--help, -h</code>
              <span className="text-sm text-slate-500">{t("플래그")}</span>
            </div>
            <p className="text-slate-300">{t("도움말 메시지를 표시합니다.")}</p>
          </div>
        </div>
      </section>

      {/* Example Output */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">{t("예제 출력")}</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">
              {t("초기 추출 (새 프로젝트)")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
              <code className="text-slate-300">
                {`$ npx i18n-extractor -p "app/**/*.tsx" -d "./locales"

🔍 Scanning files...
   Found 25 files

📝 Extracting translation keys...
   Found 45 unique keys

📁 Creating translation files...
   ✓ locales/ko.json (45 keys)
   ✓ locales/en.json (45 keys)

✅ Extraction complete!
   - New keys: 45
   - Total keys: 45`}
              </code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">
              {t("증분 업데이트 (기존 프로젝트)")}
            </h3>
            <pre className="bg-slate-950 rounded-lg p-4 text-sm border border-slate-800 overflow-x-auto">
              <code className="text-slate-300">
                {`$ npx i18n-extractor -p "app/**/*.tsx" -d "./locales"

🔍 Scanning files...
   Found 30 files

📝 Extracting translation keys...
   Found 52 unique keys

📁 Merging with existing translations...
   Existing keys: 45
   New keys: 7
   
   ✓ locales/ko.json (52 keys, +7 new)
   ✓ locales/en.json (52 keys, +7 new)

✅ Extraction complete!
   - New keys: 7
   - Existing keys: 45
   - Total keys: 52
   
💡 Don't forget to translate the new keys in en.json`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Smart Merge */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">
          {t("스마트 병합 기능")}
        </h2>
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700/50 p-6">
          <h3 className="text-lg font-semibold text-green-300 mb-4">
            {t("병합 시 보장되는 사항")}:
          </h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("기존 번역 100% 보존")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t(
                    "이미 번역된 키는 절대 덮어쓰지 않습니다. 수동으로 작성한 번역이 안전하게 유지됩니다."
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("새 키만 추가")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t("코드에 새로 추가된 키만 번역 파일에 추가됩니다.")}
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("알파벳 순 정렬")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t(
                    "모든 키가 알파벳 순으로 정렬되어 찾기 쉽고 git diff가 깔끔합니다."
                  )}
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <div>
                <strong>{t("언어별 독립 관리")}</strong>
                <p className="text-sm text-slate-400 mt-1">
                  {t(
                    "각 언어 파일은 독립적으로 관리되며, 한 언어의 변경이 다른 언어에 영향을 주지 않습니다."
                  )}
                </p>
              </div>
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
              {t("자주 실행하기")}
            </h4>
            <p className="text-slate-300">
              {t(
                "새 기능을 추가할 때마다 extractor를 실행하여 번역 파일을 최신 상태로 유지하세요."
              )}
            </p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("CI/CD에 통합하기")}
            </h4>
            <p className="text-slate-300 mb-2">
              {t(
                "빌드 프로세스에 --dry-run을 추가하여 누락된 키가 있는지 확인하세요."
              )}
            </p>
            <pre className="bg-slate-950 rounded p-2 text-xs mt-2">
              <code className="text-slate-400">
                {`# package.json
"scripts": {
  "check:i18n": "i18n-extractor --dry-run"
}`}
              </code>
            </pre>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              <span className="mr-2">✅</span>
              {t("번역 파일 버전 관리")}
            </h4>
            <p className="text-slate-300">
              {t("생성된 번역 파일을 Git에 커밋하여 팀원들과 공유하세요.")}
            </p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
              <span className="mr-2">💡</span>
              {t("영어 번역 추가하기")}
            </h4>
            <p className="text-slate-300">
              {t(
                "extractor 실행 후 en.json 파일을 열어 새로 추가된 키에 영어 번역을 추가하세요."
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
            href="/docs/i18nexus-tools/wrapper"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">🔧</span>
              i18n-wrapper →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("한국어 텍스트를 자동으로 래핑하는 방법 알아보기")}
            </p>
          </Link>
          <Link
            href="/docs/i18nexus-tools/google-sheets"
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-yellow-500 transition-colors">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
              <span className="mr-2">📊</span>
              Google Sheets {t("연동")} →
            </h4>
            <p className="text-slate-400 text-sm">
              {t("팀 협업을 위한 Google Sheets 연동 설정하기")}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
