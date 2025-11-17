# Rust 마이그레이션 구현 상태

TypeScript `t-wrapper`와 비교한 Rust 구현 현황 및 남은 작업 목록.

## ✅ 완료된 작업

### 1. 프로젝트 구조
- [x] Cargo 프로젝트 초기화
- [x] TypeScript와 1:1 파일 구조 매핑
- [x] 기본 모듈 파일 생성 (`lib.rs`, `main.rs`)
- [x] 상수 정의 (`constants.rs`)

### 2. 기본 인프라
- [x] CLI 인자 파싱 (`main.rs`)
- [x] 설정 구조체 (`ScriptConfig`)
- [x] 기본 에러 처리 (`anyhow`)

### 3. 테스트 스켈레톤
- [x] Unit test 구조 (`#[cfg(test)]`)
- [x] Integration test 구조 (`tests/`)

## 🚧 부분 구현 (TODO 포함)

### 1. AST 파싱 및 변환
- [ ] **SWC 파서 통합** (Cargo.toml에 주석 처리됨)
  - `swc_ecma_parser` 버전 호환성 확인 필요
  - 파일을 AST로 파싱하는 로직
- [ ] **AST Traverse 구현**
  - `swc_ecma_visit`의 `Visit` 트레이트 구현
  - 함수 선언, 화살표 함수 탐색
  - React 컴포넌트 감지

### 2. AST 변환 로직 (`ast_transformers.rs`)
현재: 정규식으로 한국어만 체크 (임시)

구현 필요:
- [ ] **StringLiteral 변환**
  - 한국어 포함 문자열을 `t("문자열")`로 변환
  - JSX 속성 처리 (`jsxExpressionContainer`)
  - `i18n-ignore` 주석 체크
  - `shouldSkipPath` 로직 (이미 t()로 래핑된 경우 등)

- [ ] **TemplateLiteral 변환**
  - `안녕 ${name}` → `t("안녕 {{name}}", { name })`
  - 표현식 추출 및 변수명 생성
  - 멤버 표현식 처리 (`user.name` → `user_name`)
  - 복잡한 표현식 처리 (`expr0`, `expr1` 등)

- [ ] **JSXText 변환**
  - JSX 내부 텍스트를 `{t("텍스트")}`로 변환
  - 공백/빈 텍스트 스킵

### 3. Import 관리 (`import_manager.rs`)
현재: 문자열만 반환 (임시)

구현 필요:
- [ ] **useTranslation 훅 생성**
  - SWC AST 노드로 `const { t } = useTranslation();` 생성
  - 함수 body 시작 부분에 삽입

- [ ] **Import 추가/중복 방지**
  - 기존 import 확인
  - `useTranslation`이 없으면 추가
  - import가 아예 없으면 새로 생성
  - 같은 소스의 다른 import와 병합

- [ ] **서버 함수 Import**
  - `mode: "server"`일 때 `getServerTranslation` import
  - `serverTranslationFunction` 옵션 지원

### 4. TranslationWrapper (`translation_wrapper.rs`)
현재: 파일 읽기만 구현, 실제 변환 없음

구현 필요:
- [ ] **파일 파싱**
  - SWC로 파일을 AST로 변환
  - 파싱 옵션 설정 (tsx, decorators 등)

- [ ] **컴포넌트 탐색 및 변환**
  - `FunctionDeclaration` 탐색
  - `ArrowFunctionExpression` 탐색
  - `isReactComponent` 체크
  - 각 컴포넌트 body 변환

- [ ] **Mode 처리**
  - `mode: "client"`: `'use client'` 디렉티브 추가
  - `mode: "server"`: `async` 함수 변환, 서버 함수 주입
  - `createServerTBinding` 구현

- [ ] **코드 생성 및 쓰기**
  - SWC AST를 코드로 변환
  - 원본 포맷팅/주석 유지
  - 파일에 쓰기

### 5. AST 헬퍼 (`ast_helpers.rs`)
현재: 기본 함수만 구현

구현 필요:
- [ ] **hasIgnoreComment**
  - SWC AST의 주석 노드 확인
  - 부모 노드 주석 확인
  - 소스코드 직접 검사 (fallback)

- [ ] **shouldSkipPath**
  - 이미 t()로 래핑된 경우
  - import 구문 내부
  - 객체 프로퍼티 KEY

### 6. 성능 모니터링
- [ ] PerformanceMonitor 통합
- [ ] Sentry 연동
- [ ] 성능 리포트 출력

### 7. 병렬 처리
- [ ] Rayon 통합
- [ ] `par_iter()`로 파일 병렬 처리
- [ ] 파이프라인 설계 (읽기 → 변환 → 쓰기)

## 📊 구현 진행률

| 모듈 | 진행률 | 상태 |
|------|--------|------|
| 프로젝트 구조 | 100% | ✅ 완료 |
| 상수 정의 | 100% | ✅ 완료 |
| CLI 파싱 | 80% | 🚧 기본만 |
| AST 파싱 | 0% | ❌ 미구현 |
| AST 변환 | 5% | ❌ 임시 구현만 |
| Import 관리 | 10% | ❌ 문자열만 |
| TranslationWrapper | 20% | 🚧 파일 읽기만 |
| 테스트 | 30% | 🚧 스켈레톤만 |

**전체 진행률: 약 25%**

## 🎯 우선순위별 구현 계획

### Phase 1: 기본 동작 (필수)
1. SWC 파서 통합 및 버전 확정
2. 파일 파싱 → AST 변환
3. StringLiteral 변환 (가장 기본)
4. 코드 생성 및 파일 쓰기
5. 기본 E2E 테스트

### Phase 2: 핵심 기능
1. TemplateLiteral 변환
2. JSXText 변환
3. Import 관리
4. useTranslation 훅 주입
5. Mode 옵션 (client/server)

### Phase 3: 고급 기능
1. 서버 함수 주입 (`createServerTBinding`)
2. `'use client'` 디렉티브 추가
3. `i18n-ignore` 주석 처리
4. `shouldSkipPath` 로직

### Phase 4: 최적화
1. 병렬 처리 (Rayon)
2. 성능 모니터링
3. 에러 처리 개선
4. 벤치마크 및 최적화

## 🔧 기술적 도전 과제

### 1. SWC AST vs Babel AST
- **문제**: SWC AST 구조가 Babel과 다름
- **해결**: SWC AST 기준으로 직접 구현 (Babel 호환 목표 아님)

### 2. 방문자 패턴
- **문제**: TypeScript의 `traverse` API와 Rust의 `Visit` 트레이트 차이
- **해결**: SWC의 방문자 패턴 학습 및 적용

### 3. AST 노드 생성
- **문제**: TypeScript의 `t.callExpression()` 같은 빌더 API가 없음
- **해결**: SWC AST 노드 직접 생성

### 4. 코드 생성
- **문제**: 원본 포맷팅/주석 유지
- **해결**: SWC의 코드 생성 옵션 활용

## 📝 다음 단계 체크리스트

### 즉시 시작 가능
- [ ] SWC 의존성 버전 조사 및 통합
- [ ] 간단한 파일 파싱 테스트
- [ ] AST 구조 이해 및 탐색

### 단기 (1-2주)
- [ ] StringLiteral 변환 구현
- [ ] 기본 코드 생성 및 쓰기
- [ ] 첫 번째 E2E 테스트 통과

### 중기 (1개월)
- [ ] 모든 변환 로직 구현
- [ ] Mode 옵션 완전 지원
- [ ] TypeScript 테스트와 동일한 E2E 시나리오

### 장기 (2-3개월)
- [ ] 병렬 처리 구현
- [ ] 성능 벤치마크 및 최적화
- [ ] 프로덕션 배포 준비

