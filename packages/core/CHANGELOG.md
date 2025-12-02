# Changelog

All notable changes to this project will be documented in this file.

## [3.2.1] - 2025-12-01

### ✨ Features
- **react-i18next Compatibility**: Added `lng` alias for `currentLanguage` in `useTranslation` return type
  - `const { lng } = useTranslation("home");` now supported
  - Improves compatibility with react-i18next migration
  - `lng` is an alias, both `lng` and `currentLanguage` point to the same value

---

## [3.2.0] - 2025-12-01

### ✨ Features
- **Lazy Loading Redesign**: Complete overhaul of lazy loading system for better abstraction
  - `translations` prop is now optional for lazy loading mode
  - `lazy` flag is automatically enabled when `loadNamespace` is provided
  - Fallback namespace is now automatically preloaded
  - Centralized namespace loading in `I18nProvider` for better control

### 🔧 Internal Improvements
- **I18nProvider**: Refactored to use state-based `loadedNamespaces` for better reactivity
- **useTranslation**: Simplified to read-only mode, removing redundant loading logic
- **Race Condition Prevention**: Added double-check mechanism to prevent duplicate namespace loads
- **Debug Logging**: Added helpful console logs for namespace preloading (`✓ Preloaded namespace "X"`)

### 📖 Documentation
- Added `I18NEXUS_V3.2_LAZY_LOADING_SUCCESS.md` with detailed before/after comparisons
- Updated `I18NEXUS_LAZY_LOADING_REDESIGN.md` with comprehensive redesign rationale

### 💡 Developer Experience
- Reduced `locales/index.ts` from 148 lines to 18 lines (88% reduction)
- Simplified `I18nProvider` configuration
- Clearer separation of concerns (Provider loads, hooks read)

---

## [3.1.0] - 2025-11-30

### ✨ Features
- **Automatic Type Inference**: `useTranslation` now automatically infers translation keys without explicit generics
- **Enhanced I18nProvider**: Now accepts `TTranslations` generic for full type propagation
- **Namespace-aware Context**: Added `namespaceTranslations` to `I18nContextType` for type inference
- **Overloaded useTranslation**: Multiple overloads for flexible usage with automatic type safety

### 🗑️ Deprecations
- **`createI18n`**: Marked as deprecated in favor of `I18nProvider` + `useTranslation`
  - Global singleton pattern replaced with React Context for better testability and SSR support
  - See `MIGRATION_V3.md` for migration guide

### 📖 Documentation
- Added `V3.1_PROPOSAL.md` with detailed design for automatic type inference
- Added `MIGRATION_V3.md` for users migrating from v2.x to v3.x
- Updated JSDoc comments for all public APIs

### 💡 Developer Experience
- No more explicit generic types needed: `useTranslation("home")` instead of `useTranslation<HomeKeys>("home")`
- Better IDE autocomplete for translation keys
- Clearer error messages

---

## [3.0.0] - 2025-11-29

### 🚨 Breaking Changes
- **Global singleton deprecated**: `createI18n` is now deprecated in favor of `I18nProvider`
- **New Context-based architecture**: All i18n functionality now accessed via React hooks
- **SSR-first design**: Better support for Next.js App Router and server components

### ✨ Features
- **I18nProvider**: New React Context Provider for i18n
  - Cookie-based language management
  - SSR support with `initialLanguage` prop
  - Zero hydration mismatches
- **useTranslation**: New hook for accessing translations in client components
- **useLanguageSwitcher**: New hook for language management
- **getTranslation**: Server-side translation utility for Next.js App Router
- **Lazy Loading**: Optional namespace-based code splitting
- **Type Safety**: Full TypeScript support with automatic type inference

### 🔧 Internal Improvements
- Complete refactor of internal architecture
- Better test coverage
- Improved error handling
- Enhanced performance

### 📖 Documentation
- Added `I18NEXUS_V2_ARCHITECTURE_PROPOSAL.md` with detailed Context-based architecture
- Updated README with new usage examples
- Added examples for Next.js App Router

---

## [2.x] - Legacy

Legacy versions using global singleton pattern (`createI18n`).
See git history for changes prior to v3.0.0.

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).
