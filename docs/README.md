# i18nexus Documentation

Complete documentation for i18nexus - Type-safe React i18n toolkit.

## 📚 Table of Contents

- [Quick Links](#quick-links)
- [Guides](#guides)
- [API Reference](#api-reference)
- [Release Notes](#release-notes)
- [Examples](#examples)

---

## Quick Links

- 🏠 [Main README](../README.md)
- 📦 [npm Package](https://www.npmjs.com/package/i18nexus)
- 🐙 [GitHub Repository](https://github.com/manNomi/i18nexus)
- 📋 [CHANGELOG](../CHANGELOG.md)

---

## Guides

### Getting Started

- [Quick Start](../README.md#quick-start)
- [Installation](../README.md#installation)

### Core Features

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

#### 🛠️ Developer Tools

- **[DevTools Guide](./guides/devtools.md)** - Visual debugging
  - I18NexusDevtools component
  - Features overview
  - Customization options
  - Best practices

---

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

### Version History

See [CHANGELOG.md](../CHANGELOG.md) for complete version history.

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
├── guides/                   # User guides
│   ├── accept-language.md   # Browser language detection
│   ├── interpolation.md     # Variable interpolation
│   ├── typed-config.md      # Type-safe configuration
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

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

---

## Support

### Getting Help

- 📖 [Documentation](https://github.com/manNomi/i18nexus/tree/main/packages/i18nexus/docs)
- 🐛 [Issue Tracker](https://github.com/manNomi/i18nexus/issues)
- 💬 [Discussions](https://github.com/manNomi/i18nexus/discussions)

### Community

- ⭐ [Star on GitHub](https://github.com/manNomi/i18nexus)
- 🐦 [Follow Updates](#)
- 💡 [Feature Requests](https://github.com/manNomi/i18nexus/issues/new)

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

<div align="center">

**Made with ❤️ for the React community**

[⭐ Star us on GitHub](https://github.com/manNomi/i18nexus) • [📦 View on npm](https://www.npmjs.com/package/i18nexus)

</div>
