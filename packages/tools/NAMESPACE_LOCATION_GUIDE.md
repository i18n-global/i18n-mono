# Namespace Location Guide

`namespaceLocation`은 i18n 키를 자동으로 네임스페이스별로 추출할 수 있는 간편한 설정입니다.

## 기본 개념

`namespaceLocation`에 지정된 경로의 **최상위 폴더**가 자동으로 네임스페이스가 됩니다.

## 사용 예시

### 예시 1: Next.js App Router

```json
{
  "namespaceLocation": "app"
}
```

**폴더 구조:**

```
app/
├── admin/
│   ├── dashboard/
│   │   └── page.tsx  → namespace: "admin"
│   └── users/
│       └── page.tsx  → namespace: "admin"
├── blog/
│   ├── page.tsx      → namespace: "blog"
│   └── [slug]/
│       └── page.tsx  → namespace: "blog"
├── docs/
│   └── page.tsx      → namespace: "docs"
└── page.tsx          → namespace: "common" (최상위는 defaultNamespace 사용)
```

### 예시 2: 특정 하위 경로 지정

```json
{
  "namespaceLocation": "src/pages"
}
```

**폴더 구조:**

```
src/
├── pages/
│   ├── dashboard/
│   │   └── index.tsx  → namespace: "dashboard"
│   ├── settings/
│   │   └── index.tsx  → namespace: "settings"
│   └── index.tsx      → namespace: "common"
├── components/
│   └── Button.tsx     → namespace: "common" (namespaceLocation 외부)
```

### 예시 3: Next.js 그룹 라우팅

```json
{
  "namespaceLocation": "app/(routes)",
  "namespacing": {
    "framework": "nextjs-app"
  }
}
```

**폴더 구조:**

```
app/
├── (routes)/
│   ├── shop/
│   │   └── page.tsx   → namespace: "shop"
│   └── profile/
│       └── page.tsx   → namespace: "profile"
└── (auth)/
    └── login/
        └── page.tsx   → namespace: "common" (namespaceLocation 외부)
```

## 고급 설정

### defaultNamespace 설정

```json
{
  "namespaceLocation": "app",
  "namespacing": {
    "defaultNamespace": "global"
  }
}
```

`namespaceLocation` 외부 파일 또는 최상위 파일은 `defaultNamespace`를 사용합니다.

### 프레임워크별 특수 패턴 제거

```json
{
  "namespaceLocation": "app",
  "namespacing": {
    "framework": "nextjs-app",
    "defaultNamespace": "common"
  }
}
```

**지원하는 framework:**

- `"nextjs-app"`: Next.js App Router (기본값)
  - `(group)`, `_private`, `[dynamic]`, `[...catchall]` 제거
- `"nextjs-pages"`: Next.js Pages Router
  - `[dynamic]`, `[...catchall]` 제거
- `"tanstack-file"`: TanStack Router 파일 기반
- `"tanstack-folder"`: TanStack Router 폴더 기반
- `"react-router"`: React Router
- `"remix"`: Remix
- `"other"`: 기타

### 사용자 정의 무시 패턴

```json
{
  "namespaceLocation": "app",
  "namespacing": {
    "ignorePatterns": [
      "\\(.*?\\)", // 괄호로 감싸진 폴더 무시
      "^_.*", // 언더스코어로 시작하는 폴더 무시
      "\\[.*?\\]" // 대괄호로 감싸진 폴더 무시
    ]
  }
}
```

## 추출 결과

extractor를 실행하면 네임스페이스별로 파일이 생성됩니다:

```
locales/
├── admin/
│   ├── en.json
│   └── ko.json
├── blog/
│   ├── en.json
│   └── ko.json
├── docs/
│   ├── en.json
│   └── ko.json
└── common/
    ├── en.json
    └── ko.json
```

## 명령어 사용

```bash
# extractor 실행
npx i18n-extractor

# 특정 패턴만 추출
npx i18n-extractor --pattern "app/admin/**/*.tsx"

# 네임스페이스 확인 (dry-run)
npx i18n-extractor --dry-run
```

## 레거시 모드와의 비교

### 레거시 모드 (namespaceLocation 없음)

```json
{
  "localesDir": "./locales"
}
```

결과: `locales/en.json`, `locales/ko.json` (단일 파일)

### Namespace 모드 (namespaceLocation 사용)

```json
{
  "namespaceLocation": "app",
  "localesDir": "./locales"
}
```

결과: `locales/admin/en.json`, `locales/blog/ko.json` 등 (네임스페이스별 분리)

## 주의사항

1. `namespaceLocation`을 설정하면 자동으로 `namespacing.enabled: true`가 됩니다.
2. 기존 `namespacing` 설정이 있다면 병합됩니다.
3. `namespaceLocation`은 `namespacing.basePath`로 변환됩니다.
