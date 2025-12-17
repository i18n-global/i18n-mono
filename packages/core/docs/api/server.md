# Server-Side API Reference

Complete API reference for i18nexus server-side utilities.

## Import

```typescript
import {
  getTranslation,
  getServerLanguage,
  parseAcceptLanguage,
  createServerTranslation,
  getServerTranslations,
  loadTranslations,
  createServerI18nWithTranslations,
} from "i18nexus/server";

import type { ServerTranslationVariables } from "i18nexus/server";
```

---

## Functions

### `getTranslation()`

Get translation function for Server Components with automatic language detection.

```typescript
async function getTranslation<NS extends string = string>(
  namespace?: NS,
  options?: {
    localesDir?: string;
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
    language?: string;
    translations?: Record<string, Record<string, string>>;
  },
): Promise<{
  t: TranslationFunction;
  language: string;
  translations: Record<string, Record<string, string>>;
  dict: Record<string, string>;
}>;
```

**Parameters:**

- `namespace` - Optional namespace to load translations from
- `options.localesDir` - Directory containing translation files (default: `"./locales"`)
- `options.cookieName` - Cookie name for language storage (default: `"i18n-language"`)
- `options.defaultLanguage` - Fallback language (default: `"en"`)
- `options.availableLanguages` - List of supported languages for Accept-Language detection
- `options.language` - Explicit language code (bypasses cookie/header detection)
- `options.translations` - Pre-loaded translations object

**Returns:**

- `t` - Translation function with variable interpolation
- `language` - Detected current language
- `translations` - Full translations object
- `dict` - Current language translations

**Example:**

```typescript
export default async function Page() {
  const { t, language } = await getTranslation("home", {
    availableLanguages: ["en", "ko", "ja"],
    defaultLanguage: "en",
  });

  return <h1>{t("welcome")}</h1>;
}
```

---

### `getServerLanguage()`

Get language from headers with Accept-Language support.

```typescript
function getServerLanguage(
  headers: Headers,
  options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
  },
): string;
```

**Parameters:**

- `headers` - Next.js Headers object
- `options.cookieName` - Cookie name (default: `"i18n-language"`)
- `options.defaultLanguage` - Fallback language (default: `"en"`)
- `options.availableLanguages` - Supported languages for Accept-Language

**Returns:** Detected language code

**Detection Priority:**

1. Cookie (user preference)
2. Accept-Language header (browser setting)
3. Default language (fallback)

**Example:**

```typescript
import { headers } from "next/headers";
import { getServerLanguage } from "i18nexus/server";

export default async function Page() {
  const headersList = await headers();
  const language = getServerLanguage(headersList, {
    availableLanguages: ["en", "ko", "ja"],
    defaultLanguage: "en",
  });

  return <div>Language: {language}</div>;
}
```

---

### `parseAcceptLanguage()`

Parse Accept-Language header and find best match.

```typescript
function parseAcceptLanguage(
  acceptLanguage: string,
  availableLanguages: string[],
): string | null;
```

**Parameters:**

- `acceptLanguage` - Accept-Language header value
- `availableLanguages` - List of supported language codes

**Returns:** Best matching language code or `null`

**Features:**

- Parses quality values (q-factor)
- Handles region codes (`en-US` → `en`)
- Case-insensitive matching
- Respects language priority

**Example:**

```typescript
import { parseAcceptLanguage } from "i18nexus/server";

const language = parseAcceptLanguage("ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7", [
  "en",
  "ko",
  "ja",
]);
// Returns: "ko"
```

---

### `createServerTranslation()`

Create translation function for Server Components.

```typescript
function createServerTranslation(
  language: string,
  translations: Record<string, Record<string, string>>,
): (
  key: string,
  variables?: ServerTranslationVariables | string,
  fallback?: string,
) => string;
```

**Parameters:**

- `language` - Current language code
- `translations` - Translations object

**Returns:** Translation function

**Translation Function:**

```typescript
t(key: string): string
t(key: string, variables: ServerTranslationVariables): string
t(key: string, fallback: string): string  // Legacy
```

**Example:**

```typescript
import { createServerTranslation } from "i18nexus/server";

const t = createServerTranslation("en", translations);

// Basic
t("Welcome");

// With variables
t("Hello {{name}}", { name: "World" });

// Legacy fallback
t("Welcome", "환영합니다");
```

---

### `getServerTranslations()`

Get translations object for current language.

```typescript
function getServerTranslations(
  language: string,
  translations: Record<string, Record<string, string>>,
): Record<string, string>;
```

**Parameters:**

- `language` - Language code
- `translations` - Full translations object

**Returns:** Translations for specified language

**Example:**

```typescript
import { getServerTranslations } from "i18nexus/server";

const dict = getServerTranslations("ko", translations);

return <h1>{dict["Welcome"]}</h1>;
```

---

### `loadTranslations()`

Load translations from directory.

```typescript
async function loadTranslations(
  localesDir: string,
): Promise<Record<string, Record<string, string>>>;
```

**Parameters:**

- `localesDir` - Directory path containing translations

**Returns:** Translations object

**Example:**

```typescript
import { loadTranslations } from "i18nexus/server";

const translations = await loadTranslations("./locales");
```

---

### `createServerI18nWithTranslations()`

Create server i18n with pre-loaded translations.

```typescript
function createServerI18nWithTranslations(
  headers: Headers,
  translations: Record<string, Record<string, string>>,
  options?: {
    cookieName?: string;
    defaultLanguage?: string;
    availableLanguages?: string[];
  },
): {
  t: TranslationFunction;
  language: string;
  translations: Record<string, Record<string, string>>;
  dict: Record<string, string>;
};
```

**Parameters:**

- `headers` - Next.js Headers object
- `translations` - Pre-loaded translations
- `options` - Configuration options

**Returns:** Same as `createServerI18n()`

**Example:**

```typescript
import { headers } from "next/headers";
import { createServerI18nWithTranslations } from "i18nexus/server";
import translations from "@/locales";

export default async function Page() {
  const headersList = await headers();
  const { t, language } = createServerI18nWithTranslations(
    headersList,
    translations,
    { availableLanguages: ["en", "ko"] }
  );

  return <h1>{t("Welcome")}</h1>;
}
```

---

## Types

### `ServerTranslationVariables`

```typescript
type ServerTranslationVariables = Record<string, string | number>;
```

Variables for server-side string interpolation.

**Usage:**

```typescript
const variables: ServerTranslationVariables = {
  name: "User",
  count: 5,
  price: 1000,
};

t("Hello {{name}}, {{count}} items, {{price}} KRW", variables);
```

---

## Best Practices

### 1. Use Accept-Language Detection

```typescript
const { t, language } = await getTranslation("common", {
  availableLanguages: ["en", "ko", "ja", "zh"],
  defaultLanguage: "en",
});
```

### 2. Cache Translations

```typescript
// lib/i18n.ts
let cachedTranslations: Record<string, Record<string, string>> | null = null;

export async function getTranslations() {
  if (!cachedTranslations) {
    cachedTranslations = await loadTranslations("./locales");
  }
  return cachedTranslations;
}
```

### 3. Type-Safe Languages

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const,
  defaultLanguage: "en",
});

// Usage
const { t } = await getTranslation("common", {
  availableLanguages: [...config.languages],
  defaultLanguage: config.defaultLanguage,
});
```

---

## See Also

- [Client API](./client.md)
- [Types Reference](./types.md)
- [Accept-Language Guide](../guides/accept-language.md)
- [Interpolation Guide](../guides/interpolation.md)
