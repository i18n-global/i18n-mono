# Namespace Location 사용 예시

## 설정 방법

`i18nexus.config.json`에 `namespaceLocation`을 추가하면, 해당 경로의 최상위 폴더가 자동으로 네임스페이스가 됩니다.

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{js,jsx,ts,tsx}",
  "translationImportSource": "i18nexus",
  "namespaceLocation": "app",
  "fallbackNamespace": "common"
}
```

## 폴더 구조 예시

### 데모 앱의 경우

```
app/
├── admin/
│   ├── dashboard/
│   │   └── page.tsx      → namespace: "admin"
│   └── login/
│       └── page.tsx      → namespace: "admin"
├── docs/
│   ├── i18nexus/
│   │   └── page.tsx      → namespace: "docs"
│   └── i18nexus-tools/
│       └── page.tsx      → namespace: "docs"
├── showcase/
│   ├── page.tsx          → namespace: "showcase"
│   └── submit/
│       └── page.tsx      → namespace: "showcase"
└── page.tsx              → namespace: "common" (최상위는 defaultNamespace)
```

## 추출 결과

`npx i18n-extractor` 실행 시:

```
locales/
├── admin/
│   ├── en.json
│   └── ko.json
├── docs/
│   ├── en.json
│   └── ko.json
├── showcase/
│   ├── en.json
│   └── ko.json
└── common/
    ├── en.json
    └── ko.json
```

## 장점

1. **자동화**: 폴더 구조에 따라 자동으로 네임스페이스 결정
2. **확장성**: 새로운 페이지 추가 시 자동으로 네임스페이스 분리
3. **관리 용이**: 도메인별로 번역 파일이 분리되어 관리 편함
4. **타입 안전성**: `createI18n`과 함께 사용 시 네임스페이스별 타입 추론 가능

## 고급 사용법

### Next.js 그룹 라우팅과 함께 사용

```json
{
  "namespaceLocation": "app/(routes)",
  "namespacing": {
    "framework": "nextjs-app",
    "defaultNamespace": "common"
  }
}
```

```
app/
├── (routes)/
│   ├── shop/
│   │   └── page.tsx      → namespace: "shop"
│   └── profile/
│       └── page.tsx      → namespace: "profile"
└── (auth)/
    └── login/
        └── page.tsx      → namespace: "common" (namespaceLocation 외부)
```

### 사용자 정의 패턴 무시

```json
{
  "namespaceLocation": "src/pages",
  "namespacing": {
    "framework": "nextjs-pages",
    "ignorePatterns": [
      "\\[.*?\\]", // [dynamic] 무시
      "\\(.*?\\)", // (group) 무시
      "^_" // _private 무시
    ]
  }
}
```

## 마이그레이션

### 기존 단일 파일에서 네임스페이스 분리로 전환

1. **현재 상태** (단일 파일):

   ```
   locales/
   ├── en.json   (모든 키가 한 파일에)
   └── ko.json   (모든 키가 한 파일에)
   ```

2. **`namespaceLocation` 추가**:

   ```json
   {
     "namespaceLocation": "app"
   }
   ```

3. **extractor 재실행**:

   ```bash
   npx i18n-extractor
   ```

4. **결과** (네임스페이스별 분리):
   ```
   locales/
   ├── admin/
   │   ├── en.json
   │   └── ko.json
   ├── docs/
   │   ├── en.json
   │   └── ko.json
   └── common/
       ├── en.json
       └── ko.json
   ```

## 참고 문서

- `packages/tools/NAMESPACE_LOCATION_GUIDE.md`: 상세 가이드
- `packages/tools/scripts/extractor/namespace-inference.ts`: 구현 코드
