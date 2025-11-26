# 네임스페이스 자동화 구현 상세 문서

## 📋 목차

1. [i18nexus-tools 개요](#i18nexus-tools-개요)
2. [개요](#개요)
3. [변경사항 요약](#변경사항-요약)
4. [구현된 기능](#구현된-기능)
5. [파일 구조](#파일-구조)
6. [설정 방법](#설정-방법)
7. [동작 원리](#동작-원리)
8. [사용 예시](#사용-예시)
9. [프레임워크별 처리](#프레임워크별-처리)
10. [마이그레이션 가이드](#마이그레이션-가이드)

---

## i18nexus-tools 개요

### 프로젝트 소개

**i18nexus-tools**는 React 애플리케이션을 위한 강력하고 간단한 국제화(i18n) CLI 도구 모음입니다. 개발자가 하드코딩된 문자열을 자동으로 번역 함수로 변환하고, 번역 키를 추출하며, Google Sheets와 동기화하는 등 국제화 워크플로우를 완전히 자동화할 수 있도록 도와줍니다.

### 핵심 가치

1. **자동화 (Automation)**: 수동 작업을 최소화하고 개발 생산성 향상
2. **타입 안전성 (Type Safety)**: TypeScript 완전 지원으로 컴파일 타임 에러 방지
3. **스마트 감지 (Smart Detection)**: 컨텍스트 인식으로 API 데이터, props 등은 자동 제외
4. **협업 효율성 (Collaboration)**: Google Sheets 통합으로 번역가와의 원활한 협업
5. **성능 최적화 (Performance)**: 네임스페이스 기반 코드 스플리팅으로 번들 크기 최적화

### 주요 기능

#### 1. 자동 문자열 래핑 (Automatic String Wrapping)

하드코딩된 문자열을 자동으로 `t()` 함수로 변환하고 필요한 경우 `useTranslation` 훅을 추가합니다.

**지원 기능:**

- 한국어/영어 문자열 자동 감지
- 템플릿 리터럴을 i18next 보간 형식으로 변환
- 서버 컴포넌트 자동 감지 (Next.js App Router)
- 컨텍스트 기반 스마트 감지 (API 데이터, props 제외)
- `// i18n-ignore` 주석 지원

**예시:**

```tsx
// 변환 전
export default function Page() {
  return <h1>안녕하세요</h1>;
}

// 변환 후
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  return <h1>{t("안녕하세요")}</h1>;
}
```

#### 2. 번역 키 추출 (Translation Key Extraction)

소스 코드에서 `t()` 함수 호출을 분석하여 번역 키를 추출하고 JSON 파일로 생성/업데이트합니다.

**지원 기능:**

- 기존 번역 유지하며 새 키만 추가 (기본 모드)
- 모든 번역 덮어쓰기 (Force 모드)
- 다중 언어 지원 (en, ko, ja 등)
- CSV 형식으로 Google Sheets 호환 출력
- 네임스페이스 기반 파일 분리 (도메인 우선 구조)

**예시:**

```bash
# 새 키만 추가 (기존 번역 보존)
npx i18n-extractor

# 모든 키 덮어쓰기
npx i18n-extractor --force

# CSV 형식으로 출력
npx i18n-extractor --format csv
```

#### 3. 레거시 키 정리 (Legacy Key Cleanup)

사용되지 않는 번역 키를 자동으로 찾아 제거합니다.

**지원 기능:**

- 사용되지 않는 키 자동 감지
- 백업 생성 (기본 동작)
- Dry-run 모드로 미리보기
- 다중 언어 동시 처리

**예시:**

```bash
# 미리보기
npx i18n-clean-legacy --dry-run

# 실제 정리 (백업 자동 생성)
npx i18n-clean-legacy
```

#### 4. Google Sheets 통합 (Google Sheets Integration)

번역 파일을 Google Sheets와 양방향으로 동기화하여 번역가와의 협업을 원활하게 합니다.

**지원 기능:**

- 로컬 → Google Sheets 업로드
- Google Sheets → 로컬 다운로드
- 자동 번역 모드 (Google Translate API 활용)
- 네임스페이스별 시트 자동 생성
- 증분 업데이트 지원

**예시:**

```bash
# 업로드 (자동 번역 포함)
npx i18n-upload --auto-translate

# 다운로드
npx i18n-download

# 강제 다운로드 (모든 번역 덮어쓰기)
npx i18n-download-force
```

#### 5. 네임스페이스 자동화 (Namespace Automation) ⭐ (신규)

파일 경로 기반으로 네임스페이스를 자동 추론하고 검증합니다.

**지원 기능:**

- 파일 경로 기반 네임스페이스 자동 추론
- `useTranslation` 네임스페이스 인자 검증
- 도메인 우선 구조 파일 저장 (`locales/{namespace}/{lang}.json`)
- 프레임워크별 특수 패턴 자동 처리
- Co-location 원칙 강제

### 기술 스택

#### 핵심 라이브러리

- **@babel/traverse**: AST 순회 및 변환
- **@babel/generator**: 코드 생성
- **@babel/types**: AST 타입 정의
- **@swc/core**: 고성능 파서 (Babel 대비 20배 빠름)
- **googleapis**: Google Sheets API 통합
- **glob**: 파일 패턴 매칭
- **commander**: CLI 인터페이스

#### 아키텍처

```
i18nexus-tools/
├── bin/                    # CLI 진입점
│   ├── i18n-wrapper.ts    # 문자열 래핑 (Babel)
│   ├── i18n-wrapper-swc.ts # 문자열 래핑 (SWC 실험적)
│   ├── i18n-extractor.ts  # 번역 키 추출
│   ├── i18n-upload.ts     # Google Sheets 업로드
│   ├── i18n-download.ts   # Google Sheets 다운로드
│   ├── i18n-clean-legacy.ts # 레거시 키 정리
│   └── i18n-sheets.ts     # Google Sheets 초기화
├── scripts/                # 핵심 로직
│   ├── t-wrapper/         # 문자열 래핑 로직
│   ├── extractor/         # 키 추출 로직
│   ├── google-sheets.ts   # Google Sheets 통합
│   ├── clean-legacy.ts    # 레거시 키 정리
│   └── common/           # 공통 유틸리티
└── docs/                   # 문서
```

### CLI 도구 상세

#### 1. i18n-wrapper

**목적**: 하드코딩된 문자열을 `t()` 함수로 자동 변환

**주요 옵션:**

- `-p, --pattern <pattern>`: 소스 파일 패턴 (기본값: `src/**/*.{js,jsx,ts,tsx}`)
- `--dry-run`: 변경사항 미리보기 (실제 파일 수정 안 함)
- `--verbose`: 상세 로그 출력

**동작 방식:**

1. 지정된 패턴의 파일 스캔
2. AST 파싱 (Babel 또는 SWC)
3. 문자열 리터럴 감지 (한국어/영어)
4. 컨텍스트 분석 (API 데이터, props 제외)
5. `t()` 함수로 변환
6. 필요한 경우 `useTranslation` 훅 추가
7. 코드 재생성 및 파일 저장

**성능:**

- Babel 버전: 안정적이고 빠름 (권장)
- SWC 버전: 실험적, 현재 Babel보다 느림 (AST 변환 오버헤드)

#### 2. i18n-extractor

**목적**: `t()` 함수 호출에서 번역 키 추출

**주요 옵션:**

- `-p, --pattern <pattern>`: 소스 파일 패턴
- `-o, --output-dir <dir>`: 출력 디렉토리 (기본값: `./locales`)
- `-l, --languages <langs>`: 언어 목록 (쉼표로 구분, 기본값: `en,ko`)
- `--force`: 모든 번역 덮어쓰기
- `--dry-run`: 미리보기
- `--format <format>`: 출력 형식 (`json` 또는 `csv`)

**동작 방식:**

1. 지정된 패턴의 파일 스캔
2. AST 파싱 및 `t()` 호출 찾기
3. 네임스페이스 추론 (활성화된 경우)
4. 네임스페이스 검증 (활성화된 경우)
5. 번역 키 추출
6. 기존 번역 파일 읽기
7. 새 키 병합 또는 덮어쓰기
8. JSON/CSV 파일 생성

**네임스페이스 모드:**

- 활성화 시: `locales/{namespace}/{lang}.json` 구조로 저장
- 비활성화 시: `locales/{lang}.json` 구조로 저장 (레거시)

#### 3. i18n-clean-legacy

**목적**: 사용되지 않는 번역 키 제거

**주요 옵션:**

- `-p, --pattern <pattern>`: 소스 파일 패턴
- `-l, --languages <langs>`: 언어 목록
- `--no-backup`: 백업 생성 안 함
- `--dry-run`: 미리보기

**동작 방식:**

1. 소스 코드에서 사용 중인 키 추출
2. 번역 파일에서 정의된 키 읽기
3. 사용되지 않는 키 식별
4. 백업 생성 (기본 동작)
5. 사용되지 않는 키 제거

#### 4. i18n-upload / i18n-download

**목적**: Google Sheets와 번역 파일 동기화

**주요 옵션:**

- `--auto-translate`: 자동 번역 모드 (Google Translate API)
- `--force`: 강제 업로드/다운로드
- `--namespace <ns>`: 특정 네임스페이스만 처리

**동작 방식 (업로드):**

1. 로컬 번역 파일 읽기
2. Google Sheets API 인증
3. 시트/탭 확인 및 생성
4. 데이터 업로드
5. 자동 번역 모드 시 Google Translate 수식 추가

**동작 방식 (다운로드):**

1. Google Sheets API 인증
2. 시트/탭 데이터 읽기
3. 로컬 번역 파일 읽기
4. 데이터 병합 또는 덮어쓰기
5. 로컬 파일 저장

### 성능 최적화

#### 파서 성능 비교

| 파서  | 1,000 파일 파싱 시간 | 비고                      |
| ----- | -------------------- | ------------------------- |
| Babel | ~22.5초              | 안정적, 권장              |
| SWC   | ~1.1초               | 실험적, AST 변환 오버헤드 |

**현재 권장사항**: Babel 버전 사용 (`i18n-wrapper`)

#### 네임스페이스 기반 코드 스플리팅

네임스페이스 모드를 활성화하면 각 페이지는 자신의 번역 파일만 로드하므로:

- **초기 번들 크기 감소**: 전체 번역 대신 필요한 네임스페이스만 로드
- **LCP (Largest Contentful Paint) 개선**: 초기 로드 시간 단축
- **FCP (First Contentful Paint) 개선**: 첫 렌더링 시간 단축

**예시:**

```typescript
// 레거시 모드: 모든 번역 로드 (10MB)
import translations from "./locales/ko.json"; // 전체 앱 번역

// 네임스페이스 모드: 필요한 번역만 로드 (500KB)
import dashboard from "./locales/dashboard/ko.json"; // 대시보드만
```

### 통합 및 확장성

#### Next.js App Router 지원

서버 컴포넌트를 자동 감지하고 적절한 번역 함수를 사용합니다:

```tsx
// 서버 컴포넌트 자동 감지
export default async function ServerPage() {
  const { t } = await getServerTranslation(); // 자동 변환
  return <h1>{t("서버 렌더링")}</h1>;
}

// 클라이언트 컴포넌트
("use client");
export default function ClientPage() {
  const { t } = useTranslation(); // 자동 변환
  return <h1>{t("클라이언트 렌더링")}</h1>;
}
```

#### 프레임워크 지원

- **Next.js App Router**: `(group)`, `_private`, `[dynamic]` 패턴 자동 처리
- **Next.js Pages Router**: `[dynamic]`, `[...catchall]` 패턴 자동 처리
- **TanStack Router**: 파일/폴더 기반 라우팅 지원
- **React Router**: 일반 폴더 구조 지원
- **Remix**: `$` 동적 세그먼트 자동 처리

#### 타입 안전성

TypeScript 완전 지원으로 컴파일 타임에 번역 키 오타를 방지합니다:

```typescript
// 자동 생성된 타입
type TranslationKeys = "안녕하세요" | "로그인" | "로그아웃";

// 타입 안전한 번역 함수
const { t } = useTranslation();
t("안녕하세요"); // ✅ OK
t("안녕하세요"); // ❌ 컴파일 에러
```

### 사용 사례

#### 1. 신규 프로젝트 시작

```bash
# 1. 프로젝트 초기화
npx i18n-sheets init

# 2. 코드 작성 (한국어로 자연스럽게)
# <h1>안녕하세요</h1>

# 3. 자동 변환
npx i18n-wrapper

# 4. 번역 키 추출
npx i18n-extractor

# 5. Google Sheets에 업로드
npx i18n-upload --auto-translate

# 6. 번역가가 Google Sheets에서 작업

# 7. 번역 다운로드
npx i18n-download

# 8. 배포! 🚀
```

#### 2. 기존 프로젝트 마이그레이션

```bash
# 1. 기존 코드에 i18n 적용
npx i18n-wrapper

# 2. 번역 키 추출
npx i18n-extractor

# 3. 사용되지 않는 키 정리
npx i18n-clean-legacy --dry-run  # 먼저 확인
npx i18n-clean-legacy            # 실제 정리
```

#### 3. 네임스페이스 모드 활성화

```bash
# 1. 설정 파일 업데이트
# i18nexus.config.json에 namespacing 설정 추가

# 2. 검증 비활성화로 키 추출
# (코드에 네임스페이스 추가 전)

# 3. 코드에 네임스페이스 추가
# useTranslation('dashboard')

# 4. 검증 활성화
npx i18n-extractor
```

### 버전 정보

- **현재 버전**: 1.7.7
- **Node.js 요구사항**: >= 18.0.0
- **npm 요구사항**: >= 9.0.0
- **라이선스**: MIT

### 관련 패키지

- **i18nexus-core**: React 컴포넌트 및 훅
- **i18nexus**: Google Sheets 통합이 포함된 완전한 툴킷

### 지원 및 커뮤니티

- 📖 [문서](./docs/)
- 🐛 [이슈 리포트](https://github.com/i18n-global/i18nexus-tools/issues)
- 💬 [토론](https://github.com/i18n-global/i18nexus-tools/discussions)
- 📧 이메일: support@i18nexus.com

---

## 개요

`i18nexus-tools`의 `extractor`를 개선하여 **파일 경로 기반 네임스페이스 자동화**를 구현했습니다. 이제 각 페이지/도메인별로 번역 파일을 분리하여 관리할 수 있으며, `useTranslation` 훅의 네임스페이스 인자를 자동으로 검증합니다.

### 핵심 개선사항

1. **파일 경로 기반 네임스페이스 자동 추론**
2. **`useTranslation` 네임스페이스 검증**
3. **도메인 우선 구조 파일 저장** (`locales/{namespace}/{lang}.json`)
4. **프레임워크별 특수 패턴 자동 처리**

---

## 변경사항 요약

### 1. 새로 추가된 파일

#### `scripts/extractor/namespace-inference.ts`

- 네임스페이스 추론 로직
- 네임스페이스 검증 로직
- 프레임워크별 특수 패턴 처리

**주요 함수:**

- `inferNamespace(filePath, config)`: 파일 경로에서 네임스페이스 추론
- `validateNamespace(filePath, code, expectedNamespace, config)`: `useTranslation` 인자 검증
- `findUseTranslationCalls(filePath, code)`: 파일 내 `useTranslation` 호출 찾기
- `removeFrameworkPatterns(relativePath, framework, ignorePatterns)`: 프레임워크별 특수 패턴 제거

### 2. 수정된 파일

#### `scripts/config-loader.ts`

**추가된 인터페이스:**

```typescript
namespacing?: {
  enabled: boolean;
  basePath: string; // 페이지/라우트의 기준이 되는 폴더
  defaultNamespace: string; // basePath 외부 파일의 기본 네임스페이스
  framework?: "nextjs-app" | "nextjs-pages" | "tanstack-file" | "tanstack-folder" | "react-router" | "remix" | "other";
  ignorePatterns?: string[]; // 사용자 정의 무시 패턴 (정규식)
};
```

#### `scripts/extractor/index.ts`

**주요 변경사항:**

- `ExtractorConfig`에 `namespacing`, `skipValidation` 필드 추가
- `TranslationExtractor` 클래스에 `namespaceKeys` 맵 추가 (네임스페이스별 키 분리 저장)
- `parseFile()` 메서드에 네임스페이스 추론 및 검증 로직 통합
- `extract()` 메서드에서 네임스페이스 모드/레거시 모드 분기 처리

#### `scripts/extractor/output-generator.ts`

**주요 변경사항:**

- `writeOutputFileWithNamespace()` 함수 추가 (도메인 우선 구조로 저장)
- 기존 `writeOutputFile()` 함수는 레거시 모드용으로 유지

#### `scripts/google-sheets.ts`

**주요 변경사항:**

- `GoogleSheetsConfig`에 `namespace` 필드 추가
- `getNamespacePath()` 메서드 추가 (도메인 우선 경로 반환)
- `readLocalTranslations()`, `saveTranslationsToLocal()`, `saveTranslationsToLocalIncremental()`, `addTranslationsToLocal()`, `convertCSVToLocalTranslations()` 메서드 모두 도메인 우선 구조 지원

---

## 구현된 기능

### 1. 네임스페이스 자동 추론

파일 경로를 분석하여 자동으로 네임스페이스를 결정합니다.

**추론 규칙:**

1. `basePath` 외부 파일 → `defaultNamespace` 사용
2. `basePath` 내부 파일 → 첫 번째 폴더명을 네임스페이스로 사용
3. 프레임워크별 특수 패턴 제거 후 추론

**예시:**

```
src/app/dashboard/page.tsx → "dashboard"
src/app/(main)/dashboard/_components/Chart.tsx → "dashboard" (특수 패턴 제거)
src/components/shared/Button.tsx → "common" (basePath 외부)
```

### 2. 네임스페이스 검증

파일 내 `useTranslation` 훅 호출의 네임스페이스 인자를 검증합니다.

**검증 규칙:**

- 추론된 네임스페이스와 `useTranslation` 인자가 일치해야 함
- 불일치 시 빌드 에러 발생

**에러 메시지 예시:**

```
[i18nexus-tools] Namespace Mismatch in src/app/dashboard/page.tsx:15.
File path resolves to namespace "dashboard", but found useTranslation("settings").
Please use useTranslation("dashboard").
```

### 3. 도메인 우선 구조 파일 저장

번역 파일을 도메인(네임스페이스) 우선 구조로 저장합니다.

**파일 구조:**

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

### 4. 프레임워크별 특수 패턴 처리

각 프레임워크의 특수 폴더/파일 패턴을 자동으로 제거합니다.

**지원 프레임워크:**

- **nextjs-app**: `(group)`, `_private`, `[dynamic]`, `[...catchall]` 제거
- **nextjs-pages**: `[dynamic]`, `[...catchall]` 제거
- **tanstack-file**: 파일명 기반 네임스페이스 추출
- **tanstack-folder**: `_layout`, `_index`, `$` 동적 세그먼트 제거
- **react-router**: 특수 패턴 없음
- **remix**: `$` 동적 세그먼트 제거

---

## 파일 구조

### 변경 전 (레거시)

```
locales/
├── ko.json
└── en.json
```

### 변경 후 (네임스페이스 모드)

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

---

## 설정 방법

### 1. `i18nexus.config.json` 설정

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
    "framework": "nextjs-app",
    "ignorePatterns": []
  }
}
```

### 2. 설정 옵션 설명

| 옵션               | 타입       | 필수 | 설명                                            |
| ------------------ | ---------- | ---- | ----------------------------------------------- |
| `enabled`          | `boolean`  | ✅   | 네임스페이스 모드 활성화 여부 (기본값: `false`) |
| `basePath`         | `string`   | ✅   | 페이지/라우트의 기준이 되는 폴더 경로           |
| `defaultNamespace` | `string`   | ✅   | `basePath` 외부 파일의 기본 네임스페이스        |
| `framework`        | `string`   | ❌   | 프레임워크 타입 (특수 패턴 처리용)              |
| `ignorePatterns`   | `string[]` | ❌   | 사용자 정의 무시 패턴 (정규식)                  |

### 3. 프레임워크별 `basePath` 예시

| 프레임워크           | `basePath` 예시                   |
| -------------------- | --------------------------------- |
| Next.js App Router   | `"src/app"`                       |
| Next.js Pages Router | `"src/pages"`                     |
| TanStack Router      | `"src/routes"`                    |
| React Router         | `"src/pages"` 또는 `"src/routes"` |
| Remix                | `"app/routes"`                    |

---

## 동작 원리

### 1. Extractor 실행 흐름

```
1. 파일 스캔 (glob 패턴)
   ↓
2. 각 파일별 처리:
   a. 네임스페이스 추론 (파일 경로 분석)
   b. 네임스페이스 검증 (useTranslation 인자 확인)
   c. t() 호출 추출
   d. 네임스페이스별 키 분리 저장
   ↓
3. 네임스페이스별 파일 생성:
   - locales/{namespace}/ko.json
   - locales/{namespace}/en.json
```

### 2. 네임스페이스 추론 알고리즘

```typescript
function inferNamespace(filePath: string, config: NamespacingConfig): string {
  // 1. basePath 외부 파일인지 확인
  if (!isInsideBasePath(filePath, config.basePath)) {
    return config.defaultNamespace; // "common"
  }

  // 2. basePath 기준 상대 경로 추출
  const relativePath = getRelativePath(filePath, config.basePath);
  // 예: "(main)/dashboard/_components/Chart.tsx"

  // 3. 프레임워크별 특수 패턴 제거
  const cleanedPath = removeFrameworkPatterns(
    relativePath,
    config.framework,
    config.ignorePatterns
  );
  // 예: "dashboard/Chart.tsx"

  // 4. 첫 번째 폴더명 추출
  const firstPart = cleanedPath.split("/")[0];
  // 예: "dashboard"

  // 5. 특수 파일명 체크
  if (isSpecialFileName(firstPart)) {
    return config.defaultNamespace;
  }

  return firstPart; // "dashboard"
}
```

### 3. 네임스페이스 검증 알고리즘

```typescript
function validateNamespace(
  filePath: string,
  code: string,
  expectedNamespace: string,
  config: NamespacingConfig
): { valid: boolean; error?: string } {
  // 1. 파일 내 useTranslation 호출 찾기
  const useTranslationCalls = findUseTranslationCalls(filePath, code);

  // 2. 각 호출 검증
  for (const call of useTranslationCalls) {
    if (call.namespace === undefined) {
      return {
        valid: false,
        error: `Namespace required. Please use useTranslation("${expectedNamespace}").`,
      };
    }

    if (call.namespace !== expectedNamespace) {
      return {
        valid: false,
        error: `Namespace mismatch. Expected "${expectedNamespace}", but found "${call.namespace}".`,
      };
    }
  }

  return { valid: true };
}
```

### 4. 파일 저장 로직

```typescript
function writeOutputFileWithNamespace(
  data: any,
  config: OutputConfig & { namespace: string }
): void {
  // 1. 네임스페이스 디렉토리 생성
  const namespaceDir = path.join(config.outputDir, config.namespace);
  // 예: "locales/dashboard"

  // 2. 각 언어별 파일 생성
  for (const lang of config.languages) {
    const langFile = path.join(namespaceDir, `${lang}.json`);
    // 예: "locales/dashboard/ko.json"

    // 3. 기존 번역 파일 읽기 (있다면)
    let existingTranslations = {};
    if (fs.existsSync(langFile)) {
      existingTranslations = JSON.parse(fs.readFileSync(langFile, "utf-8"));
    }

    // 4. 새 키 병합
    const mergedTranslations = {
      ...existingTranslations,
      ...data, // 새로 추출된 키
    };

    // 5. 파일 저장
    fs.writeFileSync(langFile, JSON.stringify(mergedTranslations, null, 2));
  }
}
```

---

## 사용 예시

### 예시 1: Next.js App Router 프로젝트

**파일 구조:**

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── Chart.tsx
│   └── settings/
│       └── page.tsx
└── components/
    └── shared/
        └── Button.tsx
```

**설정 (`i18nexus.config.json`):**

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

**코드 예시:**

```typescript
// src/app/dashboard/page.tsx
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation('dashboard'); // ✅ 네임스페이스 일치

  return <h1>{t('welcome')}</h1>;
}
```

```typescript
// src/app/dashboard/_components/Chart.tsx
import { useTranslation } from 'react-i18next';

export function Chart() {
  const { t } = useTranslation('dashboard'); // ✅ 같은 네임스페이스 (co-location)

  return <div>{t('chart.title')}</div>;
}
```

```typescript
// src/components/shared/Button.tsx
import { useTranslation } from 'react-i18next';

export function Button() {
  const { t } = useTranslation('common'); // ✅ basePath 외부 → "common"

  return <button>{t('submit')}</button>;
}
```

**추출 결과:**

```
locales/
├── dashboard/
│   ├── ko.json
│   │   {
│   │     "welcome": "대시보드에 오신 것을 환영합니다",
│   │     "chart.title": "차트"
│   │   }
│   └── en.json
│       {
│         "welcome": "",
│         "chart.title": ""
│       }
└── common/
    ├── ko.json
    │   {
    │     "submit": "제출"
    │   }
    └── en.json
        {
          "submit": ""
        }
```

### 예시 2: 에러 케이스

```typescript
// src/app/dashboard/page.tsx
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation('settings'); // ❌ 네임스페이스 불일치

  return <h1>{t('welcome')}</h1>;
}
```

**에러 메시지:**

```
[i18nexus-tools] Namespace Mismatch in src/app/dashboard/page.tsx:4.
File path resolves to namespace "dashboard", but found useTranslation("settings").
Please use useTranslation("dashboard").
```

### 예시 3: 마이그레이션 모드

검증을 스킵하고 키만 추출하려면:

```bash
# CLI 옵션으로 skipValidation 전달 (구현 필요)
# 또는 코드에서 직접 설정
const extractor = new TranslationExtractor({
  skipValidation: true
});
```

---

## 프레임워크별 처리

### Next.js App Router (`nextjs-app`)

**특수 패턴:**

- `(group)`: 라우트 그룹 (제거됨)
- `_private`: 프라이빗 폴더 (제거됨)
- `[dynamic]`: 동적 라우트 (제거됨)
- `[...catchall]`: Catch-all 라우트 (제거됨)

**예시:**

```
src/app/(main)/dashboard/_components/Chart.tsx
→ (main) 제거, _components 제거
→ dashboard/Chart.tsx
→ 네임스페이스: "dashboard"
```

### Next.js Pages Router (`nextjs-pages`)

**특수 패턴:**

- `[dynamic]`: 동적 라우트 (제거됨)
- `[...catchall]`: Catch-all 라우트 (제거됨)

**예시:**

```
src/pages/dashboard/[id].tsx
→ [id] 제거
→ dashboard/.tsx
→ 네임스페이스: "dashboard"
```

### TanStack Router - 파일 기반 (`tanstack-file`)

**특수 규칙:**

- 파일명에서 네임스페이스 추출
- 점(.)으로 구분된 하위 경로는 첫 번째 부분만 사용

**예시:**

```
src/routes/dashboard.about.tsx
→ dashboard.about
→ 첫 번째 부분: "dashboard"
→ 네임스페이스: "dashboard"
```

### TanStack Router - 폴더 기반 (`tanstack-folder`)

**특수 패턴:**

- `_layout`: 레이아웃 파일 (제거됨)
- `_index`: 인덱스 파일 (제거됨)
- `$`: 동적 세그먼트 (제거됨)

**예시:**

```
src/routes/dashboard/_layout.tsx
→ _layout 제거
→ dashboard/.tsx
→ 네임스페이스: "dashboard"
```

### React Router (`react-router`)

**특수 패턴:** 없음

**예시:**

```
src/pages/dashboard/index.tsx
→ dashboard/index.tsx
→ 네임스페이스: "dashboard"
```

### Remix (`remix`)

**특수 패턴:**

- `$`: 동적 세그먼트 (제거됨)

**예시:**

```
app/routes/dashboard.$id.tsx
→ $id 제거
→ dashboard/.tsx
→ 네임스페이스: "dashboard"
```

---

## 마이그레이션 가이드

### 기존 프로젝트에서 네임스페이스 모드로 전환하기

#### 1단계: 설정 파일 업데이트

`i18nexus.config.json`에 `namespacing` 설정 추가:

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

#### 2단계: 검증 비활성화로 키 추출

처음에는 검증을 스킵하고 키만 추출:

```typescript
// 임시로 skipValidation 활성화
const extractor = new TranslationExtractor({
  skipValidation: true,
});
```

또는 CLI에 `--skip-validation` 옵션 추가 (구현 필요)

#### 3단계: 기존 번역 파일 분리

기존 `locales/ko.json`, `locales/en.json`을 네임스페이스별로 분리:

```bash
# 수동으로 또는 스크립트로 분리
# 예: dashboard 관련 키들을 locales/dashboard/ko.json으로 이동
```

#### 4단계: 코드에 네임스페이스 추가

모든 `useTranslation()` 호출에 네임스페이스 인자 추가:

```typescript
// 변경 전
const { t } = useTranslation();

// 변경 후
const { t } = useTranslation("dashboard");
```

#### 5단계: 검증 활성화

설정에서 `skipValidation: false`로 변경하고 extractor 실행:

```bash
npx i18n-extractor
```

에러가 발생하면 해당 파일의 `useTranslation` 인자를 수정합니다.

#### 6단계: i18next 설정 업데이트

`i18next` 설정을 도메인 우선 구조에 맞게 업데이트:

```typescript
// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "ko",
    defaultNS: "common",
    backend: {
      loadPath: "/locales/{{ns}}/{{lng}}.json", // 도메인 우선 구조
    },
    ns: ["common", "dashboard", "settings"],
    interpolation: {
      escapeValue: false,
    },
  });
```

---

## 주요 정책 및 원칙

### 1. Co-location 원칙

페이지 폴더 내의 모든 파일(컴포넌트, 훅, 유틸리티 등)은 같은 네임스페이스를 사용해야 합니다.

**예시:**

```
src/app/dashboard/
├── page.tsx          → useTranslation('dashboard')
├── layout.tsx        → useTranslation('dashboard')
├── _components/
│   └── Chart.tsx     → useTranslation('dashboard')
└── hooks/
    └── useDashboard.ts → useTranslation('dashboard')
```

### 2. 키 중복 허용

서로 다른 네임스페이스 파일 간의 키 중복은 허용됩니다.

**예시:**

```json
// locales/dashboard/ko.json
{
  "submit": "전송"
}

// locales/settings/ko.json
{
  "submit": "저장"  // ✅ 같은 키지만 다른 값 가능
}
```

### 3. 래퍼 파일도 네임스페이스 규칙 준수

`layout.tsx`, `template.tsx` 등 래퍼 파일도 자신이 위치한 최상위 폴더의 네임스페이스를 사용해야 합니다.

**예시:**

```typescript
// src/app/dashboard/layout.tsx
export default function DashboardLayout() {
  const { t } = useTranslation("dashboard"); // ✅ 필수
  // ...
}
```

---

## 문제 해결

### Q: 네임스페이스 검증 에러가 발생합니다

**A:** 파일 경로에서 추론된 네임스페이스와 `useTranslation` 인자가 일치하지 않습니다. 파일 경로를 확인하고 올바른 네임스페이스를 사용하세요.

### Q: 특수 폴더 패턴이 제대로 제거되지 않습니다

**A:** `framework` 설정이 올바른지 확인하세요. 또는 `ignorePatterns`에 사용자 정의 패턴을 추가하세요.

### Q: basePath 외부 파일이 잘못된 네임스페이스를 사용합니다

**A:** `defaultNamespace` 설정을 확인하세요. basePath 외부 파일은 항상 `defaultNamespace`를 사용합니다.

### Q: 레거시 모드로 되돌리고 싶습니다

**A:** `i18nexus.config.json`에서 `namespacing.enabled: false`로 설정하세요.

---

## 참고 자료

- [ver2.md 기획안](../ignore/ver2.md)
- [i18next 공식 문서](https://www.i18next.com/)
- [react-i18next 공식 문서](https://react.i18next.com/)

---

**작성 일자:** 2025년 1월
**버전:** 1.7.6
**관련 이슈:** 네임스페이스 자동화 구현
