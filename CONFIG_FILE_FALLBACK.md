# i18nexus.config.json Fallback Namespace 설정

## 🎯 개요

`i18nexus.config.json` 파일에 `fallbackNamespace`를 설정하면, `createI18n`을 호출할 때 자동으로 적용됩니다.

---

## 📝 설정 파일에 Fallback Namespace 추가

### i18nexus.config.json

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{js,jsx,ts,tsx}",
  "translationImportSource": "i18nexus",
  "fallbackNamespace": "common",
  "googleSheets": {
    "spreadsheetId": "...",
    "credentialsPath": "./credentials.json",
    "sheetName": "translation"
  }
}
```

### 설정 항목

- **`fallbackNamespace`** (선택): Fallback 네임스페이스 이름
  - 예: `"common"`, `"shared"`, `"default"` 등
  - 설정하지 않으면 fallback 기능이 비활성화됩니다

- **`enableFallback`** (선택, 기본값: `true`): Fallback 기능 활성화 여부

---

## 🔧 사용 방법

### 방법 1: createI18nWithConfig 사용 (권장)

설정 파일을 자동으로 읽어서 적용합니다:

```typescript
import { createI18nWithConfig } from "i18nexus/config";
import { translations } from "./locales";

// ✅ i18nexus.config.json에서 자동으로 fallbackNamespace 읽어옴
const i18n = createI18nWithConfig(translations);

// 이제 네임스페이스 없이 사용 가능!
function MyComponent() {
  const { t } = i18n.useTranslation();

  t("welcome"); // ✅ common(fallback)에서
  t("home"); // ✅ menu에서
  t("dashboard"); // ✅ admin에서
}
```

### 방법 2: 수동으로 설정 파일 읽기

```typescript
import { createI18n } from "i18nexus";
import { loadI18nexusConfig } from "i18nexus/config";
import { translations } from "./locales";

// 설정 파일 읽기
const config = loadI18nexusConfig();

// createI18n에 적용
const i18n = createI18n(translations, {
  fallbackNamespace: config?.fallbackNamespace as any,
  enableFallback: config?.enableFallback ?? true,
});
```

### 방법 3: 기존 방식 (설정 파일 무시)

```typescript
import { createI18n } from "i18nexus";
import { translations } from "./locales";

// 수동으로 fallbackNamespace 지정
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});
```

---

## 📊 비교

| 방법                   | 설정 파일 사용 | 코드 간결성  | 권장                     |
| ---------------------- | -------------- | ------------ | ------------------------ |
| `createI18nWithConfig` | ✅ 자동        | ✅ 매우 간결 | ✅ **권장**              |
| 수동 읽기              | ⚠️ 수동        | ⚠️ 약간 복잡 | ⚠️ 유연함                |
| 기존 방식              | ❌ 사용 안 함  | ✅ 간결      | ✅ 설정 파일 불필요할 때 |

---

## 🎨 예제

### 완전한 예제

#### 1. i18nexus.config.json 설정

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus",
  "fallbackNamespace": "common"
}
```

#### 2. 번역 파일 (locales/index.ts)

```typescript
import enCommon from "./en/common.json";
import koCommon from "./ko/common.json";
import enMenu from "./en/menu.json";
import koMenu from "./ko/menu.json";

export const translations = {
  common: {
    en: enCommon,
    ko: koCommon,
  },
  menu: {
    en: enMenu,
    ko: koMenu,
  },
} as const;
```

#### 3. i18n 설정 (lib/i18n.ts)

```typescript
import { createI18nWithConfig } from "i18nexus/config";
import { translations } from "./locales";

// ✅ 설정 파일에서 자동으로 fallbackNamespace 적용
export const i18n = createI18nWithConfig(translations);
```

#### 4. 사용 (app/layout.tsx)

```typescript
import { i18n } from '@/lib/i18n';

export default function Layout({ children }) {
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

#### 5. 컴포넌트에서 사용

```typescript
function HomePage() {
  // ✅ 네임스페이스 없이 사용 가능!
  const { t } = i18n.useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>  {/* ✅ common에서 */}
      <nav>
        <a href="/">{t("home")}</a>  {/* ✅ menu에서 */}
        <a href="/about">{t("about")}</a>  {/* ✅ menu에서 */}
      </nav>
    </div>
  );
}
```

---

## ⚙️ 고급 설정

### 설정 파일 우선순위

`createI18nWithConfig`를 사용할 때:

1. **설정 파일** (`i18nexus.config.json`)에서 `fallbackNamespace` 읽기
2. **옵션 매개변수**로 전달된 값이 있으면 그것을 우선 사용

```typescript
// 설정 파일: { "fallbackNamespace": "common" }

const i18n = createI18nWithConfig(translations, {
  fallbackNamespace: "custom", // ✅ "custom"이 우선 사용됨
});
```

### Fallback 비활성화

```json
{
  "fallbackNamespace": "common",
  "enableFallback": false
}
```

또는

```typescript
const i18n = createI18nWithConfig(translations, {
  enableFallback: false, // ✅ Fallback 비활성화
});
```

---

## 🔍 타입 안전성

### 타입 추론

```typescript
const i18n = createI18nWithConfig(translations);

// ✅ 모든 네임스페이스 키 타입 추론
const { t } = i18n.useTranslation();
t("welcome"); // ✅ 타입 안전
t("home"); // ✅ 타입 안전
t("invalid"); // ❌ TypeScript 에러
```

---

## 📚 추가 리소스

- [Fallback Namespace 사용 가이드](./FALLBACK_NAMESPACE_USAGE_GUIDE.md)
- [Fallback Namespace 기획서](./FALLBACK_NAMESPACE_DESIGN.md)
- [API 레퍼런스](./packages/core/docs/API_REFERENCE.md)

---

## 💡 팁

1. **프로젝트 초기 설정**: `i18n-sheets init` 명령으로 설정 파일 생성 후 `fallbackNamespace` 추가
2. **일관성**: 프로젝트 전체에서 동일한 fallback namespace 사용 권장
3. **타입 안전성**: `createI18nWithConfig`를 사용하면 타입 추론이 자동으로 작동합니다
