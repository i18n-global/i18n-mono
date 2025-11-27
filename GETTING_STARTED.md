# i18nexus 시작 가이드

## 🚀 빠른 시작

### 1. 설치

```bash
npm install i18nexus
```

### 2. 번역 파일 정의

```typescript
// locales/index.ts
const translations = {
  common: {
    en: {
      welcome: "Welcome",
      logout: "Logout",
      greeting: "Hello {{name}}",
    },
    ko: {
      welcome: "환영합니다",
      logout: "로그아웃",
      greeting: "안녕하세요 {{name}}",
    },
  },
  menu: {
    en: {
      home: "Home",
      about: "About",
      contact: "Contact",
    },
    ko: {
      home: "홈",
      about: "소개",
      contact: "연락처",
    },
  },
} as const;

export { translations };
```

### 3. i18n 시스템 생성

```typescript
// lib/i18n.ts
import { createI18n } from "i18nexus";
import { translations } from "./locales";

export const i18n = createI18n(translations, {
  fallbackNamespace: "common", // 네임스페이스 없이 사용 시 기본값
});
```

### 4. Provider로 앱 감싸기

```typescript
// app/layout.tsx (Next.js) 또는 App.tsx (React)
import { i18n } from "@/lib/i18n";

export default function RootLayout({ children }) {
  return (
    <i18n.I18nProvider
      languageManagerOptions={{
        defaultLanguage: "en",
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
        ],
      }}
    >
      {children}
    </i18n.I18nProvider>
  );
}
```

### 5. 컴포넌트에서 사용

```typescript
import { i18n } from "@/lib/i18n";

function HomePage() {
  // ✅ 네임스페이스 없이 사용 → 모든 키 접근 가능
  const { t } = i18n.useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <nav>
        <a href="/">{t("home")}</a>
        <a href="/about">{t("about")}</a>
      </nav>
    </div>
  );
}
```

---

## 🎯 주요 기능

### 1. 네임스페이스 선택적 사용

```typescript
// ✅ 네임스페이스 없이 → 모든 키 접근
const { t } = i18n.useTranslation();
t("welcome"); // common에서
t("home"); // menu에서

// ✅ 특정 네임스페이스 지정
const { t: tMenu } = i18n.useTranslation("menu");
tMenu("home"); // menu 네임스페이스 키만
```

### 2. 완벽한 타입 지원

```typescript
const { t } = i18n.useTranslation();

t("welcome"); // ✅ 자동완성
t("home"); // ✅ 자동완성
t("invalid"); // ❌ TypeScript 에러
```

### 3. 변수 interpolation

```typescript
const { t } = i18n.useTranslation();

t("greeting", { name: "World" }); // "Hello World"
```

### 4. 언어 전환

```typescript
import { useLanguageSwitcher } from "i18nexus";

function LanguageSwitcher() {
  const { currentLanguage, switchLanguage, availableLanguages } =
    useLanguageSwitcher();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => switchLanguage(e.target.value)}
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

---

## ⚙️ 설정 파일 (선택)

### i18nexus.config.json

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "fallbackNamespace": "common"
}
```

### createI18nWithConfig 사용

```typescript
import { createI18nWithConfig } from "i18nexus/config";
import { translations } from "./locales";

// ✅ 설정 파일에서 자동으로 fallbackNamespace 읽어옴
export const i18n = createI18nWithConfig(translations);
```

---

## 🎨 사용 패턴

### 패턴 1: 간단한 사용 (권장)

```typescript
function MyComponent() {
  const { t } = i18n.useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("greeting", { name: "User" })}</p>
    </div>
  );
}
```

### 패턴 2: 네임스페이스 구분

```typescript
function ComplexComponent() {
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");

  return (
    <div>
      <h1>{tCommon("welcome")}</h1>
      <nav>
        <a href="/">{tMenu("home")}</a>
      </nav>
    </div>
  );
}
```

---

## 🔧 서버 컴포넌트 (Next.js)

### 사용법

```typescript
import { createServerI18n } from "i18nexus/server";

export default async function ServerPage() {
  const { t, dict, language } = await createServerI18n();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{dict.greeting}</p>
      <span>Language: {language}</span>
    </div>
  );
}
```

---

## 📚 다음 단계

- [Fallback Namespace 가이드](./FALLBACK_NAMESPACE_USAGE_GUIDE.md)
- [설정 파일 가이드](./CONFIG_FILE_FALLBACK.md)
- [API 레퍼런스](./packages/core/docs/API_REFERENCE.md)
- [테스트 검증 보고서](./TEST_VERIFICATION_REPORT.md)

---

## 💡 핵심 원칙

1. ✅ **createI18n 사용**: 타입 안전성 보장
2. ✅ **fallbackNamespace 설정**: 간편한 사용
3. ✅ **`as const` 사용**: 완벽한 타입 추론
4. ✅ **설정 파일 활용**: 일관된 설정 관리

---

## ⚠️ Deprecated

```typescript
// ❌ 직접 useTranslation import (권장하지 않음)
import { useTranslation } from "i18nexus";
const { t } = useTranslation();

// ✅ createI18n 사용 (권장)
import { createI18n } from "i18nexus";
const i18n = createI18n(translations, { fallbackNamespace: "common" });
const { t } = i18n.useTranslation();
```
