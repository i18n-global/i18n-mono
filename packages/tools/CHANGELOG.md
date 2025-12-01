# Changelog

All notable changes to this project will be documented in this file.

## [1.9.0] - 2025-12-01

### ✨ Features
- **v3.2 Compliance**: Updated to match i18nexus core v3.2 zero-config philosophy
  - `i18n-sheets init` now generates ultra-simplified `locales/index.ts` (only `loadNamespace` function)
  - Removed complex `translations` object and `createI18n` from generated index
  - Added comprehensive JSDoc with usage examples
  - Reduced generated code from 148 lines to 18 lines (88% reduction)

### 🔧 Internal Improvements
- **generateNamespaceIndexFile**: Complete rewrite for v3.2 compliance
  - No longer generates `createI18n` calls
  - No longer generates `translations` object
  - Only exports `loadNamespace` function
  - Added helpful documentation and usage examples
- **Config updates**: 
  - Marked `lazy` option as deprecated (auto-enabled in v3.2+)
  - Updated documentation to reflect new patterns

### 📖 Documentation
- Updated init command output messages
- Added v3.2 zero-config terminology
- Clarified that lazy loading is automatic when `loadNamespace` is provided

### 💡 Developer Experience
- Drastically simplified `locales/index.ts` for easier understanding
- New developers can understand the entire file in seconds
- Clear separation between user code and generated types

---

## [1.8.0] - 2025-11-30

### ✨ Features
- **Namespace Strategy Support**: Added flexible namespace organization strategies
  - `first-folder`: Use first folder as namespace (default)
  - `full-path`: Use full path as namespace
  - `last-folder`: Use last folder as namespace
- **Interactive Init**: Added interactive prompts to `i18n-sheets init` command
  - Ask about i18nexus library usage
  - Ask about namespace structure preference
  - Ask about namespace strategy
- **Compatibility Mode**: Support for non-i18nexus libraries
  - `useI18nexusLibrary: false` skips index.ts generation
  - Flat vs namespace structure options

### 🐛 Bug Fixes
- **Subfolder Handling**: Fixed namespace inference for nested folders
  - `src/app/gallery/folder/page.tsx` now correctly infers as "gallery"
- **Extractor Validation**: Improved namespace validation logic
  - Priority: explicit `useTranslation()` > path inference > default
- **Wrapper Namespace**: Fixed automatic namespace injection in `i18n-wrapper`
  - Now correctly adds namespace to `useTranslation()` calls

### 🔧 Internal Improvements
- Refactored `namespace-inference.ts` with clearer separation of concerns
- Added comprehensive unit tests for namespace strategies
- Improved error messages and warnings

---

## [1.7.0] - 2025-11-25

### ✨ Features
- **Type Generation**: Auto-generate TypeScript type definitions
  - Creates `types/i18nexus.d.ts` with all translation keys
  - Module augmentation for `i18nexus` package
  - Full TypeScript autocomplete support
- **Generic Types in Wrapper**: `i18n-wrapper` now adds generic types to `useTranslation`
  - Example: `useTranslation<"namespace">("namespace")`
  - Enables compile-time type checking for translation keys

### 🐛 Bug Fixes
- Fixed type generation for empty namespaces
- Fixed wrapper to preserve existing generics

---

## [1.6.0] - 2025-11-20

### ✨ Features
- **Google Sheets Integration**: Complete Google Sheets sync support
  - `i18n-sheets upload`: Upload local translations to Google Sheets
  - `i18n-sheets download`: Download translations from Google Sheets
  - `i18n-sheets download-force`: Force overwrite local translations
- **Init Command**: Added project initialization command
  - Creates `i18nexus.config.json`
  - Creates initial namespace structure
  - Generates `locales/index.ts`

---

## [1.5.0] - 2025-11-15

### ✨ Features
- **Namespace Support**: Full namespace-aware extraction and wrapping
- **Framework Detection**: Automatic framework detection (Next.js, React, etc.)
- **Server Components**: Support for Next.js Server Components

---

## [1.0.0] - 2025-11-01

### ✨ Features
- **Initial Release**: Core extraction and wrapping functionality
- **i18n-extractor**: Extract translation keys from source code
- **i18n-wrapper**: Wrap hardcoded strings with `t()` function
- **Basic Config**: Support for `i18nexus.config.json`

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).
