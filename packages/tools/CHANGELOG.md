# Changelog

All notable changes to this project will be documented in this file.

## [2.1.3] - 2025-12-01

### 🔧 Refactoring
- **Removed `lazy` parameter**: `lazy` is now always enabled (tools are library-agnostic)
  - Removed `lazy` parameter from `generateNamespaceIndexFile()`
  - `i18nexus.config.json` no longer needs `lazy` field (it's library-specific)
  - Tools now focus purely on tooling concerns, not library configuration

### ✨ UX Improvements
- **Simplified `i18n-sheets init` prompts**: Reduced from 3 questions to 1
  - Before: "Are you using i18nexus?", "Do you want namespace structure?", "Choose strategy"
  - After: "네임스페이스별로 나눌래? vs 하나로 합칠래?" (single question)
  - More intuitive and faster setup experience

### 📝 Configuration
- `i18nexus.config.json` is now purely for tooling configuration
- Library-specific settings (like `lazy`) should be configured in the library itself

---

## [2.1.2] - 2025-12-01

### 🐛 Bug Fixes
- **Server Module Import Source**: Fixed server module to also use `translationImportSource`
  - Before: `declare module "i18nexus/server"` (hardcoded)
  - After: `declare module "${translationImportSource}/server"` (dynamic)
  - Now both client and server modules respect the configured import source
- **Config Loading**: Fixed `translationImportSource` not being loaded from `i18nexus.config.json`
  - Added proper loading in extractor constructor
  - Ensures project config overrides default config

### 📝 Examples
```json
// i18nexus.config.json
{
  "translationImportSource": "@/lib/i18n"
}
```

Generates:
```typescript
declare module "@/lib/i18n" { ... }
declare module "@/lib/i18n/server" { ... }
```

---

## [2.1.1] - 2025-12-01

### ✨ Features
- **Dynamic Module Augmentation**: Type generator now uses `translationImportSource` from config
  - `declare module "i18nexus"` → `declare module "${translationImportSource}"`
  - Supports any i18n library (e.g., "react-i18next", "next-intl", etc.)
  - Server types also use the configured import source: `"${translationImportSource}/server"`
  - Makes i18nexus-tools compatible with any React i18n library

### 🔧 Internal Improvements
- Added `translationImportSource` to `ExtractorConfig` interface
- Added `translationImportSource` to `TypeGeneratorConfig` interface
- Updated `DEFAULT_CONFIG` to include `translationImportSource` from `COMMON_DEFAULTS`

---

## [2.1.0] - 2025-12-01

### ✨ Features
- **Interpolation Variable Type Checking**: Added advanced type checking for translation keys with interpolation variables
  - Automatically detects `{{variableName}}` patterns in translation keys
  - Generates `[Namespace]KeyVariables` types for keys with variables
  - `useTranslation().t()` now validates variable names at compile time
  - Example:
    - ✅ `t("{{errorMessage}} 발생", { errorMessage: "Error" })` - Correct variable name
    - ❌ `t("{{errorMessage}} 발생", { errorMessag: "Error" })` - Type error! (typo)
    - ❌ `t("{{errorMessage}} 발생")` - Type error! (missing variables)
  - Uses TypeScript conditional types and template literal types for precise validation
  - Supports multiple variables per key (e.g., `{{userName}} 님, {{totalDays}}일 남음`)

### 🐛 Bug Fixes
- Improved type generation with better handling of interpolation variable extraction

---

## [2.0.2] - 2025-12-01

### 🐛 Bug Fixes
- **Unicode Escape Prevention**: Fixed issue where Korean text was being escaped to Unicode sequences (e.g., `\uC0AC\uC6A9\uC790`)
  - Added `jsescOption: { minimal: true }` to `@babel/generator` to preserve non-ASCII characters
  - Now Korean text in `t()` calls remains as readable Korean instead of Unicode escapes
  - Example: `t("사용자")` instead of `t("\uC0AC\uC6A9\uC790")`

---

## [2.0.1] - 2025-12-01

### 🐛 Bug Fixes
- **Namespace Inference Fix**: Fixed issue where `i18n-wrapper` was wrapping all files with `common` namespace even when `namespaceLocation` was set
  - Now correctly detects `namespaceLocation` and enables namespacing automatically
  - Properly infers namespace from the first folder after `basePath` (e.g., `page/home/index.tsx` → `home`)
  - Falls back to creating `namespacing` config from `namespaceLocation` if not explicitly set

---

## [2.0.0] - 2025-12-01

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
