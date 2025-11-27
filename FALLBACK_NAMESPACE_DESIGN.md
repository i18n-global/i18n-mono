# Fallback 네임스페이스 기능 기획서

## 🎯 목표

### 현재 문제점

```typescript
// ❌ 현재: 네임스페이스가 필수
const { t: tCommon } = i18n.useTranslation("common");
const { t: tMenu } = i18n.useTranslation("menu");

// ❌ 타입 지정 방식은 불편함
const { t } = useTranslation<Keys>();
```

### 목표 상태

```typescript
// ✅ 목표: 네임스페이스 선택적, fallback 지원
const { t } = i18n.useTranslation(); // fallback 네임스페이스에서 자동 찾기
const { t: tMenu } = i18n.useTranslation("menu"); // 특정 네임스페이스 지정도 가능

// ✅ 타입 지원도 완벽하게
t("welcome"); // ✅ 자동완성, 타입 체크
```

---

## 📋 기능 요구사항

### 1. Fallback 네임스페이스 설정

```typescript
const i18n = createI18n(translations, {
  fallbackNamespace: "common", // ✅ 기본 네임스페이스 지정
});

// 또는
const i18n = createI18n(translations);
i18n.setFallbackNamespace("common"); // 동적 설정
```

### 2. 네임스페이스 선택적 사용

```typescript
// ✅ 네임스페이스 없이 사용 → fallback에서 찾기
const { t } = i18n.useTranslation();
t("welcome"); // common 네임스페이스에서 찾음

// ✅ 특정 네임스페이스 지정
const { t: tMenu } = i18n.useTranslation("menu");
tMenu("home"); // menu 네임스페이스에서 찾음

// ✅ 네임스페이스 지정 + fallback
const { t } = i18n.useTranslation("admin");
t("dashboard"); // admin에서 찾음
t("welcome"); // admin에 없으면 fallback(common)에서 찾음
```

### 3. 타입 안전성 유지

```typescript
// ✅ 모든 키 타입 추론
const { t } = i18n.useTranslation();
t("welcome"); // ✅ common의 키
t("home"); // ✅ menu의 키 (fallback으로 접근 가능)
// t("invalid");  // ❌ TypeScript 에러

// ✅ 네임스페이스 지정 시 해당 네임스페이스 키만
const { t: tMenu } = i18n.useTranslation("menu");
tMenu("home"); // ✅ OK
// tMenu("welcome");  // ❌ TypeScript 에러 (common에만 있음)
```

---

## 🏗️ 아키텍처 설계

### 옵션 1: Fallback 네임스페이스 병합 (권장)

```typescript
// 내부적으로 fallback 네임스페이스 키를 전역 풀에 추가
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});

// 내부 동작:
// 1. 모든 네임스페이스 평탄화 (기존과 동일)
// 2. fallback 네임스페이스 키를 별도로 마킹
// 3. useTranslation() 호출 시 fallback 키 타입 포함

// 타입 추론:
// useTranslation() → fallback + 모든 네임스페이스 키
// useTranslation("menu") → menu 네임스페이스 키만
```

**장점:**

- ✅ 타입 추론이 명확함
- ✅ 구현이 상대적으로 간단
- ✅ 기존 코드와 호환

**단점:**

- ⚠️ fallback 키가 전역 풀에 포함됨

### 옵션 2: 런타임 Fallback 검색

```typescript
// 타입: 모든 네임스페이스 키
// 런타임: 먼저 지정 네임스페이스에서 찾고, 없으면 fallback에서 찾기

const { t } = i18n.useTranslation("admin");
t("dashboard"); // admin에서 찾음
t("welcome"); // admin에 없으면 common(fallback)에서 찾음
```

**장점:**

- ✅ 네임스페이스 격리 유지
- ✅ 더 유연한 검색

**단점:**

- ⚠️ 타입 추론이 복잡해짐
- ⚠️ 타입과 런타임 동작 불일치 가능

### 옵션 3: 하이브리드 (권장)

```typescript
// useTranslation() → fallback + 모든 키 타입
// useTranslation("namespace") → 해당 네임스페이스 + fallback 키 타입

const { t } = i18n.useTranslation();
// 타입: common의 키 | menu의 키 | errors의 키 (모든 키)

const { t: tMenu } = i18n.useTranslation("menu");
// 타입: menu의 키 | common의 키 (fallback 포함)
```

**장점:**

- ✅ 타입 안전성과 유연성 균형
- ✅ 직관적인 사용법

---

## 📐 API 설계

### 1. createI18n 옵션 확장

```typescript
interface CreateI18nOptions {
  fallbackNamespace?: string; // 기본 fallback 네임스페이스
  enableFallback?: boolean; // fallback 활성화 여부 (기본: true)
}

const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  enableFallback: true,
});
```

### 2. useTranslation 시그니처 변경

```typescript
// 현재
function useTranslation<NS extends ExtractNamespaces<TTranslations>>(
  namespace: NS,
): UseTranslationReturn<ExtractNamespaceKeys<TTranslations, NS>>;

// 개선안
function useTranslation<
  NS extends ExtractNamespaces<TTranslations> | undefined = undefined,
>(
  namespace?: NS,
): UseTranslationReturn<
  NS extends undefined
    ? ExtractAllKeys<TTranslations> | ExtractFallbackKeys<TTranslations> // 모든 키 + fallback
    :
        | ExtractNamespaceKeys<TTranslations, NS>
        | ExtractFallbackKeys<TTranslations> // 네임스페이스 + fallback
>;
```

### 3. 타입 유틸리티 추가

```typescript
// 모든 네임스페이스의 키 추출
type ExtractAllKeys<T extends NamespaceTranslations> = ExtractI18nKeys<
  T[keyof T]
>;

// Fallback 네임스페이스의 키 추출
type ExtractFallbackKeys<
  T extends NamespaceTranslations,
  Fallback extends keyof T = "common",
> = ExtractNamespaceKeys<T, Fallback>;

// 네임스페이스 + Fallback 키
type ExtractNamespaceWithFallback<
  T extends NamespaceTranslations,
  NS extends keyof T,
  Fallback extends keyof T = "common",
> = ExtractNamespaceKeys<T, NS> | ExtractFallbackKeys<T, Fallback>;
```

---

## 🎨 사용 예시

### 예시 1: 기본 사용 (Fallback 활용)

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
    en: { dashboard: "Dashboard", users: "Users" },
    ko: { dashboard: "대시보드", users: "사용자" },
  },
} as const;

const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});

// ✅ 네임스페이스 없이 사용 → common(fallback) + 모든 키 접근 가능
function Component() {
  const { t } = i18n.useTranslation();

  t("welcome"); // ✅ common에서
  t("home"); // ✅ menu에서 (fallback으로 접근)
  t("dashboard"); // ✅ admin에서 (fallback으로 접근)
}

// ✅ 특정 네임스페이스 지정 → 해당 네임스페이스 + fallback
function AdminComponent() {
  const { t } = i18n.useTranslation("admin");

  t("dashboard"); // ✅ admin에서
  t("users"); // ✅ admin에서
  t("welcome"); // ✅ common(fallback)에서
  // t("home");    // ❌ TypeScript 에러 (menu에만 있음)
}
```

### 예시 2: Fallback 비활성화

```typescript
const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  enableFallback: false, // fallback 비활성화
});

function Component() {
  const { t } = i18n.useTranslation("admin");

  t("dashboard"); // ✅ OK
  // t("welcome");  // ❌ TypeScript 에러 (fallback 비활성화)
}
```

### 예시 3: 동적 Fallback 변경

```typescript
const i18n = createI18n(translations);

// 런타임에 fallback 변경
i18n.setFallbackNamespace("menu");

function Component() {
  const { t } = i18n.useTranslation();
  t("home"); // ✅ menu(fallback)에서
}
```

---

## 🔄 마이그레이션 가이드

### 기존 코드

```typescript
// 기존
const { t: tCommon } = i18n.useTranslation("common");
const { t: tMenu } = i18n.useTranslation("menu");
```

### 새로운 코드

```typescript
// 옵션 1: Fallback 활용 (간단)
const { t } = i18n.useTranslation(); // common이 fallback이면

// 옵션 2: 기존 방식 유지 (호환)
const { t: tCommon } = i18n.useTranslation("common");
const { t: tMenu } = i18n.useTranslation("menu");
```

---

## 📊 구현 우선순위

### Phase 1: 기본 Fallback 기능

1. ✅ `createI18n` 옵션 추가
2. ✅ `useTranslation()` 네임스페이스 선택적
3. ✅ Fallback 네임스페이스 키 타입 추론

### Phase 2: 고급 기능

1. ⚠️ 동적 fallback 변경
2. ⚠️ Fallback 비활성화 옵션
3. ⚠️ 여러 fallback 네임스페이스 지원

### Phase 3: 최적화

1. ⚠️ 타입 추론 성능 최적화
2. ⚠️ 런타임 검색 최적화

---

## 🎯 최종 목표

```typescript
// ✅ 가장 간단한 사용법
const i18n = createI18n(translations, { fallbackNamespace: "common" });
const { t } = i18n.useTranslation();

// ✅ 완벽한 타입 지원
t("welcome"); // ✅ 자동완성, 타입 체크
t("home"); // ✅ 자동완성, 타입 체크

// ✅ 네임스페이스 지정도 가능
const { t: tMenu } = i18n.useTranslation("menu");
tMenu("home"); // ✅ menu 키만
```

**핵심:**

- ✅ 네임스페이스 선택적
- ✅ Fallback 자동 검색
- ✅ 완벽한 타입 지원
- ✅ 기존 코드 호환
