# Configuration Guide

Complete reference for configuring i18nexus-tools for your project.

## 📁 Configuration Files

i18nexus-tools supports multiple configuration formats with automatic detection:

1. **TypeScript** (`i18nexus.config.ts`) - Recommended for TypeScript projects
2. **JavaScript** (`i18nexus.config.js`) - For JavaScript projects
3. **JSON** (`i18nexus.config.json`) - Universal format

### File Priority

The tool automatically detects configuration files in this order:

```
i18nexus.config.ts > i18nexus.config.js > i18nexus.config.json
```

## 🔧 Configuration Options

### Basic Configuration

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "translationImportSource": "i18nexus",
  "constantPatterns": [],
  "googleSheets": {
    "spreadsheetId": "",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

### TypeScript Configuration

```typescript
import { defineConfig } from "i18nexus";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx,js,jsx}",
  translationImportSource: "i18nexus",
  constantPatterns: ["_ITEMS", "_MENU", "_CONFIG"],
  googleSheets: {
    spreadsheetId: "your-spreadsheet-id",
    credentialsPath: "./credentials.json",
    sheetName: "Translations",
  },
});

export type AppLanguages = (typeof config.languages)[number];
```

## 📋 Configuration Reference

### Core Settings

#### `languages`

- **Type**: `string[]`
- **Default**: `["en", "ko"]`
- **Description**: List of supported languages
- **Example**: `["en", "ko", "ja", "zh"]`

#### `defaultLanguage`

- **Type**: `string`
- **Default**: `"ko"`
- **Description**: Default language code
- **Example**: `"en"`

#### `localesDir`

- **Type**: `string`
- **Default**: `"./locales"`
- **Description**: Directory for translation files
- **Example**: `"./public/locales"`

#### `sourcePattern`

- **Type**: `string`
- **Default**: `"src/**/*.{js,jsx,ts,tsx}"`
- **Description**: Glob pattern for source files
- **Examples**:
  - `"app/**/*.{ts,tsx}"` - Next.js App Router
  - `"pages/**/*.{ts,tsx}"` - Next.js Pages Router
  - `"components/**/*.{js,jsx}"` - Components only

#### `translationImportSource`

- **Type**: `string`
- **Default**: `"i18nexus"`
- **Description**: Import source for translation functions
- **Examples**:
  - `"i18nexus"` - Default
  - `"react-i18next"` - Direct react-i18next
  - `"@/lib/i18n"` - Custom path

#### `constantPatterns`

- **Type**: `string[]`
- **Default**: `[]`
- **Description**: Patterns for constant detection
- **Examples**:
  - `["_ITEMS", "_MENU"]` - Suffix patterns
  - `["UI_", "RENDER_"]` - Prefix patterns
  - `["NAV", "MENU", "BUTTON"]` - Contains patterns

### Google Sheets Settings

#### `googleSheets.spreadsheetId`

- **Type**: `string`
- **Default**: `""`
- **Description**: Google Spreadsheet ID
- **Example**: `"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"`

#### `googleSheets.credentialsPath`

- **Type**: `string`
- **Default**: `"./credentials.json"`
- **Description**: Path to Google service account credentials
- **Example**: `"./config/google-credentials.json"`

#### `googleSheets.sheetName`

- **Type**: `string`
- **Default**: `"Translations"`
- **Description**: Worksheet name in Google Sheets
- **Example**: `"App Translations"`

## 🎯 Framework-Specific Configurations

### Next.js App Router

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus",
  "constantPatterns": ["_ITEMS", "_MENU"]
}
```

### Next.js Pages Router

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./public/locales",
  "sourcePattern": "pages/**/*.{ts,tsx}",
  "translationImportSource": "react-i18next"
}
```

### React (Create React App)

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./public/locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "translationImportSource": "react-i18next"
}
```

### Vite + React

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./src/locales",
  "sourcePattern": "src/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus"
}
```

## 🔧 Advanced Configuration

### Custom Import Sources

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  translationImportSource: "@/lib/i18n",
  // ... other config
});
```

### Multiple Language Sets

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  languages: ["en", "ko", "ja", "zh", "es", "fr"] as const,
  defaultLanguage: "en",
  // ... other config
});
```

### Custom File Patterns

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  sourcePattern: "src/{components,pages,hooks}/**/*.{ts,tsx}",
  // ... other config
});
```

### Environment-Specific Configurations

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || "",
    credentialsPath:
      process.env.GOOGLE_CREDENTIALS_PATH || "./credentials.json",
    sheetName: "Translations",
  },
  // ... other config
});
```

## 🚀 Initialization Commands

### Basic Initialization

```bash
# JSON configuration
npx i18n-sheets init

# TypeScript configuration
npx i18n-sheets init --typescript

# Custom languages
npx i18n-sheets init --languages "en,ko,ja"

# Custom locales directory
npx i18n-sheets init -l "./public/locales"

# With Google Sheets
npx i18n-sheets init -s <spreadsheet-id> -c ./credentials.json
```

### Advanced Initialization

```bash
# Full configuration
npx i18n-sheets init \
  --typescript \
  --languages "en,ko,ja,zh" \
  --locales "./src/locales" \
  --spreadsheet <spreadsheet-id> \
  --credentials "./config/google-credentials.json"
```

## 🔍 Configuration Validation

### Check Configuration

```bash
# Validate configuration
npx i18n-sheets status

# Test with specific config
npx i18n-wrapper --dry-run
```

### Common Validation Errors

#### Invalid Language Codes

```json
{
  "languages": ["english", "korean"] // ❌ Wrong
}
```

```json
{
  "languages": ["en", "ko"] // ✅ Correct
}
```

#### Invalid File Patterns

```json
{
  "sourcePattern": "src/*.ts" // ❌ Too restrictive
}
```

```json
{
  "sourcePattern": "src/**/*.{ts,tsx}" // ✅ Correct
}
```

#### Missing Google Sheets Config

```json
{
  "googleSheets": {
    "spreadsheetId": "" // ❌ Empty ID
  }
}
```

## 🔄 Configuration Migration

### From v1.4.0 to v1.5.0+

```bash
# Old configuration
{
  "localesDir": "./locales/en/common.json"  // ❌ Old format
}

# New configuration
{
  "localesDir": "./locales"  // ✅ New format
}
```

### From JSON to TypeScript

1. **Rename file:**

   ```bash
   mv i18nexus.config.json i18nexus.config.ts
   ```

2. **Convert to TypeScript:**

   ```typescript
   import { defineConfig } from "i18nexus";

   export const config = defineConfig({
     // ... your existing config
   });
   ```

## 🎨 Best Practices

### Configuration Organization

```typescript
// i18nexus.config.ts
import { defineConfig } from "i18nexus";

const isProduction = process.env.NODE_ENV === "production";

export const config = defineConfig({
  languages: ["en", "ko"] as const,
  defaultLanguage: "ko",
  localesDir: "./locales",
  sourcePattern: "src/**/*.{ts,tsx}",
  translationImportSource: "i18nexus",
  constantPatterns: ["_ITEMS", "_MENU", "_CONFIG"],
  googleSheets: isProduction
    ? {
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
        credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH!,
        sheetName: "Translations",
      }
    : undefined,
});
```

### Environment Variables

```bash
# .env.local
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_CREDENTIALS_PATH=./credentials.json
```

### Type Safety

```typescript
// Use generated types
import type { AppLanguages } from "./i18nexus.config";

const { changeLanguage } = useLanguageSwitcher<AppLanguages>();
```

## 🆘 Troubleshooting

### Configuration Not Found

```bash
# Check current directory
pwd

# List configuration files
ls -la i18nexus.config.*

# Initialize if missing
npx i18n-sheets init
```

### Invalid Configuration

```bash
# Validate JSON
cat i18nexus.config.json | jq .

# Check TypeScript
npx tsc --noEmit i18nexus.config.ts
```

### Google Sheets Issues

```bash
# Test connection
npx i18n-sheets status -s <spreadsheet-id>

# Check credentials
ls -la credentials.json
```

## 📚 Next Steps

- [Getting Started Guide](./getting-started.md)
- [Google Sheets Integration](./google-sheets.md)
- [Type Safety Guide](./advanced/type-safety.md)
- [Custom Patterns Guide](./advanced/custom-patterns.md)
