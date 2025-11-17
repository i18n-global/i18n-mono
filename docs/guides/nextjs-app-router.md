# Next.js App Router Guide

Complete guide for using i18nexus-tools with Next.js 13+ App Router.

## 🚀 Quick Setup

### 1. Installation

```bash
npm install -D i18nexus-tools
```

### 2. Initialize Project

```bash
npx i18n-sheets init --typescript
```

### 3. Update Configuration

Edit `i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus",
  "mode": "server",
  "serverTranslationFunction": "getServerTranslation"
}
```

**Mode Options:**
- `"client"`: 모든 컴포넌트에 `useTranslation` + `'use client'` 적용
- `"server"`: 모든 컴포넌트에 `getServerTranslation` + `async/await` 적용
- 생략 시 기본값 (기존 동작 유지)

## 🏗️ Project Structure

```
your-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/
│   │   └── page.tsx        # About page
│   └── components/         # Client components
├── locales/
│   ├── en.json            # English translations
│   ├── ko.json            # Korean translations
│   └── index.ts           # TypeScript exports
├── i18nexus.config.ts     # Configuration
└── package.json
```

## 🔧 App Router Setup

### Root Layout Configuration

```tsx
// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const language = cookieStore.get("i18n-language")?.value || "ko";

  return (
    <html lang={language}>
      <body>
        <I18nProvider
          initialLanguage={language}
          languageManagerOptions={{
            defaultLanguage: "ko",
            availableLanguages: [
              { code: "ko", name: "한국어", flag: "🇰🇷" },
              { code: "en", name: "English", flag: "🇺🇸" },
            ],
          }}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

### Mode Configuration

i18nexus-tools는 `mode` 옵션으로 변환 전략을 명시적으로 제어합니다:

#### Server Mode (`mode: "server"`)

모든 컴포넌트에 서버 함수를 적용합니다:

```json
{
  "mode": "server",
  "serverTranslationFunction": "getServerTranslation"
}
```

**Before:**
```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>환영합니다</h1>
      <p>홈페이지에 오신 것을 환영합니다</p>
    </div>
  );
}
```

**After:**
```tsx
// app/page.tsx
import { getServerTranslation } from "i18nexus/server";

export default async function HomePage() {
  const { t } = await getServerTranslation();

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("홈페이지에 오신 것을 환영합니다")}</p>
    </div>
  );
}
```

#### Client Mode (`mode: "client"`)

모든 컴포넌트에 클라이언트 훅을 적용합니다:

```json
{
  "mode": "client"
}
```

**Before:**
```tsx
// app/components/LanguageSwitcher.tsx
export default function LanguageSwitcher() {
  return <div>현재 언어</div>;
}
```

**After:**
```tsx
// app/components/LanguageSwitcher.tsx
"use client";

import { useTranslation, useLanguageSwitcher } from "i18nexus";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } =
    useLanguageSwitcher();

  return (
    <div>
      <p>
        {t("현재 언어")}: {currentLanguage}
      </p>
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}>
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## 🔄 Development Workflow

### 1. Write Korean Content

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>회사 소개</h1>
      <p>우리는 혁신적인 솔루션을 제공합니다</p>
      <button>더 알아보기</button>
    </div>
  );
}
```

### 2. Configure Mode

`i18nexus.config.json`에서 `mode` 옵션 설정:

```json
{
  "mode": "server",
  "serverTranslationFunction": "getServerTranslation"
}
```

### 3. Run Wrapper

```bash
npx i18n-wrapper
```

**Server Mode Result:**

```tsx
// app/about/page.tsx
import { getServerTranslation } from "i18nexus/server";

export default async function AboutPage() {
  const { t } = await getServerTranslation();

  return (
    <div>
      <h1>{t("회사 소개")}</h1>
      <p>{t("우리는 혁신적인 솔루션을 제공합니다")}</p>
      <button>{t("더 알아보기")}</button>
    </div>
  );
}
```

**Client Mode Result:**

```tsx
// app/about/page.tsx
"use client";

import { useTranslation } from "i18nexus";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("회사 소개")}</h1>
      <p>{t("우리는 혁신적인 솔루션을 제공합니다")}</p>
      <button>{t("더 알아보기")}</button>
    </div>
  );
}
```

### 4. Extract Translation Keys

```bash
npx i18n-extractor
```

Generated files:

```json
// locales/ko.json
{
  "회사 소개": "회사 소개",
  "우리는 혁신적인 솔루션을 제공합니다": "우리는 혁신적인 솔루션을 제공합니다",
  "더 알아보기": "더 알아보기"
}

// locales/en.json
{
  "회사 소개": "",
  "우리는 혁신적인 솔루션을 제공합니다": "",
  "더 알아보기": ""
}
```

### 5. Add English Translations

```json
// locales/en.json
{
  "회사 소개": "About Us",
  "우리는 혁신적인 솔루션을 제공합니다": "We provide innovative solutions",
  "더 알아보기": "Learn More"
}
```

## 🎯 Advanced Features

### Template Literals

```tsx
// Before
<p>{`총 ${count}개의 항목`}</p>

// After (automatic conversion)
<p>{t("총 {{count}}개의 항목", { count })}</p>
```

### Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
import { getServerTranslation } from "i18nexus/server";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { t } = await getServerTranslation();

  return (
    <div>
      <h1>{t("블로그 포스트")}</h1>
      <p>{t("슬러그: {{slug}}", { slug: params.slug })}</p>
    </div>
  );
}
```

### API Routes

```tsx
// app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerTranslation } from "i18nexus/server";

export async function GET(request: NextRequest) {
  const { t } = await getServerTranslation();

  return NextResponse.json({
    message: t("안녕하세요"),
  });
}
```

### Middleware Integration

```tsx
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const language = request.cookies.get("i18n-language")?.value || "ko";

  // Add language to headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-language", language);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## 🔧 Configuration Options

### App Router Specific Settings

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus",
  "mode": "server",
  "serverTranslationFunction": "getServerTranslation"
}
```

### Mode Options

**Server Mode (권장):**
```json
{
  "mode": "server",
  "serverTranslationFunction": "getServerTranslation"
}
```

- 모든 컴포넌트에 `async` 함수로 변환
- `getServerTranslation()` 호출 자동 주입
- 서버 컴포넌트에 적합

**Client Mode:**
```json
{
  "mode": "client"
}
```

- 모든 컴포넌트에 `'use client'` 디렉티브 추가
- `useTranslation` 훅 자동 주입
- 클라이언트 컴포넌트에 적합

### Custom Server Translation Function

다른 라이브러리를 사용하는 경우:

```json
{
  "mode": "server",
  "serverTranslationFunction": "getServerT"
}
```

### Custom Import Sources

```json
{
  "translationImportSource": "@/lib/i18n"
}
```

## 🎨 Best Practices

### Mode Selection

**Server Mode를 사용하는 경우:**
- Next.js App Router의 서버 컴포넌트
- 정적 콘텐츠
- SEO가 중요한 페이지
- 데이터 페칭이 필요한 페이지

```json
{
  "mode": "server",
  "serverTranslationFunction": "getServerTranslation"
}
```

**Client Mode를 사용하는 경우:**
- 인터랙티브 요소
- 상태 관리가 필요한 컴포넌트
- 이벤트 핸들러가 있는 컴포넌트

```json
{
  "mode": "client"
}
```

### Mixed Mode (고급)

프로젝트 전체를 한 번에 처리하려면:

1. **Server 컴포넌트 처리:**
```bash
# server 모드로 실행
npx i18n-wrapper -p "app/**/*.tsx"
```

2. **Client 컴포넌트 처리:**
```json
// i18nexus.config.json 임시 변경
{
  "mode": "client"
}
```
```bash
# client 모드로 실행
npx i18n-wrapper -p "app/components/**/*.tsx"
```

### Type Safety

```typescript
// Use generated types
import type { AppLanguages } from "./i18nexus.config";

// In client components
const { changeLanguage } = useLanguageSwitcher<AppLanguages>();

// Type-safe language switching
changeLanguage("en"); // ✅ Valid
changeLanguage("fr"); // ❌ TypeScript error
```

### Performance Optimization

```tsx
// Use dynamic imports for heavy components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>{t("로딩 중...")}</p>,
});
```

## 🚀 Deployment

### Build Process

```bash
# Build the project
npm run build

# The wrapper automatically handles:
# - Mode-based transformation (server/client)
# - Hook/function injection based on mode
# - Template literal conversion
```

### Environment Variables

```bash
# .env.local
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_CREDENTIALS_PATH=./credentials.json
```

### Vercel Deployment

```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🔍 Debugging

### Check Mode Configuration

```bash
# Preview changes with current mode
npx i18n-wrapper --dry-run

# Verify mode in config
cat i18nexus.config.json | grep mode
```

### Verify Translations

```bash
# Check extracted keys
npx i18n-extractor --dry-run

# Validate configuration
npx i18n-sheets status
```

### Common Issues

**Hydration Mismatch:**

```tsx
// ❌ Wrong - different content on server/client
export default function Page() {
  const [mounted, setMounted] = useState(false);

  if (!mounted) return null;

  return <div>{t("클라이언트 전용")}</div>;
}
```

```tsx
// ✅ Correct - same content on server/client
export default function Page() {
  return <div>{t("서버와 클라이언트 동일")}</div>;
}
```

**Missing "use client":**

```tsx
// ❌ Wrong - missing directive
import { useTranslation } from "i18nexus";

export default function Component() {
  const { t } = useTranslation();
  return <div>{t("텍스트")}</div>;
}
```

```tsx
// ✅ Correct - with directive
"use client";

import { useTranslation } from "i18nexus";

export default function Component() {
  const { t } = useTranslation();
  return <div>{t("텍스트")}</div>;
}
```

## 📚 Next Steps

- [Google Sheets Integration](./google-sheets.md)
- [Type Safety Guide](./advanced/type-safety.md)
- [Server Components Guide](./advanced/server-components.md)
- [Template Literals Guide](./advanced/template-literals.md)
