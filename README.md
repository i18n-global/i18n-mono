# i18nexus Demo

A complete demonstration of the i18nexus React i18n toolkit with **type-safe** language management and modern design.

## ✨ New Features

### 🎯 Type-Safe Language Management

This demo showcases the new TypeScript configuration feature:

- **Type-safe language codes** with IDE autocomplete
- **Compile-time validation** for language switching
- **Zero runtime errors** from invalid language codes
- **Self-documenting code** with explicit types

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  languages: ["en", "ko"] as const, // Type inference!
  defaultLanguage: "ko",
  translationImportSource: "i18nexus",
  // ...
});

export type AppLanguages = (typeof config.languages)[number];
```

### 🎨 Modern Design

- React Hook Form-inspired clean UI
- Responsive design with Tailwind CSS
- Professional color scheme and typography
- Smooth transitions and animations

### 🌍 Complete Internationalization

- **Korean (한국어)** - Primary language
- **English** - Full translations
- Type-safe language switching
- Persistent storage with cookies
- Automatic browser language detection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                # Main demo page (client component)
│   ├── layout.tsx              # Root layout with I18nProvider
│   ├── provider/
│   │   └── page.tsx           # Provider documentation
│   ├── getting-started/
│   │   └── page.tsx           # Getting started guide
│   ├── cli/
│   │   └── page.tsx           # CLI tools documentation
│   └── components/
│       ├── Header.tsx          # Navigation header
│       └── LanguageSwitcher.tsx # Language switching UI
├── lib/
│   ├── i18n.client.ts         # Client-side i18n setup
│   ├── i18n.ts                # Shared i18n configuration
│   └── translations/
│       ├── en.json            # English translations
│       └── ko.json            # Korean translations
├── locales/
│   ├── en.json                # Extracted translations (English)
│   └── ko.json                # Extracted translations (Korean)
├── i18nexus.config.js         # i18nexus configuration (can be .ts!)
└── package.json               # Dependencies and scripts
```

## 🌐 Translation Management

### Using CLI Tools

The project demonstrates all i18nexus CLI tools:

```bash
# Initialize project (with TypeScript config)
npx i18n-sheets init --typescript

# Wrap hardcoded Korean strings automatically
npx i18n-wrapper --pattern "app/**/*.tsx"

# Extract translation keys
npx i18n-extractor --pattern "app/**/*.tsx" --output "./locales"

# Upload to Google Sheets (optional)
npx i18n-sheets upload -s YOUR_SPREADSHEET_ID

# Download from Google Sheets (optional)
npx i18n-sheets download -s YOUR_SPREADSHEET_ID
```

### Translation Files

All translations are stored in JSON format:

- `lib/translations/` - Source translations used by the app
- `locales/` - Extracted translations for CLI tools

## 🎯 Key Features Demonstrated

### 1. **Type-Safe Language Switching** 🆕

```typescript
import { useLanguageSwitcher } from "i18nexus";
import { AppLanguages } from "@/i18nexus.config";

function MyComponent() {
  const { changeLanguage } = useLanguageSwitcher<AppLanguages>();

  // ✅ Type-safe! IDE autocomplete!
  changeLanguage("en");
  changeLanguage("ko");

  // ❌ Compile error!
  // changeLanguage("fr");
}
```

### 2. **Automatic String Wrapping**

Run `npx i18n-wrapper` to automatically:

- Detect Korean strings in your code
- Wrap them with `t()` functions
- Add necessary imports
- Add `useTranslation` hooks

### 3. **Translation Key Extraction**

Run `npx i18n-extractor` to:

- Extract all `t()` calls from your code
- Generate/update JSON translation files
- Preserve existing translations
- Sort keys alphabetically

### 4. **Custom Import Sources** 🆕

Configure where `i18n-wrapper` imports from:

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  // ...
  translationImportSource: "@/lib/i18n", // Custom import!
});
```

### 5. **Language Switching**

- Seamless language switching with cookies
- No page reload required
- Persistent across sessions
- Works with SSR

### 6. **Next.js App Router Support**

- Full Server Components support
- Zero hydration mismatch
- Automatic cookie-based language detection
- Optimal performance

## 🔧 Configuration

### i18nexus Configuration

The `i18nexus.config.js` (or `.ts`) file contains:

```javascript
module.exports = {
  projectId: "demo-project",
  translations: {
    sourceDir: "./lib/translations",
    languages: ["en", "ko"],
    defaultLanguage: "ko",
    format: "json",
  },
  commands: {
    extract: {
      source: ["app/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      output: "./lib/translations",
      ignore: ["node_modules/**", ".next/**"],
    },
  },
};
```

**TypeScript Version** (Recommended):

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "app/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
});

export type AppLanguages = (typeof config.languages)[number];
```

### Next.js Configuration

- Next.js 15 with App Router
- TypeScript support
- Tailwind CSS
- i18nexus integration

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎓 What You'll Learn

This demo teaches you:

1. **Type-Safe i18n** - How to use TypeScript config for type safety
2. **Automated Workflow** - Using CLI tools to automate i18n
3. **Next.js Integration** - Proper App Router integration
4. **Server Components** - When and how to use server vs client
5. **Best Practices** - Recommended project structure
6. **Custom Configuration** - How to customize i18nexus

## 🌟 Highlights

### Before i18nexus

```tsx
// Manual, error-prone
function MyComponent() {
  const [lang, setLang] = useState("ko");
  const text = lang === "ko" ? "안녕하세요" : "Hello";

  return <h1>{text}</h1>;
}
```

### After i18nexus (with Type Safety!)

```tsx
// Automated, type-safe
"use client";

import { useTranslation } from "i18nexus";
import { AppLanguages } from "@/i18nexus.config";

function MyComponent() {
  const { t } = useTranslation<AppLanguages>();

  return <h1>{t("안녕하세요")}</h1>;
}
```

**Benefits:**

- ✅ Type-safe language codes
- ✅ Automatically wrapped with `npx i18n-wrapper`
- ✅ Automatically extracted with `npx i18n-extractor`
- ✅ No manual string management
- ✅ IDE autocomplete support

## 📚 Documentation Pages

The demo includes comprehensive documentation:

1. **Home** (`/`) - Overview and introduction
2. **Getting Started** (`/getting-started`) - Quick start guide
3. **Provider** (`/provider`) - I18nProvider documentation
4. **CLI Tools** (`/cli`) - CLI commands reference

## 🎨 Design Principles

- **Clean & Modern**: Inspired by React Hook Form
- **Accessible**: WCAG 2.1 compliant
- **Responsive**: Works on all devices
- **Performance**: Optimized for production
- **Developer Experience**: Type-safe and intuitive

## 🤝 Contributing

This demo showcases i18nexus capabilities. Feel free to:

- Add more languages
- Improve the design
- Add more examples
- Submit issues and suggestions

## 📄 License

MIT License - see LICENSE file for details.

---

<div align="center">

**🚀 Start using i18nexus today!**

[Documentation](https://github.com/manNomi/i18nexus) • [NPM Package](https://www.npmjs.com/package/i18nexus)

</div>
