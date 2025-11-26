# 커밋 메시지 가이드

## 기본 규칙

1. **2줄 이하로 작성** - 최대 2줄까지만 허용
2. **동사형 한국어로 작성** - 명사형이 아닌 동사형 사용
3. **최소한으로 작성** - 함수 이름을 길게 나열하지 말고 기능을 설명

## 형식

```
<type>: <설명>
```

### Type 접두사

- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `test:` - 테스트 추가/수정
- `refactor:` - 코드 리팩토링
- `chore:` - 빌드/설정 변경
- `docs:` - 문서 수정

## 좋은 예시 ✅

```bash
feat: useTranslation 훅 AST 노드 생성 구현
fix: visit_mut_expr 무한 재귀 방지
test: Rust E2E 테스트에 framework 옵션 검증 추가
feat: StringLiteral을 t() 호출로 실제 변환 구현
fix: Next.js 환경에서만 use client 디렉티브 추가하도록 수정
```

## 나쁜 예시 ❌

```bash
# ❌ 너무 길고 함수 이름 나열
feat: create_use_translation_hook와 add_import_if_needed 함수를 구현하고 TranslationTransformer에 함수 탐색 로직을 추가함

# ❌ 명사형 사용
feat: useTranslation 훅 AST 노드 생성 구현 완료

# ❌ 3줄 이상
feat: useTranslation 훅 AST 노드 생성 구현
추가로 import_manager에 add_import_if_needed 함수도 구현
그리고 translation_wrapper에 함수 탐색 로직 추가

# ❌ 기능 설명 없이 함수 이름만
feat: create_use_translation_hook 구현
```

## 작성 팁

1. **기능 중심으로 작성** - "무엇을" 했는지보다 "어떤 기능을" 추가/수정했는지
2. **간결하게** - 핵심만 전달
3. **일관성 유지** - 팀 내에서 동일한 스타일 사용

## 예시 비교

| 나쁜 예시 | 좋은 예시 |
|---------|---------|
| `feat: create_use_translation_hook 함수를 구현함` | `feat: useTranslation 훅 AST 노드 생성 구현` |
| `fix: visit_mut_expr에서 무한 재귀가 발생하는 문제를 해결함` | `fix: visit_mut_expr 무한 재귀 방지` |
| `test: Rust E2E 테스트에 framework 옵션 검증을 추가함` | `test: Rust E2E 테스트에 framework 옵션 검증 추가` |

