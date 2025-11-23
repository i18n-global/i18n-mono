# Type-Safe Setup Guide for useTranslation

## 문제: t("123") 에러가 안 나는 이유

TypeScript의 제너릭 타입 파라미터는 다음과 같이 작동합니다:

```typescript
// ❌ K의 타입이 명시되지 않으면
const { t } = useTranslation();
// K = string (기본값)
// 결과: 모든 문자열이 허용됨 ❌

// ✅ K를 명시적으로 제공하면
const { t } = useTranslation<"greeting" | "farewell">();
// K = "greeting" | "farewell"
// 결과: 해당 키만 허용 ✅
```

**근본 원인**:
React Context의 타입 정보는 TypeScript의 제너릭 추론에 사용될 수 없습니다. 이는 TypeScript의 **명시적 제너릭 파라미터 전달 요구사항** 때문입니다.

## 해결책: 3가지 패턴

### 패턴 1️⃣: 타입 정의 파일 만들기 (권장)

```typescript
// locales/types.ts
import { translations } from "./index";

// 모든 가능한 키를 추출
type TranslationKeys = keyof typeof translations.ko;

export type AppTranslationKey = TranslationKeys & string;
```

```typescript
// locales/index.ts
export const translations = {
  ko: {
    greeting: "안녕하세요",
    farewell: "안녕히 가세요",
    "common.loading": "로딩 중...",
  },
  en: {
    greeting: "Hello",
    farewell: "Goodbye",
    "common.loading": "Loading...",
  },
} as const;
```

```typescript
// 사용 예
import { useTranslation } from "i18nexus";
import type { AppTranslationKey } from "./locales/types";

const Page = () => {
  const { t } = useTranslation<AppTranslationKey>();

  t("greeting");     // ✅ OK
  t("farewell");     // ✅ OK
  t("invalid");      // ❌ 에러!
  t("123");          // ❌ 에러!

  return <div>{t("greeting")}</div>;
};
```

### 패턴 2️⃣: 커스텀 훅 만들기 (가장 편함)

```typescript
// hooks/useAppTranslation.ts
import { useTranslation as useI18nexusTranslation } from "i18nexus";
import type { AppTranslationKey } from "../locales/types";

export function useAppTranslation() {
  return useI18nexusTranslation<AppTranslationKey>();
}
```

```typescript
// 사용 예 - 매우 간단!
import { useAppTranslation } from "./hooks/useAppTranslation";

const Championship = () => {
  const { t } = useAppTranslation();

  t("greeting");     // ✅ OK
  t("123");          // ❌ 에러!

  return <div>{t("greeting")}</div>;
};
```

### 패턴 3️⃣: Standalone 타입 안전 함수 (변수 편함)

```typescript
// locales/createTypedT.ts
import { createTypedTranslation } from "i18nexus";
import { translations } from "./index";

export const typedT = createTypedTranslation(translations.ko, translations.en);
```

```typescript
// 사용 예
import { typedT } from "./locales/createTypedT";

const Championship = () => {
  typedT("greeting");     // ✅ OK
  typedT("123");          // ❌ 에러!

  return <div>{typedT("greeting")}</div>;
};
```

## 실제 적용: 당신의 코드

### Before (에러 감지 안 함)

```typescript
import { I18nProvider, useTranslation } from "i18nexus";
import { translations } from "../../locales";

const Championship = () => {
  const { t } = useTranslation();  // ❌ K = string

  return (
    <p>
      {championshipType === 0
        ? "리그는 팀 선택 제한이 없습니다"
        : t("{{championshipTypes[championshipType]}}은...")}  // ❌ 오타 감지 안 함
    </p>
  );
};
```

### After (에러 감지 함) - 권장

```typescript
// hooks/useAppTranslation.ts
import { useTranslation as useI18nexusTranslation } from "i18nexus";
import type { AppTranslationKey } from "../locales/types";

export function useAppTranslation() {
  return useI18nexusTranslation<AppTranslationKey>();
}
```

```typescript
// components/Championship.tsx
import { useAppTranslation } from "../hooks/useAppTranslation";

const Championship = () => {
  const { t } = useAppTranslation();  // ✅ K = AppTranslationKey

  return (
    <p>
      {championshipType === 0
        ? "리그는 팀 선택 제한이 없습니다"
        : t("championship.league.description")}  // ✅ 오타 감지됨!
    </p>
  );
};
```

## 단계별 설정

### 1단계: 타입 정의

```typescript
// locales/types.ts
import { translations } from "./index";

export type AppTranslationKey = keyof typeof translations.ko & string;
```

### 2단계: 커스텀 훅 생성

```typescript
// hooks/useAppTranslation.ts
import { useTranslation } from "i18nexus";
import type { AppTranslationKey } from "../locales/types";

export function useAppTranslation() {
  return useTranslation<AppTranslationKey>();
}
```

### 3단계: 모든 컴포넌트에서 사용

```typescript
import { useAppTranslation } from "../hooks/useAppTranslation";

const MyComponent = () => {
  const { t } = useAppTranslation();
  return <div>{t("valid_key")}</div>;
};
```

## 번역 키 정의 예시

당신의 프로젝트 구조에 맞게:

```typescript
// locales/index.ts
export const translations = {
  ko: {
    // Championship 관련
    "championship.league.description": "리그는 팀 선택 제한이 없습니다",
    "championship.cup.description": "컵은 정확히 8개의 팀을 선택해야 합니다",
    "championship.group.description":
      "그룹은 정확히 4개의 팀을 선택해야 합니다",

    // 공통
    "common.loading": "로딩 중...",
    "common.error": "오류가 발생했습니다",

    // 버튼
    "button.save": "저장",
    "button.cancel": "취소",
  },
  en: {
    "championship.league.description": "League has no team selection limit",
    "championship.cup.description": "Cup requires exactly 8 teams",
    "championship.group.description": "Group requires exactly 4 teams",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "button.save": "Save",
    "button.cancel": "Cancel",
  },
} as const;
```

## 빌드 타임 검증

TypeScript strict 모드에서:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}
```

이렇게 설정하면 모든 오타가 **컴파일 타임**에 잡힙니다! ✨

## FAQ

### Q: 왜 자동으로 감지 안 되나요?

**A:** TypeScript의 제너릭 파라미터는 명시적으로 전달되어야 합니다. React Context 타입은 함수 인자가 아니므로 자동 추론 대상이 될 수 없습니다.

### Q: 모든 컴포넌트에 타입을 붙여야 하나요?

**A:** 아니요! 커스텀 훅 `useAppTranslation()`을 만들면, 한 번만 정의하고 모든 곳에서 재사용합니다.

### Q: 성능에 영향이 있나요?

**A:** 없습니다. 이것은 **컴파일 타임 검증**이므로 런타임 오버헤드가 없습니다.

### Q: 동적 키는 어떻게 하나요?

**A:** 동적 키가 필요한 경우 `buildDynamicTranslation()` 또는 standalone `createTypedTranslation()`을 사용하세요.

## 참고: 왜 자동 추론이 안 되나?

이것은 i18nexus의 한계가 아니라 **TypeScript의 설계**입니다:

```typescript
// ❌ 이런 코드는 불가능합니다
function useExample<T = Context의 타입>() { }

// 왜냐하면 Context는 함수 파라미터가 아니기 때문입니다
// TypeScript는 함수 인자를 통해서만 제너릭을 추론합니다

// ✅ 올바른 방법
function useExample<T extends string>() { }
// 호출할 때 명시적으로 전달:
useExample<"specific" | "type">();
```

더 자세한 설명은 [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)를 참고하세요.

## 다음 단계

1. ✅ 당신의 번역 키 목록 작성
2. ✅ 타입 정의 파일 생성
3. ✅ 커스텀 훅 생성
4. ✅ 모든 컴포넌트에서 사용
5. ✅ TypeScript strict 모드 활성화

이제 `t("123")`같은 오류가 **컴파일 타임**에 잡힐 것입니다! 🎉
