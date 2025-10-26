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

Edit `i18nexus.config.ts`:

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "app/**/*.{ts,tsx}", // App Router pattern
  translationImportSource: "i18nexus",
});

export type AppLanguages = (typeof config.languages)[number];
```

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

### Server Components

Server components automatically use `getServerTranslation`:

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

### Client Components

Client components automatically get `useTranslation` hook:

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

### 2. Run Wrapper

```bash
npx i18n-wrapper
```

Result:

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

### 3. Extract Translation Keys

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

### 4. Add English Translations

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

```typescript
// i18nexus.config.ts
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "app/**/*.{ts,tsx}", // App Router pattern
  translationImportSource: "i18nexus",
  constantPatterns: ["_ITEMS", "_MENU"], // Custom patterns
});
```

### Custom Import Sources

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  translationImportSource: "@/lib/i18n", // Custom path
  // ... other config
});
```

## 🎨 Best Practices

### Server vs Client Components

**Use Server Components for:**

- Static content
- SEO-critical pages
- Data fetching

```tsx
// app/products/page.tsx (Server Component)
import { getServerTranslation } from "i18nexus/server";

export default async function ProductsPage() {
  const { t } = await getServerTranslation();

  return (
    <div>
      <h1>{t("제품 목록")}</h1>
      {/* Static content */}
    </div>
  );
}
```

**Use Client Components for:**

- Interactive elements
- State management
- Event handlers

```tsx
// app/components/ProductCard.tsx (Client Component)
"use client";

import { useTranslation } from "i18nexus";
import { useState } from "react";

export default function ProductCard() {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);

  return (
    <div>
      <h3>{t("제품명")}</h3>
      <button onClick={() => setLiked(!liked)}>
        {liked ? t("좋아요 취소") : t("좋아요")}
      </button>
    </div>
  );
}
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
# - Server component detection
# - Client component hook injection
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

### Check Server Component Detection

```bash
# Run with verbose output
npx i18n-wrapper --dry-run
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
