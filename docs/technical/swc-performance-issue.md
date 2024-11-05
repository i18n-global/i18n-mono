# SWC 성능 문제 분석

## 왜 SWC가 느린가?

### 예상 vs 실제

**예상:**

- SWC는 Rust로 작성되어 네이티브 성능
- 파싱 자체는 Babel보다 20배 빠름
- 전체 프로세스도 3-10배 빠를 것으로 예상

**실제:**

- SWC 파싱: 빠름 ✅
- 전체 프로세스: Babel보다 **52% 느림** ❌

## 문제의 핵심

### 1. AST 구조 불일치

```typescript
// swc-utils.ts
const ast = parseSync(code, { ... });  // SWC AST 생성
return ast as unknown as t.File;       // ⚠️ 타입 캐스팅만!
```

**SWC AST 구조:**

```javascript
{
  type: "Module",
  body: [...],
  // SWC 자체 구조
}
```

**Babel AST 구조:**

```javascript
{
  type: "File",
  program: {
    type: "Program",
    body: [...],
    // Babel 구조
  }
}
```

### 2. Babel Traverse의 비효율

우리 코드는 **Babel traverse**를 광범위하게 사용합니다:

```typescript
// t-wrapper.ts에서 8곳에서 사용
traverse(ast, {
  ImportDeclaration: (path) => { ... },
  StringLiteral: (path) => { ... },
  VariableDeclaration: (path) => { ... },
  // ...
});
```

**문제:**

- `traverse`는 Babel AST 구조를 기대함
- SWC AST를 받으면 구조가 달라서:
  1. 노드 탐색 실패 → 재시도
  2. 타입 체크 실패 → 추가 검증
  3. 경로(path) 생성 실패 → 폴백 로직
  4. 메모리 할당 증가

### 3. 실제 성능 측정 결과

```
Babel:
- 총 시간: 194ms
- 파싱: 107ms
- 읽기: 87ms

SWC:
- 총 시간: 296ms (52% 느림)
- 파싱: 200ms (86% 느림!) ⚠️
- 읽기: 97ms
```

**파싱 단계가 더 느린 이유:**

- SWC 파싱 자체는 빠름
- 하지만 `traverse`가 SWC AST를 처리하는 과정에서:
  - 구조 불일치로 인한 추가 검사
  - 타입 변환 시도
  - 에러 처리 오버헤드

## 왜 SWC를 쓰면 빨라질 거라고 했나?

### 이론적 배경

1. **SWC 파싱 속도**: Rust 네이티브 → 매우 빠름
2. **일반적인 사용 사례**: Next.js, Vite 등에서 SWC 사용 시 10-20배 빠름
3. **우리의 가정**: 파싱이 빠르면 전체도 빠를 것

### 실제 차이점

**일반적인 SWC 사용 (빠름):**

```
코드 → SWC 파싱 → SWC 변환 → 코드 생성
(모두 SWC 내부에서 처리)
```

**우리의 SWC 사용 (느림):**

```
코드 → SWC 파싱 → Babel traverse → Babel 변환 → 코드 생성
       (빠름)     (비효율)          (빠름)
```

## 해결 방법

### 방법 1: SWC AST → Babel AST 변환 (권장)

```typescript
import { swcToBabel } from '@swc/babel-adapter'; // 가상의 라이브러리

export function parseFileWithSwc(code: string): t.File {
  const swcAst = parseSync(code, { ... });
  const babelAst = swcToBabel(swcAst);  // 실제 변환
  return babelAst;
}
```

**장점:**

- SWC의 빠른 파싱 활용
- Babel traverse와 호환
- 변환 오버헤드가 파싱 이득보다 작을 수 있음

**단점:**

- 변환 라이브러리 필요 (존재하지 않을 수 있음)
- 변환 오버헤드 추가

### 방법 2: SWC Transform 후 Babel 파싱

```typescript
export function parseFileWithSwc(code: string): t.File {
  // SWC로 TypeScript → JavaScript 변환
  const { code: jsCode } = transformSync(code, {
    jsc: { parser: { syntax: 'typescript', tsx: true } }
  });

  // 변환된 JS를 Babel로 파싱
  return babelParse(jsCode, { ... });
}
```

**장점:**

- SWC의 빠른 변환 활용
- Babel AST 구조 보장

**단점:**

- 이중 파싱 오버헤드
- 주석, 포맷팅 손실 가능

### 방법 3: SWC AST 직접 사용 (대규모 리팩토링)

```typescript
// Babel traverse 대신 SWC visitor 사용
import { visit } from '@swc/core';

visit(swcAst, {
  visitImportDeclaration(path) { ... },
  visitStringLiteral(path) { ... },
});
```

**장점:**

- SWC의 모든 성능 이점 활용
- 네이티브 성능

**단점:**

- 전체 코드베이스 리팩토링 필요
- SWC visitor API 학습 필요
- 개발 시간 증가

### 방법 4: 현재 상태 유지 (현실적)

**Babel 사용 (현재):**

- 안정적이고 빠름
- 검증된 코드
- 추가 작업 불필요

**SWC 옵션 유지:**

- 실험적 기능으로 표시
- 향후 개선 가능성 열어둠

## 결론

### 핵심 요약

**SWC가 느린 이유 (한 줄 요약):**

> SWC 파싱은 빠르지만, **Babel traverse를 사용하기 때문에** 느려집니다.

**상세:**

1. ✅ SWC 파싱: 빠름 (Rust 네이티브)
2. ❌ Babel traverse: SWC AST 구조를 처리 못함 → 비효율
3. ❌ 타입 캐스팅만 하고 실제 변환 없음

### 해결책 우선순위

1. **현재 (권장)**: Babel 사용
   - 안정적이고 빠름
   - 검증된 코드
   - 추가 작업 불필요

2. **향후 개선 옵션**:
   - **옵션 A**: SWC AST → Babel AST 변환 라이브러리 도입
     - `swc-to-babel` 같은 라이브러리 검토 필요
     - 변환 오버헤드 vs 파싱 이득 비교 필요
   - **옵션 B**: SWC transform 후 Babel 파싱
     - 이중 파싱 오버헤드 있음
     - 주석/포맷팅 손실 가능
   - **옵션 C**: SWC AST 직접 사용 (대규모 리팩토링)
     - Babel traverse → SWC visitor로 전환
     - 최대 성능 이점, 하지만 개발 시간 많이 필요

### 교훈

- ⚠️ **파서 속도 ≠ 전체 프로세스 속도**
- ⚠️ **AST 구조 호환성이 성능에 결정적**
- ✅ **실제 측정이 중요** (이론과 다를 수 있음)
