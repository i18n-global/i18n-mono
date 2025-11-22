# API Reference

Complete API reference for i18nexus namespace-based translations.

## Table of Contents

- [createI18n](#createi18n)
- [I18nProvider](#i18nprovider)
- [useTranslation](#usetranslation)
- [useDynamicTranslation](#usedynamictranslation)
- [Server Functions](#server-functions)
- [Type Definitions](#type-definitions)

---

## createI18n

Creates a typed i18n instance with automatic type inference.

### Signature

```typescript
function createI18n<TTranslations extends NamespaceTranslations>(
  translations: TTranslations
): CreateI18nReturn<TTranslations>
```

### Parameters

- `translations`: Translation object with namespace structure

### Returns

An object containing:
- `I18nProvider`: Typed provider component
- `useTranslation`: Typed translation hook
- `translations`: Original translation object

### Example

```typescript
const translations = {
  common: {
    en: { welcome: 'Welcome' },
    ko: { welcome: '환영합니다' },
  },
} as const;

const i18n = createI18n(translations);

// Use i18n.I18nProvider, i18n.useTranslation
```

### Type Inference

```typescript
// ✅ Automatically infers:
// - Available namespaces: 'common'
// - Available keys: 'welcome'
// - Available languages: 'en' | 'ko'

const { t } = i18n.useTranslation('common');
t('welcome');  // ✅ Type-safe
t('invalid');  // ❌ TypeScript error
```

---

## I18nProvider

React context provider for i18n configuration.

### Props

```typescript
interface I18nProviderProps<
  TLanguage extends string = string,
  TTranslations extends NamespaceTranslations = NamespaceTranslations,
> {
  /** Namespace-based translations */
  translations?: TTranslations;

  /** Dynamic translations (flat structure) */
  dynamicTranslations?: Record<string, Record<string, string>>;

  /** Language manager configuration */
  languageManagerOptions?: LanguageManagerOptions;

  /** Initial language (SSR) */
  initialLanguage?: TLanguage;

  /** Children components */
  children: React.ReactNode;
}
```

### LanguageManagerOptions

```typescript
interface LanguageManagerOptions {
  /** Cookie name for language storage */
  cookieName?: string;

  /** Cookie options */
  cookieOptions?: CookieOptions;

  /** Default language */
  defaultLanguage?: string;

  /** Available language configurations */
  availableLanguages?: LanguageConfig[];

  /** Enable browser language auto-detection */
  enableAutoDetection?: boolean;

  /** Enable localStorage for language persistence */
  enableLocalStorage?: boolean;

  /** localStorage key */
  storageKey?: string;
}
```

### Example

```typescript
<I18nProvider
  translations={namespaceTranslations}
  dynamicTranslations={dynamicTranslations}
  languageManagerOptions={{
    defaultLanguage: 'en',
    availableLanguages: [
      { code: 'en', name: 'English' },
      { code: 'ko', name: '한국어' },
    ],
    enableAutoDetection: true,
    enableLocalStorage: true,
  }}
>
  <App />
</I18nProvider>
```

---

## useTranslation

Hook for namespace-based translations with type safety.

### Signature

```typescript
function useTranslation<K extends string = string>(
  namespace: string
): UseTranslationReturn<K>
```

### Parameters

- `namespace`: Namespace to use for translations

### Returns

```typescript
interface UseTranslationReturn<K extends string> {
  /** Translation function */
  t: TranslationFunction<K>;

  /** Current language code */
  currentLanguage: string;

  /** Whether translations are ready */
  isReady: boolean;
}
```

### TranslationFunction

```typescript
type TranslationFunction<K extends string> = {
  /** Basic translation */
  (key: K): string;

  /** With variable interpolation */
  (key: K, variables: TranslationVariables): string;

  /** With styled variables */
  (
    key: K,
    variables: TranslationVariables,
    styles: TranslationStyles
  ): React.ReactElement;
};
```

### Examples

#### Basic Usage

```typescript
const { t, currentLanguage, isReady } = useTranslation('common');

// Simple translation
const welcome = t('welcome');

// With variables
const greeting = t('hello', { name: 'John' });

// With styles
const styled = t(
  'hello',
  { name: 'John' },
  { name: { color: 'blue' } }
);
```

#### Variable Interpolation

```typescript
// Translation: "Hello {{name}}!"
t('greeting', { name: 'Alice' })
// Result: "Hello Alice!"

// Multiple variables
// Translation: "{{count}} items in {{location}}"
t('status', { count: 5, location: 'cart' })
// Result: "5 items in cart"
```

#### Styled Variables

```typescript
// Single style
t('greeting', { name: 'Bob' }, { name: { color: 'red' } })
// Result: Hello <span style="color: red;">Bob</span>!

// Multiple styles
t(
  'greeting',
  { name: 'Charlie' },
  {
    name: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: '20px',
    }
  }
)
```

#### Template Literal Fallback

```typescript
// If key not found, uses key as fallback and interpolates
t('{{user}}님 환영합니다', { user: '홍길동' })
// If '{{user}}님 환영합니다' not in translations:
// Result: "홍길동님 환영합니다"
```

#### Missing Variables

```typescript
// Variables not provided - keeps placeholder
t('Hello {{name}}!')
// Result: "Hello {{name}}!"

// Partial variables
t('{{a}} and {{b}}', { a: 'First' })
// Result: "First and {{b}}"
```

---

## useDynamicTranslation

Hook for runtime-generated translation keys.

### Signature

```typescript
function useDynamicTranslation(): UseDynamicTranslationReturn
```

### Returns

```typescript
interface UseDynamicTranslationReturn {
  /** Dynamic translation function */
  t: DynamicTranslationFunction;

  /** Current language code */
  currentLanguage: string;

  /** Whether translations are ready */
  isReady: boolean;
}
```

### DynamicTranslationFunction

```typescript
type DynamicTranslationFunction = {
  /** Basic translation */
  (key: string): string;

  /** With variable interpolation */
  (key: string, variables: TranslationVariables): string;

  /** With styled variables */
  (
    key: string,
    variables: TranslationVariables,
    styles: TranslationStyles
  ): React.ReactElement;
};
```

### Examples

#### Basic Usage

```typescript
const { t } = useDynamicTranslation();

// Dynamic keys from runtime
const errorCode = 'error.404';
const message = t(errorCode);

// From API response
const items = ['item.type.0', 'item.type.1'];
items.map(key => t(key));
```

#### With Variables

```typescript
const { t } = useDynamicTranslation();

// Runtime key with variables
t('user.greeting', { name: 'John' });

// Template literal fallback
t('{{count}} items', { count: 5 });
```

#### Real-World Example

```typescript
function ItemList({ items }) {
  const { t } = useDynamicTranslation();

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {t(item.translationKey)}
        </li>
      ))}
    </ul>
  );
}
```

---

## Server Functions

### getDynamicTranslation

Server-side function for dynamic translations.

#### Signature

```typescript
function getDynamicTranslation(
  language: string,
  dynamicTranslations: Record<string, Record<string, string>>
): DynamicTranslationFunction
```

#### Parameters

- `language`: Language code to use
- `dynamicTranslations`: Translation object

#### Returns

Translation function for server-side use

#### Example

```typescript
// app/page.tsx (Server Component)
import { getDynamicTranslation } from 'i18nexus/server';

export default async function Page() {
  const dynamicTranslations = {
    en: { 'error.404': 'Not Found' },
    ko: { 'error.404': '찾을 수 없음' },
  };

  const t = getDynamicTranslation('en', dynamicTranslations);

  return <p>{t('error.404')}</p>;
}
```

---

## Type Definitions

### NamespaceTranslations

```typescript
type NamespaceTranslations = Record<
  string,  // namespace
  Record<
    string,  // language
    Record<string, string>  // key: value
  >
>;
```

### TranslationVariables

```typescript
type TranslationVariables = {
  [key: string]: string | number;
};
```

### TranslationStyles

```typescript
type TranslationStyles = {
  [variableName: string]: React.CSSProperties;
};
```

### ExtractNamespaces

Extract namespace names from translation object:

```typescript
type ExtractNamespaces<T extends NamespaceTranslations> = keyof T & string;

// Example
const trans = {
  common: { en: { ... } },
  menu: { en: { ... } },
} as const;

type NS = ExtractNamespaces<typeof trans>;
// Result: 'common' | 'menu'
```

### ExtractNamespaceKeys

Extract keys from a specific namespace:

```typescript
type ExtractNamespaceKeys<
  T extends NamespaceTranslations,
  NS extends ExtractNamespaces<T>
> = keyof T[NS][keyof T[NS]] & string;

// Example
type CommonKeys = ExtractNamespaceKeys<typeof trans, 'common'>;
// Result: 'welcome' | 'goodbye'
```

### CreateI18nReturn

```typescript
interface CreateI18nReturn<TTranslations extends NamespaceTranslations> {
  I18nProvider: React.FC<I18nProviderProps>;
  useTranslation: <NS extends ExtractNamespaces<TTranslations>>(
    namespace: NS
  ) => UseTranslationReturn<ExtractNamespaceKeys<TTranslations, NS>>;
  translations: TTranslations;
}
```

---

## Complete Type Example

```typescript
import { createI18n } from 'i18nexus';
import type {
  NamespaceTranslations,
  TranslationVariables,
  TranslationStyles,
} from 'i18nexus';

const translations = {
  common: {
    en: {
      welcome: 'Welcome',
      greeting: 'Hello {{name}}',
    },
    ko: {
      welcome: '환영합니다',
      greeting: '안녕하세요 {{name}}',
    },
  },
  menu: {
    en: { home: 'Home', about: 'About' },
    ko: { home: '홈', about: '소개' },
  },
} as const satisfies NamespaceTranslations;

const i18n = createI18n(translations);

function TypedComponent() {
  // ✅ Type-safe namespace
  const { t } = i18n.useTranslation('common');

  // ✅ Type-safe keys
  const w = t('welcome');

  // ✅ Type-safe variables
  const vars: TranslationVariables = { name: 'John' };
  const g = t('greeting', vars);

  // ✅ Type-safe styles
  const styles: TranslationStyles = {
    name: { color: 'blue', fontWeight: 'bold' }
  };
  const s = t('greeting', vars, styles);

  return <div>{w}</div>;
}
```

---

## Error Handling

### Missing Namespace

```typescript
const { t } = useTranslation('nonexistent');
t('key');
// Console warning: 'Namespace "nonexistent" not found in translations'
// Returns: 'key'
```

### Missing Translation Key

```typescript
const { t } = useTranslation('common');
t('nonexistent' as any);
// Returns: 'nonexistent'
```

### Missing Variable

```typescript
t('Hello {{name}}!');
// Returns: 'Hello {{name}}!'

t('Hello {{name}}!', {});
// Returns: 'Hello {{name}}!'

t('Hello {{name}}!', { name: 'John' });
// Returns: 'Hello John!'
```

---

## Performance Tips

### 1. Use as const

```typescript
// ✅ Good - Literal types
const translations = { ... } as const;

// ❌ Bad - Wider types
const translations = { ... };
```

### 2. Memoize Translation Function

```typescript
const MemoizedComponent = React.memo(function Component() {
  const { t } = useTranslation('common');
  return <div>{t('welcome')}</div>;
});
```

### 3. Lazy Load Namespaces

```typescript
// Only load needed namespaces
const commonTranslations = {
  common: { ... }
};

const menuTranslations = {
  menu: { ... }
};

// Merge as needed
const translations = {
  ...commonTranslations,
  ...menuTranslations,
};
```

---

## See Also

- [Namespace Translations Guide](./NAMESPACE_TRANSLATIONS.md)
- [TypeScript Guide](./TYPESCRIPT_GUIDE.md)
- [Examples](../examples/)
