# t-wrapper-rust (내가 구현하려고 적는 러프한 메모)

TS `scripts/t-wrapper/`랑 완전 동일한 파일 구조로 맞춘다. 이름/역할 1:1.

## 파일 구조 매핑 (TS ↔ Rust)
- constants: `scripts/t-wrapper/constants.ts` ↔ `src/constants.rs`
- ast-helpers: `scripts/t-wrapper/ast-helpers.ts` ↔ `src/ast_helpers.rs`
- ast-transformers: `scripts/t-wrapper/ast-transformers.ts` ↔ `src/ast_transformers.rs`
- import-manager: `scripts/t-wrapper/import-manager.ts` ↔ `src/import_manager.rs`
- translation-wrapper: `scripts/t-wrapper/translation-wrapper.ts` ↔ `src/translation_wrapper.rs`
- 엔트리: `scripts/t-wrapper/index.ts` ↔ `src/main.rs`(CLI) + `src/lib.rs`(lib)

## 테스트 매핑
- unit
  - `ast-helpers.test.ts` ↔ `tests/ast_helpers_test.rs`
  - `ast-transformers.test.ts` ↔ `tests/ast_transformers_test.rs`
  - `import-manager.test.ts` ↔ `tests/import_manager_test.rs`
  - `translation-wrapper.test.ts` ↔ `tests/translation_wrapper_test.rs`
- e2e
  - TS의 `index.e2e.test.ts` 시나리오를 rust 통합 테스트로 그대로 옮길 계획

## 체크리스트 (해야 할 것들)
- [ ] SWC 파서(swc_ecma_parser) 붙이기, 필요한 옵션만
- [ ] 방문자/트래버스 설계(문자열/템플릿/JSX만 타겟)
- [ ] 템플릿 → i18next 형식(`{{var}}`) + 객체 인자 변환
- [ ] import 추가/중복 방지, `t` 바인딩 보장
- [ ] `mode: client|server`, `serverTranslationFunction` 옵션 대응
- [ ] 병렬 처리(Rayon) + 파이프라인(읽기→변환→쓰기) 설계
- [ ] E2E 시나리오(드라이런 포함) 1:1 확인

## 메모
- Babel 호환 목표 아님. SWC AST 기준으로 필요한 부분만 구현
- 성능 우선: par_iter, 최소 변환, 불필요 I/O 줄이기
- 로그/에러는 TS 정책 따라 최소 출력
