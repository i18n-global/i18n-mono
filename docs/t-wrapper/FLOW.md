# t-wrapper 작동 흐름

## 개요

`t-wrapper`는 TypeScript/JavaScript 파일에서 한국어 문자열을 자동으로 `t()` 함수 호출로 변환하는 도구입니다.

## 전체 흐름

```
입력 파일 (src/**/*.tsx)
    ↓
1. 파일 검색 (glob)
    ↓
2. 파일 읽기
    ↓
3. AST 파싱 (Babel/SWC)
    ↓
4. AST 변환
    ├─ 한국어 문자열 → t() 호출
    ├─ useTranslation 훅 추가 (클라이언트)
    ├─ getServerTranslation 바인딩 (서버)
    └─ use client 디렉티브 추가 (Next.js)
    ↓
5. 코드 생성
    ↓
6. 파일 쓰기 (dry-run이 아닌 경우)
    ↓
출력 파일 (변환된 코드)
```

## 단계별 상세 설명

### 1. 파일 검색

```typescript
// translation-wrapper.ts
const filePaths = glob.sync(this.config.sourcePattern);
```

- `sourcePattern`으로 파일 검색 (기본: `src/**/*.{js,jsx,ts,tsx}`)
- `glob` 패키지 사용

### 2. 파일 읽기

```typescript
const code = fs.readFileSync(filePath, "utf-8");
```

- 각 파일을 UTF-8로 읽기
- 소스코드 문자열 획득

### 3. AST 파싱

```typescript
// Babel 사용 (TypeScript)
const ast = parseFile(code, options);

// 또는 SWC 사용 (Rust)
let module = parse_file(code, options)?;
```

- 소스코드를 Abstract Syntax Tree (AST)로 변환
- Babel 또는 SWC 파서 사용

### 4. AST 변환

#### 4.1 한국어 문자열 감지 및 변환

```typescript
// ast-transformers.ts
StringLiteral: (path) => {
  if (한국어_체크(path.node.value)) {
    // "안녕하세요" → t("안녕하세요")
    path.replaceWith(t.callExpression(t.identifier("t"), [path.node]));
  }
}
```

**Rust 버전:**
```rust
// ast_transformers.rs
if let Expr::Lit(Lit::Str(str_lit)) = expr {
    let str_value: &str = &str_lit.value.to_string_lossy();
    if RegexPatterns::korean_text().is_match(str_value) {
        // t() 호출로 변환
    }
}
```

#### 4.2 React 컴포넌트 감지

```typescript
// ast-helpers.ts
function isReactComponent(name: string): boolean {
  return /^[A-Z]/.test(name); // 대문자로 시작
}
```

- 함수명이 대문자로 시작하면 React 컴포넌트로 간주
- 컴포넌트 내부의 문자열만 변환 대상

#### 4.3 번역 훅/함수 추가

**클라이언트 모드:**
```typescript
// import-manager.ts
const hook = createUseTranslationHook();
// const { t } = useTranslation();

// 함수 본문 시작 부분에 추가
functionBody.body.unshift(hook);
```

**서버 모드:**
```typescript
// translation-wrapper.ts
const binding = createServerTBinding("getServerTranslation");
// const { t } = await getServerTranslation();

// 함수 본문 시작 부분에 추가
functionBody.body.unshift(binding);
```

#### 4.4 use client 디렉티브 추가 (Next.js)

```typescript
// translation-wrapper.ts
if (framework === "nextjs" && mode === "client") {
  ensureUseClientDirective(ast);
  // "use client" 디렉티브 추가
}
```

### 5. 코드 생성

```typescript
// parser-utils.ts
const code = generateCode(ast);
```

- 변환된 AST를 다시 소스코드로 변환
- Babel Generator 또는 SWC Codegen 사용

### 6. 파일 쓰기

```typescript
if (!this.config.dryRun) {
  fs.writeFileSync(filePath, code, "utf-8");
}
```

- `dryRun`이 `false`인 경우에만 파일에 쓰기
- `dryRun`이 `true`면 변환만 확인하고 파일 수정 안 함

## 주요 모듈

### 1. `translation-wrapper.ts`
- **역할**: 전체 워크플로우 조율
- **주요 메서드**:
  - `processFiles()`: 파일 처리 메인 로직
  - `ensureUseClientDirective()`: use client 디렉티브 추가
  - `ensureNamedImport()`: import 문 추가

### 2. `ast-transformers.ts`
- **역할**: AST 노드 변환
- **주요 로직**:
  - `StringLiteral` → `t()` 호출
  - `TemplateLiteral` → i18next 형식
  - `JSXText` → `t()` 호출

### 3. `ast-helpers.ts`
- **역할**: AST 분석 유틸리티
- **주요 함수**:
  - `isReactComponent()`: React 컴포넌트 판단
  - `isServerComponent()`: 서버 컴포넌트 판단
  - `hasIgnoreComment()`: i18n-ignore 주석 체크

### 4. `import-manager.ts`
- **역할**: import 문 관리
- **주요 함수**:
  - `createUseTranslationHook()`: useTranslation 훅 생성
  - `addImportIfNeeded()`: import 문 추가

### 5. `parser.ts` (Rust)
- **역할**: 파일 파싱 및 코드 생성
- **주요 함수**:
  - `parse_file()`: 파일을 AST로 파싱
  - `generate_code()`: AST를 코드로 변환

## 변환 예시

### 입력

```tsx
function Component() {
  return <div>안녕하세요</div>;
}
```

### 출력 (클라이언트 모드, Next.js)

```tsx
"use client";
import { useTranslation } from "i18nexus";

function Component() {
  const { t } = useTranslation();
  return <div>{t("안녕하세요")}</div>;
}
```

### 출력 (서버 모드)

```tsx
async function Component() {
  const { t } = await getServerTranslation();
  return <div>{t("안녕하세요")}</div>;
}
```

## 설정 옵션

### `mode`
- `"client"`: `useTranslation()` 훅 사용
- `"server"`: `getServerTranslation()` 함수 사용

### `framework`
- `"nextjs"`: Next.js 환경 (use client 디렉티브 추가)
- `"react"`: 일반 React 환경 (use client 디렉티브 추가 안 함)

### `dryRun`
- `true`: 파일 수정 안 함 (변환만 확인)
- `false`: 파일 수정

## 에러 처리

- 파싱 에러: 파일 스킵하고 다음 파일 처리
- 쓰기 에러: 에러 로그 출력하고 계속 진행
- 모든 에러는 콘솔에 출력

## 성능 모니터링

- 각 파일 처리 시간 측정
- 느린 파일 감지 (1초 이상)
- 완료 리포트 출력

---

**작성 일자**: 2025년 11월 19일  
**관련 문서**: 
- [t-wrapper README](../cli/i18n-wrapper.md)
- [AST 가이드](./ast-guide.md)

