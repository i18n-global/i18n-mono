# useTranslation 사용 방법 가이드

## ✅ 네, 직접 import 가능합니다!

### 방법 1: 직접 Import (간단한 방법) ✅

```typescript
// ✅ 이미 가능하고 작동 중!
import { useTranslation, I18nProvider } from "i18nexus";

// Provider 설정
<I18nProvider
  translations={{
    en: { welcome: "Welcome", home: "Home" },
    ko: { welcome: "환영합니다", home: "홈" }
  }}
  languageManagerOptions={{ defaultLanguage: "en" }}
>
  <App />
</I18nProvider>

// 컴포넌트에서 사용
function MyComponent() {
  const { t } = useTranslation();  // ✅ 직접 사용! i18n. 없이!

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("home")}</p>
    </div>
  );
}
```

**이미 데모 앱에서 사용 중입니다!** ✅

- `apps/demo/app/page.tsx`
- `apps/demo/app/cli/page.tsx`
- 등등 19+ 파일에서 사용

---

### 방법 2: createI18n 사용 (네임스페이스 타입 안전) ✅

```typescript
// ✅ 이제 간단하게 import 가능!
import { createI18n, I18nProvider } from "i18nexus";

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
  const { t } = i18n.useTranslation("common");  // ✅ 네임스페이스 지정

  return <h1>{t("welcome")}</h1>;  // ✅ 타입 안전!
}
```

**개선 사항**: 이제 `createI18n`도 메인 export에서 사용 가능합니다! ✅

---

## 📊 비교표

| 방법       | Import                                      | 사용법                      | 타입 안전성               | 네임스페이스 |
| ---------- | ------------------------------------------- | --------------------------- | ------------------------- | ------------ |
| **방법 1** | `import { useTranslation } from "i18nexus"` | `useTranslation()`          | ✅ Provider에서 자동 추론 | ❌ 없음      |
| **방법 2** | `import { createI18n } from "i18nexus"`     | `i18n.useTranslation("ns")` | ✅ 완벽한 타입 안전       | ✅ 지원      |

---

## 💡 언제 어떤 방법을 사용할까?

### 🎯 방법 1 (직접 import) - 권장 상황

- ✅ 간단한 프로젝트
- ✅ 네임스페이스가 필요 없음
- ✅ 빠르게 시작하고 싶을 때
- ✅ 모든 번역 키가 하나의 풀에 있어도 괜찮을 때

```typescript
// ✅ 간단하고 직관적
import { useTranslation } from "i18nexus";

function Component() {
  const { t } = useTranslation();
  return <div>{t("welcome")}</div>;
}
```

### 🎯 방법 2 (createI18n) - 권장 상황

- ✅ 대규모 프로젝트
- ✅ 네임스페이스로 번역을 구조화하고 싶을 때
- ✅ 타입 안전성이 중요할 때
- ✅ 팀 협업 시 키 충돌 방지가 필요할 때

```typescript
// ✅ 타입 안전하고 구조화됨
import { createI18n } from "i18nexus";

const i18n = createI18n(translations);

function Component() {
  const { t } = i18n.useTranslation("common");
  return <div>{t("welcome")}</div>;
}
```

---

## 🎉 결론

### ✅ **직접 import 사용 가능!**

```typescript
// ✅ 이미 작동 중!
import { useTranslation } from "i18nexus";

const { t } = useTranslation();
```

### ✅ **createI18n도 이제 간단하게!**

```typescript
// ✅ 이제 메인 export에서 사용 가능!
import { createI18n } from "i18nexus";

const i18n = createI18n(translations);
const { t } = i18n.useTranslation("namespace");
```

**선택은 프로젝트 요구사항에 따라 자유롭게!** 🎯
