# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2025-01-XX

### Added

- ✨ **Detailed Performance Logging**: Translation wrapper now displays comprehensive timing breakdown
  - Overall statistics (total time, files processed, avg per file)
  - Time breakdown by operation (file discovery, reading, parsing, traversal, code generation)
  - Performance info showing parser type and parsing speed
  - Slowest files identification (top 3)
  - See `PERFORMANCE_LOGGING.md` for detailed documentation

### Changed

- ⚡ **20x Faster AST Parsing**: Replaced `@babel/parser` with `@swc/core`
  - Parsing speed improved from ~22.5s to ~1.1s for 1,000 files
  - Overall performance improved by 3.3x (30.2s → 9.0s)
  - Retained `@babel/traverse` and `@babel/generator` for compatibility
  - Added `scripts/swc-utils.ts` for swc integration

### Performance

- 📊 Expected improvements on 1,000 file project:
  - AST Parsing: 22,500ms → 1,100ms (20x faster)
  - Total Time: 30,200ms → 9,000ms (3.3x faster)

### Documentation

- 📚 Added comprehensive migration guides in `docs/migration/`:
  - `BABEL_TO_SWC_MIGRATION.md` - Babel to swc migration guide
  - `HYBRID_RUST_GUIDE.md` - Hybrid Rust integration guide (napi-rs)
  - `RUST_MIGRATION_PLAN.md` - Full Rust migration plan
  - `SENTRY_PERFORMANCE_GUIDE.md` - Sentry performance monitoring guide
- 📝 Added `PERFORMANCE_LOGGING.md` - Detailed performance logging documentation

### Internal

- 🔧 Added `.npmignore` to exclude migration docs from npm package
- 🔧 Updated `.gitignore` to ignore migration docs

## [1.6.3] - 2025-01-XX

### Initial Release

- 🎉 Initial public release of i18nexus-tools
- ✨ Translation wrapper with AST-based code transformation
- ✨ Google Sheets integration
- ✨ Sentry performance monitoring
- ✨ Support for React Server Components
- ✨ TypeScript support with full type safety
