# 커스텀 훅 처리 방식

## 개요

`t-wrapper`는 함수 이름이 `isReactComponent`이지만, 실제로는 **React 컴포넌트와 커스텀 훅 모두** 처리합니다.

## 처리 로직

### 1. `isReactComponent` 함수

```typescript
// ast-helpers.ts:104
export function isReactComponent(name: string): boolean {
  return (
    REGEX_PATTERNS.REACT_COMPONENT.test(name) ||  // 대문자로 시작
    REGEX_PATTERNS.REACT_HOOK.test(name)          // use[A-Z]로 시작
  );
}
```

**함수 이름은 "React 컴포넌트"지만 실제로는:**
- ✅ React 컴포넌트: `Component`, `MyButton` 등
- ✅ 커스텀 훅: `useMyHook`, `useToast` 등
- ❌ 일반 함수: `formatDate`, `getData` 등

### 2. 패턴 매칭

```typescript
// constants.ts
REACT_COMPONENT: /^[A-Z]/     // 대문자로 시작
REACT_HOOK: /^use[A-Z]/       // use로 시작하고 대문자로 이어짐
```

**예시:**
- `Component` → `REACT_COMPONENT` 매칭 ✅
- `useMyHook` → `REACT_HOOK` 매칭 ✅
- `useToast` → `REACT_HOOK` 매칭 ✅
- `formatDate` → 둘 다 매칭 안 됨 ❌

### 3. 실제 처리 흐름

```typescript
// translation-wrapper.ts:137-163
traverse(ast, {
  FunctionDeclaration: (path) => {
    const componentName = path.node.id?.name;
    // 👇 여기서 컴포넌트와 훅 모두 체크!
    if (componentName && isReactComponent(componentName)) {
      const wasModified = this.processFunctionBody(path, code);
      // ...
    }
  },
  ArrowFunctionExpression: (path) => {
    const componentName = path.parent.id.name;
    // 👇 여기서도 컴포넌트와 훅 모두 체크!
    if (componentName && isReactComponent(componentName)) {
      const wasModified = this.processFunctionBody(path, code);
      // ...
    }
  }
});
```

## 처리되는 경우

### ✅ React 컴포넌트

```typescript
// FunctionDeclaration
function Component() {
  return <div>안녕하세요</div>;
}

// ArrowFunctionExpression
const Component = () => {
  return <div>안녕하세요</div>;
};
```

### ✅ 커스텀 훅

```typescript
// FunctionDeclaration
function useToast() {
  toast("안녕하세요");
}

// ArrowFunctionExpression
const useToast = () => {
  toast("안녕하세요");
};
```

### ❌ 일반 함수 (처리 안 됨)

```typescript
// FunctionDeclaration
function formatDate(date: Date) {
  return date.toLocaleString("ko-KR");
}

// ArrowFunctionExpression
const formatDate = (date: Date) => {
  return date.toLocaleString("ko-KR");
};
```

## 변환 예시

### 입력

```typescript
function useToast() {
  toast("안녕하세요");
  alert("테스트 메시지");
}
```

### 처리 과정

1. **함수 이름 체크**
   ```typescript
   componentName = "useToast"
   isReactComponent("useToast") 
   → REACT_HOOK.test("useToast") 
   → /^use[A-Z]/.test("useToast") 
   → true ✅
   ```

2. **함수 본문 변환**
   ```typescript
   processFunctionBody(path, code)
   → StringLiteral "안녕하세요" 발견
   → t("안녕하세요")로 변환
   → StringLiteral "테스트 메시지" 발견
   → t("테스트 메시지")로 변환
   ```

3. **useTranslation 훅 추가**
   ```typescript
   // 변환이 일어났으므로 훅 추가
   const { t } = useTranslation();
   ```

### 출력

```typescript
import { useTranslation } from "i18nexus";

function useToast() {
  const { t } = useTranslation();
  toast(t("안녕하세요"));
  alert(t("테스트 메시지"));
}
```

## 왜 함수 이름이 `isReactComponent`인가?

**역사적 이유:**
- 초기에는 React 컴포넌트만 처리했음
- 나중에 커스텀 훅 지원이 추가됨
- 함수 이름은 그대로 유지 (하위 호환성)

**실제 동작:**
- 함수 이름은 "React 컴포넌트"지만
- 실제로는 컴포넌트와 훅 모두 처리

## 개선 제안

함수 이름을 더 명확하게 변경할 수 있습니다:

```typescript
// 현재
export function isReactComponent(name: string): boolean

// 제안
export function isReactComponentOrHook(name: string): boolean
// 또는
export function shouldProcessFunction(name: string): boolean
```

하지만 하위 호환성을 위해 현재 이름을 유지하는 것이 좋습니다.

## 결론

**커스텀 훅은 이미 처리되고 있습니다!**

- `isReactComponent` 함수가 이름은 "컴포넌트"지만 실제로는 훅도 체크
- `REACT_HOOK` 패턴으로 `use[A-Z]`로 시작하는 함수 인식
- `FunctionDeclaration`과 `ArrowFunctionExpression` 모두 처리
- 변환 후 `useTranslation` 훅 자동 추가

---

**작성 일자**: 2025년 11월 19일  
**관련 문서**: 
- [CUSTOM_HOOK_SUPPORT.md](./CUSTOM_HOOK_SUPPORT.md)
- [INTERNAL_WORKINGS.md](./INTERNAL_WORKINGS.md)

