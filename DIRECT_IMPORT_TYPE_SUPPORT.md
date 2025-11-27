# 직접 Import 방법으로 타입 지원하기

## ✅ **네, 가능합니다!** `createI18n` 없이도 타입 지원 가능

### 방법 1: ExtractI18nKeys 사용 (권장) ✅

```typescript
import { useTranslation, I18nProvider, ExtractI18nKeys } from "i18nexus";

const translations = {
  en: {
    welcome: "Welcome",
    goodbye: "Goodbye",
    home: "Home"
  },
  ko: {
    welcome: "환영합니다",
    goodbye: "안녕히 가세요",
    home: "홈"
  }
} as const;

// ✅ 타입 추출
type TranslationKeys = ExtractI18nKeys<typeof translations>;
// Result: "welcome" | "goodbye" | "home"

// Provider 설정
<I18nProvider translations={translations}>
  <App />
</I18nProvider>

// 컴포넌트에서 사용
function MyComponent() {
  const { t } = useTranslation<TranslationKeys>();  // ✅ 타입 지정!

  t("welcome");  // ✅ OK - 타입 안전!
  t("goodbye");  // ✅ OK
  t("home");     // ✅ OK
  // t("invalid");  // ❌ TypeScript 에러!

  return <div>{t("welcome")}</div>;
}
```

**장점:**

- ✅ 완벽한 타입 안전성
- ✅ IDE 자동완성 지원
- ✅ 컴파일 타임 에러 감지

---

### 방법 2: 인라인 타입 지정

```typescript
import { useTranslation, I18nProvider, ExtractI18nKeys } from "i18nexus";

const translations = {
  en: { hello: "Hello", world: "World" },
  ko: { hello: "안녕하세요", world: "세상" }
} as const;

<I18nProvider translations={translations}>
  <App />
</I18nProvider>

function Component() {
  // ✅ 인라인으로 타입 지정
  const { t } = useTranslation<ExtractI18nKeys<typeof translations>>();

  t("hello");  // ✅ OK
  t("world");  // ✅ OK
  // t("invalid");  // ❌ TypeScript 에러
}
```

---

### 방법 3: Helper 함수로 재사용성 향상

```typescript
import { useTranslation, I18nProvider, ExtractI18nKeys } from "i18nexus";
import type { ReactNode } from "react";

// ✅ 타입 안전한 i18n 설정 함수
function createTypedI18n<T extends Record<string, Record<string, string>>>(
  translations: T
) {
  type Keys = ExtractI18nKeys<T>;

  return {
    Provider: ({ children }: { children: ReactNode }) => (
      <I18nProvider translations={translations}>
        {children}
      </I18nProvider>
    ),
    useTranslation: () => useTranslation<Keys>(),  // ✅ 타입 자동 추론!
    translations,
  };
}

// 사용
const translations = {
  en: { test: "Test", demo: "Demo" },
  ko: { test: "테스트", demo: "데모" }
} as const;

const i18n = createTypedI18n(translations);

// App에서
<i18n.Provider>
  <App />
</i18n.Provider>

// 컴포넌트에서
function Component() {
  const { t } = i18n.useTranslation();  // ✅ 타입 자동 추론!

  t("test");  // ✅ OK
  t("demo");  // ✅ OK
  // t("invalid");  // ❌ TypeScript 에러
}
```

**장점:**

- ✅ 한 번 설정하면 모든 곳에서 타입 안전
- ✅ `createI18n`과 유사한 사용 경험
- ✅ 네임스페이스 없이도 타입 지원

---

## 📊 createI18n vs 직접 Import 비교

| 기능             | createI18n   | 직접 Import + ExtractI18nKeys |
| ---------------- | ------------ | ----------------------------- |
| **타입 지원**    | ✅ 완벽      | ✅ 완벽 (명시적 지정 시)      |
| **네임스페이스** | ✅ 지원      | ❌ 없음                       |
| **자동 추론**    | ✅ 완전 자동 | ⚠️ 수동 지정 필요             |
| **사용 편의성**  | ✅ 매우 편함 | ⚠️ 약간 번거로움              |
| **코드 양**      | ✅ 적음      | ⚠️ 약간 많음                  |

---

## 🎯 언제 어떤 방법을 사용할까?

### ✅ createI18n 사용 (권장)

**상황:**

- 네임스페이스가 필요할 때
- 완전 자동 타입 추론이 필요할 때
- 최소한의 코드로 타입 안전성을 원할 때

```typescript
const i18n = createI18n(translations);
const { t } = i18n.useTranslation("namespace"); // ✅ 완전 자동!
```

### ✅ 직접 Import + ExtractI18nKeys 사용

**상황:**

- 네임스페이스가 필요 없을 때
- 간단한 프로젝트
- `createI18n`의 오버헤드가 부담될 때

```typescript
type Keys = ExtractI18nKeys<typeof translations>;
const { t } = useTranslation<Keys>(); // ✅ 타입 안전!
```

---

## 💡 실용적 예시

### 예시 1: 간단한 프로젝트

```typescript
// lib/i18n.ts
import { ExtractI18nKeys } from "i18nexus";
import translations from "./translations.json";

export type TranslationKeys = ExtractI18nKeys<typeof translations>;
export { translations };

// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { translations } from "@/lib/i18n";

<I18nProvider translations={translations}>
  <App />
</I18nProvider>

// components/MyComponent.tsx
import { useTranslation } from "i18nexus";
import type { TranslationKeys } from "@/lib/i18n";

function MyComponent() {
  const { t } = useTranslation<TranslationKeys>();  // ✅ 타입 안전!
  return <div>{t("welcome")}</div>;
}
```

### 예시 2: Helper 함수 사용

```typescript
// lib/i18n.ts
import { useTranslation, I18nProvider, ExtractI18nKeys } from "i18nexus";
import translations from "./translations.json";

type Keys = ExtractI18nKeys<typeof translations>;

export const i18n = {
  Provider: ({ children }: { children: React.ReactNode }) => (
    <I18nProvider translations={translations}>
      {children}
    </I18nProvider>
  ),
  useTranslation: () => useTranslation<Keys>(),
};

// app/layout.tsx
import { i18n } from "@/lib/i18n";

<i18n.Provider>
  <App />
</i18n.Provider>

// components/MyComponent.tsx
import { i18n } from "@/lib/i18n";

function MyComponent() {
  const { t } = i18n.useTranslation();  // ✅ 타입 자동 추론!
  return <div>{t("welcome")}</div>;
}
```

---

## 🎉 결론

### ✅ **createI18n 없이도 타입 지원 가능!**

**방법:**

1. `ExtractI18nKeys<typeof translations>`로 타입 추출
2. `useTranslation<Keys>()`로 타입 지정
3. 또는 Helper 함수로 재사용성 향상

**차이점:**

- `createI18n`: 완전 자동, 네임스페이스 지원
- 직접 import: 수동 지정 필요, 네임스페이스 없음

**둘 다 완벽한 타입 안전성을 제공합니다!** ✅
