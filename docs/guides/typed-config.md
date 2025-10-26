# Configuration Guide

i18nexus supports configuration files for managing your internationalization settings.

> **⚠️ Important:** `i18nexus.config.json` is the **recommended** configuration format. TypeScript config files (`.ts`) are legacy and not recommended for new projects.

---

## Quick Start (Recommended)

### 1. Install i18nexus-tools

```bash
npm install -D i18nexus-tools
```

### 2. Initialize Configuration

```bash
npx i18n-sheets init
```

This creates `i18nexus.config.json`:

```json
{
  "languages": ["en", "ko", "ja"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus"
}
```

### 3. Use Type-Safe Language Switching

Define your language type manually:

```typescript
// types/i18n.ts
export type AppLanguages = "en" | "ko" | "ja";
```

Then use it in your components:

```typescript
import { useLanguageSwitcher } from "i18nexus";
import type { AppLanguages } from "./types/i18n";

function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useLanguageSwitcher<AppLanguages>();

  // ✅ TypeScript will autocomplete and validate these:
  const switchToEnglish = () => changeLanguage("en"); // ✅ Works
  const switchToKorean = () => changeLanguage("ko"); // ✅ Works
  const switchToJapanese = () => changeLanguage("ja"); // ✅ Works

  // ❌ TypeScript will error on invalid languages:
  // const switchToFrench = () => changeLanguage("fr"); // ❌ Error!

  return (
    <div>
      <button onClick={switchToEnglish}>English</button>
      <button onClick={switchToKorean}>한국어</button>
      <button onClick={switchToJapanese}>日本語</button>
    </div>
  );
}
```

---

## Configuration Options

### i18nexus.config.json

```json
{
  "languages": ["en", "ko", "ja"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus"
}
```

| Option | Type | Description |
|--------|------|-------------|
| `languages` | `string[]` | Array of supported language codes |
| `defaultLanguage` | `string` | Default language for your app |
| `localesDir` | `string` | Directory containing translation files |
| `sourcePattern` | `string` | Glob pattern for source files to scan |
| `translationImportSource` | `string` | Module name to import translation functions from |

---

## Type Safety with JSON Config

While JSON config doesn't provide automatic type inference, you can still achieve full type safety:

### 1. Define Language Type

```typescript
// types/i18n.ts
export type AppLanguages = "en" | "ko" | "ja";
```

### 2. Use in Components

```typescript
import { useTranslation, useLanguageSwitcher } from "i18nexus";
import type { AppLanguages } from "./types/i18n";

function MyComponent() {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguageSwitcher<AppLanguages>();

  return (
    <div>
      <h1>{t("Welcome")}</h1>
      <button onClick={() => changeLanguage("ko")}>한국어</button>
    </div>
  );
}
```

### 3. Benefits

✅ **Autocomplete**: Your IDE will suggest valid language codes  
✅ **Type Safety**: TypeScript catches invalid language codes at compile time  
✅ **Refactoring**: Easy to update when adding/removing languages  
✅ **Consistency**: Single source of truth for language types

---

## File Priority

i18nexus looks for config files in this order:

1. `i18nexus.config.json` ✅ **Recommended**
2. `i18nexus.config.js` (JavaScript module)
3. `i18nexus.config.ts` ⚠️ **Legacy - Not recommended**

The first file found will be used.

---

## Legacy: TypeScript Config (Not Recommended)

> **⚠️ Deprecated:** TypeScript config files are legacy and not recommended for new projects. Use `i18nexus.config.json` instead.

If you're maintaining a legacy project with `i18nexus.config.ts`:

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const,
  defaultLanguage: "en",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
});

export type AppLanguages = (typeof config.languages)[number];
```

### Migration to JSON (Recommended)

**Before (i18nexus.config.ts):**

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "en",
  localesDir: "./locales",
});

export type AppLanguages = (typeof config.languages)[number];
```

**After (i18nexus.config.json):**

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales"
}
```

**Create separate type file:**

```typescript
// types/i18n.ts
export type AppLanguages = "en" | "ko";
```

**Update your app:**

```typescript
// Before
import { config, AppLanguages } from "./i18nexus.config";

// After
import type { AppLanguages } from "./types/i18n";
```

---

## CLI Tools

i18nexus-tools provides powerful CLI commands:

```bash
# Initialize config
npx i18n-sheets init

# Wrap hardcoded strings with t()
npx i18n-wrapper app/

# Extract translation keys
npx i18n-extractor app/ locales/

# Upload to Google Sheets
npx i18n-sheets upload

# Download from Google Sheets
npx i18n-sheets download
```

---

## Best Practices

1. ✅ Use `i18nexus.config.json` for new projects
2. ✅ Define language types in a separate TypeScript file
3. ✅ Install `i18nexus-tools` as a dev dependency
4. ✅ Use type parameters with hooks for autocomplete
5. ❌ Don't use TypeScript config files (`.ts`) for new projects

---

## Examples

### Complete Setup Example

**1. Install:**

```bash
npm install i18nexus
npm install -D i18nexus-tools
```

**2. Initialize:**

```bash
npx i18n-sheets init
```

**3. Define types:**

```typescript
// types/i18n.ts
export type AppLanguages = "en" | "ko" | "ja";
```

**4. Use in app:**

```typescript
// app/components/LanguageSwitcher.tsx
"use client";
import { useLanguageSwitcher } from "i18nexus";
import type { AppLanguages } from "@/types/i18n";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguageSwitcher<AppLanguages>();

  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value as AppLanguages)}>
      <option value="en">English</option>
      <option value="ko">한국어</option>
      <option value="ja">日本語</option>
    </select>
  );
}
```

---

## Summary

- **Recommended:** `i18nexus.config.json` + manual type definitions
- **Legacy:** `i18nexus.config.ts` (not recommended for new projects)
- **CLI Tools:** Install `i18nexus-tools` for automation
- **Type Safety:** Define language types manually for full IDE support
