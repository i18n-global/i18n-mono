# React i18n 라이브러리에 완벽한 타입 안정성을 더하는 방법

> 모든 i18n 라이브러리와 호환되는 타입 안전 솔루션 개발기

## TL;DR

- 기존 i18n 라이브러리들은 번역 키 오타를 런타임에만 발견할 수 있음
- `declare module`을 활용한 Module Augmentation으로 기존 라이브러리에 타입 주입
- `i18nexus-tools`는 번역 파일을 분석하여 자동으로 TypeScript 타입 생성
- 보간 변수(`{{variable}}`)까지 타입 체크하여 변수명 오타도 컴파일 타임에 검출
- 생성된 타입 코드는 빌드 시 트리쉐이킹으로 완전히 제거되어 런타임 영향 0

---

## 1. 문제 인식: "왜 i18n은 타입 안전하지 않을까?"

국제화(i18n)를 구현하다 보면 이런 경험 한 번쯤 해보셨을 겁니다:

```tsx
// ❌ 오타가 있지만 컴파일은 성공
function WelcomeMessage() {
  const { t } = useTranslation("home");
  return <h1>{t("welcom_message")}</h1>; // 'welcome_message'의 오타
}
```

개발 서버를 실행하고, 페이지를 열어보고, 번역이 안 되는 걸 발견하고, 코드를 다시 확인하고...
**이 모든 과정이 런타임에서만 발견됩니다.**

### 실제 라이브러리들의 현황

주요 React i18n 라이브러리들을 살펴보면:

#### react-i18next

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("namespace");
  return <div>{t("any_random_key")}</div>; // ✅ 컴파일 성공, ❌ 타입 에러 없음
}
```

**타입 정의:**

```typescript
// react-i18next의 실제 타입
function useTranslation(ns?: string): {
  t: (key: string) => string; // key는 단순 string
};
```

#### next-intl

```tsx
import { useTranslations } from "next-intl";

function MyComponent() {
  const t = useTranslations("Namespace");
  return <div>{t("wrong.key.path")}</div>; // ✅ 컴파일 성공, ❌ 타입 에러 없음
}
```

#### react-intl

```tsx
import { useIntl } from "react-intl";

function MyComponent() {
  const intl = useIntl();
  return <div>{intl.formatMessage({ id: "typo_id" })}</div>; // ✅ 컴파일 성공
}
```

### 공통점 발견

1. **네임스페이스는 첫 번째 인자로 받음** (`useTranslation('namespace')`)
2. **번역 파일은 주로 `locales` 디렉토리에 위치**
3. **번역 키는 단순 `string` 타입** (타입 안전성 없음)
4. **런타임에만 오류 발견 가능**

---

## 2. 왜 이런 문제가 생길까?

### 2.1 동적 데이터의 본질적 한계

번역 파일은 JSON이나 별도 파일로 관리되므로, TypeScript가 **컴파일 타임에 그 내용을 알 수 없습니다**.

```json
// locales/home/ko.json (TypeScript는 이 파일의 내용을 모름)
{
  "welcome_message": "환영합니다",
  "start_button": "시작하기"
}
```

### 2.2 범용성을 위한 타입 느슨함

라이브러리 입장에서는 **사용자가 어떤 키를 사용할지 알 수 없으므로** `string`으로 타이핑할 수밖에 없습니다.

```typescript
// 라이브러리가 할 수 있는 최선
export function useTranslation(ns?: string): {
  t: (key: string) => string; // 어떤 키든 받을 수 있게
};
```

---

## 3. 해결 방안: Module Augmentation + 코드 생성

### 핵심 아이디어

1. **번역 파일을 분석**하여 실제 사용 가능한 키 추출
2. **TypeScript 타입 정의 파일(`.d.ts`) 자동 생성**
3. **Module Augmentation**을 통해 기존 라이브러리에 타입 주입

### 왜 Module Augmentation인가?

TypeScript의 Module Augmentation은 **기존 모듈의 타입을 확장**할 수 있게 해줍니다.

```typescript
// 기존 라이브러리를 수정하지 않고도 타입 확장 가능!
declare module "react-i18next" {
  // 기존 타입을 덮어쓰기
  export function useTranslation<NS extends Namespace>(
    ns: NS
  ): {
    t: (key: TranslationKeys[NS]) => string;
  };
}
```

**장점:**

- ✅ 라이브러리 코드 수정 불필요
- ✅ 어떤 i18n 라이브러리와도 호환
- ✅ 프로젝트별 커스터마이징 가능

---

## 4. 구현: i18nexus-tools

### 4.1 번역 파일 분석

```bash
npx i18n-extractor
```

**동작 과정:**

1. **소스 코드 스캔**

   ```typescript
   // AST를 활용하여 t() 함수 호출 감지
   const code = fs.readFileSync(filePath, "utf-8");
   const ast = babelParse(code);
   traverse(ast, {
     CallExpression(path) {
       if (isTFunction(path.node.callee)) {
         // t("welcome_message") 발견!
         extractKey(path.node.arguments[0]);
       }
     },
   });
   ```

2. **네임스페이스별 키 수집**

   ```
   locales/
   ├── home/
   │   ├── ko.json  → HomeKeys
   │   └── en.json
   ├── about/
   │   ├── ko.json  → AboutKeys
   │   └── en.json
   └── common/
       ├── ko.json  → CommonKeys
       └── en.json
   ```

3. **타입 정의 생성**

### 4.2 생성되는 타입 구조

```typescript
// locales/types/i18nexus.d.ts (자동 생성됨)

// 1. 네임스페이스 정의
declare type TranslationNamespace = "home" | "about" | "common";

// 2. 각 네임스페이스의 키 정의
declare type HomeKeys = "welcome_message" | "start_button" | "hero_title";

declare type AboutKeys = "company_name" | "team_size";

declare type CommonKeys = "loading" | "error" | "submit";

// 3. 네임스페이스 → 키 매핑
declare type TranslationKeys = {
  home: HomeKeys;
  about: AboutKeys;
  common: CommonKeys;
};

// 4. Module Augmentation
declare module "react-i18next" {
  export function useTranslation<NS extends TranslationNamespace>(
    namespace: NS
  ): {
    t: (key: TranslationKeys[NS]) => string;
    currentLanguage: string;
    lng: string; // Alias for currentLanguage (react-i18next compatibility)
    isReady: boolean;
  };
}

// 5. 개별 네임스페이스 타입 export (상수 정의용)
export type HomeKeys = TranslationKeys["home"];
export type AboutKeys = TranslationKeys["about"];
export type CommonKeys = TranslationKeys["common"];
```

### 4.3 동적 Import Source 지원

```json
// i18nexus.config.json
{
  "translationImportSource": "@/lib/i18n" // 또는 "react-i18next", "next-intl" 등
}
```

생성되는 타입:

```typescript
declare module "@/lib/i18n" {  // 설정한 경로로 자동 생성!
  export function useTranslation<NS extends TranslationNamespace>(...): ...;
}
```

**지원하는 라이브러리:**

- `react-i18next`
- `next-intl`
- `react-intl`
- 커스텀 경로 (예: `@/lib/i18n`, `@/app/i18n/client`)

---

## 5. 고급 기능: 보간 변수 타입 체크

### 5.1 문제 상황

```typescript
// ❌ 변수명 오타
t("User {{userName}} has {{totalDays}} days left", {
  userNam: "John", // 오타!
  totalDays: 5,
});

// ❌ 필수 변수 누락
t("User {{userName}} has {{totalDays}} days left", {
  userName: "John", // totalDays 누락!
});
```

### 5.2 해결: 변수 추출 + 조건부 타입

```typescript
// 1. 보간 변수 추출
function extractInterpolationVariables(key: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const vars: string[] = [];
  let match;

  while ((match = regex.exec(key)) !== null) {
    vars.push(match[1]);
  }

  return [...new Set(vars)];
}

// 2. 타입 생성
declare type CommonKeyVariables = {
  "User {{userName}} has {{totalDays}} days left": "userName" | "totalDays";
  "Error: {{errorMessage}}": "errorMessage";
};

// 3. 조건부 타입으로 변수 요구
type ExtractVariables<K> = K extends keyof CommonKeyVariables
  ? CommonKeyVariables[K]
  : never;

export function useTranslation<NS extends TranslationNamespace>(
  namespace: NS
): {
  t: <K extends TranslationKeys[NS]>(
    key: K,
    ...args: ExtractVariables<K> extends never
      ? [variables?: Record<string, string | number>] // 변수 없으면 선택적
      : [variables: Record<ExtractVariables<K>, string | number>] // 변수 있으면 필수!
  ) => string;
  currentLanguage: string;
  lng: string; // Alias for currentLanguage (react-i18next compatibility)
  isReady: boolean;
};
```

### 5.3 결과

```typescript
// ✅ 올바른 사용
t("User {{userName}} has {{totalDays}} days left", {
  userName: "John",
  totalDays: 5,
});

// ❌ 타입 에러: userNam은 userName의 오타
t("User {{userName}} has {{totalDays}} days left", {
  userNam: "John", // Type Error!
  totalDays: 5,
});

// ❌ 타입 에러: totalDays 누락
t("User {{userName}} has {{totalDays}} days left", {
  userName: "John", // Type Error: Property 'totalDays' is missing
});
```

---

## 6. 고급 활용: 상수 정의에서 타입 안정성

### 6.1 문제 상황

드롭다운 메뉴나 네비게이션 같은 상수 배열에서 번역 키를 사용할 때:

```typescript
// ❌ 타입 안전성 없음
const LANGUAGE_ITEMS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "Englsh" }, // 오타, but 컴파일 성공
];

const { t } = useTranslation("constant");
LANGUAGE_ITEMS.map((item) => t(item.label)); // 런타임 에러 가능
```

### 6.2 해결: 네임스페이스별 타입 export

`i18n-extractor`는 각 네임스페이스에 대한 개별 타입을 자동으로 export합니다:

```typescript
// locales/types/i18nexus.d.ts (자동 생성)
export type ConstantKeys = TranslationKeys["constant"];
export type HomeKeys = TranslationKeys["home"];
export type CommonKeys = TranslationKeys["common"];
```

**사용 예시:**

```typescript
import type { ConstantKeys } from "i18nexus";

// ✅ 타입 안전한 상수 정의
const LANGUAGE_ITEMS: Array<{
  value: string;
  label: ConstantKeys; // 컴파일 타임 체크!
}> = [
  { value: "ko", label: "한국어" }, // ✅ OK
  { value: "en", label: "English" }, // ✅ OK
  // { value: "fr", label: "Français" } // ❌ 컴파일 오류!
] as const;

const { t } = useTranslation("constant");
LANGUAGE_ITEMS.map((item) => t(item.label)); // 완전 타입 안전
```

### 6.3 활용 사례

- **드롭다운 메뉴**: 언어 선택, 설정 옵션
- **네비게이션**: 메뉴 아이템, 탭, 링크
- **폼 필드**: 라벨, 플레이스홀더, 에러 메시지

---

## 7. 실전 예제: 각 라이브러리별 적용

### 7.1 react-i18next

**설정:**

```json
{
  "translationImportSource": "react-i18next",
  "localesDir": "./public/locales"
}
```

**Before:**

```tsx
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation("home");
  return <h1>{t("welcom_title")}</h1>; // 오타, but 컴파일 성공 ❌
}
```

**After:**

```tsx
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation("home");
  return <h1>{t("welcom_title")}</h1>; // ❌ Type Error!
  //              ^^^^^^^^^^^^
  // Type '"welcom_title"' is not assignable to type '"welcome_title" | "hero_subtitle" | ...'
}
```

### 7.2 next-intl

**설정:**

```json
{
  "translationImportSource": "next-intl",
  "localesDir": "./messages"
}
```

**사용:**

```tsx
import { useTranslations } from "next-intl";

function AboutPage() {
  const t = useTranslations("about");
  return <p>{t("team_size")}</p>; // ✅ 타입 안전!
}
```

### 7.3 커스텀 i18n 래퍼

**설정:**

```json
{
  "translationImportSource": "@/lib/i18n/client",
  "localesDir": "./locales"
}
```

**생성되는 타입:**

```typescript
declare module "@/lib/i18n/client" {
  export function useTranslation<NS extends TranslationNamespace>(...): ...;
}

declare module "@/lib/i18n/client/server" {
  export function getTranslation<NS extends TranslationNamespace>(
    namespace: NS
  ): Promise<{
    t: (key: TranslationKeys[NS]) => string;
    language: string;
    lng: string;  // Alias for language (react-i18next compatibility)
    translations: Record<string, Record<string, string>>;
    dict: Record<string, string>;
  }>;
}
```

---

## 8. 성능 고려: "타입 코드가 너무 길어지지 않을까?"

### 8.1 우려 사항

프로젝트가 커지면 번역 키가 수천 개가 될 수 있습니다:

```typescript
declare type HomeKeys =
  | "key_1"
  | "key_2"
  | "key_3"
  // ... 수천 개
  | "key_9999";
```

### 8.2 해답: TypeScript는 타입을 런타임에 남기지 않습니다

**핵심 포인트:**

1. **타입은 컴파일 타임에만 존재**

   ```typescript
   // TypeScript 소스
   const x: HomeKeys = "key_1";

   // 컴파일 후 JavaScript (타입 정보 완전 제거)
   const x = "key_1";
   ```

2. **`.d.ts` 파일은 번들에 포함되지 않음**
   - Webpack, Vite, Rollup 등 모든 번들러는 `.d.ts` 파일을 무시
   - 타입 체크용으로만 사용되고 빌드 결과물에는 포함 안 됨

3. **트리쉐이킹의 대상도 아님**
   - 트리쉐이킹은 **사용하지 않는 코드**를 제거하는 기술
   - 타입은 애초에 **코드가 아니므로** 번들에 없음

### 8.3 실제 빌드 결과

**TypeScript (개발 시):**

```typescript
// 10,000개의 키를 가진 타입
declare type HomeKeys = "key_1" | "key_2" | ... | "key_10000";

const message: HomeKeys = "key_1";
```

**JavaScript (프로덕션):**

```javascript
// 타입 정보 0바이트
const message = "key_1";
```

### 8.4 실제 번들 크기 비교

| 파일                          | 개발 환경  | 프로덕션 빌드        |
| ----------------------------- | ---------- | -------------------- |
| `i18nexus.d.ts` (1,000 keys)  | ~50KB      | **0KB** (포함 안 됨) |
| `i18nexus.d.ts` (10,000 keys) | ~500KB     | **0KB** (포함 안 됨) |
| 번역 JSON 파일                | 포함 안 됨 | ~100KB (실제 데이터) |

**결론: 타입이 아무리 길어져도 런타임 성능/번들 크기에 영향 0**

---

## 9. 실제 도입 효과

### Before vs After

| 항목           | Before                 | After                       |
| -------------- | ---------------------- | --------------------------- |
| 오타 발견 시점 | 런타임 (사용자가 발견) | 컴파일 타임 (개발자가 발견) |
| IDE 자동완성   | ❌ 없음                | ✅ 모든 키 자동완성         |
| 리팩토링       | 수동 검색/교체         | TypeScript가 자동 추적      |
| 보간 변수 오타 | 런타임 에러            | 컴파일 에러                 |
| 번들 크기 영향 | -                      | 0KB (타입은 제거됨)         |

### 실제 사용 사례

```typescript
// ✅ IDE가 자동완성 제공
const { t } = useTranslation("home");
t("wel..."); // → 'welcome_title', 'welcome_subtitle' 자동완성!

// ✅ 존재하지 않는 키는 빨간 줄
t("non_existent_key"); // ❌ Type Error

// ✅ 네임스페이스 오타도 감지
useTranslation("hme"); // ❌ Type Error: "hme" is not assignable to "home" | "about" | ...

// ✅ 보간 변수 체크
t("hello {{name}}", { nam: "John" }); // ❌ Type Error: 'nam' → 'name'

// ✅ react-i18next 호환성: lng 별칭 사용 가능
const { currentLanguage, lng } = useTranslation("home");
// currentLanguage와 lng는 같은 값
```

---

## 10. 사용법

### 10.1 설치

```bash
npm install -D i18nexus-tools
```

### 10.2 설정

```json
// i18nexus.config.json
{
  "languages": ["ko", "en"],
  "localesDir": "./locales",
  "translationImportSource": "react-i18next", // 사용 중인 라이브러리
  "sourcePattern": "src/**/*.{ts,tsx}"
}
```

### 10.3 타입 생성

```bash
npx i18n-extractor
```

**생성 결과:**

```
locales/
├── home/
│   ├── ko.json
│   └── en.json
├── about/
│   ├── ko.json
│   └── en.json
└── types/
    └── i18nexus.d.ts  ← 자동 생성!
```

### 10.4 자동화 (CI/CD)

```yaml
# .github/workflows/type-check.yml
name: Type Check

on: [push, pull_request]

jobs:
  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npx i18n-extractor # 타입 생성
      - run: npm run type-check # TypeScript 검사
```

---

## 11. 결론

### 우리가 해결한 것

1. ✅ **런타임 → 컴파일 타임으로 오류 검출 시점 이동**
2. ✅ **모든 i18n 라이브러리와 호환되는 범용 솔루션**
3. ✅ **보간 변수까지 완벽한 타입 안정성**
4. ✅ **런타임 성능 영향 0 (타입은 빌드 시 제거)**
5. ✅ **개발자 경험 대폭 개선 (자동완성, 타입 에러)**
6. ✅ **상수 정의에서도 타입 안정성 (네임스페이스별 타입 export)**
7. ✅ **react-i18next 호환성 (lng 별칭 지원)**

### 핵심 인사이트

> **"라이브러리를 수정하지 말고, TypeScript의 Module Augmentation으로 타입을 주입하라"**

이 접근법은 i18n뿐만 아니라 **타입이 느슨한 모든 라이브러리**에 적용할 수 있는 패턴입니다.

### 다음 단계

- 🚀 [i18nexus-tools GitHub](https://github.com/i18n-global/i18n-mono)
- 📦 [npm: i18nexus-tools](https://www.npmjs.com/package/i18nexus-tools)
- 📖 [전체 문서](https://github.com/i18n-global/i18n-mono/tree/main/packages/tools)

---

## 부록: 기술 상세

### A. AST 기반 번역 키 추출

```typescript
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

function extractKeys(sourceCode: string): string[] {
  const ast = parse(sourceCode, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const keys: string[] = [];

  traverse(ast, {
    CallExpression(path) {
      // t("key") 패턴 감지
      if (
        path.node.callee.type === "Identifier" &&
        path.node.callee.name === "t" &&
        path.node.arguments[0]?.type === "StringLiteral"
      ) {
        keys.push(path.node.arguments[0].value);
      }
    },
  });

  return keys;
}
```

### B. 조건부 타입의 작동 원리

```typescript
// 1. 키에서 변수 추출
type ExtractVariables<K> = K extends keyof KeyVariables
  ? KeyVariables[K]
  : never;

// 2. 변수가 있으면 필수, 없으면 선택적
type TranslationArgs<K> =
  ExtractVariables<K> extends never
    ? [variables?: Record<string, any>]
    : [variables: Record<ExtractVariables<K>, any>];

// 3. 실제 적용
function t<K extends Keys>(key: K, ...args: TranslationArgs<K>): string;

// 결과:
t("no_vars"); // variables 인자 선택적
t("has {{var}}"); // variables 인자 필수
t("has {{var}}", { var: "x" }); // ✅ OK
t("has {{var}}", { vr: "x" }); // ❌ Type Error
```

### C. Unicode 이스케이프 방지

```typescript
// @babel/generator 설정
generate(ast, {
  jsescOption: {
    minimal: true, // 한글 등을 Unicode로 변환하지 않음
  },
});

// Before: t("\uC0AC\uC6A9\uC790")
// After:  t("사용자")
```

---

**Written by:** i18nexus Team  
**Published:** 2025-12-01  
**Tags:** #TypeScript #i18n #ModuleAugmentation #DeveloperExperience
