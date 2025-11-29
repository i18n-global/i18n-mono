# 🌐 i18nexus

> **Type-safe React i18n toolkit with intelligent automation and SSR support**

i18nexus는 React 애플리케이션을 위한 현대적이고 타입 안전한 국제화(i18n) 라이브러리입니다. TypeScript의 강력한 타입 시스템을 활용하여 번역 키와 값을 자동으로 검증하고, Next.js의 최신 기능(App Router, Server Components)을 완벽하게 지원합니다.

[![NPM Version](https://img.shields.io/npm/v/i18nexus)](https://www.npmjs.com/package/i18nexus)
[![NPM Downloads](https://img.shields.io/npm/dm/i18nexus)](https://www.npmjs.com/package/i18nexus)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ 주요 특징

### 🔒 완벽한 타입 안정성

- 번역 키 자동 완성 및 타입 체크
- 번역 값의 매개변수 타입 검증
- 컴파일 타임 오류 감지

### ⚡ 현대적인 React 지원

- Next.js 14+ App Router 지원
- Server Components에서의 번역
- Client Components에서의 번역
- React Server Actions 지원

### 🌍 유연한 네임스페이스

- 페이지별 번역 파일 분리
- 컴포넌트별 번역 관리
- 동적 네임스페이스 로딩
- 폴백 네임스페이스 지원

### 🎯 개발자 친화적

- 제로 설정으로 빠른 시작
- 직관적인 API 디자인
- 상세한 TypeScript 타입
- 풍부한 문서와 예제

### 🔥 성능 최적화

- 경량 번들 사이즈
- 지연 로딩 지원
- 효율적인 메모리 사용
- Hot Module Replacement 지원

## 📦 설치

```bash
npm install i18nexus
# or
yarn add i18nexus
# or
pnpm add i18nexus
```

## 🚀 빠른 시작

### 1. 번역 파일 생성

```typescript
// lib/i18n.ts
import { createI18n } from "i18nexus";

export const translations = {
  common: {
    ko: {
      환영합니다: "환영합니다",
      안녕하세요: "안녕하세요, {{name}}님",
    },
    en: {
      환영합니다: "Welcome",
      안녕하세요: "Hello, {{name}}",
    },
  },
  home: {
    ko: {
      시작하기: "시작하기",
      "문서 보기": "문서 보기",
    },
    en: {
      시작하기: "Get Started",
      "문서 보기": "View Docs",
    },
  },
} as const;

// 타입 안전한 i18n 시스템 생성
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});
```

### 2. Provider 설정

Next.js App Router의 루트 레이아웃에 Provider를 추가합니다:

```tsx
// app/layout.tsx
import { headers } from "next/headers";
import { getServerLanguage } from "i18nexus/server";
import { i18n } from "@/lib/i18n";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  return (
    <html lang={language}>
      <body>
        <i18n.I18nProvider initialLanguage={language}>
          {children}
        </i18n.I18nProvider>
      </body>
    </html>
  );
}
```

### 3. 컴포넌트에서 사용

#### Client Component

```tsx
"use client";
import { i18n } from "@/lib/i18n";

export default function WelcomeClient() {
  const { t } = i18n.useTranslation("common");

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("안녕하세요", { name: "홍길동" })}</p>
    </div>
  );
}
```

#### Server Component

```tsx
import { i18n } from "@/lib/i18n";

export default async function WelcomeServer() {
  const { t } = await i18n.getServerTranslation("common");

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("안녕하세요", { name: "홍길동" })}</p>
    </div>
  );
}
```

## 📖 API 레퍼런스

### `createI18n(translations, options?)`

타입 안전한 i18n 시스템을 생성합니다.

```typescript
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  lazy: true,
  loadNamespace: async (namespace, lang) => {
    const module = await import(`./locales/${namespace}/${lang}.json`);
    return module.default;
  },
});
```

**반환값:**

- `I18nProvider` - Provider 컴포넌트
- `useTranslation` - Client Component용 훅
- `getServerTranslation` - Server Component용 함수

### `i18n.useTranslation(namespace?)`

Client Component에서 번역을 사용하는 Hook입니다.

```tsx
const { t } = i18n.useTranslation("common");
```

**반환값:**

- `t(key, variables?)` - 번역 함수

### `i18n.getServerTranslation(namespace?)`

Server Component에서 번역을 가져오는 함수입니다.

```tsx
const { t, language } = await i18n.getServerTranslation("common");
```

**반환값:**

- `t(key, variables?)` - 번역 함수
- `language` - 현재 언어 (자동 감지)

### `useLanguageSwitcher()`

언어 전환 기능을 제공하는 Hook입니다.

```tsx
const { currentLanguage, changeLanguage, availableLanguages } =
  useLanguageSwitcher();
```

**반환값:**

- `currentLanguage` - 현재 언어
- `changeLanguage(lang)` - 언어 변경 함수
- `availableLanguages` - 사용 가능한 언어 목록

## 🎨 고급 사용법

### 네임스페이스 사용

페이지별 또는 기능별로 번역 파일을 분리할 수 있습니다:

```
locales/
├── ko.json              # 공통 번역
├── en.json
├── page.tsx/
│   ├── ko.json          # 페이지 전용 번역
│   └── en.json
└── components/
    ├── header/
    │   ├── ko.json      # 헤더 컴포넌트 전용 번역
    │   └── en.json
```

사용 예시:

```tsx
// 네임스페이스 지정
const { t } = useTranslation("page.tsx");

// 또는 동적 로딩
const { t, loadNamespace } = useTranslation();

useEffect(() => {
  loadNamespace("components/header");
}, []);
```

### 변수 보간

번역 텍스트에 변수를 삽입할 수 있습니다:

```json
{
  "welcome": "환영합니다, {{name}}님!",
  "stats": "{{count}}개의 항목이 있습니다"
}
```

```tsx
t("welcome", { name: "홍길동" }); // "환영합니다, 홍길동님!"
t("stats", { count: 5 }); // "5개의 항목이 있습니다"
```

### 복수형 처리

```json
{
  "items": {
    "zero": "항목이 없습니다",
    "one": "{{count}}개의 항목",
    "other": "{{count}}개의 항목들"
  }
}
```

```tsx
t("items", { count: 0 }); // "항목이 없습니다"
t("items", { count: 1 }); // "1개의 항목"
t("items", { count: 5 }); // "5개의 항목들"
```

### 쿠키 기반 언어 설정

사용자가 선택한 언어는 자동으로 쿠키에 저장됩니다:

```tsx
const { changeLanguage } = useTranslation();

// 언어 변경 (자동으로 쿠키에 저장)
changeLanguage("en");

// 페이지 새로고침 시 저장된 언어로 자동 복원
```

### TypeScript 타입 안정성

번역 키를 자동으로 타입 체크할 수 있습니다:

```tsx
// 타입 안전 사용
t("common.welcome"); // ✅ OK
t("common.invalid"); // ❌ TypeScript 오류

// 매개변수 타입 체크
t("common.hello", { name: "홍길동" }); // ✅ OK
t("common.hello", { age: 30 }); // ❌ TypeScript 오류
```

## 🔧 설정 옵션

### i18nexus.config.json

```json
{
  "defaultLanguage": "ko",
  "supportedLanguages": ["ko", "en", "ja", "zh"],
  "translationDir": "./locales",
  "sourceDir": "./app",
  "fallbackLanguage": "en",
  "cookieName": "i18n-language",
  "enableTypeGeneration": true,
  "namespaceDelimiter": ".",
  "variablePattern": "{{(\\w+)}}"
}
```

**옵션 설명:**

- `defaultLanguage`: 기본 언어
- `supportedLanguages`: 지원하는 언어 목록
- `translationDir`: 번역 파일 디렉토리
- `sourceDir`: 소스 코드 디렉토리
- `fallbackLanguage`: 번역이 없을 때 사용할 언어
- `cookieName`: 언어 설정 쿠키 이름
- `enableTypeGeneration`: 타입 생성 활성화
- `namespaceDelimiter`: 네임스페이스 구분자
- `variablePattern`: 변수 패턴 (정규식)

## 🛠️ CLI 도구와 함께 사용

i18nexus는 강력한 CLI 도구(`i18nexus-tools`)와 함께 사용할 수 있습니다:

```bash
# CLI 도구 설치
npm install -D i18nexus-tools

# 번역 키 자동 추출
npx i18n-extractor

# Google Sheets 연동
npx i18n-upload
npx i18n-download

# 컴포넌트 자동 래핑
npx i18n-wrapper
```

자세한 내용은 [i18nexus-tools 문서](../tools/README.md)를 참조하세요.

## 📚 추가 문서

- [API 레퍼런스](./docs/API_REFERENCE.md)
- [TypeScript 가이드](./docs/TYPESCRIPT_GUIDE.md)
- [배포 가이드](./docs/DEPLOYMENT_SETUP.md)
- [트러블슈팅](./docs/TROUBLESHOOTING.md)
- [마이그레이션 가이드](./docs/guides/migration-guide.md)
- [베스트 프랙티스](./docs/guides/best-practices.md)

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 커버리지 리포트
npm test -- --coverage
```

## 🤝 기여하기

기여를 환영합니다! 다음 방법으로 참여할 수 있습니다:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

자세한 내용은 [CONTRIBUTING.md](./docs/CONTRIBUTING.md)를 참조하세요.

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 🙏 크레딧

이 프로젝트는 다음 라이브러리들의 영감을 받았습니다:

- [react-i18next](https://react.i18next.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [i18next](https://www.i18next.com/)

## 📞 지원

- 🐛 [이슈 리포트](https://github.com/manNomi/i18nexus/issues)
- 💬 [토론](https://github.com/manNomi/i18nexus/discussions)
- 📧 Email: support@i18nexus.com
- 📖 [Documentation](./docs)

## 📈 버전 히스토리

### v2.11.1 (Latest)

- 🐛 버그 수정 및 안정성 개선
- 📚 문서 업데이트

### v2.11.0

- ✨ Server Components 지원 추가
- ⚡ 성능 최적화
- 🔒 타입 안정성 강화

자세한 변경 사항은 [CHANGELOG.md](./CHANGELOG.md)를 참조하세요.

---

**Made with ❤️ by the i18nexus team**
