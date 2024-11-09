# 테스트 코드 작성 가이드라인

## 테스트가 필요한 경우

### ✅ 테스트 작성 권장

1. **비즈니스 로직이 있는 함수**
   - 복잡한 조건 분기
   - 데이터 변환/가공 로직
   - 계산/집계 로직
   - 예: `transformFunctionBody`, `extractTranslationKey`, `generateOutputData`

2. **순수 함수 (Pure Functions)**
   - 입력 → 출력이 명확한 함수
   - 부작용(side effect)이 없는 함수
   - 예: `hasIgnoreComment`, `isReactComponent`, `escapeCsvValue`

3. **에러 처리 로직**
   - 커스텀 에러 메시지
   - 에러 복구 로직
   - 예: 파일 파싱 실패 처리

4. **복잡한 알고리즘**
   - AST 변환 로직
   - 템플릿 리터럴 → i18next 형식 변환
   - 예: TemplateLiteral 변환 로직

### ❌ 테스트 불필요한 경우

1. **단순 래퍼 함수**
   - 외부 라이브러리 호출만 하는 함수
   - 예: `parseWithBabel` (Babel parser 래퍼), `parseFile` (분기만 하는 래퍼)

2. **상수/설정 객체**
   - 단순 값 정의
   - TypeScript 타입 체크로 충분
   - 예: `COMMON_DEFAULTS`, `SCRIPT_CONFIG_DEFAULTS`

3. **단순 getter/setter**
   - 값 반환만 하는 함수
   - 예: `getExtractedKeys()` (단순 배열 변환)

4. **이미 잘 테스트된 라이브러리 래퍼**
   - `@babel/parser`, `@babel/generator` 등
   - 라이브러리 자체가 이미 테스트됨

5. **의미 없는 테스트**
   - `expect(true).toBe(true)` 같은 테스트
   - 실제 검증이 없는 테스트

## 테스트 작성 원칙

### 1. 테스트는 비즈니스 가치를 제공해야 함
- 버그를 찾을 수 있는 테스트
- 리팩토링 시 안전망 역할
- 문서화 역할 (사용 예시)

### 2. 테스트 비용 vs 이익 고려
- 테스트 작성/유지보수 비용
- 실제 버그 발견 가능성
- 리팩토링 시 도움 정도

### 3. 통합 테스트 vs 단위 테스트
- **단위 테스트**: 순수 함수, 독립적인 로직
- **통합 테스트**: 여러 모듈이 함께 작동하는 경우
- 단순 래퍼는 통합 테스트에서 자연스럽게 검증됨

## 현재 프로젝트 테스트 전략

### 테스트 작성 대상
- ✅ `ast-helpers.ts` - 순수 함수들 (hasIgnoreComment, isReactComponent 등)
- ✅ `ast-transformers.ts` - 복잡한 AST 변환 로직
- ✅ `key-extractor.ts` - 키 추출 로직
- ✅ `output-generator.ts` - 출력 생성 로직
- ✅ `extractor-utils.ts` - 유틸리티 함수들

### 테스트 불필요
- ❌ `parser-utils.ts` - Babel/SWC 래퍼
- ❌ `default-config.ts` - 상수 정의
- ❌ `import-manager.ts` - 단순 AST 노드 생성

## 예시

### 좋은 테스트 예시
```typescript
// 복잡한 로직이 있는 경우
describe("transformTemplateLiteral", () => {
  it("템플릿 리터럴을 i18next 형식으로 변환해야 함", () => {
    const input = "`안녕 ${name}`";
    const result = transformTemplateLiteral(input);
    expect(result).toBe("`안녕 {{name}}`");
  });
});
```

### 불필요한 테스트 예시
```typescript
// 단순 래퍼
describe("parseWithBabel", () => {
  it("코드를 파싱할 수 있어야 함", () => {
    // Babel이 이미 테스트됨, 우리가 테스트할 게 없음
  });
});

// 상수 객체
describe("COMMON_DEFAULTS", () => {
  it("값이 정의되어 있어야 함", () => {
    // TypeScript가 이미 체크함
  });
});
```

