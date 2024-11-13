# Version 1.7.5 Release Notes

> 릴리즈 노트는 커밋할 때마다 업데이트됩니다.

## 🎯 주요 변경사항

### Refactoring & Code Quality

#### 상수 분리 및 중앙화
- ✨ t-wrapper와 extractor의 모든 상수를 `constants.ts`로 분리
- 🔒 `Object.freeze`로 상수 불변성 보장
- 📦 Console 메시지, CLI 옵션, 문자열 상수, 정규식 패턴 등 체계적 관리

#### Console 출력 최소화
- 🎯 에러 메시지만 출력하도록 변경
- 📊 완료 리포트는 `PerformanceReporter`로 별도 제공
- 🧹 불필요한 진행 상황 메시지 제거

#### 코드 구조 개선
- 📁 t-wrapper와 extractor를 폴더 구조로 재구성
- 🔧 공통 로직을 `common/` 폴더로 이동
- 📦 모듈별 책임 분리 (ast-helpers, import-manager, ast-transformers 등)

### Testing

#### E2E 테스트 추가
- ✅ t-wrapper E2E 테스트 (7개 케이스)
- ✅ extractor E2E 테스트 (9개 케이스)
- 🧪 실제 파일 시스템을 사용한 통합 테스트

#### 테스트 코드 정리
- 🗑️ 불필요한 테스트 케이스 제거 (26개 → 21개)
- 🎯 핵심 기능에 집중한 테스트로 정리

### Rust Implementation

#### t-wrapper-rust 초기 셋업
- 🦀 Rust로 구현할 t-wrapper 프로젝트 구조 생성
- 📦 TypeScript 버전과 동일한 모듈 구조
- 🧪 초기 테스트 코드 셋업 완료

### Documentation

#### 문서 정리
- 🗑️ 불필요한 개발자용 문서 제거
- 📝 릴리즈 노트 작성 시작

---

## 📝 상세 변경사항

### Added

- `scripts/t-wrapper/constants.ts` - t-wrapper 상수 정의
- `scripts/extractor/constants.ts` - extractor 상수 정의
- `scripts/t-wrapper/index.e2e.test.ts` - t-wrapper E2E 테스트
- `scripts/extractor/index.e2e.test.ts` - extractor E2E 테스트
- `scripts/t-wrapper-rust/` - Rust 구현 초기 셋업
- `RELEASE_v1.7.5.md` - 릴리즈 노트

### Changed

- Console 출력 최소화 (에러만 출력)
- 상수 중앙화 및 Object.freeze 적용
- 코드 구조 개선 (폴더 구조로 재구성)

### Removed

- 불필요한 테스트 케이스 (5개)
- 개발자용 문서들 (MIGRATION_SEPARATION_COMPLETE.md, DEPLOYMENT_NOTES.md, PERFORMANCE_LOGGING.md, PERFORMANCE_MONITORING.md, RELEASE_v1.7.0.md, test.md)

---

## 🚀 다음 버전 계획

- Rust 구현 진행 (SWC 의존성 추가 및 AST 변환 로직 구현)
- 성능 최적화
- 추가 기능 개발

