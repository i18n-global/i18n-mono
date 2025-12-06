# Changelog

All notable changes to this project will be documented in this file.

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

---
