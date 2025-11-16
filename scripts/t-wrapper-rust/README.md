# t-wrapper-rust 구조 매핑 (TS 동등성)

이 프로젝트는 TypeScript `scripts/t-wrapper/`와 1:1로 대응되는 구조를 가집니다.

## 소스 코드 매핑
- TS: `scripts/t-wrapper/constants.ts` ↔ Rust: `src/constants.rs`
- TS: `scripts/t-wrapper/ast-helpers.ts` ↔ Rust: `src/ast_helpers.rs`
- TS: `scripts/t-wrapper/ast-transformers.ts` ↔ Rust: `src/ast_transformers.rs`
- TS: `scripts/t-wrapper/import-manager.ts` ↔ Rust: `src/import_manager.rs`
- TS: `scripts/t-wrapper/translation-wrapper.ts` ↔ Rust: `src/translation_wrapper.rs`
- TS: `scripts/t-wrapper/index.ts` ↔ Rust: `src/main.rs` (CLI) / `src/lib.rs` (라이브러리)

## 테스트 매핑
- TS Unit
  - `ast-helpers.test.ts` ↔ `tests/ast_helpers_test.rs`
  - `ast-transformers.test.ts` ↔ `tests/ast_transformers_test.rs`
  - `import-manager.test.ts` ↔ `tests/import_manager_test.rs`
  - `translation-wrapper.test.ts` ↔ `tests/translation_wrapper_test.rs`
- TS E2E
  - `index.e2e.test.ts`의 시나리오를 Rust 통합 테스트로 단계적으로 반영 예정

## 다음 단계 체크리스트
- [ ] SWC 파서 통합 버전 확정 및 AST 방문자 설계
- [ ] `translation_wrapper` 병렬 처리 스레드/파이프라인 설계
- [ ] E2E에 해당하는 통합 테스트 시나리오 구현
- [ ] TS `mode`/`serverTranslationFunction` 설정 대응 옵션 설계

# t-wrapper-rust

Rust로 구현된 t-wrapper. SWC를 사용하여 고성능 AST 변환을 수행합니다.

## 구조

- `src/main.rs`: CLI 진입점
- `src/lib.rs`: 라이브러리 진입점
- `src/parser.rs`: 파일 파싱 모듈
- `src/transformer.rs`: AST 변환 모듈
- `src/utils.rs`: 유틸리티 함수

## 빌드

```bash
cargo build
```

## 실행

```bash
cargo run
```
