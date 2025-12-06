# Changelog

All notable changes to this project will be documented in this file.

## [2.3.10] - 2025-12-06

### ✨ Features

- **extractor 개선**: 기존 파일에도 `useLanguageSwitcher`와 `I18nProvider` 자동 import
  - 파일에 이미 `useTranslation` import가 있으면 자동으로 `useLanguageSwitcher`와 `I18nProvider`도 추가
  - wrapper 실행 시 기존 파일들도 자동으로 import 업데이트

---

## [2.3.9] - 2025-12-06

### ✨ Features

- **extractor 개선**: i18nexus 사용 시 자동으로 `useLanguageSwitcher`와 `I18nProvider` import 추가
  - 클라이언트 모드에서 `useTranslation` 사용 시 함께 필요한 import들을 자동으로 추가
  - `ensureMultipleNamedImports` 함수 추가로 여러 import를 한 번에 처리

---

## [2.3.8] - 2025-12-06

### 🐛 Bug Fixes

- **타입 생성기 수정**: `i18n-extractor`가 생성하는 타입 정의에 `useLanguageSwitcher` 추가
  - `declare module "i18nexus"`에서 `useLanguageSwitcher` 훅 타입 정의 포함
  - 이제 생성된 타입 정의 파일에서 `useLanguageSwitcher`를 정상적으로 import 가능
  - **i18nexus 사용자에 한해서만 추가**: `translationImportSource`가 `"i18nexus"`일 때만 `useLanguageSwitcher` 타입 정의 생성
  - 다른 i18n 라이브러리(예: `react-i18next`) 사용 시에는 생성되지 않음

---

## [2.3.7] - 2025-12-06

### 🐛 Bug Fixes

- **Server mode wrapper 수정**: `mode: "server"` 설정 시 `getServerTranslation` 생성 및 올바른 import source 사용
  - `i18nexus.config.json`에서 `mode`, `framework`, `serverTranslationFunction` 설정을 wrapper에 전달하도록 수정
  - 서버 모드일 때 import source에 `/server` 경로 자동 추가
  - 결과: `import { getServerTranslation } from "i18nexus/server"` (이전: `import { useTranslation } from "i18nexus"`)

---
