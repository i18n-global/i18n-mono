# 1. 시작하기 (필수 개념만 간단히)

목표: 현재 t-wrapper가 “코드 → AST → 변환 → 코드”로 동작하는 큰 흐름만 이해하기.

모르면 용어만 기억하고 공식 문서를 찾아보세요.

---

## 1) 우리가 하는 일 (한 줄 요약)
- 한국어 텍스트를 찾아 `t("...")`로 바꾸고, JSX에선 `{t("...")}`로 감쌉니다.

---

## 2) 어디서 보나 (파일 위치)
- 핵심 변환: `scripts/t-wrapper/ast-transformers.ts`
- 스킵/무시 규칙: `scripts/t-wrapper/ast-helpers.ts`
- 문자열/정규식 상수: `scripts/t-wrapper/constants.ts`
- SWC 시도 (참고): `scripts/swc-utils.ts` (지금은 Babel 권장)

---

## 3) 큰 흐름 (5단계)
1. 파일 읽기
2. 파싱 → AST 생성 (Babel 사용)
3. traverse(순회)로 노드 방문
4. 한국어 포함 텍스트만 `t("...")`로 교체
5. 결과 코드 생성 후 저장 (dry-run이면 미리보기만)

---

## 4) AST 최소 개념
- AST: 코드의 트리 구조. 노드 타입(예: `StringLiteral`, `TemplateLiteral`, `JSXText`)로 구성
- NodePath: 현재 노드 + 부모/형제 맥락까지 들고 있는 핸들
- Traverse: “타입별 방문 함수”를 등록해서 바꾸는 방식

예시 (핵심만):
```ts
path.traverse({
  StringLiteral(subPath) { /* "텍스트" */ },
  TemplateLiteral(subPath) { /* `템플릿 ${변수}` */ },
  JSXText(subPath) { /* <div>텍스트</div> */ },
});
```

---

## 5) 변환 규칙 (우리가 실제로 하는 판단)
- 공통 스킵 조건
  - `i18n-ignore` 주석이 있으면 건너뜀
  - 이미 `t("...")`로 감싸진 경우 건너뜀
  - 빈 문자열/공백만 있는 문자열은 무시
- 한국어 포함 여부 체크: `/[가-힣]/` 정규식
- 위치별 처리
  - 일반 문자열 → `t("...")`
  - JSX 텍스트 → `{t("...")}`
  - 템플릿 리터럴 → `t("문자 {{변수}}", { 변수 })` 형식으로 바꿈

---

## 6) 코드에서 바로 볼 포인트
- `ast-transformers.ts`
  - StringLiteral, TemplateLiteral, JSXText 핸들러가 어떻게 바꾸는지
  - JSX에서는 `t()`를 `JSXExpressionContainer`로 감싸는지 확인
- `ast-helpers.ts`
  - `hasIgnoreComment`, `shouldSkipPath`로 언제 건너뛰는지
- `constants.ts`
  - `TRANSLATION_FUNCTION`, `KOREAN_TEXT` 같은 상수 정의

---

## 7) 테스트로 빠르게 감 잡기
- E2E: `scripts/t-wrapper/index.e2e.test.ts` (여러 케이스 한 번에 확인)
- 단위: `ast-helpers.test.ts`, `ast-transformers.test.ts`

---

## 8) 다음 가이드
- `02-AST-기본.md`: 자주 쓰는 노드 타입과 속성
- `03-traverse-패턴.md`: 안전한 교체 패턴/주의점
- `04-SWC-소개.md`: SWC로 옮길 때 차이와 변환 전략
- `05-Rust-로드맵.md`: Rust 구현 시 모듈 구성 가이드

---

핵심만 기억: “한국어만 t()로, JSX는 {t()}, 템플릿은 {{변수}} + 객체 전달, ignore면 스킵”.


