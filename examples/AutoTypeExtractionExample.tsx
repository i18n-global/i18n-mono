/**
 * I18nProvider와 useTranslation 자동 타입 추출 예제
 *
 * 이제 I18nProvider에 전달된 translations 객체에서
 * 자동으로 유효한 키를 추출하여 useTranslation에서 사용합니다!
 */

import React from "react";
import { I18nProvider, useTranslation } from "i18nexus";

// ============================================================================
// Step 1: 번역 객체를 as const로 정의
// ============================================================================

const translations = {
  en: {
    "리그는 팀 선택 제한이 없습니다":
      "League has no team selection restrictions",
    "대회 생성입니다만": "This is a championship creation",
    greeting: "Hello {{name}}",
    farewell: "Goodbye {{name}}",
    championship: "{{championshipType}} requires exactly {{matchCount}} teams",
  },
  ko: {
    "리그는 팀 선택 제한이 없습니다": "리그는 팀 선택 제한이 없습니다",
    "대회 생성입니다만": "대회 생성입니다만",
    greeting: "안녕하세요 {{name}}",
    farewell: "안녕히 가세요 {{name}}",
    championship:
      "{{championshipType}}은 정확히 {{matchCount}}개의 팀을 선택해야 합니다",
  },
} as const;

// ============================================================================
// Step 2: 컴포넌트에서 useTranslation 사용
// ============================================================================

function ChampionshipInfo({
  championshipType,
}: {
  championshipType: number;
  matchCount: number;
}) {
  // useTranslation이 I18nProvider의 translations에서
  // 자동으로 유효한 키를 추출합니다!
  const { t } = useTranslation();

  const championshipTypes = ["League", "Cup", "Group Stage"];
  const matchCounts = [0, 8, 4];

  return (
    <div>
      <p className="text-sm text-amber-800">
        {championshipType === 0
          ? t("리그는 팀 선택 제한이 없습니다")
          : t("championship", {
              championshipType: championshipTypes[championshipType],
              matchCount: String(matchCounts[championshipType]),
            })}
      </p>

      {/* 이 아래는 컴파일 에러가 발생합니다! */}
      {/* <p>{t("존재하지_않는_키")}</p> */}
    </div>
  );
}

function UserGreeting({ name }: { name: string }) {
  const { t } = useTranslation();

  return (
    <div>
      {/* ✅ 유효한 키들 - 컴파일 성공 */}
      <h1>{t("greeting", { name })}</h1>
      <p>{t("farewell", { name })}</p>
      <p>{t("대회 생성입니다만")}</p>

      {/* ❌ 아래는 컴파일 에러:
      <p>{t("invalid_key")}</p>
      */}
    </div>
  );
}

// ============================================================================
// Step 3: I18nProvider로 감싸기
// ============================================================================

export function App() {
  return (
    <I18nProvider
      languageManagerOptions={{
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
        ],
        defaultLanguage: "en",
      }}
      translations={translations}>
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1>자동 타입 추출 예제</h1>

        <section style={{ marginBottom: "30px" }}>
          <h2>유저 인사말</h2>
          <UserGreeting name="Alice" />
        </section>

        <section style={{ marginBottom: "30px" }}>
          <h2>대회 정보</h2>
          <ChampionshipInfo championshipType={0} matchCount={0} />
          <ChampionshipInfo championshipType={1} matchCount={8} />
          <ChampionshipInfo championshipType={2} matchCount={4} />
        </section>

        <section>
          <h2>주요 특징</h2>
          <ul>
            <li>
              ✅ <code>I18nProvider translations</code>에서 자동으로 키 타입
              추출
            </li>
            <li>
              ✅ <code>useTranslation()</code> 호출 시 제네릭 불필요
            </li>
            <li>✅ 존재하지 않는 키 사용 시 컴파일 에러</li>
            <li>✅ IDE 자동 완성 지원</li>
          </ul>
        </section>
      </div>
    </I18nProvider>
  );
}

export default App;
