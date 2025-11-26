# I18nProvider 자동 타입 추출 및 동적 변수 해결

## 개요 (v2.10.0+)

이제 `I18nProvider`에 전달된 `translations` 객체에서 **자동으로 키 타입을 추출**하여 `useTranslation()`에서 사용합니다!

```typescript
// ✅ 이제 제네릭을 지정할 필요 없습니다!
const { t } = useTranslation();
t("존재_하는_키"); // ✅ OK
t("존재하지_않는_키"); // ❌ 컴파일 에러
```

## 문제와 해결책

### 문제 1: 템플릿 문자열에서 동적 계산 불가

**문제 코드:**

```typescript
const { t } = useTranslation();
t("{{championshipTypes[championshipType]}}은 정확히 {{matchCount[championshipType]}}개의 팀을 선택해야 합니다.", {
  championshipTypes[championshipType]: championshipTypes[championshipType],
  matchCount[championshipType]: matchCount[championshipType],
})
```

**문제점:**

- `championshipTypes[championshipType]`는 동적 계산이므로 변수명으로 사용 불가
- 번역 문자열 내에서 배열 인덱싱은 지원 안 함

**해결책 1: 미리 계산해서 변수로 전달**

```typescript
const { t } = useTranslation();

const type = championshipTypes[championshipType];
const count = matchCount[championshipType];

t("{{type}}은 정확히 {{count}}개의 팀을 선택해야 합니다.", {
  type,
  count,
});
```

**해결책 2: 별도의 키로 분리**

```typescript
const translations = {
  en: {
    leagueInfo: "League has no team selection restrictions",
    cupInfo: "{{cupName}} requires exactly {{teamCount}} teams",
    groupInfo: "{{groupName}} requires exactly {{teamCount}} teams",
  },
} as const;

function ChampionshipInfo({ type }: { type: "league" | "cup" | "group" }) {
  const { t } = useTranslation();

  if (type === "league") {
    return <p>{t("leagueInfo")}</p>;
  }

  if (type === "cup") {
    return <p>{t("cupInfo", { cupName: "FA Cup", teamCount: 8 })}</p>;
  }

  return <p>{t("groupInfo", { groupName: "Group Stage", teamCount: 4 })}</p>;
}
```

**해결책 3: 컴포넌트에서 계산 후 렌더링**

```typescript
const { t } = useTranslation();

const baseMsg = t("{{championshipType}}은 정확히 {{matchCount}}개의 팀을 선택해야 합니다.", {
  championshipType: championshipTypes[championshipType],
  matchCount: String(matchCount[championshipType]),
});

return <p>{baseMsg}</p>;
```

## 자동 타입 추출 사용법

### 1. 기본 사용법

```typescript
import { I18nProvider, useTranslation } from "i18nexus";

// Step 1: translations을 as const로 정의
const translations = {
  en: {
    greeting: "Hello {{name}}",
    farewell: "Goodbye",
    championship: "{{type}} requires {{count}} teams",
  },
  ko: {
    greeting: "안녕하세요 {{name}}",
    farewell: "안녕히 가세요",
    championship: "{{type}}은 {{count}}개 팀 필요",
  },
} as const;

// Step 2: I18nProvider로 감싸기
function App() {
  return (
    <I18nProvider translations={translations}>
      <MyComponent />
    </I18nProvider>
  );
}

// Step 3: useTranslation - 자동으로 타입 추출!
function MyComponent() {
  const { t } = useTranslation();

  // 모든 유효한 키가 자동으로 인식됨
  return (
    <div>
      <p>{t("greeting", { name: "Alice" })}</p>        {/* ✅ OK */}
      <p>{t("farewell")}</p>                             {/* ✅ OK */}
      <p>{t("championship", { type: "Cup", count: 8 })}</p> {/* ✅ OK */}

      {/* ❌ 아래는 컴파일 에러:
      <p>{t("invalid_key")}</p>
      */}
    </div>
  );
}
```

### 2. 타입 명시적 지정 (선택사항)

경우에 따라 타입을 명시하고 싶으면:

```typescript
import { useTranslation, ExtractI18nKeys } from "i18nexus";

// 타입 추출
type TranslationKeys = ExtractI18nKeys<typeof translations>;

function MyComponent() {
  // 명시적으로 지정 - 하지만 보통 필요 없음
  const { t } = useTranslation<TranslationKeys>();

  return <p>{t("greeting", { name: "Alice" })}</p>;
}
```

## 실제 사용 예제

### 예제 1: 동적 변수 처리

```typescript
const translations = {
  en: {
    teamNotification: "{{action}} {{count}} teams",
  },
} as const;

interface TeamActionProps {
  action: "selected" | "removed";
  count: number;
}

function TeamNotification({ action, count }: TeamActionProps) {
  const { t } = useTranslation();

  const actionText = action === "selected" ? "Selected" : "Removed";

  return (
    <p>
      {t("teamNotification", {
        action: actionText,
        count: String(count),
      })}
    </p>
  );
}
```

### 예제 2: 조건부 번역

```typescript
const translations = {
  en: {
    leagueDescription: "League has no team restrictions",
    cupDescription: "Cup requires {{teamCount}} teams",
    groupDescription: "Group requires {{teamCount}} teams",
  },
} as const;

type ChampionshipType = "league" | "cup" | "group";

interface ChampionshipDescriptionProps {
  type: ChampionshipType;
  teamCount?: number;
}

function ChampionshipDescription({
  type,
  teamCount = 0,
}: ChampionshipDescriptionProps) {
  const { t } = useTranslation();

  switch (type) {
    case "league":
      return <p>{t("leagueDescription")}</p>;
    case "cup":
      return (
        <p>
          {t("cupDescription", {
            teamCount: String(teamCount),
          })}
        </p>
      );
    case "group":
      return (
        <p>
          {t("groupDescription", {
            teamCount: String(teamCount),
          })}
        </p>
      );
  }
}
```

### 예제 3: 복잡한 구조

```typescript
const translations = {
  en: {
    championshipCreation: "Championship Creation",
    leagueInfo: "League",
    cupInfo: "Cup",
    selectTeams: "Select {{count}} teams",
    confirmButton: "Create {{type}}",
  },
  ko: {
    championshipCreation: "대회 생성",
    leagueInfo: "리그",
    cupInfo: "컵",
    selectTeams: "{{count}}개 팀 선택",
    confirmButton: "{{type}} 생성",
  },
} as const;

function ChampionshipCreation() {
  const { t, currentLanguage } = useTranslation();
  const [championshipType, setChampionshipType] = React.useState<
    "league" | "cup"
  >("league");
  const [selectedTeams, setSelectedTeams] = React.useState(0);

  const teamCounts = { league: 0, cup: 8 };
  const typeLabels = { league: t("leagueInfo"), cup: t("cupInfo") };

  return (
    <div>
      <h1>{t("championshipCreation")}</h1>

      <div>
        <label>
          <input
            type="radio"
            value="league"
            checked={championshipType === "league"}
            onChange={(e) =>
              setChampionshipType(e.target.value as "league" | "cup")
            }
          />
          {t("leagueInfo")}
        </label>
        <label>
          <input
            type="radio"
            value="cup"
            checked={championshipType === "cup"}
            onChange={(e) =>
              setChampionshipType(e.target.value as "league" | "cup")
            }
          />
          {t("cupInfo")}
        </label>
      </div>

      {championshipType !== "league" && (
        <p>{t("selectTeams", { count: String(teamCounts[championshipType]) })}</p>
      )}

      <button>
        {t("confirmButton", {
          type: typeLabels[championshipType],
        })}
      </button>
    </div>
  );
}
```

## 주요 이점

| 기능                             | 이전 (v2.9.0)   | 현재 (v2.10.0+) |
| -------------------------------- | --------------- | --------------- |
| 제네릭 지정 필요                 | ✅ 필수         | ❌ 불필요       |
| I18nProvider 변경 시 자동 동기화 | ❌ 아니오       | ✅ 예           |
| IDE 자동 완성                    | ✅ 수동 지정 후 | ✅ 즉시         |
| 컴파일 타임 검증                 | ✅ 예           | ✅ 예           |
| 오버헤드                         | 낮음            | 낮음            |

## 마이그레이션

### 기존 v2.9.0 코드

```typescript
type TranslationKeys = "greeting" | "farewell" | "welcome";

function MyComponent() {
  const { t } = useTranslation<TranslationKeys>();
  return <p>{t("greeting", { name: "Alice" })}</p>;
}
```

### 새로운 v2.10.0+ 코드

```typescript
function MyComponent() {
  // 제네릭 지정 불필요!
  const { t } = useTranslation();
  return <p>{t("greeting", { name: "Alice" })}</p>;
}
```

## 기술 세부사항

### ExtractI18nKeys 타입 유틸리티

```typescript
export type ExtractI18nKeys<T extends Record<string, Record<string, string>>> =
  keyof T[keyof T] & string;

// 사용 예:
type Keys = ExtractI18nKeys<typeof translations>;
// Result: "greeting" | "farewell" | "welcome"
```

### I18nContextType 업데이트

```typescript
export interface I18nContextType<
  TLanguage extends string = string,
  TKeys extends string = string,
> {
  currentLanguage: TLanguage;
  changeLanguage: (lang: TLanguage) => Promise<void>;
  availableLanguages: LanguageConfig[];
  languageManager: LanguageManager;
  isLoading: boolean;
  translations: Record<string, Record<string, string>>;
  _translationKeys?: Record<TKeys, true>;
}
```

## 트러블슈팅

### 문제: 타입이 여전히 `string`입니다

**원인:** I18nProvider에 `as const`를 빼먹었을 수 있습니다.

```typescript
// ❌ 틀린 코드
const translations = {
  en: { greeting: "Hello" },
  ko: { greeting: "안녕" },
};

// ✅ 올바른 코드
const translations = {
  en: { greeting: "Hello" },
  ko: { greeting: "안녕" },
} as const;
```

### 문제: 새로운 키를 추가했는데 인식 안 됨

**해결책:** 타입 스크립트 캐시 초기화

```bash
rm -rf dist
npm run build
```

## 성능

- **컴파일 타임**: 무시할 수 있는 수준 (타입 추출만 수행)
- **런타임**: 0 오버헤드 (이전과 동일)
- **번들 크기**: 변화 없음

## 다음 단계

- [Type-Safe Keys Guide](./type-safe-keys.md) - 고급 타입 안전 기능
- [useTranslation Type-Safe Guide](./use-translation-type-safe.md) - 수동 제네릭 지정
