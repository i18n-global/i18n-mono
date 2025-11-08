# Type-Safe useTranslation Hook

## 개요

이제 `useTranslation()` 훅에서 TypeScript 제네릭 파라미터를 사용하여 **유효한 번역 키만 허용**하도록 할 수 있습니다.

존재하지 않는 키를 사용하면 **컴파일 타임**에 에러가 발생합니다! 🎉

## 핵심 기능

```typescript
// ❌ 기존 방식 (타입 체크 없음)
const { t } = useTranslation();
t("123");        // ✅ 컴파일 성공, 런타임 에러 가능
t("invalid");    // ✅ 컴파일 성공, 런타임 에러 가능

// ✅ 새로운 방식 (타입 세이프)
const { t } = useTranslation<"greeting" | "farewell" | "welcome">();
t("greeting");   // ✅ OK - 유효한 키
t("123");        // ❌ 컴파일 에러 - '"123"'은 허용된 키가 아님
t("invalid");    // ❌ 컴파일 에러 - '"invalid"'는 허용된 키가 아님
```

## 사용 방법

### 1. 기본 사용법 (제네릭 파라미터 지정)

```typescript
import { useTranslation } from "i18nexus";

const translations = {
  en: {
    greeting: "Hello {{name}}",
    farewell: "Goodbye",
    welcome: "Welcome",
  },
  ko: {
    greeting: "안녕하세요 {{name}}",
    farewell: "안녕히 가세요",
    welcome: "환영합니다",
  },
} as const;

function MyComponent() {
  // 방법 1: 문자 리터럴 유니온으로 지정
  const { t } = useTranslation<"greeting" | "farewell" | "welcome">();

  return (
    <div>
      <p>{t("greeting", { name: "Alice" })}</p>  {/* ✅ OK */}
      <p>{t("farewell")}</p>                       {/* ✅ OK */}
      {/* <p>{t("invalid")}</p> */}                {/* ❌ Error */}
    </div>
  );
}
```

### 2. 재사용 가능한 타입 정의

가장 권장되는 방식입니다:

```typescript
// types.ts 또는 translations.ts
const translations = {
  en: {
    greeting: "Hello {{name}}",
    farewell: "Goodbye",
    welcome: "Welcome",
  },
  // ...
} as const;

// 유효한 키의 타입 추출
type TranslationKey = keyof (typeof translations.en);

// components.tsx
function MyComponent() {
  const { t } = useTranslation<TranslationKey>();

  return (
    <div>
      <p>{t("greeting", { name: "Bob" })}</p>
      <p>{t("farewell")}</p>
    </div>
  );
}
```

### 3. 호환성: 기존 코드는 그대로 작동

제네릭 파라미터를 지정하지 않으면 기존과 동일합니다:

```typescript
// 타입 체크 없음 (기존 방식)
const { t } = useTranslation();

t("greeting");    // ✅ 컴파일 성공
t("any_key");     // ✅ 컴파일 성공 (런타임에 실패할 수 있음)
t("123");         // ✅ 컴파일 성공
```

## 실제 예제

### 예제 1: 간단한 컴포넌트

```typescript
import { useTranslation, I18nProvider } from "i18nexus";

const translations = {
  en: {
    welcome: "Welcome {{name}}",
    goodbye: "Goodbye {{name}}",
  },
  ko: {
    welcome: "환영합니다 {{name}}",
    goodbye: "안녕히 가세요 {{name}}",
  },
} as const;

type AppKeys = keyof (typeof translations.en);

function UserCard({ name }: { name: string }) {
  const { t, currentLanguage } = useTranslation<AppKeys>();

  return (
    <div>
      <h1>{t("welcome", { name })}</h1>
      <p>Language: {currentLanguage}</p>

      {/* ❌ 아래는 컴파일 에러:
      <p>{t("unknown")}</p>
      */}
    </div>
  );
}

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
      translations={translations}
    >
      <UserCard name="Alice" />
    </I18nProvider>
  );
}
```

### 예제 2: 여러 컴포넌트에서 재사용

```typescript
// types.ts
export const translations = {
  en: {
    greeting: "Hello {{name}}",
    farewell: "Goodbye {{name}}",
    welcome: "Welcome",
    count: "Count: {{count}}",
  },
  ko: {
    greeting: "안녕하세요 {{name}}",
    farewell: "안녕히 가세요 {{name}}",
    welcome: "환영합니다",
    count: "개수: {{count}}",
  },
} as const;

export type TranslationKey = keyof (typeof translations.en);

// component1.tsx
import { useTranslation } from "i18nexus";
import { TranslationKey } from "./types";

function Header() {
  const { t } = useTranslation<TranslationKey>();
  return <h1>{t("welcome")}</h1>;
}

// component2.tsx
function Greeting({ name }: { name: string }) {
  const { t } = useTranslation<TranslationKey>();
  return <p>{t("greeting", { name })}</p>;
}
```

### 예제 3: 동적 키 검증

```typescript
import { getTranslationKeyList } from "i18nexus";

function DynamicLookup() {
  const allKeys = getTranslationKeyList(translations.en);

  // allKeys는 ["greeting", "farewell", "welcome", "count"]

  return (
    <ul>
      {allKeys.map((key) => (
        <li key={key}>{key}</li>
      ))}
    </ul>
  );
}
```

## 비교: 타입 세이프 vs 기존 방식

| 상황 | 타입 세이프 (`useTranslation<Keys>()`) | 기존 방식 (`useTranslation()`) |
|------|------|------|
| 유효한 키 사용 | ✅ 컴파일 성공 | ✅ 컴파일 성공 |
| 존재하지 않는 키 사용 | ❌ **컴파일 에러** | ✅ 컴파일 성공 (런타임 에러) |
| 타이핑 에러 ("greting" 등) | ❌ **컴파일 에러** | ✅ 컴파일 성공 (런타임 에러) |
| 리팩토링 시 안전성 | ✅ 높음 | ❌ 낮음 |
| IDE 자동 완성 | ✅ 모든 유효한 키 제시 | ❌ 제시 없음 |

## 마이그레이션 가이드

### Step 1: 번역 객체에 `as const` 추가

```typescript
// Before
const translations = {
  en: { greeting: "Hello" },
  ko: { greeting: "안녕" },
};

// After
const translations = {
  en: { greeting: "Hello" },
  ko: { greeting: "안녕" },
} as const;
```

### Step 2: 키 타입 추출

```typescript
type TranslationKey = keyof (typeof translations.en);
```

### Step 3: `useTranslation` 업데이트

```typescript
// Before
const { t } = useTranslation();

// After
const { t } = useTranslation<TranslationKey>();
```

## 트러블슈팅

### 문제: "문자열 리터럴이 타입에 할당할 수 없습니다"

```typescript
// ❌ 문제 코드
const { t } = useTranslation<"greeting" | "farewell">();
t("invalid");  // Error: '"invalid"' is not assignable to '"greeting" | "farewell"'
```

**해결책**: 번역 객체에 정의된 키만 사용하세요.

```typescript
// ✅ 올바른 코드
const { t } = useTranslation<"greeting" | "farewell">();
t("greeting");  // OK
t("farewell");  // OK
```

### 문제: 타입을 하드코딩하기 싫어요

**해결책**: `as const`와 함께 타입을 추출하세요:

```typescript
const translations = {
  en: { greeting: "Hello", farewell: "Goodbye" },
  ko: { greeting: "안녕", farewell: "안녕히" },
} as const;

// 자동으로 타입이 추출됨
type Keys = keyof (typeof translations.en);

const { t } = useTranslation<Keys>();
```

## API 참조

### `useTranslation<K extends string = string>()`

```typescript
function useTranslation<K extends string = string>(): {
  t: TranslationFunction<K>;
  currentLanguage: string;
  isReady: boolean;
}
```

#### 제네릭 파라미터

- `K extends string = string`: 허용된 번역 키의 유니온 타입
  - 생략하면 모든 문자열 허용 (기존 방식)
  - 지정하면 해당 키만 허용

#### 반환값

- `t`: 타입 세이프 번역 함수 (제네릭 파라미터에 따라 키 검증)
- `currentLanguage`: 현재 언어 코드
- `isReady`: 번역이 준비됐는지 여부

## 베스트 프랙티스

### 1. 항상 `as const`를 사용하세요

```typescript
// ✅ Good
const translations = {
  en: { greeting: "Hello" },
} as const;

// ❌ Bad
const translations = {
  en: { greeting: "Hello" },
};
```

### 2. 재사용 가능한 타입을 중앙에서 관리하세요

```typescript
// translations/types.ts
export type TranslationKey = keyof (typeof translations.en);

// any-component.tsx
import { TranslationKey } from "./types";
const { t } = useTranslation<TranslationKey>();
```

### 3. IDE 자동 완성을 활용하세요

```typescript
const { t } = useTranslation<TranslationKey>();
t("|")  // IDE가 모든 유효한 키를 제시합니다
// - t("greeting")
// - t("farewell")
// - t("welcome")
```

### 4. 팀 프로젝트에서는 문서화하세요

```typescript
/**
 * 타입 세이프 번역 훅 (v2.8.0+)
 * 
 * @example
 * ```typescript
 * const { t } = useTranslation<TranslationKey>();
 * t("greeting", { name: "Alice" }); // ✅ OK
 * t("invalid");                      // ❌ Compile error
 * ```
 */
const { t } = useTranslation<TranslationKey>();
```

## 요약

✅ **구현 완료** (v2.8.0+):
- `useTranslation<K>()` 제네릭 파라미터 지원
- 컴파일 타임 키 검증
- 기존 코드 호환성 100%
- IDE 자동 완성 지원

✅ **이전 방식도 여전히 작동**:
- 제네릭 없이 `useTranslation()` 사용 가능
- 기존 프로젝트 마이그레이션 선택사항

✅ **추가 도구들**:
- `createTypedTranslation()`: 단일 언어 번역 함수
- `createMultiLangTypedTranslation()`: 다중 언어 팩토리
- `validateTranslationKeys()`: 런타임 검증
- `getTranslationKeyList()`: 유효한 키 목록 추출
