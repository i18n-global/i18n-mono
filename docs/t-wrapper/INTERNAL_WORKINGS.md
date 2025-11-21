# t-wrapper 내부 동작 원리

## 개요

이 문서는 `t-wrapper`의 내부 동작 원리를 상세히 설명합니다. Babel AST 변환, Visitor 패턴, Scope 관리 등 핵심 메커니즘을 다룹니다.

## 핵심 개념

### 1. AST (Abstract Syntax Tree)

소스코드를 트리 구조로 표현한 것입니다. 각 노드는 코드의 구조적 요소를 나타냅니다.

```typescript
// 코드
function Component() {
  return <div>안녕하세요</div>;
}

// AST 구조
File
└── Program
    └── body: [
        FunctionDeclaration {
          id: Identifier { name: "Component" }
          body: BlockStatement {
            body: [
              ReturnStatement {
                argument: JSXElement {
                  openingElement: JSXOpeningElement { name: "div" }
                  children: [
                    JSXText { value: "안녕하세요" }  // ← 변환 대상
                  ]
                }
              }
            ]
          }
        }
      ]
```

### 2. Visitor 패턴

Babel Traverse는 Visitor 패턴을 사용하여 AST를 순회합니다. 각 노드 타입에 대한 핸들러를 정의하면 해당 타입의 노드를 만날 때마다 호출됩니다.

```typescript
traverse(ast, {
  // FunctionDeclaration 타입 노드를 만나면 호출
  FunctionDeclaration: (path) => {
    // path.node: 현재 노드
    // path.parent: 부모 노드
    // path.replaceWith(): 노드 교체
  },

  // StringLiteral 타입 노드를 만나면 호출
  StringLiteral: (path) => {
    // 문자열 리터럴 처리
  },
});
```

## 내부 동작 흐름

### Phase 1: 파일 파싱

```typescript
// translation-wrapper.ts:124
const code = fs.readFileSync(filePath, "utf-8");
const ast = parseFile(code, this.config.parserType, {
  sourceType: "module",
  tsx: true,
  decorators: true,
});
```

**동작:**

1. 파일을 UTF-8 문자열로 읽기
2. Babel/SWC 파서로 AST 생성
3. TSX, 데코레이터 등 옵션 적용

**결과:** 소스코드 → AST 트리

### Phase 2: React 컴포넌트 탐색

```typescript
// translation-wrapper.ts:137-163
traverse(ast, {
  FunctionDeclaration: (path) => {
    const componentName = path.node.id?.name;
    if (componentName && isReactComponent(componentName)) {
      // React 컴포넌트 발견
      const wasModified = this.processFunctionBody(path, code);
      if (wasModified) {
        modifiedComponentPaths.push(path);
      }
    }
  },
  ArrowFunctionExpression: (path) => {
    // 화살표 함수도 동일하게 처리
  },
});
```

**동작 원리:**

1. **컴포넌트 감지:**

   ```typescript
   // ast-helpers.ts:104
   function isReactComponent(name: string): boolean {
     return /^[A-Z]/.test(name); // 대문자로 시작
   }
   ```

   - 함수명이 대문자로 시작하면 React 컴포넌트로 간주
   - 예: `Component`, `MyButton` ✅
   - 예: `component`, `myButton` ❌

2. **함수 본문 처리:**
   - 컴포넌트 내부의 문자열만 변환 대상
   - 일반 함수는 변환하지 않음

**왜 컴포넌트만 처리하는가?**

- UI에 표시되는 텍스트만 번역 필요
- 유틸리티 함수의 문자열은 번역 불필요

### Phase 3: 문자열 변환 (핵심 로직)

```typescript
// ast-transformers.ts:24-53
path.traverse({
  StringLiteral: (subPath) => {
    // 1. 스킵 조건 체크
    if (shouldSkipPath(subPath, hasIgnoreComment)) return;

    // 2. 한국어 체크
    if (REGEX_PATTERNS.KOREAN_TEXT.test(subPath.node.value)) {
      wasModified = true;

      // 3. t() 호출로 교체
      const replacement = t.callExpression(t.identifier("t"), [
        t.stringLiteral(subPath.node.value),
      ]);

      // 4. JSX 속성이면 JSXExpressionContainer로 감싸기
      if (t.isJSXAttribute(subPath.parent)) {
        subPath.replaceWith(t.jsxExpressionContainer(replacement));
      } else {
        subPath.replaceWith(replacement);
      }
    }
  },
});
```

**동작 원리:**

#### 3.1 스킵 조건 체크

```typescript
// ast-helpers.ts:63-99
function shouldSkipPath(path, hasIgnoreCommentFn) {
  // 1. i18n-ignore 주석 체크
  if (hasIgnoreCommentFn(path)) return true;

  // 2. 이미 t()로 래핑된 경우
  if (t.isCallExpression(path.parent) && path.parent.callee.name === "t") {
    return true;
  }

  // 3. import 구문은 스킵
  if (path.findParent((p) => t.isImportDeclaration(p.node))) {
    return true;
  }

  // 4. 객체 프로퍼티 키는 스킵
  if (t.isObjectProperty(path.parent) && path.parent.key === path.node) {
    return true;
  }
}
```

**스킵하는 경우:**

- `// i18n-ignore` 주석이 있는 경우
- 이미 `t("...")`로 변환된 경우
- `import "..."` 구문
- 객체 키: `{ "key": "value" }`에서 `"key"`는 스킵

#### 3.2 한국어 감지

```typescript
// constants.ts
REGEX_PATTERNS.KOREAN_TEXT = /[가-힣]/;
```

- 정규식으로 한글 유니코드 범위 체크
- `가`(0xAC00) ~ `힣`(0xD7A3)

#### 3.3 AST 노드 교체

```typescript
// 변환 전
StringLiteral { value: "안녕하세요" }

// 변환 후
CallExpression {
  callee: Identifier { name: "t" }
  arguments: [
    StringLiteral { value: "안녕하세요" }
  ]
}
```

**교체 메서드:**

- `path.replaceWith(newNode)`: 현재 노드를 새 노드로 교체
- `path.replaceWithMultiple([node1, node2])`: 여러 노드로 교체

### Phase 4: 템플릿 리터럴 변환

```typescript
// ast-transformers.ts:54-159
TemplateLiteral: (subPath) => {
  // `안녕 ${name}` → t("안녕 {{name}}", { name })

  // 1. 한국어 체크
  const hasKorean = subPath.node.quasis.some((quasi) =>
    REGEX_PATTERNS.KOREAN_TEXT.test(quasi.value.raw)
  );

  // 2. i18next 형식으로 변환
  let i18nextString = "";
  const interpolationVars = [];

  quasis.forEach((quasi, index) => {
    i18nextString += quasi.value.raw; // "안녕 "

    if (index < expressions.length) {
      const expr = expressions[index]; // name
      const varName = extractVarName(expr); // "name"

      i18nextString += `{{${varName}}}`; // "{{name}}"
      interpolationVars.push(t.objectProperty(t.identifier(varName), expr));
    }
  });

  // 3. t() 호출 생성
  const replacement = t.callExpression(t.identifier("t"), [
    t.stringLiteral(i18nextString), // "안녕 {{name}}"
    t.objectExpression(interpolationVars), // { name: name }
  ]);

  subPath.replaceWith(replacement);
};
```

**변환 예시:**

```typescript
// 입력
`안녕하세요 ${user.name}님`;

// 변환 과정
quasis: ["안녕하세요 ", "님"];
expressions: [user.name];

// 1단계: 변수명 추출
varName = "user_name"; // MemberExpression 처리

// 2단계: i18next 형식
i18nextString = "안녕하세요 {{user_name}}님";

// 3단계: interpolation 객체
{
  user_name: user_name;
}

// 최종
t("안녕하세요 {{user_name}}님", { user_name: user_name });
```

### Phase 5: JSX 텍스트 변환

```typescript
// ast-transformers.ts:160-187
JSXText: (subPath) => {
  const text = subPath.node.value.trim();

  if (REGEX_PATTERNS.KOREAN_TEXT.test(text)) {
    wasModified = true;

    // JSX 텍스트는 JSXExpressionContainer로 감싸야 함
    const replacement = t.jsxExpressionContainer(
      t.callExpression(t.identifier("t"), [t.stringLiteral(text)])
    );

    subPath.replaceWith(replacement);
  }
};
```

**변환 예시:**

```tsx
// 입력
<div>안녕하세요</div>

// 변환 후
<div>{t("안녕하세요")}</div>
```

**왜 JSXExpressionContainer가 필요한가?**

- JSX에서 JavaScript 표현식을 사용하려면 `{ }`로 감싸야 함
- `JSXExpressionContainer`는 `{ }`를 나타냄

### Phase 6: 번역 훅/함수 추가

#### 6.1 클라이언트 모드

```typescript
// translation-wrapper.ts:210-231
if (!isServerMode) {
  const body = componentPath.get("body");

  // 이미 useTranslation이 있는지 체크
  let hasHook = false;
  body.traverse({
    CallExpression: (p) => {
      if (p.node.callee.name === "useTranslation") {
        hasHook = true;
      }
    },
  });

  // 없으면 추가
  if (!hasHook) {
    body.unshiftContainer("body", createUseTranslationHook());
    // const { t } = useTranslation();
  }
}
```

**동작:**

1. 함수 본문을 traverse하여 `useTranslation()` 호출 확인
2. 없으면 함수 본문 시작 부분에 추가
3. `unshiftContainer()`: 배열 앞에 추가

#### 6.2 서버 모드

```typescript
// translation-wrapper.ts:189-209
if (isServerMode) {
  // 함수를 async로 변경
  componentPath.node.async = true;

  const body = componentPath.get("body");
  const decl = this.createServerTBinding("getServerTranslation");
  // const { t } = await getServerTranslation();

  if (body.isBlockStatement()) {
    body.unshiftContainer("body", decl);
  } else {
    // concise body → block으로 변환
    const original = body.node;
    const block = t.blockStatement([decl, t.returnStatement(original)]);
    componentPath.node.body = block;
  }
}
```

**동작:**

1. 함수를 `async`로 변경
2. `getServerTranslation()` 바인딩 추가
3. Concise body(`=> expr`)면 Block body로 변환

**예시:**

```typescript
// 변환 전
const Component = () => <div>안녕</div>;

// 변환 후
const Component = async () => {
  const { t } = await getServerTranslation();
  return <div>{t("안녕")}</div>;
};
```

### Phase 7: Import 문 추가

```typescript
// translation-wrapper.ts:234-244
if (wasUseHookAdded) {
  addImportIfNeeded(ast, this.config.translationImportSource);
  // import { useTranslation } from "i18nexus";
}

if (wasServerImportAdded) {
  this.ensureNamedImport(
    ast,
    this.config.translationImportSource,
    this.config.serverTranslationFunction
  );
  // import { getServerTranslation } from "i18nexus";
}
```

**동작 원리:**

```typescript
// import-manager.ts:37-81
export function addImportIfNeeded(ast, source) {
  let hasImport = false;

  // 1. 기존 import 확인
  traverse(ast, {
    ImportDeclaration: (path) => {
      if (path.node.source.value === source) {
        // 같은 소스의 import가 있음
        hasImport = true;

        // useTranslation이 없으면 추가
        if (!hasUseTranslation(path.node)) {
          path.node.specifiers.push(
            t.importSpecifier(
              t.identifier("useTranslation"),
              t.identifier("useTranslation")
            )
          );
        }
      }
    }
  });

  // 2. import가 없으면 새로 생성
  if (!hasImport) {
    const importDecl = t.importDeclaration(
      [t.importSpecifier(...)],
      t.stringLiteral(source)
    );
    ast.program.body.unshift(importDecl);  // 맨 앞에 추가
  }
}
```

**우선순위:**

1. 같은 소스의 import가 있으면 specifier만 추가
2. import가 없으면 새로 생성
3. 항상 파일 맨 앞에 배치 (`unshift`)

### Phase 8: use client 디렉티브 추가

```typescript
// translation-wrapper.ts:176-178
if (isNextjsFramework && isClientMode) {
  this.ensureUseClientDirective(ast);
}
```

**동작:**

```typescript
// translation-wrapper.ts:29-41
private ensureUseClientDirective(ast) {
  // 이미 있으면 스킵
  const hasDirective = ast.program.directives?.some(
    d => d.value.value === "use client"
  );

  if (!hasDirective) {
    const dir = t.directive(
      t.directiveLiteral("use client")
    );
    ast.program.directives = ast.program.directives || [];
    ast.program.directives.unshift(dir);  // 맨 앞에 추가
  }
}
```

**조건:**

- `framework === "nextjs"` AND `mode === "client"`
- React/Vite 프로젝트에서는 추가 안 함
- 서버 모드에서는 추가 안 함

### Phase 9: 코드 생성 및 파일 쓰기

```typescript
// translation-wrapper.ts:246-252
if (!this.config.dryRun) {
  const output = generateCode(ast, this.config.parserType, {
    retainLines: true,
    comments: true,
  });
  fs.writeFileSync(filePath, output, "utf-8");
}
```

**동작:**

1. 변환된 AST를 다시 소스코드로 변환
2. `retainLines: true`: 원본 줄 번호 유지 (에러 추적용)
3. `comments: true`: 주석 보존
4. `dryRun`이 `false`인 경우에만 파일에 쓰기

## Scope 관리

### t 변수 중복 방지

```typescript
// translation-wrapper.ts:181-187
if (componentPath.scope.hasBinding("t")) {
  return; // 이미 t가 있으면 스킵
}
```

**동작:**

- Babel의 Scope API 사용
- 현재 스코프에 `t` 변수가 있는지 확인
- 있으면 훅/바인딩 추가 안 함

**예시:**

```typescript
// 이미 t가 있는 경우
function Component() {
  const { t } = useTranslation("namespace");
  return <div>{t("안녕")}</div>;
}
// → 추가 훅 추가 안 함
```

## Visitor 패턴의 재귀적 순회

### 중첩된 Visitor

```typescript
// 1단계: 최상위 traverse
traverse(ast, {
  FunctionDeclaration: (path) => {
    // 2단계: 함수 본문 내부 traverse
    path.traverse({
      StringLiteral: (subPath) => {
        // 문자열 변환
      },
    });
  },
});
```

**동작 순서:**

1. 최상위에서 `FunctionDeclaration` 찾기
2. 찾은 함수 내부에서 `StringLiteral` 찾기
3. 각 문자열을 개별적으로 처리

### 왜 중첩된 Visitor를 사용하는가?

#### 문제: 최상위에서 모든 StringLiteral을 처리하면?

```typescript
// ❌ 이렇게 하면 안 됨
traverse(ast, {
  StringLiteral: (path) => {
    // 모든 문자열을 변환하려고 시도
    if (한국어_체크(path.node.value)) {
      path.replaceWith(t.callExpression(...));
    }
  }
});
```

**문제점:**

1. **일반 함수의 문자열도 변환됨**

   ```typescript
   // 유틸리티 함수 - 번역 불필요
   function formatDate(date: Date) {
     return date.toLocaleString("ko-KR"); // ← 이건 변환하면 안 됨!
   }
   ```

2. **import 문의 문자열도 변환될 수 있음**

   ```typescript
   import { useTranslation } from "i18nexus"; // ← 이건 변환하면 안 됨!
   ```

3. **객체 키도 변환될 수 있음**

   ```typescript
   const config = {
     apiUrl: "https://api.example.com", // ← 키는 변환하면 안 됨!
   };
   ```

4. **스코프 관리가 어려움**
   - 어느 함수에 `useTranslation`을 추가해야 할지 모름
   - 여러 함수에서 변환이 일어나면 각각 체크해야 함

#### 해결: 중첩된 Visitor 사용

```typescript
// ✅ 올바른 방법
traverse(ast, {
  FunctionDeclaration: (path) => {
    // 1단계: React 컴포넌트인지 확인
    const componentName = path.node.id?.name;
    if (componentName && isReactComponent(componentName)) {
      // 2단계: 컴포넌트 내부에서만 문자열 변환
      path.traverse({
        StringLiteral: (subPath) => {
          // 이제 안전하게 변환 가능
          // - 이미 컴포넌트 내부라는 것이 보장됨
          // - 스코프가 명확함
        },
      });
    }
  },
});
```

**장점:**

1. **정확한 타겟팅**
   - React 컴포넌트 내부의 문자열만 변환
   - UI에 표시되는 텍스트만 처리

2. **스코프 관리 용이**

   ```typescript
   // 컴포넌트를 찾은 후 내부에서만 변환
   // → 변환 후 useTranslation 훅을 정확한 위치에 추가 가능
   if (wasModified) {
     componentPath.get("body").unshiftContainer("body", hook);
     // ↑ 이 컴포넌트에만 훅 추가
   }
   ```

3. **성능 최적화**
   - 컴포넌트가 아닌 함수는 아예 순회하지 않음
   - 불필요한 체크 감소

4. **에러 방지**
   - import 문, 객체 키 등은 이미 함수 내부가 아니므로 스킵
   - `shouldSkipPath`로 추가 체크하지만, 기본적으로 안전함

#### 실제 코드 예시

```typescript
// translation-wrapper.ts
traverse(ast, {
  FunctionDeclaration: (path) => {
    const componentName = path.node.id?.name;
    if (componentName && isReactComponent(componentName)) {
      // ✅ 컴포넌트 확인 후 내부만 처리
      const wasModified = this.processFunctionBody(path, code);
      if (wasModified) {
        modifiedComponentPaths.push(path); // 나중에 훅 추가할 위치 저장
      }
    }
  },
});

// ast-transformers.ts
export function transformFunctionBody(path, sourceCode) {
  // ✅ 이미 컴포넌트 내부라는 것이 보장됨
  path.traverse({
    StringLiteral: (subPath) => {
      // 안전하게 변환
    },
  });
}
```

**비교:**

| 방식                          | 장점                             | 단점                                       |
| ----------------------------- | -------------------------------- | ------------------------------------------ |
| **최상위 StringLiteral 처리** | 코드 간단                        | 모든 문자열 처리, 스코프 불명확, 에러 위험 |
| **중첩된 Visitor**            | 정확한 타겟팅, 스코프 명확, 안전 | 코드 약간 복잡                             |

**결론:** 중첩된 Visitor를 사용하면 React 컴포넌트 내부의 문자열만 정확하게 타겟팅할 수 있고, 스코프 관리와 에러 방지에 유리합니다.

## 에러 처리

```typescript
// translation-wrapper.ts:126-131
try {
  const ast = parseFile(code, ...);
  // 변환 로직
} catch (error) {
  console.error(`Failed to process ${filePath}:`, error);
  // 다음 파일로 계속 진행
}
```

**전략:**

- 파일별로 독립적 처리
- 한 파일 실패해도 다른 파일 계속 처리
- 에러 로그만 출력

## 성능 최적화

### 1. 파일별 독립 처리

```typescript
for (const filePath of filePaths) {
  // 각 파일을 독립적으로 처리
  // 병렬 처리 가능 (미구현)
}
```

### 2. 조건부 변환

```typescript
// 한국어가 있는 경우만 변환
if (REGEX_PATTERNS.KOREAN_TEXT.test(value)) {
  // 변환 로직
}
```

### 3. 중복 체크

```typescript
// 이미 변환된 경우 스킵
if (t.isCallExpression(path.parent) && path.parent.callee.name === "t") {
  return;
}
```

## 실제 변환 예시

### 예시 1: 기본 변환

**입력:**

```tsx
function Component() {
  return <div>안녕하세요</div>;
}
```

**변환 과정:**

1. `FunctionDeclaration` 발견 → `Component`는 React 컴포넌트
2. 함수 본문 traverse
3. `JSXText` 발견 → "안녕하세요" (한국어)
4. `t("안녕하세요")`로 교체
5. `useTranslation` 훅 추가
6. import 문 추가
7. (Next.js면) "use client" 추가

**출력:**

```tsx
"use client";
import { useTranslation } from "i18nexus";

function Component() {
  const { t } = useTranslation();
  return <div>{t("안녕하세요")}</div>;
}
```

### 예시 2: 템플릿 리터럴

**입력:**

```tsx
function Component() {
  const name = "홍길동";
  return <div>{`안녕하세요 ${name}님`}</div>;
}
```

**변환 과정:**

1. `TemplateLiteral` 발견
2. `quasis`: ["안녕하세요 ", "님"]
3. `expressions`: [name]
4. i18next 형식: "안녕하세요 {{name}}님"
5. interpolation 객체: { name: name }

**출력:**

```tsx
function Component() {
  const { t } = useTranslation();
  const name = "홍길동";
  return <div>{t("안녕하세요 {{name}}님", { name })}</div>;
}
```

## 핵심 메커니즘 요약

### 1. Visitor 패턴

- Babel Traverse가 AST를 순회
- 각 노드 타입별 핸들러 실행
- 중첩된 traverse로 정밀한 제어

### 2. AST 노드 교체

- `path.replaceWith()`: 노드 교체
- `path.unshiftContainer()`: 배열 앞에 추가
- 불변성 유지 (새 노드 생성)

### 3. Scope 관리

- `path.scope.hasBinding()`: 변수 존재 확인
- 중복 방지 및 정확한 스코프 처리

### 4. 조건부 변환

- 한국어 체크
- i18n-ignore 주석 체크
- 이미 변환된 경우 스킵

---

**작성 일자**: 2025년 11월 19일  
**관련 문서**:

- [FLOW.md](./FLOW.md) (전체 흐름)
- [t-wrapper README](../cli/i18n-wrapper.md)
