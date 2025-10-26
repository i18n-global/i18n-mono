# Changelog

All notable changes to i18nexus will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.7.0] - 2025-10-26

### 🌐 Accept-Language Auto-Detection

- **NEW**: `parseAcceptLanguage()` function to parse Accept-Language headers
- **NEW**: Automatic browser language detection from Accept-Language header
- **NEW**: Quality value (q-factor) support for language priority
- **NEW**: Region code support (e.g., `en-US` → `en`)
- **NEW**: `availableLanguages` option in `getServerLanguage()`
- **NEW**: `availableLanguages` option in `createServerI18n()`
- **NEW**: `availableLanguages` option in `createServerI18nWithTranslations()`
- **NEW**: `ACCEPT_LANGUAGE_GUIDE.md` - Complete Accept-Language guide
- **NEW**: Language detection priority: Cookie → Accept-Language → Default
- **NEW**: Case-insensitive language matching
- **NEW**: Comprehensive test suite with 20+ test cases

#### Usage Example

```tsx
// Automatic language detection from browser
import { createServerI18n } from "i18nexus/server";

export default async function Page() {
  const { t, language } = await createServerI18n({
    availableLanguages: ["en", "ko", "ja", "zh"],
    defaultLanguage: "en",
  });

  // Automatically detects from:
  // 1. Cookie (if user selected)
  // 2. Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8 (browser)
  // 3. Default language (fallback)

  return (
    <h1>
      {t("Welcome")} - {language}
    </h1>
  );
}
```

### 🚀 CI/CD Automation

- **NEW**: GitHub Actions workflow for automatic npm publishing on main branch push
- **NEW**: CI workflow for automated testing on Pull Requests (Node.js 16, 18, 20)
- **NEW**: Version check to prevent duplicate publishing
- **NEW**: Automatic Git tag and GitHub Release creation
- **NEW**: `.github/DEPLOYMENT_SETUP.md` - Complete deployment guide

### 🎨 Variable Interpolation

- **NEW**: Variable interpolation support with `{{variable}}` syntax
- **NEW**: Works in both Client Components (`useTranslation`) and Server Components (`createServerTranslation`)
- **NEW**: `ServerTranslationVariables` type for server-side translations
- **NEW**: Support for string and number variables
- **NEW**: Styled variables in Client Components with CSS styles
- **NEW**: Multiple variables in single translation string
- **NEW**: Backwards compatible fallback parameter support
- **NEW**: `INTERPOLATION_GUIDE.md` - Complete variable interpolation guide
- **NEW**: Comprehensive test suite with 21 test cases

### 📝 Documentation

- **NEW**: `INTERPOLATION_GUIDE.md` - Detailed variable interpolation documentation
- **NEW**: `examples/InterpolationExample.tsx` - Client Component examples
- **NEW**: `examples/ServerInterpolationExample.tsx` - Server Component examples
- **IMPROVED**: README updated with variable interpolation features
- **IMPROVED**: API Reference with interpolation examples
- **IMPROVED**: Type documentation with `TranslationVariables` and `TranslationStyles`

### ✨ Enhancements

#### Translation Functions

```tsx
// Client Component - String interpolation
t("Hello {{name}}", { name: "World" });
// Returns: "Hello World"

// Client Component - Styled variables
t(
  "Price: {{amount}}",
  { amount: 100 },
  { amount: { color: "red", fontWeight: "bold" } }
);
// Returns: React.ReactElement with styled span

// Server Component - String interpolation
t("Hello {{name}}", { name: "World" });
// Returns: "Hello World"
```

### 🧪 Testing

- **NEW**: `interpolation.test.tsx` with 21 comprehensive test cases
- **NEW**: Tests for Client-side variable interpolation
- **NEW**: Tests for Server-side variable interpolation
- **NEW**: Tests for styled variables
- **NEW**: Tests for edge cases (special characters, large numbers, etc.)

### 📦 Package Configuration

- **NEW**: `.npmignore` file for cleaner npm package
- **IMPROVED**: Package excludes test files, examples, and documentation
- **IMPROVED**: Smaller package size with optimized file inclusion

---

## [2.6.0] - 2025-10-26

### 🎨 Variable Interpolation

- **NEW**: Variable interpolation support with `{{variable}}` syntax
- **NEW**: Works in both Client Components (`useTranslation`) and Server Components (`createServerTranslation`)
- **NEW**: `ServerTranslationVariables` type for server-side translations
- **NEW**: Support for string and number variables
- **NEW**: Styled variables in Client Components with CSS styles
- **NEW**: Multiple variables in single translation string
- **NEW**: Backwards compatible fallback parameter support

### 🚀 CI/CD Automation

- **NEW**: GitHub Actions workflow for automatic npm publishing
- **NEW**: CI workflow for automated testing on Pull Requests
- **NEW**: Version check to prevent duplicate publishing
- **NEW**: Automatic Git tag and GitHub Release creation

### 📦 Package Optimization

- **NEW**: `.npmignore` file for cleaner npm package
- **IMPROVED**: Smaller package size with optimized file inclusion

---

## [2.5.2] - 2025-10-20

### 🛠 Developer Tools

- **NEW**: `I18NexusDevtools` — React Query-style devtools for inspecting and switching languages in development.
- **NEW**: Devtools shows current language, browser language, available languages, translation stats, and provides quick actions (switch, reset).

### ✨ Enhancements

- Updated `useTranslation` with stricter type guards and styled interpolation.

### 🐛 Fixes

- Removed unused scripts references and provided safe fallbacks for config loading.

### 🎯 Major Features - Type Safety

#### TypeScript Configuration Support

- **NEW**: `i18nexus.config.ts` support for TypeScript configuration files
- **NEW**: Type inference for language codes with `as const`
- **NEW**: `defineConfig()` helper for type-safe configuration
- **NEW**: `ExtractLanguages<T>` type utility to extract language union types
- **NEW**: Auto-detection of config files (`.ts` > `.js` > `.json`)
- **NEW**: `--typescript` flag for `i18n-sheets init` command

#### Type-Safe Language Management

- **NEW**: Generic type parameters for `I18nProvider<TLanguage>`
- **NEW**: Generic type parameters for `useTranslation<TLanguage>()`
- **NEW**: Generic type parameters for `useLanguageSwitcher<TLanguage>()`
- **NEW**: IDE autocomplete support for language codes
- **NEW**: Compile-time validation for language codes
- **NEW**: Self-documenting code with explicit language types

#### Custom Import Sources

- **NEW**: `translationImportSource` configuration option
- **NEW**: Customize where `i18n-wrapper` imports from
- **NEW**: Default value: `"i18nexus"`
- **NEW**: Supports custom paths like `"@/lib/i18n"`

### ✨ Enhancements

#### CLI Tools

- **IMPROVED**: `i18n-wrapper` now respects `translationImportSource` config
- **IMPROVED**: `i18n-sheets init` can generate TypeScript config files
- **IMPROVED**: Better error messages for config file issues
- **IMPROVED**: Async config loading for better performance

#### Documentation

- **NEW**: `TYPED_CONFIG.md` - Complete type safety guide
- **IMPROVED**: README with type safety examples
- **IMPROVED**: QUICK_START.md simplified to 3-command workflow
- **IMPROVED**: Demo README with new features

#### Type Definitions

- **IMPROVED**: Better TypeScript definitions for all hooks and components
- **IMPROVED**: More precise type constraints for generic parameters
- **IMPROVED**: Export config types for reusability

### 📝 Documentation

- Complete TypeScript configuration guide
- Migration guide from JSON to TypeScript config
- Type safety best practices
- Examples with IDE autocomplete
- Comparison of JSON vs TypeScript configs

### 🔧 Breaking Changes

- `loadConfig()` is now async and returns a `Promise`
- Server-side utilities now use async config loading
- Config file priority changed: `.ts` > `.js` > `.json`

### 🐛 Bug Fixes

- Fixed type errors in Provider generic implementation
- Fixed async config loading in bin scripts
- Fixed linter errors related to `any` types
- Fixed type assertions in language switching

### 📦 Dependencies

- No new dependencies added
- All existing dependencies maintained

---

## [2.1.0] - 2025-01-14

### 🎉 Major Features

#### Server Components Support

- **NEW**: Full Next.js App Router Server Components support
- **NEW**: `createServerTranslation()` function for server-side translations
- **NEW**: `getServerTranslations()` function to get raw translation object
- **NEW**: `getServerLanguage()` improved with better type safety
- **NEW**: Separate package export `i18nexus/server` for server utilities

#### CLI Improvements

- **NEW**: `config-loader.ts` - Centralized configuration management
- **NEW**: `i18nexus.config.json` support for project-wide settings
- **NEW**: `i18n-sheets init` command to initialize projects
- **IMPROVED**: `i18n-extractor` now supports config-based settings
- **IMPROVED**: `i18n-wrapper` now supports config-based settings
- **IMPROVED**: `i18n-sheets` commands now read from config file

#### Demo Application

- **NEW**: `/getting-started` page with complete step-by-step guide
- **NEW**: `/server-example` page demonstrating Server Component usage
- **NEW**: Comprehensive examples for both Client and Server Components
- **NEW**: Warning sections for common pitfalls

### ✨ Enhancements

- **IMPROVED**: README with Server Components documentation
- **IMPROVED**: Better TypeScript type definitions for server utilities
- **IMPROVED**: More comprehensive error messages in CLI tools
- **IMPROVED**: Demo app now shows best practices for Next.js App Router

### 📝 Documentation

- Complete rewrite of README with Server Components focus
- Added migration guide from Client to Server Components
- Added comparison table for Server vs Client Components
- Added complete workflow examples

### 🐛 Bug Fixes

- Fixed TypeScript build errors in `tsconfig.build.json`
- Fixed hydration mismatch issues in Next.js App Router
- Fixed import resolution for server utilities

### ⚠️ Breaking Changes

None - This is a backwards compatible release

### 📦 Dependencies

- Synced bin scripts with latest i18nexus-tools
- Updated scripts to use centralized config loader

## [2.0.6] - 2024-12-XX

### Initial Release

- Basic I18nProvider with cookie-based language management
- useTranslation and useLanguageSwitcher hooks
- CLI tools: i18n-wrapper, i18n-extractor, i18n-upload, i18n-download
- Google Sheets integration
- TypeScript support
- Next.js compatibility

---

## Migration Guide

### Migrating to 2.1.0

If you're using Server Components in Next.js App Router:

#### Before (2.0.6)

```tsx
// ❌ This causes hydration issues
export default function Layout({ children }) {
  return <I18nProvider>{children}</I18nProvider>;
}
```

#### After (2.1.0)

```tsx
// ✅ Server-side language detection
import { headers } from "next/headers";
import { getServerLanguage } from "i18nexus/server";

export default async function Layout({ children }) {
  const headersList = await headers();
  const language = getServerLanguage(headersList);

  return <I18nProvider initialLanguage={language}>{children}</I18nProvider>;
}
```

#### Using Server Components

```tsx
// ✅ Server Component with translations
import { createServerTranslation } from "i18nexus/server";

export default async function Page() {
  const t = createServerTranslation(language, translations);
  return <h1>{t("Welcome")}</h1>;
}
```

---

## Roadmap

### Planned for 2.2.0

- [ ] Automatic translation API integration (DeepL, Google Translate)
- [ ] VSCode extension for inline translation editing
- [ ] Advanced caching strategies
- [ ] Translation validation and testing utilities

### Planned for 2.3.0

- [ ] React Native support
- [ ] Pluralization support
- [ ] Gender-specific translations
- [ ] RTL language support improvements

---

## Version Links

[2.7.0]: https://github.com/manNomi/i18nexus/releases/tag/v2.7.0
[2.6.0]: https://github.com/manNomi/i18nexus/releases/tag/v2.6.0
[2.5.2]: https://github.com/manNomi/i18nexus/releases/tag/v2.5.2
[2.1.0]: https://github.com/manNomi/i18nexus/compare/v2.0.6...v2.1.0
[2.0.6]: https://github.com/manNomi/i18nexus/releases/tag/v2.0.6
