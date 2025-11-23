# Type-Safe Translation Keys

Type-safe translation 시스템으로 **컴파일 타임에 잘못된 번역 키를 감지**할 수 있습니다. 더 이상 런타임 에러로 키 매칭 문제를 겪지 않습니다!

## 🎯 문제 정의

기존 방식의 문제점:

```typescript
// ❌ 문제: 키 오타가 런타임에 발견됨
const translations = {
  en: { greeting: "Hello {{name}}" },
  ko: { greeting: "안녕 {{name}}" },
};

const { t } = useTranslation();
t("greting"); // 오타! 하지만 TypeScript는 모름. 런타임 에러

// ❌ 언어 간 키 불일치 감지 불가
const badTranslations = {
  en: { greeting: "Hello", farewell: "Goodbye" },
  ko: { greeting: "안녕" }, // farewell이 없음! 에러 모름
};
```

## ✅ 해결책: Type-Safe Translation

### 1단계: const assertion으로 translations 정의

```typescript
const translations = {
  en: {
    welcome: "Welcome",
    greeting: "Hello {{name}}",
  },
  ko: {
    welcome: "환영합니다",
    greeting: "안녕하세요 {{name}}",
  },
} as const; // ← 중요: const assertion
```

### 2단계: 타입 추출

```typescript
import { ExtractTranslationKeys } from "i18nexus";

type AppKeys = ExtractTranslationKeys<typeof translations>;
// Result: "welcome" | "greeting"
```

### 3단계: 유효성 검증 (선택사항)

```typescript
import { validateTranslationKeys } from "i18nexus";

// 런타임에 모든 언어의 키가 일치하는지 확인
validateTranslationKeys(translations);
// ✅ 모두 일치하면 통과
// ❌ 불일치하면 에러 발생
```

## 🔧 API 문서

### `createTypedTranslation(translations)`

단일 언어의 type-safe 번역 함수 생성:

```typescript
import { createTypedTranslation } from "i18nexus";

const en = {
  greeting: "Hello {{name}}",
  count: "You have {{count}} items",
} as const;

const t = createTypedTranslation(en);

// ✅ Valid - 키가 정확함
t("greeting", { name: "Alice" }); // "Hello Alice"

// ❌ Compile Error - 존재하지 않는 키
t("invalid_key"); // Error: '"invalid_key"' is not assignable to '"greeting" | "count"'
```

**반환 타입:**

```typescript
(key: K, variables?: Record<string, string | number>) => string;
```

### `createTypedTranslationWithStyles(translations)`

스타일링을 지원하는 type-safe 번역 함수:

```typescript
import { createTypedTranslationWithStyles } from "i18nexus";

const t = createTypedTranslationWithStyles(en);

// 스타일 없음 - 문자열 반환
t("greeting", { name: "Alice" });
// Returns: "Hello Alice"

// 스타일 있음 - React element 반환
t(
  "greeting",
  { name: "Alice" },
  { name: { color: "red", fontWeight: "bold" } }
);
// Returns: <>Hello <span style={{color: "red", fontWeight: "bold"}}>Alice</span></>
```

### `createMultiLangTypedTranslation(translations)`

여러 언어를 한번에 관리:

```typescript
import { createMultiLangTypedTranslation } from "i18nexus";

const translations = {
  en: { greeting: "Hello {{name}}" },
  ko: { greeting: "안녕 {{name}}" },
} as const;

const getT = createMultiLangTypedTranslation(translations);

// 각 언어별 type-safe 함수 생성
const tEn = getT("en");
const tKo = getT("ko");

// ✅ 둘 다 유효한 키만 받음
tEn("greeting", { name: "Alice" }); // "Hello Alice"
tKo("greeting", { name: "철수" }); // "안녕 철수"
```

### `validateTranslationKeys(translations)`

런타임에 모든 언어의 키가 일치하는지 확인:

```typescript
import { validateTranslationKeys } from "i18nexus";

const translations = {
  en: { greeting: "Hello", farewell: "Goodbye" },
  ko: { greeting: "안녕", farewell: "안녕히" }, // ✅ 모두 일치
  ja: { greeting: "こんにちは" }, // ❌ farewell 없음
};

validateTranslationKeys(translations);
// Error: Missing key "farewell" in language "ja". Found in "en" but not in "ja".
```

**사용 시기:**

- 테스트 코드에서 번역 일관성 검증
- CI/CD 파이프라인에서 배포 전 검증
- 개발 환경 초기화 시 자동 검증

### `getTranslationKeyList(translations)`

모든 valid 키 목록 가져오기:

```typescript
import { getTranslationKeyList } from "i18nexus";

const en = {
  greeting: "Hello",
  farewell: "Goodbye",
  count: "Count: {{count}}",
} as const;

const keys = getTranslationKeyList(en);
// Returns: ["greeting", "farewell", "count"]

// 런타임 동적 검증 시 유용
if (keys.includes(userInput)) {
  const result = t(userInput as any); // 이제 안전
}
```

### 타입 유틸리티

#### `ExtractTranslationKeys<T>`

여러 언어 객체에서 모든 valid 키 추출:

```typescript
import { ExtractTranslationKeys } from "i18nexus";

const translations = {
  en: { greeting: "Hello", count: "Count: {{count}}" },
  ko: { greeting: "안녕", count: "개수: {{count}}" },
} as const;

type ValidKeys = ExtractTranslationKeys<typeof translations>;
// Result: "greeting" | "count"
```

#### `ExtractLanguageKeys<T>`

단일 언어 객체에서 valid 키 추출:

```typescript
import { ExtractLanguageKeys } from "i18nexus";

const en = { greeting: "Hello", count: "Count" } as const;

type EnKeys = ExtractLanguageKeys<typeof en>;
// Result: "greeting" | "count"
```

## 💡 베스트 프랙티스

### 1. 항상 `as const` 사용

```typescript
// ✅ Good
const translations = {
  en: { greeting: "Hello" },
  ko: { greeting: "안녕" },
} as const;

// ❌ Bad - 타입이 string이 되어 type safety 손실
const translations = {
  en: { greeting: "Hello" },
  ko: { greeting: "안녕" },
};
```

### 2. 모든 언어 키 일치 확인

```typescript
// 테스트 파일에서
import { validateTranslationKeys } from "i18nexus";
import { translations } from "./i18n";

describe("Translations", () => {
  it("should have matching keys across all languages", () => {
    expect(() => validateTranslationKeys(translations)).not.toThrow();
  });
});
```

### 3. I18nProvider와 함께 사용

```typescript
import { I18nProvider, useTranslation } from "i18nexus";
import { translations, AppLanguages } from "./i18n";

function App() {
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
      <Content />
    </I18nProvider>
  );
}

function Content() {
  const { t } = useTranslation();

  // ✅ Type-safe - valid 키만 가능
  return <h1>{t("greeting", { name: "User" })}</h1>;
}
```

## 🚀 예제

### 완벽한 설정 예제

```typescript
// i18n.ts
import { validateTranslationKeys, ExtractTranslationKeys } from "i18nexus";

export const translations = {
  en: {
    welcome: "Welcome to our app",
    greeting: "Hello {{name}}, you are {{age}} years old",
    error: "An error occurred",
  },
  ko: {
    welcome: "우리 앱에 오신 것을 환영합니다",
    greeting: "안녕하세요 {{name}}님, 나이가 {{age}}살이군요",
    error: "오류가 발생했습니다",
  },
} as const;

// 빌드 타임에 키 타입 추출
export type AppTranslationKey = ExtractTranslationKeys<typeof translations>;

// 런타임에 검증
validateTranslationKeys(translations);
```

```typescript
// Component.tsx
import { useTranslation } from "i18nexus";
import { AppTranslationKey } from "./i18n";

function MyComponent() {
  const { t } = useTranslation();

  const key: AppTranslationKey = "greeting"; // ✅ Type-safe

  return (
    <div>
      {/* ✅ 모두 컴파일 타임에 검증됨 */}
      <h1>{t("welcome")}</h1>
      <p>{t("greeting", { name: "Alice", age: 25 })}</p>

      {/* ❌ 컴파일 에러 */}
      {/* {t("invalid_key")} */}
    </div>
  );
}
```

## 🔍 일반적인 에러 메시지

### 에러: 존재하지 않는 키

```
Type '"invalid_key"' is not assignable to type '"welcome" | "greeting" | "error"'
```

**해결:**

- 올바른 키 이름 사용
- `getTranslationKeyList()`로 valid 키 확인

### 에러: 언어 간 키 불일치

```
Missing key "greeting" in language "ko". Found in "en" but not in "ko".
```

**해결:**

- 모든 언어에 동일한 키 추가
- `validateTranslationKeys()`로 검증

### 에러: 타입 안정성 손실

```
const translations = { en: { greeting: "Hello" } }; // as const 없음
// 타입이 { en: { greeting: string } }가 되어 string으로 추론됨
```

**해결:**

- 항상 `as const` 사용

## 📊 비교표

| 방식                          | 컴파일 타임 검증 | IDE 자동완성 | 런타임 검증 | 복잡도 |
| ----------------------------- | :--------------: | :----------: | :---------: | ------ |
| String literal                |        ✅        |      ✅      |     ❌      | 낮음   |
| createTypedTranslation        |        ✅        |      ✅      |     ✅      | 중간   |
| I18nProvider + useTranslation |        ✅        |      ✅      |     ✅      | 중간   |
| 커스텀 type guard             |        ✅        |      ⚠️      |     ✅      | 높음   |

## 🎓 학습 리소스

- [TypeScript Const Assertions](https://www.typescriptlang.org/docs/handbook/3-8.html#type-only-imports-and-export-names)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [i18nexus GitHub Examples](https://github.com/manNomi/i18nexus/tree/main/examples)
