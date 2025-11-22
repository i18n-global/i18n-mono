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

See [Namespace Translations Guide](./NAMESPACE_TRANSLATIONS.md) for complete guide.
