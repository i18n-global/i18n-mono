# useTranslation 사용 방법 비교

## 📊 두 가지 사용 방법

### ✅ 방법 1: 직접 Import (네임스페이스 없이)

```typescript
// ✅ 직접 import - 네임스페이스 없이 사용
import { useTranslation, I18nProvider } from "i18nexus";

// Provider 설정
<I18nProvider
  translations={{
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
  }}
  languageManagerOptions={{ defaultLanguage: "en" }}
>
  <App />
</I18nProvider>

// 컴포넌트에서 사용
function MyComponent() {
  const { t } = useTranslation();  // ✅ 직접 사용!

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("goodbye")}</p>
    </div>
  );
}
```

**장점:**

- ✅ 간단하고 직관적
- ✅ 네임스페이스 없이 빠르게 시작 가능
- ✅ 타입 추론은 I18nProvider의 translations에서 자동으로 됨

**단점:**

- ⚠️ 네임스페이스 타입 안전성 없음
- ⚠️ 모든 키가 하나의 풀에 있음

---

### ✅ 방법 2: createI18n 사용 (네임스페이스 타입 안전)

```typescript
// ✅ createI18n으로 타입 안전한 네임스페이스 사용
import { createI18n } from "i18nexus/utils/createI18n";

const translations = {
  common: {
    en: { welcome: "Welcome", goodbye: "Goodbye" },
    ko: { welcome: "환영합니다", goodbye: "안녕히 가세요" }
  },
  menu: {
    en: { home: "Home", about: "About" },
    ko: { home: "홈", about: "소개" }
  }
} as const;

const i18n = createI18n(translations);

// Provider 설정
<i18n.I18nProvider languageManagerOptions={{ defaultLanguage: "en" }}>
  <App />
</i18n.I18nProvider>

// 컴포넌트에서 사용
function MyComponent() {
  const { t } = i18n.useTranslation("common");  // ✅ 네임스페이스 지정!

  return (
    <div>
      <h1>{t("welcome")}</h1>  {/* ✅ 타입 안전! */}
      {/* t("home") */}  {/* ❌ TypeScript 에러! (home은 menu에만 있음) */}
    </div>
  );
}
```

**장점:**

- ✅ 완벽한 타입 안전성
- ✅ 네임스페이스별 키 자동완성
- ✅ 컴파일 타임 에러 감지

**단점:**

- ⚠️ 초기 설정이 조금 더 복잡
- ⚠️ `i18n.` 접두사 필요

---

## 🔄 실제 사용 예시

### 현재 데모 앱에서 사용 중인 방법

```typescript
// apps/demo/app/page.tsx
import { useTranslation } from "i18nexus";  // ✅ 직접 import!

export default function HomePage() {
  const { t } = useTranslation();  // ✅ 네임스페이스 없이 사용

  return <h1>{t("환영합니다")}</h1>;
}
```

**이미 작동하고 있습니다!** ✅

---

## 💡 권장 사용 패턴

### 🎯 간단한 프로젝트 (네임스페이스 불필요)

```typescript
// ✅ 직접 import 사용
import { useTranslation, I18nProvider } from "i18nexus";

<I18nProvider translations={translations}>
  <App />
</I18nProvider>

function Component() {
  const { t } = useTranslation();
  return <div>{t("key")}</div>;
}
```

### 🎯 대규모 프로젝트 (네임스페이스 필요)

```typescript
// ✅ createI18n 사용
import { createI18n } from "i18nexus/utils/createI18n";

const i18n = createI18n(translations);

<i18n.I18nProvider>
  <App />
</i18n.I18nProvider>

function Component() {
  const { t } = i18n.useTranslation("namespace");
  return <div>{t("key")}</div>;
}
```

---

## 📝 createI18n export 추가 제안

현재 `createI18n`이 `index.ts`에서 export되지 않아서:

```typescript
import { createI18n } from "i18nexus/utils/createI18n"; // ⚠️ 긴 경로
```

**개선 제안:**

```typescript
// packages/core/src/index.ts에 추가
export { createI18n } from "./utils/createI18n";
export type { CreateI18nReturn } from "./utils/createI18n";
```

그러면:

```typescript
import { createI18n } from "i18nexus"; // ✅ 간단!
```

---

## 🎯 결론

### ✅ **직접 import 사용 가능!**

```typescript
// ✅ 이미 가능하고 작동 중!
import { useTranslation } from "i18nexus";

const { t } = useTranslation();
```

### ✅ **createI18n도 사용 가능!**

```typescript
// ✅ 네임스페이스 타입 안전성이 필요할 때
import { createI18n } from "i18nexus/utils/createI18n";

const i18n = createI18n(translations);
const { t } = i18n.useTranslation("namespace");
```

**선택은 프로젝트 요구사항에 따라!** 🎯
