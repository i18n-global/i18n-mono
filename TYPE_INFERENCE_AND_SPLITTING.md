# 타입 추론 및 코드 스플리팅 분석 리포트

## 📊 질문 1: 직접 import해도 타입 추론이 됩니까?

### ⚠️ **부분적으로 작동합니다**

#### ✅ 작동하는 경우

```typescript
// ✅ I18nProvider에 타입을 명시적으로 지정하면 타입 추론 작동
import { useTranslation, I18nProvider } from "i18nexus";

const translations = {
  en: {
    welcome: "Welcome",
    goodbye: "Goodbye",
    home: "Home"
  },
  ko: {
    welcome: "환영합니다",
    goodbye: "안녕히 가세요",
    home: "홈"
  }
} as const;

// ✅ 타입을 명시적으로 지정
<I18nProvider<"en" | "ko", typeof translations> translations={translations}>
  <App />
</I18nProvider>

// ✅ useTranslation에 타입을 명시적으로 지정
function Component() {
  const { t } = useTranslation<keyof typeof translations.en>();
  t("welcome");  // ✅ 타입 안전!
  t("invalid"); // ❌ TypeScript 에러
}
```

#### ⚠️ 자동 추론이 제한적인 경우

```typescript
// ⚠️ 타입을 지정하지 않으면 string으로 추론됨
import { useTranslation, I18nProvider } from "i18nexus";

<I18nProvider translations={translations}>
  <App />
</I18nProvider>

function Component() {
  const { t } = useTranslation();  // ⚠️ 타입: string
  t("welcome");  // ✅ 작동하지만 타입 체크 없음
  t("invalid");  // ⚠️ 타입 에러 없음 (런타임에서만 감지)
}
```

### 📝 실제 구현 분석

```typescript
// packages/core/src/hooks/useTranslation.ts (185-216줄)
export function useTranslation<
  K extends string = string, // ⚠️ 기본값이 string
>(): UseTranslationReturn<K> {
  const context = useI18nContext<string, K>(); // ⚠️ K가 명시되지 않으면 string
  // ...
}
```

**문제점:**

- `useTranslation()`을 인자 없이 호출하면 `K = string`으로 추론
- `I18nProvider`의 translations 타입이 자동으로 전파되지 않음
- Context에서 타입을 추출하는 메커니즘이 제한적

### ✅ 개선 방법

#### 방법 1: 명시적 타입 지정 (권장)

```typescript
import { useTranslation, I18nProvider, ExtractI18nKeys } from "i18nexus";

const translations = {
  en: { welcome: "Welcome", home: "Home" },
  ko: { welcome: "환영합니다", home: "홈" }
} as const;

type TranslationKeys = ExtractI18nKeys<typeof translations>;

<I18nProvider translations={translations}>
  <App />
</I18nProvider>

function Component() {
  const { t } = useTranslation<TranslationKeys>();  // ✅ 명시적 타입
  t("welcome");  // ✅ 타입 안전!
}
```

#### 방법 2: createI18n 사용 (완벽한 타입 추론)

```typescript
// ✅ createI18n은 완벽한 타입 추론 제공
import { createI18n } from "i18nexus";

const i18n = createI18n(translations);

function Component() {
  const { t } = i18n.useTranslation("common"); // ✅ 자동 타입 추론!
  t("welcome"); // ✅ 완벽한 타입 안전성
}
```

---

## 📊 질문 2: 네임스페이스 기반으로 오토 스플리팅이 됩니까?

### ❌ **현재는 지원하지 않습니다**

#### 현재 구현 분석

```typescript
// packages/core/src/utils/createI18n.ts (96-104줄)
function TypedI18nProvider(props) {
  // ⚠️ 모든 네임스페이스를 즉시 평탄화하여 병합
  const flattenedTranslations = Object.keys(
    props.translations || translations,
  ).reduce(
    (acc, namespace) => {
      const nsTranslations = (props.translations || translations)[namespace];
      Object.keys(nsTranslations).forEach((lang) => {
        acc[lang] = { ...acc[lang], ...nsTranslations[lang] };
      });
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  );

  // ⚠️ 모든 번역이 즉시 로드됨
  return React.createElement(BaseI18nProvider, {
    ...props,
    translations: flattenedTranslations, // 모든 네임스페이스가 포함됨
  });
}
```

**문제점:**

- ✅ 모든 네임스페이스가 즉시 로드됨
- ❌ Lazy loading 미지원
- ❌ 코드 스플리팅 미지원
- ❌ 네임스페이스별 동적 import 없음

### 📊 현재 동작 방식

```typescript
const translations = {
  common: { en: { welcome: "Welcome" } },
  admin: { en: { dashboard: "Dashboard" } },
  settings: { en: { preferences: "Preferences" } }
};

const i18n = createI18n(translations);

// ⚠️ 모든 네임스페이스가 즉시 로드됨
<i18n.I18nProvider>
  <App />
</i18n.I18nProvider>

// 사용하지 않는 네임스페이스도 메모리에 로드됨
// - common: ✅ 사용됨
// - admin: ❌ 사용 안 함 (하지만 로드됨)
// - settings: ❌ 사용 안 함 (하지만 로드됨)
```

### 🚀 개선 방안

#### 제안 1: Lazy Loading 지원 추가

```typescript
// 향후 개선안
const i18n = createI18n({
  common: () => import('./locales/common'),  // ✅ 지연 로딩
  admin: () => import('./locales/admin'),
  settings: () => import('./locales/settings')
});

// 네임스페이스가 실제로 사용될 때만 로드
function AdminPage() {
  const { t } = i18n.useTranslation("admin");  // ✅ 이때 admin 로드
  return <div>{t("dashboard")}</div>;
}
```

#### 제안 2: 동적 Provider 지원

```typescript
// 향후 개선안
function App() {
  const [namespaces, setNamespaces] = useState(["common"]);

  return (
    <i18n.I18nProvider
      namespaces={namespaces}  // ✅ 필요한 네임스페이스만 지정
      onNamespaceNeeded={(ns) => {
        // 네임스페이스가 필요할 때 동적 로드
        import(`./locales/${ns}`).then(module => {
          setNamespaces([...namespaces, ns]);
        });
      }}
    >
      <App />
    </i18n.I18nProvider>
  );
}
```

---

## 📊 종합 비교표

| 기능              | 직접 import       | createI18n   | 코드 스플리팅 |
| ----------------- | ----------------- | ------------ | ------------- |
| **타입 추론**     | ⚠️ 수동 지정 필요 | ✅ 자동 추론 | N/A           |
| **네임스페이스**  | ❌ 없음           | ✅ 지원      | ❌ 없음       |
| **Lazy Loading**  | ❌ 없음           | ❌ 없음      | ❌ 없음       |
| **코드 스플리팅** | ❌ 없음           | ❌ 없음      | ❌ 없음       |
| **타입 안전성**   | ⚠️ 제한적         | ✅ 완벽      | N/A           |

---

## 🎯 결론

### ✅ 질문 1: 타입 추론

**답변: 부분적으로 작동합니다**

- ✅ `createI18n` 사용 시: **완벽한 타입 추론** ✅
- ⚠️ 직접 import 사용 시: **명시적 타입 지정 필요** ⚠️
- ❌ 자동 추론: **제한적** ❌

**권장사항:**

- 타입 안전성이 중요하면 → `createI18n` 사용
- 간단한 프로젝트면 → 직접 import + 명시적 타입 지정

### ❌ 질문 2: 코드 스플리팅

**답변: 현재는 지원하지 않습니다**

- ❌ 네임스페이스별 코드 스플리팅: **미지원** ❌
- ❌ Lazy loading: **미지원** ❌
- ⚠️ 모든 번역이 즉시 로드됨: **현재 동작** ⚠️

**영향:**

- 작은 프로젝트: 문제 없음 ✅
- 대규모 프로젝트: 초기 번들 크기 증가 가능 ⚠️

**향후 개선 필요:**

- 네임스페이스별 동적 import 지원
- Lazy loading 메커니즘 추가
- 코드 스플리팅 옵션 제공

---

## 💡 실용적 권장사항

### 현재 사용 방법

```typescript
// ✅ 간단한 프로젝트: 직접 import
import { useTranslation, I18nProvider } from "i18nexus";

<I18nProvider translations={translations}>
  <App />
</I18nProvider>

// ✅ 대규모 프로젝트: createI18n (타입 안전성)
import { createI18n } from "i18nexus";

const i18n = createI18n(translations);
<i18n.I18nProvider>
  <App />
</i18n.I18nProvider>
```

### 코드 스플리팅이 필요한 경우

현재는 수동으로 구현해야 합니다:

```typescript
// 수동 코드 스플리팅 예시
const [translations, setTranslations] = useState({});

useEffect(() => {
  Promise.all([
    import('./locales/common'),
    import('./locales/admin')
  ]).then(([common, admin]) => {
    setTranslations({ common, admin });
  });
}, []);

<I18nProvider translations={translations}>
  <App />
</I18nProvider>
```

---

## 🔮 향후 로드맵

1. **타입 추론 개선**
   - Context 기반 자동 타입 추론
   - `useTranslation` 자동 키 추론

2. **코드 스플리팅 지원**
   - 네임스페이스별 동적 import
   - Lazy loading API
   - 번들 크기 최적화

3. **성능 최적화**
   - 필요한 네임스페이스만 로드
   - 메모리 효율성 개선
