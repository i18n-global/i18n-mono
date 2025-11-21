# 네임스페이스 자동화 구현 가이드

> i18nexus-tools v1.7.7+ 네임스페이스 자동화 기능 상세 문서

## 📋 목차

1. [개요](#개요)
2. [빠른 시작](#빠른-시작)
3. [핵심 기능](#핵심-기능)
4. [설정 방법](#설정-방법)
5. [동작 원리](#동작-원리)
6. [프레임워크별 처리](#프레임워크별-처리)
7. [실전 예시](#실전-예시)
8. [마이그레이션 가이드](#마이그레이션-가이드)
9. [문제 해결](#문제-해결)
10. [API 레퍼런스](#api-레퍼런스)

---

## 개요

### 배경

기존 i18next는 모든 번역을 단일 파일에 저장하여 다음과 같은 문제가 있었습니다:

- **번들 크기 증가**: 전체 앱의 모든 번역을 한 번에 로드
- **유지보수 어려움**: 수천 개의 키가 하나의 파일에 집중
- **협업 충돌**: 여러 개발자가 같은 파일을 동시 수정

### 해결 방안

**네임스페이스 자동화**를 통해 파일 경로 기반으로 번역을 자동 분리합니다:

```
✅ 페이지별 번역 파일 분리
✅ 자동 네임스페이스 추론
✅ 빌드 타임 검증
✅ 번들 크기 최적화 (코드 스플리팅)
```

### 핵심 가치

| 기능 | 기존 방식 | 네임스페이스 모드 |
|------|-----------|-------------------|
| **번역 파일** | `locales/ko.json` (10MB) | `locales/dashboard/ko.json` (500KB) |
| **번들 크기** | 전체 번역 로드 | 필요한 네임스페이스만 로드 |
| **개발 경험** | 수동 네임스페이스 관리 | 자동 추론 + 검증 |
| **유지보수** | 단일 거대 파일 | 도메인별 작은 파일 |

---

## 빠른 시작

### 1. 설정 파일 생성

`i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "namespacing": {
    "enabled": true,
    "basePath": "src/app",
    "defaultNamespace": "common",
    "framework": "nextjs-app"
  }
}
```

### 2. 코드 작성

```tsx
// src/app/dashboard/page.tsx
'use client';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation('dashboard'); // 네임스페이스 명시

  return <h1>{t('환영합니다')}</h1>;
}
```

### 3. 번역 키 추출

```bash
npx i18n-extractor
```

### 4. 생성된 파일 확인

```
locales/
└── dashboard/
    ├── ko.json  → { "환영합니다": "환영합니다" }
    └── en.json  → { "환영합니다": "" }
```

---

## 핵심 기능

### 1. 자동 네임스페이스 추론

**파일 경로에서 네임스페이스를 자동으로 결정**합니다.

```typescript
// 파일: src/app/dashboard/settings/page.tsx
// 추론된 네임스페이스: "dashboard"
// (basePath 다음 첫 번째 폴더명)
```

**추론 규칙:**

| 파일 위치 | 네임스페이스 |
|-----------|--------------|
| `src/app/dashboard/page.tsx` | `dashboard` |
| `src/app/dashboard/settings/page.tsx` | `dashboard` |
| `src/app/(main)/dashboard/page.tsx` | `dashboard` (특수 패턴 제거) |
| `src/components/Button.tsx` | `common` (basePath 외부) |

### 2. 빌드 타임 검증

**`useTranslation` 인자를 자동 검증**하여 실수를 방지합니다.

```typescript
// ❌ 에러 발생
// 파일: src/app/dashboard/page.tsx
const { t } = useTranslation('settings'); // 네임스페이스 불일치

// ✅ 올바른 코드
const { t } = useTranslation('dashboard');
```

**에러 메시지:**

```
[i18nexus-tools] Namespace Mismatch in src/app/dashboard/page.tsx:4.
File path resolves to namespace "dashboard", but found useTranslation("settings").
Please use useTranslation("dashboard").
```

### 3. 도메인 우선 파일 구조

**네임스페이스별로 번역 파일을 분리 저장**합니다.

```
locales/
├── dashboard/
│   ├── ko.json
│   └── en.json
├── settings/
│   ├── ko.json
│   └── en.json
└── common/
    ├── ko.json
    └── en.json
```

**장점:**

- 🚀 **번들 크기 최적화**: 페이지별로 필요한 번역만 로드
- 📦 **코드 스플리팅**: Next.js/Webpack이 자동으로 청크 분리
- 🔧 **유지보수 용이**: 도메인별로 독립적인 파일 관리

### 4. 프레임워크별 자동 처리

**각 프레임워크의 특수 패턴을 자동으로 제거**합니다.

| 프레임워크 | 특수 패턴 | 예시 |
|------------|-----------|------|
| Next.js App Router | `(group)`, `_private`, `[dynamic]` | `(main)/dashboard` → `dashboard` |
| Next.js Pages Router | `[dynamic]`, `[...catchall]` | `[id]/page` → `page` |
| TanStack Router | `$param`, `_layout` | `$id/_layout` → (제거) |
| Remix | `$param` | `dashboard.$id` → `dashboard` |

---

## 설정 방법

### 설정 옵션

```typescript
interface NamespacingConfig {
  enabled: boolean;              // 네임스페이스 모드 활성화
  basePath: string;              // 페이지/라우트 기준 폴더
  defaultNamespace: string;      // basePath 외부 파일의 기본값
  framework?: FrameworkType;     // 프레임워크 타입
  ignorePatterns?: string[];     // 사용자 정의 무시 패턴 (정규식)
}
```

### 프레임워크별 설정 예시

#### Next.js App Router

```json
{
  "namespacing": {
    "enabled": true,
    "basePath": "src/app",
    "defaultNamespace": "common",
    "framework": "nextjs-app"
  }
}
```

#### Next.js Pages Router

```json
{
  "namespacing": {
    "enabled": true,
    "basePath": "src/pages",
    "defaultNamespace": "common",
    "framework": "nextjs-pages"
  }
}
```

#### React Router

```json
{
  "namespacing": {
    "enabled": true,
    "basePath": "src/routes",
    "defaultNamespace": "common",
    "framework": "react-router"
  }
}
```

### 커스텀 무시 패턴

```json
{
  "namespacing": {
    "enabled": true,
    "basePath": "src/app",
    "defaultNamespace": "common",
    "framework": "nextjs-app",
    "ignorePatterns": [
      "\\(.*?\\)",        // 모든 괄호 패턴
      "^_",               // 언더스코어로 시작하는 폴더
      "\\[.*?\\]"         // 모든 대괄호 패턴
    ]
  }
}
```

---

## 동작 원리

### 전체 흐름도

```
1. 파일 스캔
   ↓
2. 파일별 처리
   ├─ 네임스페이스 추론
   ├─ 네임스페이스 검증
   └─ t() 호출 추출
   ↓
3. 네임스페이스별 그룹화
   ↓
4. 파일 생성
   └─ locales/{namespace}/{lang}.json
```

### 네임스페이스 추론 알고리즘

```typescript
function inferNamespace(filePath: string, config: NamespacingConfig): string {
  // 1. basePath 외부 파일?
  if (!isInsideBasePath(filePath, config.basePath)) {
    return config.defaultNamespace; // "common"
  }

  // 2. basePath 기준 상대 경로
  const relativePath = path.relative(config.basePath, filePath);
  // 예: "(main)/dashboard/_components/Chart.tsx"

  // 3. 프레임워크별 특수 패턴 제거
  const cleanedPath = removeFrameworkPatterns(
    relativePath,
    config.framework,
    config.ignorePatterns
  );
  // 예: "dashboard/Chart.tsx"

  // 4. 첫 번째 폴더명 추출
  const namespace = cleanedPath.split('/')[0];
  // 예: "dashboard"

  return namespace;
}
```

### 검증 로직

```typescript
function validateNamespace(
  filePath: string,
  code: string,
  expectedNamespace: string
): ValidationResult {
  // 1. useTranslation 호출 찾기
  const calls = findUseTranslationCalls(code);

  // 2. 각 호출 검증
  for (const call of calls) {
    if (!call.namespace) {
      return {
        valid: false,
        error: `Missing namespace. Use useTranslation("${expectedNamespace}")`
      };
    }

    if (call.namespace !== expectedNamespace) {
      return {
        valid: false,
        error: `Expected "${expectedNamespace}", found "${call.namespace}"`
      };
    }
  }

  return { valid: true };
}
```

---

## 프레임워크별 처리

### Next.js App Router

**특수 패턴:**

- `(group)`: 라우트 그룹 (UI 구성용, 제거됨)
- `_folder`: 프라이빗 폴더 (제거됨)
- `[param]`: 동적 라우트 (제거됨)
- `[...slug]`: Catch-all 라우트 (제거됨)

**예시:**

```
src/app/(main)/dashboard/_components/[id]/Chart.tsx
        └─────┘ └────────┘ └──────────┘ └───┘
         제거     제거        제거        제거

→ dashboard/Chart.tsx
→ 네임스페이스: "dashboard"
```

### TanStack Router (폴더 기반)

**특수 패턴:**

- `_layout`: 레이아웃 파일 (제거됨)
- `_index`: 인덱스 파일 (제거됨)
- `$param`: 동적 세그먼트 (제거됨)

**예시:**

```
src/routes/dashboard/$id/_layout.tsx
                    └──┘ └──────┘
                    제거   제거

→ dashboard/.tsx
→ 네임스페이스: "dashboard"
```

### Remix

**특수 패턴:**

- `$param`: 동적 세그먼트 (제거됨)

**예시:**

```
app/routes/dashboard.$id.settings.tsx
                   └──┘
                   제거

→ dashboard.settings.tsx
→ 네임스페이스: "dashboard"
```

---

## 실전 예시

### 예시 1: 복잡한 Next.js App Router 프로젝트

**프로젝트 구조:**

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    → "common" (특수 폴더만 있음)
│   │   └── about/
│   │       └── page.tsx                → "about"
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx                → "dashboard"
│   │   │   ├── _components/
│   │   │   │   └── Chart.tsx           → "dashboard"
│   │   │   └── [id]/
│   │   │       └── page.tsx            → "dashboard"
│   │   └── settings/
│   │       ├── page.tsx                → "settings"
│   │       └── profile/
│   │           └── page.tsx            → "settings"
│   └── api/
│       └── route.ts                    → "common" (basePath 외부 아님, 특수)
└── components/
    └── ui/
        └── Button.tsx                  → "common" (basePath 외부)
```

**코드 예시:**

```typescript
// src/app/(dashboard)/dashboard/page.tsx
'use client';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation('dashboard'); // ✅

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

```typescript
// src/app/(dashboard)/dashboard/_components/Chart.tsx
'use client';
import { useTranslation } from 'react-i18next';

export function Chart() {
  const { t } = useTranslation('dashboard'); // ✅ Co-location

  return <div>{t('chart.loading')}</div>;
}
```

```typescript
// src/components/ui/Button.tsx
import { useTranslation } from 'react-i18next';

export function Button() {
  const { t } = useTranslation('common'); // ✅ basePath 외부

  return <button>{t('submit')}</button>;
}
```

**추출 결과:**

```
locales/
├── dashboard/
│   ├── ko.json
│   │   {
│   │     "title": "대시보드",
│   │     "description": "통계를 확인하세요",
│   │     "chart.loading": "차트 로딩 중..."
│   │   }
│   └── en.json
├── settings/
│   ├── ko.json
│   └── en.json
├── about/
│   ├── ko.json
│   └── en.json
└── common/
    ├── ko.json
    │   {
    │     "submit": "제출"
    │   }
    └── en.json
```

### 예시 2: 중첩된 페이지 구조

```
src/app/
└── products/
    ├── page.tsx                    → "products"
    ├── [id]/
    │   ├── page.tsx                → "products"
    │   └── reviews/
    │       └── page.tsx            → "products"
    └── _components/
        └── ProductCard.tsx         → "products"
```

**모든 파일이 같은 네임스페이스 `products`를 사용** (Co-location 원칙)

---

## 마이그레이션 가이드

### 기존 프로젝트 → 네임스페이스 모드

#### 단계 1: 백업

```bash
# 기존 번역 파일 백업
cp -r locales locales.backup
```

#### 단계 2: 설정 추가

`i18nexus.config.json`:

```json
{
  "namespacing": {
    "enabled": true,
    "basePath": "src/app",
    "defaultNamespace": "common",
    "framework": "nextjs-app"
  }
}
```

#### 단계 3: 검증 비활성화 모드로 추출

먼저 검증 없이 키만 추출하여 기존 코드가 어떻게 분리되는지 확인:

```typescript
// 임시: extractor에 skipValidation 옵션 추가 필요
// 또는 CLI: npx i18n-extractor --skip-validation
```

#### 단계 4: 코드 수정

모든 `useTranslation()` 호출에 네임스페이스 추가:

```typescript
// 변경 전
const { t } = useTranslation();

// 변경 후
const { t } = useTranslation('dashboard');
```

**자동화 스크립트 (예시):**

```bash
# src/app/dashboard 폴더 내 모든 파일에 'dashboard' 네임스페이스 추가
find src/app/dashboard -name "*.tsx" -exec sed -i \
  "s/useTranslation()/useTranslation('dashboard')/g" {} +
```

#### 단계 5: 검증 활성화 및 재추출

```bash
npx i18n-extractor
```

에러 발생 시 해당 파일 수정.

#### 단계 6: i18next 설정 업데이트

```typescript
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// 모든 네임스페이스 나열
const namespaces = [
  'common',
  'dashboard',
  'settings',
  'products',
  // ...
];

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ko',
    defaultNS: 'common',
    ns: namespaces,
    backend: {
      loadPath: '/locales/{{ns}}/{{lng}}.json', // 도메인 우선 구조
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

#### 단계 7: 레거시 파일 정리

```bash
# 기존 단일 번역 파일 제거 (백업 확인 후)
rm locales/ko.json locales/en.json
```

---

## 문제 해결

### Q1: 네임스페이스 검증 에러가 계속 발생합니다

**증상:**

```
Namespace Mismatch in src/app/dashboard/components/Chart.tsx:5.
Expected "dashboard", found "common".
```

**해결:**

1. **파일 위치 확인**: `src/app/dashboard/` 폴더 내부인지 확인
2. **useTranslation 인자 수정**: `useTranslation('dashboard')` 사용
3. **특수 폴더 체크**: `_components`, `(group)` 등은 자동 제거됨

### Q2: basePath 외부 파일인데 다른 네임스페이스를 사용하고 싶습니다

**증상:**

```typescript
// src/components/DashboardButton.tsx
const { t } = useTranslation('dashboard'); // ❌ basePath 외부라 'common' 강제
```

**해결:**

두 가지 옵션:

1. **파일을 basePath 내부로 이동**:
   ```
   src/components/DashboardButton.tsx
   → src/app/dashboard/_components/DashboardButton.tsx
   ```

2. **Co-location 원칙 따르기**: basePath 외부 파일은 `common` 사용

### Q3: 프레임워크 특수 패턴이 제대로 제거되지 않습니다

**증상:**

```
src/app/(main)/dashboard/page.tsx
→ 네임스페이스: "(main)" (잘못됨)
```

**해결:**

1. **framework 설정 확인**:
   ```json
   {
     "namespacing": {
       "framework": "nextjs-app"  // ✅ 올바른 값
     }
   }
   ```

2. **커스텀 패턴 추가**:
   ```json
   {
     "namespacing": {
       "framework": "nextjs-app",
       "ignorePatterns": ["\\(special\\)"]  // 추가 패턴
     }
   }
   ```

### Q4: 중첩된 폴더 구조에서 어느 레벨이 네임스페이스가 되나요?

**질문:**

```
src/app/products/[id]/reviews/page.tsx
→ 네임스페이스: "products"? "[id]"? "reviews"?
```

**답변:**

**항상 basePath 다음 첫 번째 폴더**가 네임스페이스입니다 (특수 패턴 제거 후).

```
src/app/products/[id]/reviews/page.tsx
       └──────┘
       basePath

→ 상대 경로: products/[id]/reviews/page.tsx
→ 특수 패턴 제거: products/reviews/page.tsx ([id] 제거)
→ 첫 번째 폴더: "products"
```

### Q5: 같은 키를 여러 네임스페이스에서 사용해도 되나요?

**질문:**

```json
// locales/dashboard/ko.json
{ "submit": "전송" }

// locales/settings/ko.json
{ "submit": "저장" }  // 같은 키, 다른 값
```

**답변:**

✅ **완전히 정상입니다.** 네임스페이스는 독립적인 스코프입니다.

```typescript
// dashboard 페이지
const { t } = useTranslation('dashboard');
t('submit'); // "전송"

// settings 페이지
const { t } = useTranslation('settings');
t('submit'); // "저장"
```

---

## API 레퍼런스

### TranslationExtractor 클래스

```typescript
class TranslationExtractor {
  constructor(config: ExtractorConfig);

  extract(): Promise<void>;

  private parseFile(filePath: string): void;
  private inferNamespace(filePath: string): string;
  private validateNamespace(
    filePath: string,
    code: string,
    expectedNamespace: string
  ): void;
}
```

### 설정 인터페이스

```typescript
interface ExtractorConfig {
  sourcePattern: string;
  outputDir: string;
  languages: string[];
  defaultLanguage: string;
  force?: boolean;
  dryRun?: boolean;
  skipValidation?: boolean;
  namespacing?: NamespacingConfig;
}

interface NamespacingConfig {
  enabled: boolean;
  basePath: string;
  defaultNamespace: string;
  framework?: FrameworkType;
  ignorePatterns?: string[];
}

type FrameworkType =
  | 'nextjs-app'
  | 'nextjs-pages'
  | 'tanstack-file'
  | 'tanstack-folder'
  | 'react-router'
  | 'remix'
  | 'other';
```

### 유틸리티 함수

```typescript
// 네임스페이스 추론
function inferNamespace(
  filePath: string,
  config: NamespacingConfig
): string;

// 네임스페이스 검증
function validateNamespace(
  filePath: string,
  code: string,
  expectedNamespace: string,
  config: NamespacingConfig
): ValidationResult;

// 프레임워크 패턴 제거
function removeFrameworkPatterns(
  relativePath: string,
  framework?: FrameworkType,
  ignorePatterns?: string[]
): string;

// useTranslation 호출 찾기
function findUseTranslationCalls(
  filePath: string,
  code: string
): UseTranslationCall[];
```

---

## 참고 자료

### 관련 문서

- [i18next 공식 문서](https://www.i18next.com/)
- [react-i18next 공식 문서](https://react.i18next.com/)
- [Next.js i18n 가이드](https://nextjs.org/docs/advanced-features/i18n-routing)

### 프로젝트 링크

- [GitHub Repository](https://github.com/i18n-global/i18nexus-tools)
- [npm Package](https://www.npmjs.com/package/i18nexus-tools)
- [기획안 (ver2.md)](../ignore/ver2.md)

---

**작성:** 2025년 1월
**버전:** 1.7.7
**라이선스:** MIT
