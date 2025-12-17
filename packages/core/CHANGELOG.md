# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 🗑️ Removed

- **Deprecated `createServerI18n()` function removed**: Use `getTranslation()` instead
  - The deprecated function has been completely removed from the codebase
  - Migration: Replace `createServerI18n()` calls with `getTranslation()`
  - See [API Reference](./docs/api/server.md) for migration guide

### 📚 Documentation

- Updated API documentation to reflect `getTranslation()` as the primary server function
- Removed references to deprecated `createServerI18n()` from documentation

## [3.4.1] - 2025-12-06

### 🐛 Bug Fixes

- **클라이언트 번들 오류 해결**: 메인 export에서 서버 코드 제거
  - 클라이언트에서 `import { useLanguageSwitcher } from "i18nexus"` 시 fs 모듈 오류 수정
  - 서버 유틸리티는 `i18nexus/server`에서만 import 가능
  - 클라이언트 번들 크기 감소 및 빌드 오류 해결

### 🔄 Breaking Changes

- **서버 함수 import 경로 변경**: 메인 export에서 서버 함수 제거
  - ❌ 더 이상 작동하지 않음: `import { getTranslation } from "i18nexus"`
  - ✅ 올바른 사용법: `import { getTranslation } from "i18nexus/server"`
  - 영향: 서버 컴포넌트에서 메인 패키지로 서버 함수를 import하던 코드

### 📋 마이그레이션 가이드

**이전 코드 (v3.4.0):**

```typescript
import { getTranslation } from "i18nexus"; // ❌ 더 이상 작동하지 않음
```

**새로운 코드 (v3.4.1+):**

```typescript
import { getTranslation } from "i18nexus/server"; // ✅ 올바른 사용법
```

---

## [3.4.0] - 2025-12-06

### ✨ Features

- **타입 Export 추가**: Type augmentation을 위한 server 관련 타입 export
  - `GetTranslationReturn`, `GetTranslationOptions`, `ServerTranslationVariables` export
  - `i18nexus-tools`가 원본 타입을 재사용할 수 있도록 개선

### 🔄 Breaking Changes

- **타입 시스템 개선**: 생성된 타입 파일이 원본 패키지 타입을 재사용
  - `i18nexus-tools@2.4.0` 이상 필요
  - `npx i18n-extractor` 재실행으로 타입 재생성 필요
  - 대부분의 프로젝트에서 코드 변경 불필요 (사용 방법 동일)

---

## [3.3.4] - 2025-12-06

### 🐛 Bug Fixes

- **`getTranslation`에 `language` 옵션 추가**: Static Export 환경에서 명시적 언어 전달 가능
  - `language` 옵션으로 쿠키/헤더 감지 우회 가능
  - Next.js Static Export (`output: "export"`) 환경에서 필수
  - `params.lng`를 직접 전달 가능

---

## [3.3.3] - 2025-12-06

### 🐛 Bug Fixes

- **서버 번역 경로 해석 개선**: `i18nexus.config.json` 파일 위치를 기준으로 경로 계산
  - `process.cwd()` 대신 config 파일 디렉토리를 기준으로 `localesDir` 해석
  - Next.js 빌드 환경에서 경로 해석 오류 해결
  - "Cannot find module './locales/common/ko.json'" 오류 수정

- **서버 번역 함수 수정**: `createServerTranslation`과 `getServerTranslations`에서 translations 구조 올바르게 해석
  - `translations` 구조: `{ [namespace]: { [key]: value } }` (언어별 파일에서 이미 로드됨)
  - 이전에는 `translations[language]`로 접근하여 항상 빈 객체 반환
  - 이제 모든 namespace의 번역을 병합하여 사용

- **디버깅 개선**: 개발 환경에서 번역 파일 로드 및 키 누락 경고 추가

---

## [3.3.2] - 2025-12-06

### 🐛 Bug Fixes

- **서버 번역 파일 로딩 수정**: `getTranslation`에서 동적 import 대신 fs를 사용하여 파일 직접 읽기
  - Next.js 서버 컴포넌트에서 번역 파일을 찾지 못하는 문제 해결
  - `./locales/common/ko.json` 경로 오류 해결
  - 서버 환경에서는 fs를 사용하여 파일을 직접 읽도록 변경

---

## [3.3.1] - 2025-12-06

### 🗑️ Breaking Changes

- **레거시 API 제거**: `createI18n`, `createI18nWithConfig`, `config-loader` 제거
  - `createI18n`은 v3.1부터 deprecated 되었으며 v3.3.1에서 완전히 제거됨
  - 대신 `I18nProvider`와 `useTranslation` 사용을 권장
  - 이 변경으로 클라이언트 번들에서 `fs` 모듈이 제거되어 번들 크기 감소 및 빌드 오류 해결

### ✨ Features

- **서버 유틸리티 개선**: `server.ts`에서 config 로딩을 내부적으로 처리
  - `loadConfigSilently` 함수를 server.ts 내부로 이동
  - `callsite-inference.ts`에서 타입 정의를 직접 정의하여 순환 참조 제거

### 🐛 Bug Fixes

- **클라이언트 번들 오류 해결**: `fs` 모듈이 클라이언트 번들에 포함되는 문제 해결
  - Next.js에서 "Module not found: Can't resolve 'fs'" 오류 해결
  - 레거시 API 제거로 서버 전용 코드가 클라이언트 번들에 포함되지 않음

---

## [3.3.0] - 2025-12-06

### ✨ Features

- **`useLanguageSwitcher` 훅 추가**: 언어 전환 기능을 제공하는 훅 추가
- **타입 안전성 개선**: TypeScript 타입 정의 개선
