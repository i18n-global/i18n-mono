# i18nexus Monorepo

This is a monorepo containing all i18nexus packages and demo application.

## Structure

```
.
├── apps/
│   └── demo/          # Demo Next.js application
├── packages/
│   ├── core/          # i18nexus core package (React i18n toolkit)
│   └── tools/         # i18nexus-tools CLI package
```

## Packages

### `i18nexus` (packages/core)
Type-safe React i18n toolkit with intelligent automation and SSR support.

### `i18nexus-tools` (packages/tools)
CLI tools for i18nexus - automate i18n workflows with type-safe configuration and Google Sheets integration.

### `i18nexus-demo` (apps/demo)
Demo Next.js application showcasing i18nexus features.

## Development

Each package is managed as a separate git repository but can be developed together in this monorepo.

## Deployment

- **Core & Tools**: Auto-deploy to npm via GitHub Actions
- **Demo**: Auto-deploy to Vercel via GitHub Actions

See individual package `.github/DEPLOYMENT.md` files for details.

