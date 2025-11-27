# Fallback 네임스페이스 사용 가이드

## 🎯 개요

`i18nexus`의 fallback 네임스페이스 기능을 사용하면 네임스페이스를 지정하지 않고도 모든 번역 키에 접근할 수 있습니다.

---

## ✨ 주요 기능

### 1. 네임스페이스 선택적 사용

```typescript
// ✅ 네임스페이스 없이 사용 → 모든 키 접근 가능
const { t } = i18n.useTranslation();

// ✅ 특정 네임스페이스 지정도 가능
const { t: tMenu } = i18n.useTranslation("menu");
```

### 2. 완벽한 타입 지원

```typescript
// TypeScript 자동완성 및 타입 체크
t("welcome"); // ✅ OK
t("home"); // ✅ OK
t("invalid"); // ❌ TypeScript 에러
```

### 3. 기존 코드 호환

```typescript
// 기존 코드도 그대로 작동
const { t: tCommon } = i18n.useTranslation("common");
const { t: tMenu } = i18n.useTranslation("menu");
```

---

## 📖 기본 사용법

### 1. translations 정의

```typescript
const translations = {
  common: {
    en: {
      welcome: "Welcome",
      logout: "Logout",
      greeting: "Hello {{name}}",
    },
    ko: {
      welcome: "환영합니다",
      logout: "로그아웃",
      greeting: "안녕하세요 {{name}}",
    },
  },
  menu: {
    en: {
      home: "Home",
      about: "About",
      contact: "Contact",
    },
    ko: {
      home: "홈",
      about: "소개",
      contact: "연락처",
    },
  },
  admin: {
    en: {
      dashboard: "Dashboard",
      users: "Users",
    },
    ko: {
      dashboard: "대시보드",
      users: "사용자",
    },
  },
} as const;
```

### 2. createI18n으로 i18n 시스템 생성

```typescript
import { createI18n } from "i18nexus";

// ✅ Fallback 네임스페이스 지정
const i18n = createI18n(translations, {
  fallbackNamespace: "common", // 선택적
});
```

### 3. Provider로 앱 감싸기

```typescript
function App() {
  return (
    <i18n.I18nProvider
      languageManagerOptions={{
        defaultLanguage: "en",
        availableLanguages: [
          { code: "en", name: "English" },
          { code: "ko", name: "한국어" },
        ],
      }}
    >
      <YourApp />
    </i18n.I18nProvider>
  );
}
```

### 4. 컴포넌트에서 사용

```typescript
function MyComponent() {
  // ✅ 네임스페이스 없이 사용 → 모든 키 접근 가능
  const { t } = i18n.useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      {/* ✅ common 네임스페이스의 키 */}

      <nav>
        <a href="/">{t("home")}</a>
        {/* ✅ menu 네임스페이스의 키 */}

        <a href="/about">{t("about")}</a>
        {/* ✅ menu 네임스페이스의 키 */}
      </nav>

      <div>{t("dashboard")}</div>
      {/* ✅ admin 네임스페이스의 키 */}
    </div>
  );
}
```

---

## 🎨 사용 패턴

### 패턴 1: 네임스페이스 없이 사용 (권장)

**사용 시기:**

- 여러 네임스페이스의 키를 동시에 사용해야 할 때
- 간단한 컴포넌트
- 네임스페이스 구분이 불필요할 때

```typescript
function HomePage() {
  const { t } = i18n.useTranslation();

  return (
    <div>
      <h1>{t("welcome")}</h1> {/* common */}
      <nav>
        <a href="/">{t("home")}</a> {/* menu */}
        <a href="/about">{t("about")}</a> {/* menu */}
      </nav>
    </div>
  );
}
```

**장점:**

- ✅ 코드가 간결함
- ✅ 여러 네임스페이스 키를 자유롭게 사용
- ✅ 완벽한 타입 지원

### 패턴 2: 특정 네임스페이스 지정

**사용 시기:**

- 특정 네임스페이스의 키만 사용할 때
- 네임스페이스별로 코드를 명확히 구분하고 싶을 때

```typescript
function AdminDashboard() {
  const { t } = i18n.useTranslation("admin");

  return (
    <div>
      <h1>{t("dashboard")}</h1> {/* ✅ admin 네임스페이스 */}
      <p>{t("users")}</p> {/* ✅ admin 네임스페이스 */}
      <button>{t("logout")}</button> {/* ✅ fallback(common) 네임스페이스 */}
    </div>
  );
}
```

**장점:**

- ✅ 네임스페이스 격리
- ✅ 코드의 의도가 명확함
- ✅ Fallback 네임스페이스 키도 사용 가능

### 패턴 3: 여러 네임스페이스 hooks

**사용 시기:**

- 네임스페이스별로 번역 함수를 구분하고 싶을 때
- 복잡한 컴포넌트

```typescript
function ComplexComponent() {
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");
  const { t: tAdmin } = i18n.useTranslation("admin");

  return (
    <div>
      <h1>{tCommon("welcome")}</h1>
      <nav>
        <a href="/">{tMenu("home")}</a>
      </nav>
      <div>{tAdmin("dashboard")}</div>
    </div>
  );
}
```

**장점:**

- ✅ 네임스페이스가 명확히 구분됨
- ✅ 기존 코드와 호환
- ✅ 타입 안전성

---

## 🔧 옵션

### createI18n 옵션

```typescript
interface CreateI18nOptions {
  /**
   * Fallback 네임스페이스
   * 네임스페이스를 지정하지 않을 때 사용할 기본 네임스페이스
   * @default undefined
   */
  fallbackNamespace?: keyof typeof translations;

  /**
   * Fallback 활성화 여부
   * @default true
   */
  enableFallback?: boolean;
}
```

### 사용 예시

```typescript
// ✅ Fallback 네임스페이스 지정
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});

// ✅ Fallback 비활성화
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  enableFallback: false,
});

// ✅ 옵션 없이 사용 (모든 키 접근 가능)
const i18n = createI18n(translations);
```

---

## 📊 비교: 기존 vs 새로운 방식

| 항목             | 기존 방식                            | 새로운 방식 (Fallback)   |
| ---------------- | ------------------------------------ | ------------------------ |
| **네임스페이스** | 필수                                 | 선택적                   |
| **타입 지원**    | ✅ 완벽                              | ✅ 완벽                  |
| **코드 간결성**  | ⚠️ 여러 hooks 필요                   | ✅ 단일 hook로 모든 키   |
| **사용 편의성**  | ⚠️ 네임스페이스마다 hook 호출        | ✅ 한 번만 호출          |
| **호환성**       | ✅ 완벽                              | ✅ 기존 코드 그대로 작동 |
| **적합한 경우**  | 네임스페이스 구분이 명확히 필요할 때 | 간단한 사용, 유연한 접근 |

### 기존 방식

```typescript
function Component() {
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");
  const { t: tAdmin } = i18n.useTranslation("admin");

  return (
    <div>
      <h1>{tCommon("welcome")}</h1>
      <a href="/">{tMenu("home")}</a>
      <p>{tAdmin("dashboard")}</p>
    </div>
  );
}
```

### 새로운 방식 (Fallback)

```typescript
function Component() {
  const { t } = i18n.useTranslation(); // ✅ 단일 hook!

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <a href="/">{t("home")}</a>
      <p>{t("dashboard")}</p>
    </div>
  );
}
```

---

## 💡 타입 추론

### 네임스페이스 없을 때

```typescript
const { t } = i18n.useTranslation();

// 타입: "welcome" | "logout" | "greeting" | "home" | "about" | "contact" | "dashboard" | "users"
// 모든 네임스페이스의 모든 키
```

### 특정 네임스페이스 지정 시

```typescript
const { t } = i18n.useTranslation("menu");

// 타입: "home" | "about" | "contact" | "welcome" | "logout" | "greeting"
// menu 네임스페이스 키 + fallback(common) 네임스페이스 키
```

---

## 🎯 마이그레이션 가이드

### 기존 코드에서 마이그레이션

#### Step 1: createI18n에 fallbackNamespace 추가

```typescript
// Before
const i18n = createI18n(translations);

// After
const i18n = createI18n(translations, {
  fallbackNamespace: "common", // ✅ 추가
});
```

#### Step 2: useTranslation 호출 간소화 (선택적)

```typescript
// Before
function Component() {
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");

  return (
    <div>
      <h1>{tCommon("welcome")}</h1>
      <a href="/">{tMenu("home")}</a>
    </div>
  );
}

// After (선택적)
function Component() {
  const { t } = i18n.useTranslation(); // ✅ 간소화!

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <a href="/">{t("home")}</a>
    </div>
  );
}
```

**주의:** 기존 코드도 그대로 작동하므로, 점진적으로 마이그레이션 가능합니다.

---

## 🔍 고급 기능

### 변수 interpolation

```typescript
const { t } = i18n.useTranslation();

// ✅ 모든 네임스페이스에서 작동
t("greeting", { name: "World" }); // "Hello World"
```

### 다국어 지원

```typescript
<i18n.I18nProvider
  initialLanguage="ko" // ✅ 초기 언어 설정
  languageManagerOptions={{
    defaultLanguage: "en",
    availableLanguages: [
      { code: "en", name: "English" },
      { code: "ko", name: "한국어" },
    ],
  }}
>
  <App />
</i18n.I18nProvider>
```

### 언어 전환

```typescript
import { useLanguageSwitcher } from "i18nexus";

function LanguageSwitcher() {
  const { currentLanguage, switchLanguage, availableLanguages } =
    useLanguageSwitcher();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => switchLanguage(e.target.value)}
    >
      {availableLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

---

## ⚡ 성능

- ✅ **컴파일 타임 타입 체크**: 런타임 오버헤드 없음
- ✅ **평탄화 구조**: 모든 네임스페이스가 평탄화되어 빠른 검색
- ✅ **메모이제이션**: React의 최적화 기법 활용

---

## 🎉 결론

Fallback 네임스페이스 기능으로:

- ✅ **간결한 코드**: 네임스페이스 지정 불필요
- ✅ **완벽한 타입 지원**: 모든 키에 대한 자동완성 및 타입 체크
- ✅ **유연성**: 네임스페이스 지정도 가능
- ✅ **호환성**: 기존 코드 그대로 작동

**권장 사용법:**

- 간단한 컴포넌트: `useTranslation()` (네임스페이스 없이)
- 복잡한 컴포넌트: `useTranslation("namespace")` (네임스페이스 지정)
- 기존 프로젝트: 점진적 마이그레이션

---

## 📚 추가 리소스

- [i18nexus 문서](https://github.com/i18n-global/i18n-mono)
- [예제 코드](./packages/core/auto-inference-example.tsx)
- [테스트 코드](./packages/core/src/__tests__/fallback-namespace.test.tsx)
