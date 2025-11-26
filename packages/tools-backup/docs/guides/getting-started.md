# Getting Started Guide

Welcome to i18nexus-tools! This guide will help you get up and running with automated i18n workflows in minutes.

## 🚀 Quick Start

### 1. Installation

Choose your preferred installation method:

```bash
# Global installation (recommended)
npm install -g i18nexus-tools

# Local installation
npm install -D i18nexus-tools

# Using npx (no installation required)
npx i18nexus-tools
```

### 2. Project Initialization

Initialize your project with a single command:

```bash
# Basic initialization
npx i18n-sheets init

# With Google Sheets integration
npx i18n-sheets init -s <your-spreadsheet-id>
```

This creates:

- `i18nexus.config.json` - Configuration file
- `locales/en.json` - English translations
- `locales/ko.json` - Korean translations
- `locales/index.ts` - TypeScript exports

### 3. Basic Workflow

```bash
# 1. Wrap hardcoded strings
npx i18n-wrapper

# 2. Extract translation keys
npx i18n-extractor

# 3. Upload to Google Sheets (optional)
npx i18n-upload

# 4. Download translations (optional)
npx i18n-download
```

## 📁 Project Structure

After initialization, your project will look like this:

```
your-project/
├── i18nexus.config.json    # Configuration
├── locales/
│   ├── en.json            # English translations
│   ├── ko.json            # Korean translations
│   └── index.ts           # TypeScript exports
├── src/                   # Your source code
└── package.json
```

## 🔧 Configuration

### Basic Configuration

Edit `i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "googleSheets": {
    "spreadsheetId": "",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

### TypeScript Configuration (Advanced)

For type safety, use TypeScript config:

```bash
npx i18n-sheets init --typescript
```

This creates `i18nexus.config.ts`:

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx,js,jsx}",
  translationImportSource: "i18nexus",
  googleSheets: {
    spreadsheetId: "your-spreadsheet-id",
    credentialsPath: "./credentials.json",
    sheetName: "Translations",
  },
});

export type AppLanguages = (typeof config.languages)[number];
```

## 🎯 Next.js Setup

### App Router (Next.js 13+)

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

### Pages Router (Traditional)

```tsx
// pages/_app.tsx
import { I18nProvider } from "i18nexus";

function MyApp({ Component, pageProps }) {
  return (
    <I18nProvider
      languageManagerOptions={{
        defaultLanguage: "ko",
        availableLanguages: [
          { code: "ko", name: "한국어", flag: "🇰🇷" },
          { code: "en", name: "English", flag: "🇺🇸" },
        ],
      }}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
```

## 🔄 Development Workflow

### Daily Development

1. **Write Korean text naturally:**

   ```tsx
   function Welcome() {
     return <h1>안녕하세요!</h1>;
   }
   ```

2. **Run wrapper to convert:**

   ```bash
   npx i18n-wrapper
   ```

   Result:

   ```tsx
   import { useTranslation } from "i18nexus";

   function Welcome() {
     const { t } = useTranslation();
     return <h1>{t("안녕하세요!")}</h1>;
   }
   ```

3. **Extract translation keys:**

   ```bash
   npx i18n-extractor
   ```

4. **Add English translations:**
   ```json
   // locales/en.json
   {
     "안녕하세요!": "Hello!"
   }
   ```

### With Google Sheets

1. **Upload for translation:**

   ```bash
   npx i18n-upload --auto-translate
   ```

2. **Translators work in Google Sheets**

3. **Download completed translations:**
   ```bash
   npx i18n-download
   ```

## 🎨 Advanced Features

### Template Literals

The wrapper automatically converts template literals:

```tsx
// Before
<p>{`사용자: ${count}명`}</p>

// After
<p>{t("사용자: {{count}}명", { count })}</p>
```

### Server Components

Server components are automatically detected:

```tsx
// Server component - no useTranslation hook added
export default async function ServerPage() {
  const { t } = await getServerTranslation();
  return <h1>{t("서버 렌더링")}</h1>;
}
```

### Ignore Comments

Skip wrapping specific content:

```tsx
// i18n-ignore
const apiKey = "한글 API 키";

{
  /* i18n-ignore */
}
<p>이것은 무시됩니다</p>;
```

### Clean Legacy Keys

Remove unused translation keys:

```bash
npx i18n-clean-legacy --dry-run
npx i18n-clean-legacy
```

## 🔧 CLI Commands Reference

### Core Commands

| Command             | Description                 | Example                 |
| ------------------- | --------------------------- | ----------------------- |
| `i18n-sheets init`  | Initialize project          | `npx i18n-sheets init`  |
| `i18n-wrapper`      | Wrap hardcoded strings      | `npx i18n-wrapper`      |
| `i18n-extractor`    | Extract translation keys    | `npx i18n-extractor`    |
| `i18n-upload`       | Upload to Google Sheets     | `npx i18n-upload`       |
| `i18n-download`     | Download from Google Sheets | `npx i18n-download`     |
| `i18n-clean-legacy` | Clean unused keys           | `npx i18n-clean-legacy` |

### Common Options

| Option            | Description                      | Example                              |
| ----------------- | -------------------------------- | ------------------------------------ |
| `--dry-run`       | Preview changes without applying | `npx i18n-wrapper --dry-run`         |
| `--force`         | Force overwrite mode             | `npx i18n-extractor --force`         |
| `-p, --pattern`   | Custom file pattern              | `npx i18n-wrapper -p "app/**/*.tsx"` |
| `-l, --languages` | Custom languages                 | `npx i18n-extractor -l "en,ko,ja"`   |

## 🆘 Troubleshooting

### Common Issues

**Config file not found:**

```bash
# Solution: Initialize project
npx i18n-sheets init
```

**Google Sheets access denied:**

```bash
# Solution: Check credentials and permissions
npx i18n-sheets status -s <spreadsheet-id>
```

**No files processed:**

```bash
# Solution: Check source pattern in config
npx i18n-wrapper --dry-run
```

### Getting Help

- 📖 [Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/manNomi/i18nexus/issues)
- 💬 [Discussions](https://github.com/manNomi/i18nexus/discussions)

## 🎉 Next Steps

Now that you're set up, explore these advanced topics:

- [Next.js App Router Guide](./nextjs-app-router.md)
- [Google Sheets Integration](./google-sheets.md)
- [Type Safety](./advanced/type-safety.md)
- [Custom Patterns](./advanced/custom-patterns.md)

Happy internationalizing! 🌍
