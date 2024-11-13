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
