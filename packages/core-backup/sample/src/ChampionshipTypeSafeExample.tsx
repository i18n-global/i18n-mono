/**
 * 실제 사용 예: 당신의 Championship 컴포넌트에 적용하는 방법
 *
 * 이 파일은 4가지 단계를 보여줍니다:
 * 1. 타입 정의
 * 2. 번역 정의
 * 3. 커스텀 훅
 * 4. 컴포넌트 구현
 */

// ============================================================================
// 예제: 당신의 실제 프로젝트 구조
// ============================================================================
//
// locales/
//   ├── index.ts (번역 정의)
//   └── types.ts (타입 정의)
//
// hooks/
//   └── useAppTranslation.ts (커스텀 훅)
//
// components/
//   └── Championship.tsx (컴포넌트)
//
// ============================================================================
// 1단계: 타입 정의 (locales/types.ts)
// ============================================================================

// 이 타입 정의는 다음과 같이 하세요:
// import type { translations } from "./index";
// export type AppTranslationKey = keyof (typeof translations.ko) & string;

// 예제에서는 하드코딩된 타입을 사용합니다:
export type AppTranslationKey =
  | "championship.league"
  | "championship.cup"
  | "championship.group"
  | "common.loading"
  | "common.error";

// ============================================================================
// 2단계: 번역 정의 (locales/index.ts)
// ============================================================================

export const translations = {
  ko: {
    // Championship 관련
    "championship.league": "리그는 팀 선택 제한이 없습니다",
    "championship.cup": "컵은 정확히 {{count}}개의 팀을 선택해야 합니다",
    "championship.group": "그룹은 정확히 {{count}}개의 팀을 선택해야 합니다",

    // 공통
    "common.loading": "로딩 중...",
    "common.error": "오류가 발생했습니다",

    // 더 많은 키들...
  },
  en: {
    "championship.league": "League has no team selection limit",
    "championship.cup": "Cup requires exactly {{count}} teams",
    "championship.group": "Group requires exactly {{count}} teams",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
  },
} as const;

// ============================================================================
// 3단계: 커스텀 훅 생성 (hooks/useAppTranslation.ts)
// ============================================================================

import { useTranslation as useI18nexusTranslation } from "i18nexus";

/**
 * 타입 안전한 useTranslation 훅
 * 모든 컴포넌트에서 이 훅을 사용하세요
 *
 * @example
 * ```typescript
 * const { t } = useAppTranslation();
 * t("championship.league");  // ✅ OK
 * t("invalid.key");          // ❌ TypeScript Error
 * ```
 */
export function useAppTranslation() {
  return useI18nexusTranslation<AppTranslationKey>();
}

// ============================================================================
// 4단계: 컴포넌트에서 사용 (components/Championship.tsx)
// ============================================================================

import React from "react";
import { createDynamicTranslation, buildTranslationParams } from "i18nexus";

interface ChampionshipProps {
  championshipType: 0 | 1 | 2; // 0: league, 1: cup, 2: group
}

export const Championship: React.FC<ChampionshipProps> = ({
  championshipType,
}) => {
  const { t } = useAppTranslation(); // ✅ 타입 안전!

  // 배열 정의
  const championshipTypes = ["League", "Cup", "Group"];
  const matchCounts = [0, 8, 4];

  // 경우 1️⃣: 리그 (선택 제한 없음)
  const renderLeagueInfo = () => {
    return (
      <p className="text-sm text-amber-800">
        {t("championship.league")} {/* ✅ 타입 안전 */}
      </p>
    );
  };

  // 경우 2️⃣: 컵 또는 그룹 (동적 변수)
  const renderDynamicInfo = () => {
    const count = matchCounts[championshipType];

    // 동적 변수를 포함한 번역
    const params = buildTranslationParams({ count });
    const template = t(
      championshipType === 1 ? "championship.cup" : "championship.group"
    );
    const message = createDynamicTranslation(template, params);

    return <p className="text-sm text-amber-800">{message}</p>;
  };

  // 조건부 렌더링
  return (
    <div>
      {championshipType === 0 ? renderLeagueInfo() : renderDynamicInfo()}
    </div>
  );
};

// ============================================================================
// 대안: 조금 더 간단한 패턴 (권장)
// ============================================================================

export const ChampionshipSimple: React.FC<ChampionshipProps> = ({
  championshipType,
}) => {
  const { t } = useAppTranslation();

  // 설정 객체로 정의 (타입 안전!)
  const championshipConfig = [
    {
      type: "League",
      message: "championship.league" as const,
      count: undefined,
    },
    { type: "Cup", message: "championship.cup" as const, count: 8 },
    { type: "Group", message: "championship.group" as const, count: 4 },
  ] as const;

  const config = championshipConfig[championshipType];
  const params =
    config.count !== undefined
      ? buildTranslationParams({ count: config.count })
      : {};

  const template = t(config.message);
  const finalMessage = createDynamicTranslation(template, params);

  return <p className="text-sm text-amber-800">{finalMessage}</p>;
};

// ============================================================================
// 완전 해결책: 더 강화된 설정
// ============================================================================

const CHAMPIONSHIP_CONFIG = [
  {
    id: 0,
    name: "League",
    messageKey: "championship.league" as const,
    minTeams: 0,
    maxTeams: Infinity,
    teamCount: 0,
  },
  {
    id: 1,
    name: "Cup",
    messageKey: "championship.cup" as const,
    minTeams: 1,
    maxTeams: 16,
    teamCount: 8,
  },
  {
    id: 2,
    name: "Group",
    messageKey: "championship.group" as const,
    minTeams: 1,
    maxTeams: 8,
    teamCount: 4,
  },
] as const;

export const ChampionshipAdvanced: React.FC<ChampionshipProps> = ({
  championshipType,
}) => {
  const { t } = useAppTranslation();

  const config = CHAMPIONSHIP_CONFIG[championshipType];

  // 타입 안전한 메시지 생성
  const params = buildTranslationParams({
    count: config.teamCount,
  });

  const template = t(config.messageKey); // ✅ config.messageKey의 타입은 정확한 리터럴!
  const message = createDynamicTranslation(template, params);

  return (
    <div>
      <h3>{config.name}</h3>
      <p className="text-sm text-amber-800">{message}</p>
      <p className="text-xs text-gray-600">
        팀 선택: {config.minTeams} ~{" "}
        {config.maxTeams === Infinity ? "무제한" : config.maxTeams}명
      </p>
    </div>
  );
};

// ============================================================================
// 테스트: 타입 안전성 검증
// ============================================================================

// 다음 코드들을 주석 해제하면 TypeScript 에러가 나야 합니다:

// ❌ 에러: 유효하지 않은 키
// const { t } = useAppTranslation();
// t("invalid.key");  // ← 여기서 에러!

// ❌ 에러: 오타
// const { t } = useAppTranslation();
// t("championship.leage");  // ← 여기서 에러! (league를 leage로 오타)

// ✅ 성공: 올바른 키
// const { t } = useAppTranslation();
// t("championship.league");  // ✅ OK!

export default Championship;
