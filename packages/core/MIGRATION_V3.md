# i18nexus Core v3 마이그레이션 가이드

## 개요

i18nexus core v3에서는 **Context 기반 아키텍처**로 완전히 전환되었습니다.

### 변경 사항

| 항목 | v2 (Old) | v3 (New) |
|------|----------|----------|
| **메인 API** | `createI18n()` (싱글톤) | `I18nProvider` + `useTranslation()` |
| **상태 관리** | 글로벌 싱글톤 | React Context |
| **테스트 격리** | ❌ 어려움 | ✅ 완벽 |
| **SSR 지원** | ⚠️ 제한적 | ✅ 완전 지원 |
| **네임스페이스** | ✅ 지원 | ✅ 지원 + Lazy Loading |

---

## 마이그레이션 단계

### 1. locales/index.ts 수정

#### Before (v2)

```typescript
import { createI18n } from "i18nexus";

const translations = {
  common: {
    en: await import("./common/en.json"),
    ko: await import("./common/ko.json"),
  },
  home: {
    en: await import("./home/en.json"),
    ko: await import("./home/ko.json"),
  },
};

export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  lazy: true,
  loadNamespace,
});
```

#### After (v3)

```typescript
// locales/index.ts
import type koCommon from "./common/ko.json";
import type enCommon from "./common/en.json";
import type koHome from "./home/ko.json";
import type enHome from "./home/en.json";

export const translations = {
  common: {} as {
    ko: typeof koCommon;
    en: typeof enCommon;
  },
  home: {} as {
    ko: typeof koHome;
    en: typeof enHome;
  },
};

export async function loadNamespace(namespace: string, lang: string) {
  const module = await import(`./${namespace}/${lang}.json`);
  return module.default;
}
```

### 2. App Layout에 Provider 추가

#### Before (v2)

```tsx
// app/layout.tsx
import { i18n } from "@/locales";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

#### After (v3)

```tsx
// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { translations, loadNamespace } from "@/locales";
import { cookies } from "next/headers";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = cookieStore.get("i18n-language")?.value || "ko";

  return (
    <html lang={language}>
      <body>
        <I18nProvider
          initialLanguage={language}
          namespaceTranslations={translations}
          lazy={true}
          loadNamespace={loadNamespace}
          fallbackNamespace="common"
          preloadNamespaces={["common"]}
          languageManagerOptions={{
            defaultLanguage: "ko",
            availableLanguages: [
              { code: "ko", name: "한국어", flag: "🇰🇷" },
              { code: "en", name: "English", flag: "🇺🇸" },
            ],
          }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### 3. 컴포넌트에서 사용

#### Before (v2)

```tsx
"use client";

import { i18n } from "@/locales";

export default function HomePage() {
  const { t } = i18n.useTranslation("home");
  
  return <h1>{t("title")}</h1>;
}
```

#### After (v3)

```tsx
"use client";

import { useTranslation } from "i18nexus";

export default function HomePage() {
  const { t } = useTranslation("home");
  
  return <h1>{t("title")}</h1>;
}
```

### 4. 언어 전환

#### Before (v2)

```tsx
"use client";

import { i18n } from "@/locales";

export function LanguageSwitcher() {
  return (
    <button onClick={() => i18n.changeLanguage("en")}>
      English
    </button>
  );
}
```

#### After (v3)

```tsx
"use client";

import { useLanguageSwitcher } from "i18nexus";

export function LanguageSwitcher() {
  const { changeLanguage } = useLanguageSwitcher();
  
  return (
    <button onClick={() => changeLanguage("en")}>
      English
    </button>
  );
}
```

---

## 장점

### ✅ 1. 완벽한 테스트 격리

```tsx
// Before: 글로벌 싱글톤으로 테스트 간 상태 공유
describe("Component", () => {
  it("test 1", () => {
    i18n.changeLanguage("en"); // 다른 테스트에 영향!
  });
});

// After: 각 테스트마다 독립적인 Provider
describe("Component", () => {
  it("test 1", () => {
    render(
      <I18nProvider initialLanguage="en" {...}>
        <Component />
      </I18nProvider>
    );
    // 완전히 격리됨!
  });
});
```

### ✅ 2. SSR/RSC 완벽 지원

```tsx
// Before: 서버에서 항상 defaultLanguage 사용
const { t } = i18n.useTranslation(); // ❌ 쿠키 무시

// After: 서버에서 initialLanguage 사용
<I18nProvider initialLanguage={language}> {/* ✅ SSR 지원 */}
  {children}
</I18nProvider>
```

### ✅ 3. React 패러다임 준수

```tsx
// Before: React 렌더링 사이클 우회
i18n.changeLanguage("en"); // 어디서든 직접 호출

// After: React Context 기반
const { changeLanguage } = useLanguageSwitcher(); // Hook 사용
changeLanguage("en"); // React 상태 관리
```

---

## 하위 호환성

`createI18n`은 여전히 작동하지만 **deprecated**로 표시됩니다.

```typescript
// ⚠️ Deprecated (여전히 작동하지만 권장하지 않음)
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});

// ✅ 권장
<I18nProvider
  namespaceTranslations={translations}
  fallbackNamespace="common"
>
  {children}
</I18nProvider>
```

---

## FAQ

### Q: 기존 코드를 당장 마이그레이션해야 하나요?

A: 아니요. `createI18n`은 여전히 작동합니다. 점진적으로 마이그레이션하세요.

### Q: Lazy loading도 지원하나요?

A: 네! `lazy={true}`와 `loadNamespace` prop을 사용하세요.

### Q: 네임스페이스 없이 사용할 수 있나요?

A: 네! `translations` prop에 플랫 구조를 전달하세요:

```tsx
<I18nProvider
  translations={{
    ko: koTranslations,
    en: enTranslations,
  }}
>
  {children}
</I18nProvider>
```

### Q: 서버 컴포넌트에서는요?

A: `getServerTranslation()`은 여전히 지원됩니다 (추후 개선 예정).

---

## 완전한 예시

```tsx
// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { translations, loadNamespace } from "@/locales";
import { cookies } from "next/headers";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = cookieStore.get("i18n-language")?.value || "ko";

  return (
    <html lang={language}>
      <body>
        <I18nProvider
          initialLanguage={language}
          namespaceTranslations={translations}
          lazy={true}
          loadNamespace={loadNamespace}
          fallbackNamespace="common"
          preloadNamespaces={["common"]}
          languageManagerOptions={{
            defaultLanguage: "ko",
            availableLanguages: [
              { code: "ko", name: "한국어" },
              { code: "en", name: "English" },
            ],
          }}
        >
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

```tsx
// page/home/page.tsx
"use client";

import { useTranslation, useLanguageSwitcher } from "i18nexus";

export default function HomePage() {
  const { t, currentLanguage } = useTranslation("home");
  const { changeLanguage } = useLanguageSwitcher();

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      
      <button onClick={() => changeLanguage("en")}>
        English
      </button>
      <button onClick={() => changeLanguage("ko")}>
        한국어
      </button>
      
      <p>Current: {currentLanguage}</p>
    </div>
  );
}
```

---

## 결론

v3는 더 안전하고, 테스트하기 쉽고, React 생태계와 잘 통합됩니다. 🚀

