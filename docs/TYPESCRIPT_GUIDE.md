# TypeScript Guide

Complete guide to using i18nexus with TypeScript for full type safety.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Type Safety](#basic-type-safety)
- [Advanced Type Safety](#advanced-type-safety)
- [Type Inference](#type-inference)
- [Generic Types](#generic-types)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Installation

```bash
npm install i18nexus
```

TypeScript types are included - no need for `@types/i18nexus`.

### Minimal Setup

```typescript
import { createI18n } from 'i18nexus';

const translations = {
  common: {
    en: { welcome: 'Welcome' },
    ko: { welcome: '환영합니다' },
  },
} as const;  // ⚠️ Important!

const i18n = createI18n(translations);
export default i18n;
```

---

## Basic Type Safety

### 1. Define Translations with `as const`

```typescript
// ✅ CORRECT - Use 'as const' for literal types
const translations = {
  common: {
    en: { welcome: 'Welcome', goodbye: 'Goodbye' },
    ko: { welcome: '환영합니다', goodbye: '안녕히 가세요' },
  },
} as const;

// ❌ WRONG - Without 'as const', types are too wide
const translations = {
  common: {
    en: { welcome: 'Welcome' },  // Type: string
  },
};
```

### 2. Use createI18n for Automatic Inference

```typescript
const i18n = createI18n(translations);

function Component() {
  // ✅ Namespace is type-checked
  const { t } = i18n.useTranslation('common');

  // ✅ Keys are type-checked
  t('welcome');    // ✅ OK
  t('goodbye');    // ✅ OK
  t('invalid');    // ❌ TypeScript Error
}
```

### 3. Type-Safe Namespaces

```typescript
const translations = {
  auth: {
    en: { login: 'Log In', signup: 'Sign Up' },
    ko: { login: '로그인', signup: '회원가입' },
  },
  menu: {
    en: { home: 'Home', about: 'About' },
    ko: { home: '홈', about: '소개' },
  },
} as const;

const i18n = createI18n(translations);

// ✅ Valid namespaces
i18n.useTranslation('auth');
i18n.useTranslation('menu');

// ❌ Invalid namespace
i18n.useTranslation('invalid');  // TypeScript Error
```

---

## Advanced Type Safety

### satisfies Operator (TypeScript 4.9+)

```typescript
import type { NamespaceTranslations } from 'i18nexus';

const translations = {
  common: {
    en: { welcome: 'Welcome' },
    ko: { welcome: '환영합니다' },
  },
} as const satisfies NamespaceTranslations;

const i18n = createI18n(translations);
```

**Benefits:**
- ✅ Validates structure at compile time
- ✅ Preserves literal types
- ✅ Better error messages

### Strict Translation Keys

```typescript
// Ensure all languages have same keys
type TranslationKeys = {
  welcome: string;
  goodbye: string;
};

const translations = {
  common: {
    en: {
      welcome: 'Welcome',
      goodbye: 'Goodbye',
    } satisfies TranslationKeys,
    ko: {
      welcome: '환영합니다',
      goodbye: '안녕히 가세요',
    } satisfies TranslationKeys,
  },
} as const;
```

### Type-Safe Variables

```typescript
import type { TranslationVariables } from 'i18nexus';

const translations = {
  common: {
    en: { greeting: 'Hello {{name}}!' },
  },
} as const;

const i18n = createI18n(translations);

function Component() {
  const { t } = i18n.useTranslation('common');

  // ✅ Type-safe variables
  const vars: TranslationVariables = { name: 'John' };
  t('greeting', vars);

  // ✅ Inline
  t('greeting', { name: 'John' });

  // ✅ Number values
  t('count', { count: 5 });
}
```

### Type-Safe Styles

```typescript
import type { TranslationStyles } from 'i18nexus';

function Component() {
  const { t } = i18n.useTranslation('common');

  // ✅ Type-safe styles
  const styles: TranslationStyles = {
    name: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: '20px',
    },
  };

  t('greeting', { name: 'John' }, styles);

  // ❌ Invalid CSS property
  const invalid: TranslationStyles = {
    name: {
      notAProperty: 'value',  // TypeScript Error
    },
  };
}
```

---

## Type Inference

### Extract Namespaces

```typescript
import type { ExtractNamespaces } from 'i18nexus';

const translations = {
  common: { en: { ... } },
  menu: { en: { ... } },
  auth: { en: { ... } },
} as const;

type Namespaces = ExtractNamespaces<typeof translations>;
// Result: 'common' | 'menu' | 'auth'

// Use in function parameters
function useTypedTranslation(namespace: Namespaces) {
  return i18n.useTranslation(namespace);
}
```

### Extract Keys

```typescript
import type { ExtractNamespaceKeys } from 'i18nexus';

const translations = {
  common: {
    en: { welcome: '...', goodbye: '...' },
  },
} as const;

type CommonKeys = ExtractNamespaceKeys<typeof translations, 'common'>;
// Result: 'welcome' | 'goodbye'

// Use in function parameters
function translate(key: CommonKeys): string {
  const { t } = i18n.useTranslation('common');
  return t(key);
}
```

### Infer All Keys

```typescript
type ExtractI18nKeys<T extends NamespaceTranslations> = {
  [NS in keyof T]: keyof T[NS][keyof T[NS]] & string;
}[keyof T] & string;

const translations = {
  common: { en: { welcome: '...' } },
  menu: { en: { home: '...' } },
} as const;

type AllKeys = ExtractI18nKeys<typeof translations>;
// Result: 'welcome' | 'home'
```

---

## Generic Types

### Generic Component with Namespace

```typescript
function TranslatedText<NS extends ExtractNamespaces<typeof translations>>(
  props: {
    namespace: NS;
    tkey: ExtractNamespaceKeys<typeof translations, NS>;
  }
) {
  const { t } = i18n.useTranslation(props.namespace);
  return <span>{t(props.tkey)}</span>;
}

// Usage
<TranslatedText namespace="common" tkey="welcome" />  // ✅ OK
<TranslatedText namespace="common" tkey="invalid" />  // ❌ Error
<TranslatedText namespace="invalid" tkey="welcome" /> // ❌ Error
```

### Generic Hook

```typescript
function useTypedTranslation<
  NS extends ExtractNamespaces<typeof translations>
>(namespace: NS) {
  const { t } = i18n.useTranslation(namespace);

  return {
    t: (key: ExtractNamespaceKeys<typeof translations, NS>) => t(key),
  };
}

// Usage
const { t } = useTypedTranslation('common');
t('welcome');  // ✅ OK
t('invalid');  // ❌ Error
```

### Conditional Types

```typescript
type TranslationReturn<
  NS extends string,
  K extends string,
  HasStyles extends boolean = false
> = HasStyles extends true ? React.ReactElement : string;

function typedTranslate<
  NS extends ExtractNamespaces<typeof translations>,
  K extends ExtractNamespaceKeys<typeof translations, NS>
>(
  namespace: NS,
  key: K,
  variables?: TranslationVariables,
  styles?: TranslationStyles
): TranslationReturn<NS, K, typeof styles extends undefined ? false : true> {
  const { t } = i18n.useTranslation(namespace);
  return t(key, variables!, styles!) as any;
}
```

---

## Common Patterns

### 1. Shared Translation Types

```typescript
// types/i18n.ts
export const translations = {
  common: { en: { ... }, ko: { ... } },
  menu: { en: { ... }, ko: { ... } },
} as const;

export type Namespaces = ExtractNamespaces<typeof translations>;
export type CommonKeys = ExtractNamespaceKeys<typeof translations, 'common'>;
export type MenuKeys = ExtractNamespaceKeys<typeof translations, 'menu'>;

// components/MyComponent.tsx
import type { Namespaces, CommonKeys } from '@/types/i18n';

function Component() {
  const ns: Namespaces = 'common';
  const key: CommonKeys = 'welcome';
  // ...
}
```

### 2. Translation Factory

```typescript
// utils/createTranslation.ts
export function createTranslation<
  NS extends ExtractNamespaces<typeof translations>
>(namespace: NS) {
  return {
    useT: () => {
      const { t } = i18n.useTranslation(namespace);
      return t;
    },
    t: (key: ExtractNamespaceKeys<typeof translations, NS>) => {
      // Server-side translation
    },
  };
}

// usage
const common = createTranslation('common');

function Component() {
  const t = common.useT();
  return <div>{t('welcome')}</div>;
}
```

### 3. Typed Translation Object

```typescript
type TypedTranslations = {
  [NS in ExtractNamespaces<typeof translations>]: {
    [K in ExtractNamespaceKeys<typeof translations, NS>]: string;
  };
};

function createTypedTranslations(
  language: string
): TypedTranslations {
  // Implementation
  return {} as TypedTranslations;
}

const typed = createTypedTranslations('en');
typed.common.welcome;  // ✅ Type-safe
```

### 4. Namespace Guard

```typescript
function isValidNamespace(
  ns: string
): ns is ExtractNamespaces<typeof translations> {
  return ns in translations;
}

function safeTranslate(namespace: string, key: string) {
  if (!isValidNamespace(namespace)) {
    return key;
  }

  const { t } = i18n.useTranslation(namespace);
  return t(key);
}
```

---

## Troubleshooting

### Issue 1: Types Too Wide

**Problem:**
```typescript
const translations = {
  common: {
    en: { welcome: 'Welcome' },  // Type: string (too wide)
  },
};
```

**Solution:**
```typescript
const translations = {
  common: {
    en: { welcome: 'Welcome' },  // Type: 'Welcome' (literal)
  },
} as const;  // ✅ Add 'as const'
```

### Issue 2: Type Errors with Dynamic Keys

**Problem:**
```typescript
const { t } = i18n.useTranslation('common');
const key = 'welcome';  // Type: string
t(key);  // ❌ Error: string not assignable to 'welcome' | 'goodbye'
```

**Solution 1 - Use useDynamicTranslation:**
```typescript
const { t } = useDynamicTranslation();
const key = 'welcome';
t(key);  // ✅ OK
```

**Solution 2 - Use Type Assertion:**
```typescript
const { t } = i18n.useTranslation('common');
const key = 'welcome' as const;
t(key);  // ✅ OK
```

**Solution 3 - Use 'as any':**
```typescript
const { t } = i18n.useTranslation('common');
const key = getRuntimeKey();
t(key as any);  // ✅ OK (but loses type safety)
```

### Issue 3: Cannot Infer Types

**Problem:**
```typescript
const i18n = createI18n(translations);
// Type of i18n is too complex or 'any'
```

**Solution:**
```typescript
// 1. Ensure 'as const'
const translations = { ... } as const;

// 2. Check TypeScript version (4.9+ recommended)

// 3. Simplify translation structure
const translations = {
  common: {
    en: { a: '1', b: '2' },  // Keep reasonable size
  },
} as const;
```

### Issue 4: Style Property Errors

**Problem:**
```typescript
t('key', { name: 'John' }, {
  name: { color: 'blue', invalidProp: 'x' }  // ❌ Error
});
```

**Solution:**
```typescript
import type { TranslationStyles } from 'i18nexus';

const styles: TranslationStyles = {
  name: {
    color: 'blue',
    // Only valid CSS properties allowed
  },
};

t('key', { name: 'John' }, styles);
```

### Issue 5: React.ReactElement vs string

**Problem:**
```typescript
const result = t('key', vars, styles);
// Type is string | React.ReactElement
```

**Solution 1 - Type Guard:**
```typescript
if (React.isValidElement(result)) {
  // result is React.ReactElement
} else {
  // result is string
}
```

**Solution 2 - Conditional:**
```typescript
const result = styles
  ? t('key', vars, styles) as React.ReactElement
  : t('key', vars) as string;
```

---

## Best Practices

### 1. Always Use `as const`

```typescript
// ✅ DO
const translations = { ... } as const;

// ❌ DON'T
const translations = { ... };
```

### 2. Use `satisfies` for Validation

```typescript
// ✅ DO (TypeScript 4.9+)
const translations = {
  ...
} as const satisfies NamespaceTranslations;

// ⚠️ OLDER
const translations: NamespaceTranslations = {
  ...  // Loses literal types
};
```

### 3. Extract Types to Separate File

```typescript
// types/i18n.ts
export const translations = { ... } as const;
export const i18n = createI18n(translations);
export type Namespaces = ExtractNamespaces<typeof translations>;
```

### 4. Document Complex Types

```typescript
/**
 * Translation keys available in the 'common' namespace
 * @example
 * const { t } = useTranslation('common');
 * t('welcome');  // ✅ OK
 */
export type CommonKeys = ExtractNamespaceKeys<
  typeof translations,
  'common'
>;
```

### 5. Use Type-Safe Wrappers

```typescript
// Wrap for additional type safety
export function useCommonTranslation() {
  return i18n.useTranslation('common');
}

// Usage
const { t } = useCommonTranslation();
t('welcome');  // ✅ Fully typed
```

---

## TypeScript Config

Recommended `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",

    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,

    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  }
}
```

---

## See Also

- [API Reference](./API_REFERENCE.md)
- [Namespace Translations Guide](./NAMESPACE_TRANSLATIONS.md)
- [Examples](../examples/)
