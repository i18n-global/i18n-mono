# Namespace-based Translations

Organize your translations into logical namespaces for better structure and maintainability.

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Automatic Type Inference](#automatic-type-inference)
- [Dynamic Translations](#dynamic-translations)
- [Styled Variables](#styled-variables)
- [Server-Side Usage](#server-side-usage)
- [Best Practices](#best-practices)

---

## Overview

Namespace-based translations allow you to organize translation keys by feature, page, or domain:

```typescript
{
  common: { en: { welcome: "Welcome" } },
  menu: { en: { home: "Home" } },
  error: { en: { notfound: "404 - Not Found" } }
}
```

### Benefits

✅ **Better Organization** - Group related translations together
✅ **Type Safety** - Each namespace has its own typed keys
✅ **Lazy Loading** - Load only needed namespaces
✅ **No Key Conflicts** - Same key in different namespaces
✅ **Team Collaboration** - Different teams own different namespaces

---

## Basic Usage

### 1. Define Translations

```typescript
import type { NamespaceTranslations } from 'i18nexus';

const translations: NamespaceTranslations = {
  common: {
    en: {
      welcome: 'Welcome',
      goodbye: 'Goodbye',
    },
    ko: {
      welcome: '환영합니다',
      goodbye: '안녕히 가세요',
    },
  },
  menu: {
    en: {
      home: 'Home',
      about: 'About',
    },
    ko: {
      home: '홈',
      about: '소개',
    },
  },
};
```

### 2. Setup Provider

```tsx
import { I18nProvider } from 'i18nexus';

function App() {
  return (
    <I18nProvider
      translations={translations}
      languageManagerOptions={{
        defaultLanguage: 'en',
      }}
    >
      <YourApp />
    </I18nProvider>
  );
}
```

### 3. Use Translations

```tsx
import { useTranslation } from 'i18nexus';

function WelcomeComponent() {
  const { t } = useTranslation('common');

  return <h1>{t('welcome')}</h1>;
}

function MenuComponent() {
  const { t } = useTranslation('menu');

  return <nav>{t('home')}</nav>;
}
```

---

## Automatic Type Inference

Use `createI18n` to automatically infer types from your translation object:

### Basic Example

```typescript
import { createI18n } from 'i18nexus';

const translations = {
  common: {
    en: { welcome: 'Welcome', goodbye: 'Goodbye' },
    ko: { welcome: '환영합니다', goodbye: '안녕히 가세요' },
  },
  menu: {
    en: { home: 'Home', about: 'About' },
    ko: { home: '홈', about: '소개' },
  },
} as const; // ⚠️ Important: 'as const' for type inference

const i18n = createI18n(translations);

// Now use the typed versions
function App() {
  return (
    <i18n.I18nProvider
      languageManagerOptions={{ defaultLanguage: 'en' }}
    >
      <YourApp />
    </i18n.I18nProvider>
  );
}

function Component() {
  // ✅ TypeScript knows available namespaces
  const { t } = i18n.useTranslation('common');

  // ✅ TypeScript knows available keys
  t('welcome');  // ✅ OK
  t('invalid');  // ❌ TypeScript Error
}
```

### Advanced Example

```typescript
const translations = {
  auth: {
    en: {
      login: 'Log In',
      signup: 'Sign Up',
      forgot: 'Forgot Password?',
    },
    ko: {
      login: '로그인',
      signup: '회원가입',
      forgot: '비밀번호를 잊으셨나요?',
    },
  },
  dashboard: {
    en: {
      overview: 'Overview',
      stats: 'Statistics',
      settings: 'Settings',
    },
    ko: {
      overview: '개요',
      stats: '통계',
      settings: '설정',
    },
  },
} as const;

const i18n = createI18n(translations);

// ✅ Full type inference
function AuthPage() {
  const { t } = i18n.useTranslation('auth');
  // t() has autocomplete for: 'login' | 'signup' | 'forgot'

  return (
    <div>
      <button>{t('login')}</button>
      <button>{t('signup')}</button>
      <a>{t('forgot')}</a>
    </div>
  );
}
```

### Type Benefits

```typescript
const i18n = createI18n(translations);

// ❌ Invalid namespace
i18n.useTranslation('invalid');  // TypeScript Error

// ❌ Invalid key
const { t } = i18n.useTranslation('auth');
t('nonexistent');  // TypeScript Error

// ✅ Full IDE autocomplete
const { t } = i18n.useTranslation('auth');
t('lo...')  // IDE suggests: login
```

---

## Dynamic Translations

For runtime-generated keys (e.g., from API, user input, arrays):

### When to Use

Use `useDynamicTranslation` when:
- Keys come from API responses
- Keys are generated at runtime
- Keys come from array indices
- Keys are user-provided

### Basic Usage

```typescript
import { useDynamicTranslation } from 'i18nexus';

function DynamicComponent() {
  const { t } = useDynamicTranslation();

  // ✅ Runtime keys work
  const items = ['item.type.0', 'item.type.1', 'item.type.2'];

  return (
    <div>
      {items.map(key => (
        <div key={key}>{t(key)}</div>
      ))}
    </div>
  );
}
```

### Setup Dynamic Translations

```tsx
const dynamicTranslations = {
  en: {
    'item.type.0': 'League',
    'item.type.1': 'Cup',
    'error.404': 'Not Found',
    'error.500': 'Server Error',
  },
  ko: {
    'item.type.0': '리그',
    'item.type.1': '컵',
    'error.404': '찾을 수 없음',
    'error.500': '서버 오류',
  },
};

<I18nProvider
  translations={namespaceTranslations}
  dynamicTranslations={dynamicTranslations}
  languageManagerOptions={{ defaultLanguage: 'en' }}
>
  <App />
</I18nProvider>
```

### Real-World Example

```tsx
// API response with dynamic types
const items = [
  { id: 1, type: 0, label: 'item.type.0' },
  { id: 2, type: 1, label: 'item.type.1' },
];

function ItemList() {
  const { t } = useDynamicTranslation();

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {t(item.label)}  {/* ✅ Dynamic key */}
        </li>
      ))}
    </ul>
  );
}
```

### Mixed Usage

```tsx
function MixedComponent() {
  const { t: tCommon } = useTranslation('common');
  const { t: tDynamic } = useDynamicTranslation();

  return (
    <div>
      <h1>{tCommon('welcome')}</h1>  {/* Static, type-safe */}
      <p>{tDynamic(errorCode)}</p>    {/* Dynamic, runtime */}
    </div>
  );
}
```

---

## Styled Variables

Style specific parts of translated text:

### Basic Styling

```tsx
const { t } = useTranslation('common');

// Translation: "Hello {{name}}!"
t(
  'greeting',
  { name: 'John' },
  { name: { color: 'blue' } }
)
// Result: Hello <span style="color: blue;">John</span>!
```

### Multiple Styles

```tsx
t(
  'greeting',
  { name: 'John' },
  {
    name: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: '20px',
      textDecoration: 'underline',
    }
  }
)
```

### Badge Style

```tsx
// Translation: "You have {{count}} items"
t(
  'cartStatus',
  { count: '5' },
  {
    count: {
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '12px',
      fontWeight: 'bold',
    }
  }
)
```

### Multiple Variables

```tsx
// Translation: "{{first}} and {{second}}"
t(
  'multi',
  { first: 'React', second: 'TypeScript' },
  {
    first: { color: '#61dafb', fontWeight: 'bold' },
    second: { color: '#3178c6', fontWeight: 'bold' },
  }
)
```

### Highlight Box

```tsx
t(
  'warning',
  { text: 'Important' },
  {
    text: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      border: '1px solid #ffc107',
    }
  }
)
```

### Advanced: Gradient

```tsx
t(
  'premium',
  { user: 'Premium User' },
  {
    user: {
      background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
      fontSize: '20px',
    }
  }
)
```

### Type Definition

```typescript
type TranslationStyles = {
  [variableName: string]: React.CSSProperties;
};

function t(
  key: string,
  variables?: { [key: string]: string | number },
  styles?: TranslationStyles
): string | React.ReactElement;
```

---

## Server-Side Usage

### Next.js App Router

```tsx
// app/[locale]/layout.tsx
import { I18nProvider } from 'i18nexus';
import { translations } from '@/i18n/translations';

export default function Layout({ children, params }) {
  return (
    <I18nProvider
      translations={translations}
      languageManagerOptions={{
        defaultLanguage: params.locale,
      }}
    >
      {children}
    </I18nProvider>
  );
}
```

### Server Component with Namespaces

```tsx
import { getTranslation } from 'i18nexus/server';

export default async function ServerPage() {
  const { t } = await getTranslation('common', 'en');

  return <h1>{t('welcome')}</h1>;
}
```

### Dynamic Translations on Server

```tsx
import { getDynamicTranslation } from 'i18nexus/server';

export default async function ServerPage() {
  const dynamicTranslations = {
    en: { 'error.404': 'Not Found' },
    ko: { 'error.404': '찾을 수 없음' },
  };

  const t = getDynamicTranslation('en', dynamicTranslations);

  return <p>{t('error.404')}</p>;
}
```

---

## Best Practices

### 1. Namespace Organization

```
✅ Good - By feature/domain
├── auth: { login, signup, forgot }
├── dashboard: { overview, stats, settings }
├── profile: { edit, view, delete }

❌ Avoid - By page
├── page1: { title, button1, button2 }
├── page2: { title, button1, button2 }
```

### 2. Namespace Naming

```typescript
// ✅ Good - Clear, semantic names
const translations = {
  authentication: { ... },
  navigation: { ... },
  validation: { ... },
}

// ❌ Avoid - Generic names
const translations = {
  misc: { ... },
  other: { ... },
  stuff: { ... },
}
```

### 3. Use as const

```typescript
// ✅ Always use 'as const' with createI18n
const translations = {
  common: { en: { welcome: 'Welcome' } },
} as const;

const i18n = createI18n(translations);

// ❌ Missing 'as const' - no type inference
const translations = {
  common: { en: { welcome: 'Welcome' } },
};
```

### 4. Separate Static and Dynamic

```tsx
// ✅ Good - Clear separation
function Component() {
  const { t } = useTranslation('common');  // Static keys
  const { t: tDynamic } = useDynamicTranslation();  // Runtime keys

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{tDynamic(apiKey)}</p>
    </div>
  );
}

// ❌ Avoid - Mixing concerns
function Component() {
  const { t } = useTranslation('common');
  return <p>{t(runtimeKey as any)}</p>;  // Type unsafe
}
```

### 5. Template Literal Fallback

```tsx
// ✅ Good - Inline fallback with interpolation
t('{{user}}님 환영합니다', { user: name })

// ❌ Avoid - No fallback
t(unknownKey, { user: name })
```

### 6. Keep Namespaces Focused

```typescript
// ✅ Good - Single responsibility
const translations = {
  userAuth: {
    en: { login: '...', signup: '...', logout: '...' }
  },
  userProfile: {
    en: { view: '...', edit: '...', delete: '...' }
  },
}

// ❌ Avoid - Too broad
const translations = {
  user: {
    en: {
      login: '...', signup: '...', logout: '...',
      view: '...', edit: '...', delete: '...',
      // ... 100 more keys
    }
  },
}
```

---

## Migration Guide

### From Old Structure

**Before:**
```typescript
const translations = {
  en: { welcome: 'Welcome', goodbye: 'Goodbye' },
  ko: { welcome: '환영합니다', goodbye: '안녕히 가세요' },
};

const { t } = useTranslation();
t('welcome');
```

**After:**
```typescript
const translations = {
  common: {
    en: { welcome: 'Welcome', goodbye: 'Goodbye' },
    ko: { welcome: '환영합니다', goodbye: '안녕히 가세요' },
  },
} as const;

const i18n = createI18n(translations);

const { t } = i18n.useTranslation('common');
t('welcome');  // ✅ Type-safe
```

### Gradual Migration

You can use both old and new patterns during migration:

```typescript
// Keep old translations
const oldTranslations = {
  en: { ... },
  ko: { ... },
};

// Add new namespace translations
const namespaceTranslations = {
  common: { en: { ... }, ko: { ... } },
};

// Use both in provider
<I18nProvider
  translations={namespaceTranslations}
  // oldTranslations can be used as dynamicTranslations
  dynamicTranslations={oldTranslations}
>
```

---

## See Also

- [Styled Text Examples](../examples/styled-text-example.tsx)
- [API Reference](./API_REFERENCE.md)
- [TypeScript Guide](./TYPESCRIPT_GUIDE.md)
