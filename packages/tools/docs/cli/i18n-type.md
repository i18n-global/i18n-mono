# i18n-type Command Reference

Complete reference for the `i18n-type` command.

## Overview

The `i18n-type` command generates TypeScript type definitions from translation JSON files. This command is independent of the extractor and can be run separately after extracting translations or modifying JSON files.

## Basic Usage

```bash
npx i18n-type
```

## How It Works

1. Reads all translation JSON files from the `locales` directory
2. Generates TypeScript type definitions in `locales/types/i18nexus.d.ts`
3. Includes fallback namespace support (if configured)
4. Provides type-safe translation keys for `useTranslation()` and `getTranslation()`

## Options

### `-h, --help`

Display help information.

```bash
npx i18n-type --help
```

## Configuration

The command uses settings from `i18nexus.config.json`:

```json
{
  "localesDir": "./locales",
  "fallbackNamespace": "common",
  "translationImportSource": "i18nexus"
}
```

**Configuration Options:**

- `localesDir` - Directory containing translation files (default: `"./locales"`)
- `fallbackNamespace` - Namespace whose keys are included in all namespace types
- `translationImportSource` - Import source for type augmentation (e.g., `"i18nexus"`, `"react-i18next"`)

## Output

The command generates a TypeScript declaration file:

```
locales/types/i18nexus.d.ts
```

This file contains:

- Type definitions for all translation keys
- Namespace-specific type exports (`CommonKeys`, `HomeKeys`, etc.)
- Fallback namespace type unions (if configured)
- Module augmentation for the specified `translationImportSource`

## Examples

### Basic Type Generation

```bash
# Generate types from locales directory
npx i18n-type
```

**Output:**

```
📝 Generating TypeScript type definitions...

✅ Type definitions generated successfully!
   Output: locales/types/i18nexus.d.ts
   Fallback namespace: "common" (keys included in all namespaces)
```

### With Fallback Namespace

If `fallbackNamespace` is configured, keys from that namespace are automatically included in all namespace types:

```typescript
// i18nexus.config.json
{
  "fallbackNamespace": "common"
}

// Generated types include common keys in all namespaces
const { t } = useTranslation<"home">();
t("welcome"); // ✅ OK (from common namespace)
t("home.title"); // ✅ OK (from home namespace)
```

## Workflow

### Typical Workflow

```bash
# 1. Extract translation keys
npx i18n-extractor

# 2. Generate types
npx i18n-type

# 3. Use type-safe translations in code
```

### After Modifying JSON Files

```bash
# After editing locales/common/en.json
npx i18n-type  # Regenerate types
```

## Type Safety Features

### Namespace-Specific Types

Each namespace gets its own type export:

```typescript
import type { CommonKeys, HomeKeys } from "@/locales/types/i18nexus";

const commonKey: CommonKeys = "welcome"; // ✅ Type-safe
const homeKey: HomeKeys = "title"; // ✅ Type-safe
```

### Fallback Namespace Support

When `fallbackNamespace` is configured, all namespace types include fallback keys:

```typescript
// Config: fallbackNamespace: "common"
const { t } = useTranslation<"home">();

// Common namespace keys are available
t("welcome"); // ✅ OK (from common)
t("title"); // ✅ OK (from home)
```

### Module Augmentation

Types are automatically augmented for the configured `translationImportSource`:

```typescript
// For "i18nexus"
import { useTranslation } from "i18nexus";
const { t } = useTranslation("common");
t("welcome"); // ✅ Type-safe

// For "react-i18next"
import { useTranslation } from "react-i18next";
const { t } = useTranslation("common");
t("welcome"); // ✅ Type-safe
```

## Error Handling

### No Translation Files Found

```bash
⚠️  No translation files found in locales directory
   Locales directory: ./locales
```

**Solution:** Run `npx i18n-extractor` first to generate translation files.

### Invalid JSON Files

The command will report errors if JSON files are malformed:

```bash
❌ Failed to generate type definitions: SyntaxError: Unexpected token
```

**Solution:** Fix JSON syntax errors in translation files.

## Best Practices

### 1. Run After Extraction

Always run `i18n-type` after extracting new keys:

```bash
npx i18n-extractor
npx i18n-type
```

### 2. Regenerate After JSON Changes

Regenerate types after manually editing JSON files:

```bash
# Edit locales/common/en.json
npx i18n-type
```

### 3. Commit Type Files

Include generated type files in version control:

```bash
git add locales/types/i18nexus.d.ts
git commit -m "Update translation types"
```

### 4. CI/CD Integration

Add type generation to your build process:

```bash
# package.json
{
  "scripts": {
    "i18n:extract": "i18n-extractor && i18n-type"
  }
}
```

## Troubleshooting

### Types Not Updating

**Problem:** Types don't reflect recent changes.

**Solution:** Regenerate types:

```bash
npx i18n-type
```

### Missing Namespace Types

**Problem:** Namespace-specific types not generated.

**Solution:** Ensure namespace structure is correct:

```
locales/
├── common/
│   ├── en.json
│   └── ko.json
└── home/
    ├── en.json
    └── ko.json
```

### Type Errors in IDE

**Problem:** IDE shows type errors even after regeneration.

**Solution:** Restart TypeScript server in your IDE:

- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- WebStorm: File → Invalidate Caches

## See Also

- [i18n-extractor](./i18n-extractor.md) - Extract translation keys
- [Type Safety Guide](../guides/type-safe-setup.md) - Type-safe setup
- [Configuration Guide](../guides/configuration.md) - Configuration options
