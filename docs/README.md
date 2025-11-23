# i18nexus Documentation

Complete documentation for i18nexus namespace-based translation system with automatic type inference.

## 📚 Documentation Index

### Getting Started

- **[Namespace Translations Guide](./NAMESPACE_TRANSLATIONS.md)** - Complete guide to namespace-based translations
  - Basic usage
  - Automatic type inference with `createI18n`
  - Dynamic translations
  - Styled variables
  - Server-side usage
  - Best practices
  - Migration guide

### Reference

- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
  - `createI18n` - Type-safe i18n instance creation
  - `I18nProvider` - React context provider
  - `useTranslation` - Namespace translation hook
  - `useDynamicTranslation` - Runtime dynamic keys
  - Server functions
  - Type definitions
  - Error handling

- **[TypeScript Guide](./TYPESCRIPT_GUIDE.md)** - TypeScript usage and patterns
  - Type safety basics
  - Advanced type inference
  - Generic types
  - Common patterns
  - Troubleshooting

### Feature Guides

#### 🌐 Accept-Language Detection

- **[Accept-Language Guide](./guides/accept-language.md)** - Browser language auto-detection
  - How it works
  - Usage examples
  - Quality values (q-factor)
  - Debugging tips

#### 🎨 Variable Interpolation

- **[Interpolation Guide](./guides/interpolation.md)** - Dynamic values in translations
  - `{{variable}}` syntax
  - Styled variables (Client)
  - Server Component support
  - Real-world examples

#### 🎯 Type Safety

- **[Typed Config Guide](./guides/typed-config.md)** - TypeScript configuration
  - Type-safe language codes
  - IDE autocomplete
  - Custom import sources
  - Migration from JSON
- **[Auto Type Extraction](./guides/auto-type-extraction.md)** - Automatic type inference from I18nProvider
  - Automatic key type extraction
  - Dynamic variable handling
  - Real-world examples
- **[Type-Safe Keys](./guides/type-safe-keys.md)** - Compile-time key validation
  - `createTypedTranslation()` functions
  - Runtime validation utilities
  - Best practices
- **[Type-Safe Setup](./guides/type-safe-setup.md)** - Complete setup guide
  - Step-by-step configuration
  - Custom hooks pattern
  - Migration guide
- **[useTranslation Type-Safe](./guides/use-translation-type-safe.md)** - Type-safe hook usage
  - Generic parameter support
  - IDE autocomplete
  - Migration from non-type-safe code

#### 🛠️ Developer Tools

- **[DevTools Guide](./guides/devtools.md)** - Visual debugging
  - I18NexusDevtools component
  - Features overview
  - Customization options
  - Best practices

### Examples

- **[Styled Text Example](../examples/styled-text-example.tsx)** - React/TypeScript examples
- **[Styled Text Demo](../examples/styled-text-demo.html)** - Interactive HTML demo

## 🚀 Quick Start

```typescript
import { createI18n } from 'i18nexus';

const translations = {
  common: {
    en: { welcome: 'Welcome' },
    ko: { welcome: '환영합니다' },
  },
} as const;

const i18n = createI18n(translations);

function App() {
  const { t } = i18n.useTranslation('common');
  return <h1>{t('welcome')}</h1>;
}
```

## API Reference

### Server-Side API

- **[Server API](./api/server.md)** - Server Component utilities
  - `createServerI18n()`
  - `getServerLanguage()`
  - `parseAcceptLanguage()`
  - `createServerTranslation()`
  - Complete type definitions

### Client-Side API

- **[Client API](./api/client.md)** - Client Component hooks
  - `useTranslation()`
  - `useLanguageSwitcher()`
  - `I18nProvider`
  - `I18NexusDevtools`
  - Complete type definitions

### Types

- **[Types Reference](./api/types.md)** - TypeScript types
  - Core types
  - Hook return types
  - Configuration types
  - Utility types

---

## Release Notes

### Latest Releases

- **[v2.7.0](./releases/v2.7.0.md)** (Latest) - Accept-Language Auto-Detection
  - Browser language detection
  - Quality value support
  - Region code support

- **[v2.6.0](./releases/v2.6.0.md)** - Variable Interpolation & CI/CD
  - `{{variable}}` syntax
  - Styled variables
  - GitHub Actions automation

- **[v2.5.2](./releases/v2.5.2.md)** - Developer Tools
  - I18NexusDevtools component
  - TypeScript config support
  - Type-safe hooks

- **[v2.1.0](./releases/v2.1.0.md)** - Server Components Support
  - Full Next.js App Router support
  - Server-side utilities
  - Zero hydration mismatch

- **[v2.0.6](./releases/v2.0.6.md)** - Initial Release (2.x)
  - Basic I18n components
  - CLI tools
  - Google Sheets integration

### 1.x Series (Legacy)

- **[v1.3.1](./releases/v1.3.1.md)** - Final 1.x Release
  - Bug fixes and polish
  - Production stability

- **[v1.3.0](./releases/v1.3.0.md)** - Feature Enhancements
  - Enhanced CLI tools
  - Performance improvements

- **[v1.2.0](./releases/v1.2.0.md)** - Minor Features
  - Google Sheets enhancements
  - Multiple patch releases (v1.2.1-v1.2.5)

- **[v1.1.0](./releases/v1.1.0.md)** - CLI Tool Addition
  - New i18n-sheets command

- **[v1.0.4](./releases/v1.0.4.md)** - First Stable Release
  - Initial stable version

### Version History

See [CHANGELOG.md](./CHANGELOG.md) for complete version history.

---

## Examples

### Code Examples

Examples are available in the [`examples/`](../examples/) directory:

- **[DevtoolsExample.tsx](../examples/DevtoolsExample.tsx)** - DevTools usage
- **[InterpolationExample.tsx](../examples/InterpolationExample.tsx)** - Client Component variables
- **[ServerInterpolationExample.tsx](../examples/ServerInterpolationExample.tsx)** - Server Component variables

### Demo Application

Full demo application available at [`i18nexus-demo/`](../../i18nexus-demo/)

---

## Documentation Structure

```
docs/
├── README.md                 # This file
├── NAMESPACE_TRANSLATIONS.md # Namespace-based translations guide
├── API_REFERENCE.md          # Complete API documentation
├── TYPESCRIPT_GUIDE.md       # TypeScript usage patterns
├── guides/                   # User guides
│   ├── accept-language.md   # Browser language detection
│   ├── interpolation.md     # Variable interpolation
│   ├── typed-config.md      # Type-safe configuration
│   ├── auto-type-extraction.md  # Automatic type inference
│   ├── type-safe-keys.md    # Compile-time key validation
│   ├── type-safe-setup.md   # Complete setup guide
│   ├── use-translation-type-safe.md  # Type-safe hook usage
│   └── devtools.md          # Developer tools
├── api/                      # API reference
│   ├── server.md            # Server-side API
│   ├── client.md            # Client-side API
│   └── types.md             # TypeScript types
└── releases/                 # Release notes
    ├── v2.7.0.md            # Latest release
    ├── v2.6.0.md            # Variable interpolation
    ├── v2.5.2.md            # Developer tools
    └── v2.1.0.md            # Server components
```

See [Namespace Translations Guide](./NAMESPACE_TRANSLATIONS.md) for complete guide.
