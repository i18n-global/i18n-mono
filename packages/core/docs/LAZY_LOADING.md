# Lazy Loading을 통한 코드 스플리팅

## 개요

i18nexus는 이제 lazy loading을 지원하여 네임스페이스별 코드 스플리팅이 가능합니다. 이를 통해 초기 번들 크기를 대폭 줄이고 페이지 로딩 속도를 향상시킬 수 있습니다.

## 문제점

### Before: Eager Loading (기존 방식)

```typescript
// locales/index.ts
import enHome from "./home/en.json"; // ❌ 모든 네임스페이스를 한 번에 import
import koHome from "./home/ko.json";
import enCli from "./cli/en.json";
import koCli from "./cli/ko.json";
// ... 20개 이상의 네임스페이스

export const translations = {
  home: { en: enHome, ko: koHome },
  cli: { en: enCli, ko: koCli },
  // ...
};
```

**문제점:**

- 사용자가 홈 페이지만 방문해도 모든 네임스페이스가 번들에 포함됨
- 초기 로딩 시간 증가
- 번들 크기 증가
- 메모리 낭비

### After: Lazy Loading (새로운 방식)

```typescript
// locales/index.ts
import { createI18n } from "i18nexus";

// 동적 namespace 로더
async function loadNamespace(namespace: string, lang: string) {
  const module = await import(`./${namespace}/${lang}.json`); // ✅ 필요할 때만 로드
  return module.default;
}

export const i18n = createI18n(
  {},
  {
    fallbackNamespace: "common",
    lazy: true,
    loadNamespace,
    preloadNamespaces: ["common"], // common만 미리 로드
  },
);
```

**장점:**

- ✅ 필요한 네임스페이스만 동적으로 로드
- ✅ 초기 번들 크기 감소
- ✅ 페이지별 코드 스플리팅
- ✅ 메모리 효율성 향상

## 사용법

### 1. Extractor로 Lazy Loading용 index.ts 생성

```bash
npx i18n-extractor
```

extractor는 기본적으로 lazy loading 모드로 `locales/index.ts`를 생성합니다:

```typescript
import { createI18n } from "i18nexus";

export const translations = {} as const;

async function loadNamespace(namespace: string, lang: string) {
  const module = await import(`./${namespace}/${lang}.json`);
  return module.default;
}

export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
  lazy: true,
  loadNamespace,
  preloadNamespaces: ["common"],
});

export type AvailableNamespaces = "home" | "cli" | "common" | ...;

export async function preloadNamespace(namespace: AvailableNamespaces) {
  await i18n.loadNamespace(namespace);
}
```

### 2. 컴포넌트에서 사용

```typescript
// pages/home/index.tsx
import { i18n } from "@/locales";

export default function HomePage() {
  const { t } = i18n.useTranslation("home");

  return <h1>{t("welcome")}</h1>;
}
```

네임스페이스는 자동으로 로드됩니다. 추가 코드가 필요 없습니다!

### 3. (선택) 성능 최적화: Preloading

중요한 페이지의 네임스페이스를 미리 로드하여 사용자 경험을 향상시킬 수 있습니다:

```typescript
// app/layout.tsx
import { preloadNamespace } from "@/locales";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    // 다음 페이지에서 사용할 네임스페이스 미리 로드
    preloadNamespace("getting-started");
    preloadNamespace("cli");
  }, []);

  return <html>{children}</html>;
}
```

## 번들 크기 비교

### Eager Loading

```
Initial Bundle: 250 KB
├─ locales/index.ts: 180 KB (모든 네임스페이스)
├─ home page: 50 KB
└─ framework: 20 KB
```

### Lazy Loading

```
Initial Bundle: 90 KB
├─ locales/index.ts: 2 KB (loader 코드만)
├─ locales/common: 18 KB (preloaded)
├─ home page: 50 KB
└─ framework: 20 KB

Home Page Load: +12 KB (home namespace만)
CLI Page Load: +15 KB (cli namespace만)
```

**개선:**

- 초기 번들: 250 KB → 90 KB (64% 감소)
- 각 페이지는 필요한 네임스페이스만 로드

## 설정 옵션

### CreateI18nOptions

```typescript
interface CreateI18nOptions {
  /**
   * Lazy loading 활성화
   * @default false
   */
  lazy?: boolean;

  /**
   * Namespace 로더 함수
   * lazy: true일 때 필수
   */
  loadNamespace?: (
    namespace: string,
    language: string,
  ) => Promise<Record<string, string>>;

  /**
   * 미리 로드할 네임스페이스 목록
   * lazy: true일 때만 사용
   * @default []
   */
  preloadNamespaces?: string[];

  /**
   * Fallback 네임스페이스
   */
  fallbackNamespace?: string;
}
```

### 예제

```typescript
const i18n = createI18n(translations, {
  lazy: true,
  loadNamespace: async (ns, lang) => {
    const data = await import(`./locales/${ns}/${lang}.json`);
    return data.default;
  },
  preloadNamespaces: ["common", "home"], // 자주 사용되는 것만 미리 로드
  fallbackNamespace: "common",
});
```

## Eager Loading으로 전환

필요하다면 eager loading으로 전환할 수 있습니다:

```bash
npx i18n-extractor --eager
```

또는 수동으로 `locales/index.ts`를 생성:

```typescript
import { createI18n } from "i18nexus";
import enCommon from "./common/en.json";
import koCommon from "./common/ko.json";
// ... 모든 imports

export const translations = {
  common: { en: enCommon, ko: koCommon },
  // ...
} as const;

export const i18n = createI18n(translations, {
  lazy: false, // 또는 생략
  fallbackNamespace: "common",
});
```

## 주의사항

1. **SSR 환경**: 서버 사이드 렌더링에서는 dynamic import가 다르게 동작할 수 있습니다.
2. **Preloading**: 자주 사용되는 네임스페이스는 `preloadNamespaces`에 포함시켜 UX를 개선하세요.
3. **Fallback**: `fallbackNamespace`는 항상 미리 로드되어야 합니다.

## 성능 권장사항

### 소규모 프로젝트 (< 5개 네임스페이스)

- Eager loading 사용 (기본값)
- 번들 크기가 크지 않아 lazy loading의 이점이 적음

### 중규모 프로젝트 (5-20개 네임스페이스)

- Lazy loading + 주요 네임스페이스 preload
- 균형 잡힌 성능과 UX

### 대규모 프로젝트 (20개+ 네임스페이스)

- Lazy loading + common만 preload
- 최대 번들 크기 절감

## 마이그레이션 가이드

### 1. i18nexus 업데이트

```bash
npm install i18nexus@latest i18nexus-tools@latest
```

### 2. Extractor 재실행

```bash
npx i18n-extractor
```

### 3. 기존 코드 변경 없음

컴포넌트 코드는 변경할 필요가 없습니다. `i18n.useTranslation()`은 동일하게 작동합니다.

### 4. (선택) Preloading 추가

성능 최적화를 위해 자주 사용되는 네임스페이스를 preload합니다.

## TypeScript 지원

```typescript
// 타입 안전하게 namespace 로드
import { preloadNamespace, type AvailableNamespaces } from "@/locales";

const ns: AvailableNamespaces = "home"; // ✅ 자동완성
await preloadNamespace(ns);

await preloadNamespace("invalid"); // ❌ TypeScript error
```

## 문제 해결

### "loadNamespace function is required when lazy mode is enabled"

Lazy mode를 사용하려면 `loadNamespace` 함수가 필요합니다:

```typescript
export const i18n = createI18n(translations, {
  lazy: true,
  loadNamespace: async (ns, lang) => {
    // 필수!
    const data = await import(`./${ns}/${lang}.json`);
    return data.default;
  },
});
```

### Dynamic import 에러

Webpack/Next.js 설정에서 dynamic import를 지원하는지 확인하세요. 최신 버전에서는 기본적으로 지원됩니다.
