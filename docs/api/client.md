# Client-Side API Reference

Complete API reference for i18nexus client-side hooks and components.

## Import

```typescript
import {
  I18nProvider,
  I18NexusDevtools,
  useTranslation,
  useLanguageSwitcher,
  useI18nContext,
} from "i18nexus";

import type {
  I18nProviderProps,
  I18NexusDevtoolsProps,
  UseTranslationReturn,
  UseLanguageSwitcherReturn,
  TranslationVariables,
  TranslationStyles,
  TranslationFunction,
} from "i18nexus";
```

---

## Components

### `<I18nProvider>`

Main provider component for i18n context.

```typescript
function I18nProvider<TLanguage extends string = string>(
  props: I18nProviderProps<TLanguage>
): JSX.Element;
```

**Props:**

```typescript
interface I18nProviderProps<TLanguage extends string = string> {
  children: ReactNode;
  initialLanguage?: TLanguage;
  languageManagerOptions?: LanguageManagerOptions;
  translations?: Record<string, Record<string, string>>;
  onLanguageChange?: (language: TLanguage) => void;
}
```

**Example:**

```tsx
import { I18nProvider } from "i18nexus";
import type { AppLanguages } from "@/i18nexus.config";

<I18nProvider<AppLanguages>
  initialLanguage="ko"
  languageManagerOptions={{
    defaultLanguage: "ko",
    availableLanguages: [
      { code: "ko", name: "한국어", flag: "🇰🇷" },
      { code: "en", name: "English", flag: "🇺🇸" },
    ],
  }}
  translations={translations}
  onLanguageChange={(lang) => console.log("Changed to:", lang)}>
  <App />
</I18nProvider>;
```

---

### `<I18NexusDevtools>`

Visual debugging tools for i18n (development only).

```typescript
function I18NexusDevtools(props: I18NexusDevtoolsProps): JSX.Element | null;
```

**Props:**

```typescript
interface I18NexusDevtoolsProps {
  initialIsOpen?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  panelStyles?: React.CSSProperties;
  buttonStyles?: React.CSSProperties;
}
```

**Features:**

- 🌐 Current language display
- 🔍 Browser language detection
- 🔄 Quick language switching
- 📊 Translation statistics
- ⚡ Auto-removed in production

**Example:**

```tsx
import { I18NexusDevtools } from "i18nexus";

<I18nProvider {...config}>
  <App />
  <I18NexusDevtools
    position="bottom-right"
    initialIsOpen={false}
    panelStyles={{ backgroundColor: "#1a1a1a" }}
  />
</I18nProvider>;
```

---

## Hooks

### `useTranslation()`

Main hook for translation functions.

```typescript
function useTranslation<
  TLanguage extends string = string,
>(): UseTranslationReturn;
```

**Returns:**

```typescript
interface UseTranslationReturn {
  t: TranslationFunction;
  currentLanguage: string;
  isReady: boolean;
}
```

**Translation Function:**

```typescript
interface TranslationFunction {
  // With styles - returns React.ReactElement
  (
    key: string,
    variables: TranslationVariables,
    styles: TranslationStyles
  ): React.ReactElement;

  // Without styles - returns string
  (key: string, variables?: TranslationVariables): string;
}
```

**Example:**

```tsx
import { useTranslation } from "i18nexus";

function MyComponent() {
  const { t, currentLanguage, isReady } = useTranslation();

  // Basic translation
  <h1>{t("Welcome")}</h1>

  // With variables
  <p>{t("Hello {{name}}", { name: "World" })}</p>

  // With styled variables
  <div>
    {t(
      "Price: {{amount}}",
      { amount: 100 },
      { amount: { color: "red", fontWeight: "bold" } }
    )}
  </div>

  // Multiple variables
  <p>{t("{{completed}} of {{total}} done", { completed: 7, total: 10 })}</p>
}
```

---

### `useLanguageSwitcher()`

Hook for language switching functionality.

```typescript
function useLanguageSwitcher<
  TLanguage extends string = string,
>(): UseLanguageSwitcherReturn;
```

**Returns:**

```typescript
interface UseLanguageSwitcherReturn {
  currentLanguage: string;
  availableLanguages: LanguageConfig[];
  changeLanguage: (lang: string) => Promise<void>;
  switchLng: (lang: string) => Promise<void>; // Alias
  switchToNextLanguage: () => Promise<void>;
  switchToPreviousLanguage: () => Promise<void>;
  getLanguageConfig: (code?: string) => LanguageConfig | undefined;
  detectBrowserLanguage: () => string | null;
  resetLanguage: () => void;
  isLoading: boolean;
}
```

**Example:**

```tsx
import { useLanguageSwitcher } from "i18nexus";
import type { AppLanguages } from "@/i18nexus.config";

function LanguageSwitcher() {
  const { currentLanguage, availableLanguages, changeLanguage, isLoading } =
    useLanguageSwitcher<AppLanguages>();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      disabled={isLoading}>
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

---

### `useI18nContext()`

Low-level hook to access i18n context directly.

```typescript
function useI18nContext(): I18nContext;
```

**Returns:**

```typescript
interface I18nContext {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  availableLanguages: LanguageConfig[];
  languageManager: LanguageManager;
  isLoading: boolean;
  translations: Record<string, Record<string, string>>;
}
```

**Example:**

```tsx
import { useI18nContext } from "i18nexus";

function DebugInfo() {
  const { currentLanguage, translations, isLoading } = useI18nContext();

  return (
    <div>
      <p>Current: {currentLanguage}</p>
      <p>Loading: {isLoading.toString()}</p>
      <p>Translations: {Object.keys(translations).length}</p>
    </div>
  );
}
```

---

## Types

### `TranslationVariables`

Variables for string interpolation.

```typescript
type TranslationVariables = Record<string, string | number>;
```

**Usage:**

```typescript
const variables: TranslationVariables = {
  name: "User",
  count: 5,
  price: 1000,
};
```

---

### `TranslationStyles`

CSS styles for variables in Client Components.

```typescript
type TranslationStyles = Record<string, React.CSSProperties>;
```

**Usage:**

```typescript
const styles: TranslationStyles = {
  price: { color: "red", fontWeight: "bold" },
  discount: { color: "green" },
};

t("Price: {{price}} ({{discount}}% off)", variables, styles);
```

---

### `LanguageConfig`

Language configuration object.

```typescript
interface LanguageConfig {
  code: string;
  name: string;
  flag?: string;
  dir?: "ltr" | "rtl";
}
```

**Usage:**

```typescript
const languages: LanguageConfig[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" },
];
```

---

### `LanguageManagerOptions`

Options for language manager.

```typescript
interface LanguageManagerOptions {
  defaultLanguage?: string;
  availableLanguages?: LanguageConfig[];
  cookieName?: string;
  cookieOptions?: CookieOptions;
}
```

**Usage:**

```typescript
const options: LanguageManagerOptions = {
  defaultLanguage: "en",
  availableLanguages: [
    { code: "en", name: "English" },
    { code: "ko", name: "한국어" },
  ],
  cookieName: "i18n-language",
  cookieOptions: {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    path: "/",
    sameSite: "lax",
  },
};
```

---

## Advanced Usage

### Custom Language Switcher with Flags

```tsx
function FlagSwitcher() {
  const { currentLanguage, availableLanguages, changeLanguage } =
    useLanguageSwitcher();

  return (
    <div className="flex gap-2">
      {availableLanguages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={currentLanguage === lang.code ? "active" : ""}>
          <span className="text-2xl">{lang.flag}</span>
          <span className="sr-only">{lang.name}</span>
        </button>
      ))}
    </div>
  );
}
```

### Conditional Rendering Based on Language

```tsx
function ConditionalContent() {
  const { currentLanguage } = useTranslation();

  return (
    <>
      {currentLanguage === "ko" && <KoreanSpecificComponent />}
      {currentLanguage === "en" && <EnglishSpecificComponent />}
      <UniversalComponent />
    </>
  );
}
```

### Loading State Handling

```tsx
function TranslatedContent() {
  const { t, isReady } = useTranslation();

  if (!isReady) {
    return <div>Loading translations...</div>;
  }

  return <div>{t("Content")}</div>;
}
```

---

## Best Practices

### 1. Use Type-Safe Languages

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  languages: ["en", "ko", "ja"] as const,
  defaultLanguage: "en",
});

export type AppLanguages = (typeof config.languages)[number];

// Component
const { changeLanguage } = useLanguageSwitcher<AppLanguages>();
changeLanguage("en"); // ✅ Autocomplete
changeLanguage("fr"); // ❌ Type error
```

### 2. Memoize Styled Translations

```tsx
import { useMemo } from "react";

function ExpensiveComponent() {
  const { t } = useTranslation();

  const styledText = useMemo(
    () => t("Price: {{amount}}", { amount: 100 }, { amount: { color: "red" } }),
    [t]
  );

  return <div>{styledText}</div>;
}
```

### 3. Extract Translation Keys

```typescript
// constants/translationKeys.ts
export const TRANSLATION_KEYS = {
  WELCOME: "Welcome",
  HELLO_NAME: "Hello {{name}}",
  ITEMS_COUNT: "{{count}} items",
} as const;

// Component
function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t(TRANSLATION_KEYS.WELCOME)}</h1>;
}
```

---

## See Also

- [Server API](./server.md)
- [Types Reference](./types.md)
- [Interpolation Guide](../guides/interpolation.md)
- [DevTools Guide](../guides/devtools.md)
