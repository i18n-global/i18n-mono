# 🌐 i18nexus Turborepo

> **Type-safe React i18n toolkit with intelligent automation and SSR support**

i18nexus는 React 애플리케이션을 위한 현대적인 국제화(i18n) 솔루션입니다. TypeScript의 완벽한 타입 안정성과 Google Sheets 통합, 자동화 도구를 제공하여 다국어 개발을 쉽고 효율적으로 만듭니다.

[![NPM Version](https://img.shields.io/npm/v/i18nexus)](https://www.npmjs.com/package/i18nexus)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## ✨ 주요 특징

- 🔒 **완벽한 타입 안정성** - TypeScript로 번역 키와 값의 타입을 자동으로 검증
- ⚡ **SSR/SSG 지원** - Next.js App Router 및 Server Components 완벽 지원
- 🤖 **자동화 워크플로우** - 코드에서 번역 키 자동 추출 및 Google Sheets 동기화
- 🎯 **제로 설정** - 복잡한 설정 없이 바로 시작 가능
- 📦 **모노레포 구조** - 핵심 라이브러리, CLI 도구, 데모 앱 통합 관리
- 🌍 **네임스페이스 지원** - 페이지별, 컴포넌트별 번역 파일 분리
- 🔥 **Hot Reload** - 개발 중 번역 변경 사항 즉시 반영

## 📦 패키지 구조

이 모노레포는 세 개의 주요 패키지로 구성되어 있습니다:

```
i18nexus-turborepo/
├── packages/
│   ├── core/          # 핵심 i18n 라이브러리 (i18nexus)
│   └── tools/         # CLI 자동화 도구 (i18nexus-tools)
└── apps/
    └── demo/          # Next.js 데모 애플리케이션
```

### 🎨 [`i18nexus`](./packages/core) - Core Library

React 애플리케이션을 위한 핵심 i18n 라이브러리입니다.

```bash
npm install i18nexus
```

**주요 기능:**

- `useTranslation` - 컴포넌트에서 번역 사용
- `getServerTranslation` - Server Components에서 번역 사용
- `I18nProvider` - 다국어 컨텍스트 제공
- 타입 안전 번역 키 자동 완성
- 쿠키 기반 언어 설정 관리

📚 [상세 문서 보기](./packages/core/README.md)

### 🛠️ [`i18nexus-tools`](./packages/tools) - CLI Tools

i18n 워크플로우를 자동화하는 강력한 CLI 도구입니다.

```bash
npm install -g i18nexus-tools
```

**주요 명령어:**

- `i18n-extractor` - 코드에서 번역 키 자동 추출
- `i18n-upload` - 번역 파일을 Google Sheets에 업로드
- `i18n-download` - Google Sheets에서 번역 다운로드
- `i18n-wrapper` - 컴포넌트 자동 래핑 (코드 변환)
- `i18n-sheets` - Google Sheets API 관리

📚 [상세 문서 보기](./packages/tools/README.md)

### 🚀 [Demo App](./apps/demo)

i18nexus의 모든 기능을 시연하는 Next.js 애플리케이션입니다.

```bash
cd apps/demo
npm install
npm run dev
```

**데모 기능:**

- Server Components에서의 번역 사용
- Client Components에서의 번역 사용
- 동적 네임스페이스 전환
- 언어 전환 UI
- Firebase 통합 예제

📚 [데모 가이드 보기](./apps/demo/README.md)

## 🚀 빠른 시작

### 1. 패키지 설치

```bash
# 핵심 라이브러리 설치
npm install i18nexus

# CLI 도구 설치 (선택사항)
npm install -D i18nexus-tools
```

### 2. 설정 파일 생성

`i18nexus.config.json` 파일을 프로젝트 루트에 생성합니다:

```json
{
  "defaultLanguage": "ko",
  "supportedLanguages": ["ko", "en"],
  "translationDir": "./locales",
  "sourceDir": "./app"
}
```

### 3. 번역 파일 생성

`locales/ko.json`:

```json
{
  "welcome": "환영합니다",
  "hello": "안녕하세요, {{name}}님"
}
```

`locales/en.json`:

```json
{
  "welcome": "Welcome",
  "hello": "Hello, {{name}}"
}
```

### 4. Provider 설정

```tsx
// app/layout.tsx
import { I18nProvider } from "i18nexus";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
```

### 5. 컴포넌트에서 사용

**Client Component:**

```tsx
"use client";
import { useTranslation } from "i18nexus";

export default function Welcome() {
  const { t, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("hello", { name: "사용자" })}</p>
      <button onClick={() => changeLanguage("en")}>Switch to English</button>
    </div>
  );
}
```

**Server Component:**

```tsx
import { getServerTranslation } from "i18nexus/server";

export default async function Welcome() {
  const t = await getServerTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
    </div>
  );
}
```

## 🎯 주요 워크플로우

### 번역 키 자동 추출

코드에서 사용된 번역 키를 자동으로 추출합니다:

```bash
npx i18n-extractor
```

### Google Sheets 동기화

```bash
# 번역을 Google Sheets에 업로드
npx i18n-upload

# Google Sheets에서 번역 다운로드
npx i18n-download
```

### 컴포넌트 자동 래핑

기존 텍스트를 번역 함수로 자동 변환:

```bash
npx i18n-wrapper
```

**변환 전:**

```tsx
export default function Page() {
  return <h1>환영합니다</h1>;
}
```

**변환 후:**

```tsx
export default function Page() {
  const { t } = useTranslation();
  return <h1>{t("환영합니다")}</h1>;
}
```

## 📚 문서

### 핵심 가이드

- [시작하기](./GETTING_STARTED.md)
- [배포 가이드](./DEPLOYMENT_GUIDE.md)
- [GitHub Actions 설정](./GITHUB_ACTIONS_SETUP.md)
- [Vercel 배포](./VERCEL_SETUP.md)
- [Jest 설정](./JEST_SETUP.md)

### 패키지별 문서

- [i18nexus Core 문서](./packages/core/README.md)
- [i18nexus Tools 문서](./packages/tools/README.md)
- [Demo App 가이드](./apps/demo/README.md)

## 🛠️ 개발

### 모노레포 설정

```bash
# 의존성 설치
npm install

# 모든 패키지 빌드
npm run build

# 개발 모드 실행
npm run dev

# 테스트 실행
npm run test

# 린트 실행
npm run lint
```

### 패키지별 개발

```bash
# Core 패키지 개발
cd packages/core
npm run dev

# Tools 패키지 개발
cd packages/tools
npm run dev

# Demo 앱 개발
cd apps/demo
npm run dev
```

## 🔧 기술 스택

- **언어**: TypeScript 5.x
- **프레임워크**: React 18+, Next.js 14+
- **빌드 도구**: Turbo, TypeScript Compiler
- **테스트**: Jest, React Testing Library
- **코드 변환**: Babel, SWC
- **통합**: Google Sheets API, Firebase
- **패키지 관리**: npm workspaces

## 📈 로드맵

- [x] Core i18n 라이브러리
- [x] CLI 자동화 도구
- [x] Next.js App Router 지원
- [x] Server Components 지원
- [x] Google Sheets 통합
- [x] 타입 안전성
- [x] 네임스페이스 지원
- [ ] 플러그인 시스템
- [ ] VSCode 확장
- [ ] 더 많은 프레임워크 지원
- [ ] AI 기반 번역 제안

## 🤝 기여하기

기여를 환영합니다! 다음 방법으로 참여할 수 있습니다:

1. 이슈 리포트
2. 기능 제안
3. Pull Request 제출
4. 문서 개선

자세한 내용은 [CONTRIBUTING.md](./packages/core/docs/CONTRIBUTING.md)를 참조하세요.

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](./packages/core/LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 영감을 받았습니다:

- react-i18next
- next-intl
- i18next

## 📞 지원 및 커뮤니티

- 🐛 [이슈 리포트](https://github.com/manNomi/i18nexus/issues)
- 💬 [토론](https://github.com/manNomi/i18nexus/discussions)
- 📧 이메일: support@i18nexus.com

---

**만든 이**: i18nexus Team  
**라이선스**: MIT  
**버전**: 2.11.x
