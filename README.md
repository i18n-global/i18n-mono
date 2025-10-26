# i18nexus

<div align="center">

![i18nexus Logo](https://img.shields.io/badge/i18nexus-Complete%20React%20i18n%20Toolkit-blue?style=for-the-badge)

[![npm version](https://badge.fury.io/js/i18nexus.svg)](https://badge.fury.io/js/i18nexus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**🌍 Type-safe React i18n toolkit with intelligent automation and Server Components support**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API Reference](#-api-reference)

</div>

---

## 🚀 What is i18nexus?

i18nexus is a comprehensive React internationalization toolkit that **automates the entire i18n workflow** with **full type safety**. With TypeScript config support, automatic string wrapping, and seamless Google Sheets integration, i18nexus eliminates tedious manual work while providing IDE autocomplete for language codes.

### ✨ Key Features

- 🌐 **Accept-Language Auto-Detection** - Automatically detects user's browser language
- 🎨 **Variable Interpolation** - `{{variable}}` syntax with styled variables
- 🎯 **Type-Safe Languages** - TypeScript config with IDE autocomplete
- 🖥️ **Server Components** - Full Next.js App Router support with zero hydration
- 🛠️ **Developer Tools** - React Query-style devtools for visual debugging
- 🤖 **Zero Manual Work** - Automatically detect and wrap hardcoded strings
- 🍪 **Smart Persistence** - Cookie-based language management with SSR support

---

## 🚀 Quick Start

### Installation

```bash
npm install i18nexus
```

### 1. Initialize Config (Optional but Recommended)

```bash
npx i18n-sheets init --typescript
```

Creates `i18nexus.config.ts`:

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const,
  defaultLanguage: "en",
  localesDir: "./locales",
});

export type AppLanguages = (typeof config.languages)[number];
```

### 2. Setup Provider (Next.js App Router)

```tsx
// app/layout.tsx
import { createServerI18n } from "i18nexus/server";
import { I18nProvider } from "i18nexus";

export default async function RootLayout({ children }) {
  const { language } = await createServerI18n({
    availableLanguages: ["en", "ko", "ja"],
    defaultLanguage: "en",
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

### 3. Use Translations

**Server Component:**

```tsx
import { createServerI18n } from "i18nexus/server";

export default async function Page() {
  const { t, language } = await createServerI18n({
    availableLanguages: ["en", "ko", "ja"],
    defaultLanguage: "en",
  });

  return (
    <div>
      <h1>{t("Welcome {{name}}", { name: "User" })}</h1>
      <p>Current: {language}</p>
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
      <h1>{t("Welcome")}</h1>
      <p>{t("You have {{count}} messages", { count: 5 })}</p>
    </div>
  );
}
```

---

## 📚 Documentation

### 📖 Complete Documentation
- **[Documentation Hub](./docs/README.md)** - Central documentation portal

### 🎯 Feature Guides
- [🌐 Accept-Language Detection](./docs/guides/accept-language.md) - Browser language auto-detection
- [🎨 Variable Interpolation](./docs/guides/interpolation.md) - Dynamic values in translations
- [🎯 Type-Safe Configuration](./docs/guides/typed-config.md) - TypeScript config setup
- [🛠️ Developer Tools](./docs/guides/devtools.md) - Visual debugging tools

### 📚 API Reference
- [Server-Side API](./docs/api/server.md) - `createServerI18n`, `getServerLanguage`, etc.
- [Client-Side API](./docs/api/client.md) - `useTranslation`, `useLanguageSwitcher`, etc.
- [TypeScript Types](./docs/api/types.md) - Complete type definitions

### 📋 Release Notes
- [v2.7.0](./docs/releases/v2.7.0.md) - Accept-Language auto-detection (Latest)
- [v2.6.0](./docs/releases/v2.6.0.md) - Variable interpolation & CI/CD
- [v2.5.2](./docs/releases/v2.5.2.md) - Developer tools
- [v2.1.0](./docs/releases/v2.1.0.md) - Server Components support
- [Full Changelog](./CHANGELOG.md)

---

## 🎯 Core Features

### 🌐 Accept-Language Auto-Detection

Automatically detects user's browser language from `Accept-Language` header:

```tsx
const { t, language } = await createServerI18n({
  availableLanguages: ["en", "ko", "ja", "zh"],
  defaultLanguage: "en",
});

// Detects from:
// 1. Cookie (user preference)
// 2. Accept-Language header (browser setting)
// 3. Default language (fallback)
```

### 🎨 Variable Interpolation

Insert dynamic values with `{{variable}}` syntax:

```tsx
// Basic
t("Hello {{name}}", { name: "World" })

// Multiple variables
t("{{count}} of {{total}} done", { count: 7, total: 10 })

// With styles (Client Component)
t("Price: {{amount}}", 
  { amount: 100 }, 
  { amount: { color: "red", fontWeight: "bold" } }
)
```

### 🎯 Type-Safe Languages

```typescript
const { changeLanguage } = useLanguageSwitcher<AppLanguages>();

changeLanguage("en"); // ✅ Autocomplete!
changeLanguage("fr"); // ❌ Compile error!
```

### 🛠️ Developer Tools

```tsx
import { I18NexusDevtools } from "i18nexus";

<I18nProvider>
  <App />
  <I18NexusDevtools /> {/* Dev mode only */}
</I18nProvider>
```

---

## 📦 Package Info

- **Name:** i18nexus
- **Version:** 2.7.0
- **License:** MIT
- **TypeScript:** ✅ Full support
- **Bundle Size:** ~15KB (gzipped)

---

## 🤝 Contributing

We welcome contributions! Please see our contribution guidelines:

- 📖 [Contributing Guide (English)](./CONTRIBUTING.md)
- 📖 [기여 가이드 (한국어)](./CONTRIBUTING.ko.md)

Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated!

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🔗 Links

- 📦 [npm Package](https://www.npmjs.com/package/i18nexus)
- 🐙 [GitHub Repository](https://github.com/manNomi/i18nexus)
- 📖 [Documentation](./docs/README.md)
- 🐛 [Issue Tracker](https://github.com/manNomi/i18nexus/issues)
- 💬 [Discussions](https://github.com/manNomi/i18nexus/discussions)

---

<div align="center">

**Made with ❤️ for the React community**

[⭐ Star us on GitHub](https://github.com/manNomi/i18nexus) • [📦 View on npm](https://www.npmjs.com/package/i18nexus)

</div>
