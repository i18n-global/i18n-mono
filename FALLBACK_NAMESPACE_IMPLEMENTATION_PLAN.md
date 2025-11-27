# Fallback 네임스페이스 구현 계획

## 🎯 핵심 목표

```typescript
// ✅ 목표: 네임스페이스 선택적, fallback 지원, 완벽한 타입 지원
const i18n = createI18n(translations, { fallbackNamespace: "common" });

// ✅ 네임스페이스 없이 사용 → fallback에서 자동 찾기
const { t } = i18n.useTranslation();
t("welcome"); // ✅ common(fallback)에서 찾음, 타입 안전!

// ✅ 특정 네임스페이스 지정도 가능
const { t: tMenu } = i18n.useTranslation("menu");
tMenu("home"); // ✅ menu에서 찾음
```

---

## 📐 타입 시스템 설계

### 1. 모든 네임스페이스 키 추출 타입

```typescript
/**
 * 모든 네임스페이스의 키를 Union 타입으로 추출
 */
type ExtractAllKeys<T extends NamespaceTranslations> = {
  [K in keyof T]: ExtractNamespaceKeys<T, K>;
}[keyof T];

// 예시:
// ExtractAllKeys<{ common: { en: { a: "A" } }, menu: { en: { b: "B" } } }>
// → "a" | "b"
```

### 2. Fallback 네임스페이스 키 추출

```typescript
/**
 * Fallback 네임스페이스의 키 추출
 */
type ExtractFallbackKeys<
  T extends NamespaceTranslations,
  Fallback extends keyof T = "common",
> = ExtractNamespaceKeys<T, Fallback>;
```

### 3. 네임스페이스 + Fallback 키 타입

```typescript
/**
 * 특정 네임스페이스 키 + Fallback 키
 */
type ExtractNamespaceWithFallback<
  T extends NamespaceTranslations,
  NS extends keyof T,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, NS> | ExtractFallbackKeys<T, Fallback>;
```

---

## 🔧 구현 단계

### Phase 1: 타입 시스템 구축

#### 1.1 타입 유틸리티 추가

```typescript
// packages/core/src/utils/createI18n.ts

/**
 * 모든 네임스페이스의 키를 Union으로 추출
 */
export type ExtractAllKeys<T extends NamespaceTranslations> = {
  [K in keyof T]: ExtractNamespaceKeys<T, K>;
}[keyof T];

/**
 * Fallback 네임스페이스 키 추출
 */
export type ExtractFallbackKeys<
  T extends NamespaceTranslations,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, Fallback>;

/**
 * 네임스페이스 + Fallback 키
 */
export type ExtractNamespaceWithFallback<
  T extends NamespaceTranslations,
  NS extends keyof T,
  Fallback extends keyof T,
> = ExtractNamespaceKeys<T, NS> | ExtractFallbackKeys<T, Fallback>;
```

#### 1.2 createI18n 옵션 타입 추가

```typescript
export interface CreateI18nOptions<
  TTranslations extends NamespaceTranslations,
  Fallback extends keyof TTranslations = "common",
> {
  fallbackNamespace?: Fallback;
  enableFallback?: boolean; // 기본: true
}
```

### Phase 2: useTranslation 시그니처 변경

#### 2.1 네임스페이스 선택적 매개변수

```typescript
function useTranslation<
  NS extends ExtractNamespaces<TTranslations> | undefined = undefined,
>(
  namespace?: NS,
): UseTranslationReturn<
  NS extends undefined
    ? ExtractAllKeys<TTranslations> // 네임스페이스 없으면 모든 키
    : ExtractNamespaceWithFallback<TTranslations, NS, Fallback> // 네임스페이스 있으면 해당 + fallback
>;
```

#### 2.2 Fallback 네임스페이스 기본값 처리

```typescript
// fallbackNamespace가 지정되지 않으면 첫 번째 네임스페이스 사용
type DefaultFallback<T extends NamespaceTranslations> = keyof T extends infer K
  ? K extends keyof T
    ? K
    : never
  : never;

// 또는 더 간단하게
type DefaultFallback<T extends NamespaceTranslations> =
  ExtractNamespaces<T> extends `${infer First}` ? First : never;
```

### Phase 3: 런타임 Fallback 로직

#### 3.1 useTranslation 내부 로직

```typescript
function useTranslation<NS extends ExtractNamespaces<TTranslations> | undefined = undefined>(
  namespace?: NS
): UseTranslationReturn<...> {
  const context = useI18nContext();
  const { translations, currentLanguage } = context;

  const translate = (key: string, ...args: any[]) => {
    // 1. 네임스페이스가 지정된 경우
    if (namespace) {
      // 먼저 해당 네임스페이스에서 찾기
      const nsTranslations = translations[namespace]?.[currentLanguage];
      if (nsTranslations?.[key]) {
        return nsTranslations[key];
      }

      // 없으면 fallback 네임스페이스에서 찾기
      if (fallbackNamespace) {
        const fallbackTranslations = translations[fallbackNamespace]?.[currentLanguage];
        if (fallbackTranslations?.[key]) {
          return fallbackTranslations[key];
        }
      }
    } else {
      // 2. 네임스페이스가 없는 경우
      // 모든 네임스페이스에서 찾기 (이미 평탄화되어 있음)
      const allTranslations = translations[currentLanguage];
      if (allTranslations?.[key]) {
        return allTranslations[key];
      }
    }

    // 최종적으로 키 반환 (fallback)
    return key;
  };

  return { t: translate, ... };
}
```

---

## 🎨 최종 API 설계

### 사용 예시

```typescript
const translations = {
  common: {
    en: { welcome: "Welcome", logout: "Logout" },
    ko: { welcome: "환영합니다", logout: "로그아웃" },
  },
  menu: {
    en: { home: "Home", about: "About" },
    ko: { home: "홈", about: "소개" },
  },
  admin: {
    en: { dashboard: "Dashboard" },
    ko: { dashboard: "대시보드" },
  },
} as const;

// ✅ Fallback 네임스페이스 설정
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});

// ✅ 사용법 1: 네임스페이스 없이 (모든 키 접근 가능)
function Component1() {
  const { t } = i18n.useTranslation();

  t("welcome"); // ✅ common에서
  t("home"); // ✅ menu에서
  t("dashboard"); // ✅ admin에서
  // t("invalid");  // ❌ TypeScript 에러
}

// ✅ 사용법 2: 특정 네임스페이스 지정 (해당 네임스페이스 + fallback)
function Component2() {
  const { t } = i18n.useTranslation("admin");

  t("dashboard"); // ✅ admin에서
  t("welcome"); // ✅ common(fallback)에서
  t("logout"); // ✅ common(fallback)에서
  // t("home");    // ❌ TypeScript 에러 (menu에만 있음)
}

// ✅ 사용법 3: 기존 방식도 계속 작동
function Component3() {
  const { t: tCommon } = i18n.useTranslation("common");
  const { t: tMenu } = i18n.useTranslation("menu");

  tCommon("welcome"); // ✅ OK
  tMenu("home"); // ✅ OK
}
```

---

## 🔄 마이그레이션 전략

### 하위 호환성 유지

```typescript
// ✅ 기존 코드는 계속 작동
const { t } = i18n.useTranslation("common");

// ✅ 새로운 방식도 사용 가능
const { t } = i18n.useTranslation(); // fallback 사용
```

### 점진적 마이그레이션

1. **Phase 1**: 옵션 추가, 기존 코드 유지
2. **Phase 2**: 새로운 API 사용 권장
3. **Phase 3**: (선택) 기존 API deprecate

---

## 📊 구현 우선순위

### ✅ Phase 1: 핵심 기능 (최우선)

1. ✅ `createI18n` 옵션 추가
2. ✅ `useTranslation()` 네임스페이스 선택적
3. ✅ Fallback 네임스페이스 타입 추론
4. ✅ 모든 키 타입 추론 (네임스페이스 없을 때)

### ⚠️ Phase 2: 고급 기능

1. ⚠️ 동적 fallback 변경
2. ⚠️ Fallback 비활성화 옵션
3. ⚠️ 여러 fallback 네임스페이스 지원

### 🔮 Phase 3: 최적화

1. 🔮 타입 추론 성능 최적화
2. 🔮 런타임 검색 최적화
3. 🔮 개발자 경험 개선

---

## 🎯 최종 목표 상태

```typescript
// ✅ 가장 간단하고 타입 안전한 사용법
const i18n = createI18n(translations, { fallbackNamespace: "common" });

function MyComponent() {
  const { t } = i18n.useTranslation(); // ✅ 네임스페이스 불필요!

  // ✅ 완벽한 타입 지원
  t("welcome"); // ✅ 자동완성, 타입 체크
  t("home"); // ✅ 자동완성, 타입 체크
  // t("invalid");  // ❌ TypeScript 에러
}
```

**핵심 가치:**

- ✅ **간단함**: 네임스페이스 지정 불필요
- ✅ **타입 안전성**: 완벽한 타입 추론
- ✅ **유연성**: 네임스페이스 지정도 가능
- ✅ **하위 호환성**: 기존 코드 계속 작동
