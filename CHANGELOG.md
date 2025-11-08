# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.0] - 2025-11-08

### Added
- **Type-Safe useTranslation Hook**: Generic parameter support for compile-time key validation
  - `useTranslation<"key1" | "key2">()`: Specify valid translation keys as generic parameter
  - TypeScript will error if you use a key that doesn't exist
  - IDE auto-completion for all valid keys
  - Fully backward compatible with existing code
- **UseTranslationTypeSafeExample.tsx**: Comprehensive examples showing:
  - Type-safe hook usage with generic parameters
  - Comparison with non-type-safe usage
  - Real-world component examples
  - Migration guide
- **USETRANSLATION_TYPE_SAFE.md**: Complete documentation (300+ lines) covering:
  - Core feature and benefits
  - Usage methods and patterns
  - Real-world examples with multiple scenarios
  - Migration guide from existing code
  - Troubleshooting and best practices
  - API reference
  - Comparison table: Type-safe vs existing

### Changed
- Enhanced `TranslationFunction` interface to support generic key validation
- Enhanced `UseTranslationReturn` interface to support generic key validation

### Fixed
- Improved type safety for `useTranslation` hook through generic parameters

## [2.8.0] - 2025-11-08

### Added
- **Type-Safe Translation Keys System**: Comprehensive compile-time validation for translation keys
  - `createTypedTranslation()`: Create type-safe translators for single language with compile-time key validation
  - `createMultiLangTypedTranslation()`: Factory function to create typed translators for multiple languages
  - `createTypedTranslationWithStyles()`: Enhanced translator with JSX support for styled variables
  - `validateTranslationKeys()`: Runtime validation to ensure all languages have matching keys
  - `getTranslationKeyList()`: Extract all valid translation keys as an array
  - `ExtractTranslationKeys<T>`: Type utility to extract union of all valid keys from multi-language translations
  - `ExtractLanguageKeys<T>`: Type utility to extract keys from single language dictionary
- **TYPE_SAFE_KEYS.md**: Comprehensive documentation (400+ lines) covering:
  - Problem definition and solutions
  - API reference for all 7 new functions
  - 5 best practices for type-safe translations
  - Real-world examples and patterns
  - Common error messages and troubleshooting
  - Comparison with runtime-only approaches
- **Examples**: `TypeSafeTranslationExample.tsx` with 6 practical examples showing:
  - Const assertion patterns
  - Runtime validation
  - I18nProvider integration
  - useTranslation hook integration
  - Individual typed translators
  - Multi-language factory pattern
- **Comprehensive Test Suite**: 20 test cases covering:
  - Basic translation with variables
  - Multiple languages support
  - Key validation across all languages
  - Edge cases and error handling
  - Type extraction utilities

### Changed
- Enhanced type safety throughout the codebase
- Improved documentation with advanced patterns

### Fixed
- Prevented runtime translation key mapping errors through compile-time validation

## [2.7.0] - 2025-11-08

### Added
- I18NexusDevtools component for React Query-style development tools
- Devtools documentation and visual guides

### Fixed
- Build system fixes for deleted scripts references

## [2.5.2] - 2025-10-20

### Added
- Initial type-guard implementation for useTranslation hook
- Improved function overloading for translation functions

### Changed
- Cleaned up unnecessary scripts and sample directories
