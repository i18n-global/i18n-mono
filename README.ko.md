# i18nexus

<div align="center">

![i18nexus Logo](https://img.shields.io/badge/i18nexus-Complete%20React%20i18n%20Toolkit-blue?style=for-the-badge)

[![npm version](https://badge.fury.io/js/i18nexus.svg)](https://badge.fury.io/js/i18nexus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**🌍 타입 안전한 React 국제화 툴킷 - 지능형 자동화 및 Server Components 지원**

[기능](#-기능) • [빠른 시작](#-빠른-시작) • [문서](#-문서) • [API 레퍼런스](#-api-레퍼런스)

[English](./README.md) | **한국어**

</div>

---

## 🚀 i18nexus란?

i18nexus는 **완전한 타입 안전성**을 갖춘 **i18n 워크플로우를 자동화**하는 포괄적인 React 국제화 툴킷입니다. TypeScript 설정 지원, 자동 문자열 래핑, 그리고 원활한 Google Sheets 통합으로 i18nexus는 지루한 수동 작업을 없애고 언어 코드에 대한 IDE 자동완성을 제공합니다.

### ✨ 주요 기능

- 🌐 **Accept-Language 자동 감지** - 사용자의 브라우저 언어 자동 감지
- 🎨 **변수 삽입** - `{{variable}}` 문법과 스타일 변수 지원
- 🎯 **타입 안전 언어** - IDE 자동완성이 가능한 TypeScript 설정
- 🖥️ **Server Components** - Next.js App Router 완벽 지원 및 hydration 이슈 제로
- 🛠️ **개발자 도구** - 시각적 디버깅을 위한 React Query 스타일 devtools
- 🤖 **제로 수동 작업** - 하드코딩된 문자열 자동 감지 및 래핑
- 🍪 **스마트 저장** - SSR 지원 쿠키 기반 언어 관리

---

## 🚀 빠른 시작

### 설치

```bash
npm install i18nexus
npm install -D i18nexus-tools  # CLI 도구를 위해 권장
```

### 1. 설정 초기화 (권장)

```bash
npx i18n-sheets init
```

`i18nexus.config.json` 생성:

```json
{
  "languages": ["en", "ko", "ja"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus"
}
```

**참고:** `i18nexus.config.json`이 권장되는 설정 형식입니다. TypeScript 설정 파일(`.ts`)은 레거시 방식이며 새 프로젝트에는 권장하지 않습니다.

### 2. Provider 설정 (Next.js App Router)

```tsx
// app/layout.tsx
import { createServerI18n } from "i18nexus/server";
import { I18nProvider } from "i18nexus";

export default async function RootLayout({ children }) {
  const { language } = await createServerI18n({
    availableLanguages: ["en", "ko", "ja"],
    defaultLanguage: "ko",
  });

  return (
    <html lang={language}>
      <body>
        <I18nProvider initialLanguage={language}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### 3. 번역 사용

**Server Component:**

```tsx
import { createServerI18n } from "i18nexus/server";

export default async function Page() {
  const { t, language } = await createServerI18n({
    availableLanguages: ["en", "ko", "ja"],
    defaultLanguage: "ko",
  });

  return (
    <div>
      <h1>{t("환영합니다 {{name}}", { name: "사용자" })}</h1>
      <p>현재 언어: {language}</p>
    </div>
  );
}
```

**Client Component:**

```tsx
"use client";
import { useTranslation } from "i18nexus";

export default function ClientComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("{{count}}개의 메시지가 있습니다", { count: 5 })}</p>
    </div>
  );
}
```

---

## 📚 문서

### 📖 완전한 문서
- **[문서 허브](./docs/README.md)** - 중앙 문서 포털

### 🎯 기능 가이드
- [🌐 Accept-Language 감지](./docs/guides/accept-language.md) - 브라우저 언어 자동 감지
- [🎨 변수 삽입](./docs/guides/interpolation.md) - 번역 내 동적 값
- [🎯 타입 안전 설정](./docs/guides/typed-config.md) - TypeScript 설정 구성
- [🛠️ 개발자 도구](./docs/guides/devtools.md) - 시각적 디버깅 도구

### 📚 API 레퍼런스
- [서버 사이드 API](./docs/api/server.md) - `createServerI18n`, `getServerLanguage` 등
- [클라이언트 사이드 API](./docs/api/client.md) - `useTranslation`, `useLanguageSwitcher` 등
- [TypeScript 타입](./docs/api/types.md) - 완전한 타입 정의

### 📋 릴리즈 노트
- [v2.7.0](./docs/releases/v2.7.0.md) - Accept-Language 자동 감지 (최신)
- [v2.6.0](./docs/releases/v2.6.0.md) - 변수 삽입 & CI/CD
- [v2.5.2](./docs/releases/v2.5.2.md) - 개발자 도구
- [v2.1.0](./docs/releases/v2.1.0.md) - Server Components 지원
- [전체 변경 로그](./docs/CHANGELOG.md)

---

## 🎯 핵심 기능

### 🌐 Accept-Language 자동 감지

`Accept-Language` 헤더에서 사용자의 브라우저 언어를 자동으로 감지합니다:

```tsx
const { t, language } = await createServerI18n({
  availableLanguages: ["en", "ko", "ja", "zh"],
  defaultLanguage: "ko",
});

// 다음 순서로 감지:
// 1. 쿠키 (사용자 선호)
// 2. Accept-Language 헤더 (브라우저 설정)
// 3. 기본 언어 (폴백)
```

### 🎨 변수 삽입

`{{variable}}` 문법으로 동적 값을 삽입합니다:

```tsx
// 기본
t("안녕하세요 {{name}}", { name: "세계" })

// 여러 변수
t("{{count}}/{{total}} 완료", { count: 7, total: 10 })

// 스타일 적용 (Client Component)
t("가격: {{amount}}", 
  { amount: 100 }, 
  { amount: { color: "red", fontWeight: "bold" } }
)
```

### 🎯 타입 안전 언어

```typescript
// 언어 타입 정의
type AppLanguages = "en" | "ko" | "ja";

const { changeLanguage } = useLanguageSwitcher<AppLanguages>();

changeLanguage("ko"); // ✅ 자동완성!
changeLanguage("fr"); // ❌ 컴파일 에러!
```

### 🛠️ 개발자 도구

```tsx
import { I18NexusDevtools } from "i18nexus";

<I18nProvider>
  <App />
  <I18NexusDevtools /> {/* Dev 모드에서만 */}
</I18nProvider>
```

---

## 📦 패키지 정보

- **이름:** i18nexus
- **버전:** 2.7.0
- **라이센스:** MIT
- **TypeScript:** ✅ 완벽 지원
- **번들 크기:** ~15KB (gzipped)

---

## 🤝 기여하기

기여를 환영합니다! 기여 가이드라인을 확인해주세요:

- 📖 [Contributing Guide (English)](./docs/CONTRIBUTING.md)
- 📖 [기여 가이드 (한국어)](./docs/CONTRIBUTING.ko.md)

버그 수정, 기능 추가, 문서 개선 등 모든 도움에 감사드립니다!

---

## 📄 라이센스

MIT License - 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.

---

## 🔗 링크

- 📦 [npm 패키지](https://www.npmjs.com/package/i18nexus)
- 🐙 [GitHub 저장소](https://github.com/manNomi/i18nexus)
- 📖 [문서](./docs/README.md)
- 🐛 [이슈 트래커](https://github.com/manNomi/i18nexus/issues)
- 💬 [토론](https://github.com/manNomi/i18nexus/discussions)

---

<div align="center">

**React 커뮤니티를 위해 ❤️로 만들었습니다**

[⭐ GitHub에서 Star 주기](https://github.com/manNomi/i18nexus) • [📦 npm에서 보기](https://www.npmjs.com/package/i18nexus)

</div>

