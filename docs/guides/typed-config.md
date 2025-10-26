# Typed Language Configuration

i18nexus now supports TypeScript config files with full type safety for language codes!

## Quick Start

### 1. Create a TypeScript Config File

Create `i18nexus.config.ts` (instead of `.json`):

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const, // Use 'as const' for type inference
  defaultLanguage: "en",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
});

// Export the language union type
export type AppLanguages = (typeof config.languages)[number]; // "en" | "ko" | "ja"
```

### 2. Use Typed Hooks in Your App

```typescript
import { I18nProvider, useLanguageSwitcher } from "i18nexus";
import { config, AppLanguages } from "./i18nexus.config";

function App() {
  return (
    <I18nProvider<AppLanguages>
      languageManagerOptions={{
        defaultLanguage: config.defaultLanguage,
        availableLanguages: config.languages.map(code => ({ code, name: code })),
      }}
      translations={translations}
    >
      <LanguageSwitcher />
    </I18nProvider>
  );
}

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

### 3. Alternative: Extract Type Helper

You can also use the `ExtractLanguages` helper:

```typescript
// i18nexus.config.ts
import { defineConfig, ExtractLanguages } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const,
  defaultLanguage: "en",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
});

export type AppLanguages = ExtractLanguages<typeof config>;
```

## Benefits

### ✅ Autocomplete

Your IDE will suggest valid language codes:

```typescript
const { changeLanguage } = useLanguageSwitcher<AppLanguages>();
changeLanguage(/* IDE shows: "en" | "ko" | "ja" */);
```

### ✅ Type Safety

TypeScript will catch errors at compile time:

```typescript
changeLanguage("fr"); // ❌ Error: Argument of type '"fr"' is not assignable to parameter of type '"en" | "ko" | "ja"'
```

### ✅ Refactoring Support

If you add or remove a language from the config, TypeScript will help you update all usage sites:

```typescript
// Before: languages: ["en", "ko", "ja"]
// After: languages: ["en", "ko"] (removed "ja")

// TypeScript will now error wherever "ja" is used:
changeLanguage("ja"); // ❌ Error: '"ja"' is not assignable to type '"en" | "ko"'
```

## Migration from JSON Config

If you're using `i18nexus.config.json`, you can migrate to TypeScript:

### Before (i18nexus.config.json):

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus"
}
```

### After (i18nexus.config.ts):

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const, // Add 'as const'
  defaultLanguage: "en",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
});

export type AppLanguages = (typeof config.languages)[number];
```

Then update your app:

```typescript
// Before
const { changeLanguage } = useLanguageSwitcher();

// After
const { changeLanguage } = useLanguageSwitcher<AppLanguages>();
```

## File Priority

i18nexus will look for config files in this order:

1. `i18nexus.config.ts` (TypeScript, with type inference)
2. `i18nexus.config.js` (JavaScript module)
3. `i18nexus.config.json` (JSON)

The first file found will be used.

## Notes

- Don't forget `as const` on the languages array for proper type inference
- TypeScript config files require the `defineConfig` helper or explicit typing
- JSON config files will still work but won't provide type inference
