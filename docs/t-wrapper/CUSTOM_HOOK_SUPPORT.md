# 커스텀 훅 지원 및 사이드 이펙트 분석

## 개요

커스텀 훅 내부의 문자열도 `t()` 함수로 변환하도록 지원합니다. 특히 `toast("텍스트")`, `alert("테스트")` 같은 경우를 처리합니다.

## 현재 상태

### 인식되는 패턴

```typescript
REACT_HOOK: /^use[A-Z]/
```

- ✅ `useState`, `useTranslation` (React 기본 훅)
- ✅ `useMyHook`, `useCustomHook` (커스텀 훅)
- ❌ `use-my-hook`, `use_my_hook` (하이픈/언더스코어 포함)

### 처리되는 함수 형태

1. **FunctionDeclaration**
   ```typescript
   function useMyHook() {
     return "안녕하세요";
   }
   ```

2. **ArrowFunctionExpression**
   ```typescript
   const useMyHook = () => {
     return "안녕하세요";
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

### 출력

```typescript
function useToast() {
  const { t } = useTranslation();
  toast(t("안녕하세요"));
  alert(t("테스트 메시지"));
}
```

## 사이드 이펙트 분석

### 1. `t` 함수 스코프 문제

**문제:**
```typescript
// 변환 전
function useMyHook() {
  toast("안녕하세요");
}

// 변환 후
function useMyHook() {
  toast(t("안녕하세요")); // ❌ t가 정의되지 않음!
}
```

**해결:**
- 커스텀 훅에도 `useTranslation` 훅을 추가
- 변환이 일어난 경우에만 추가 (성능 최적화)

```typescript
// 변환 후 (올바름)
function useMyHook() {
  const { t } = useTranslation();
  toast(t("안녕하세요")); // ✅ t가 정의됨
}
```

### 2. 불필요한 `useTranslation` 추가

**문제:**
- 모든 커스텀 훅에 `useTranslation`이 추가될 수 있음
- 실제로 번역이 필요 없는 훅에도 추가됨

**예시:**
```typescript
// 변환 전
function useCounter() {
  return { count: 0 };
}

// 변환 후 (불필요)
function useCounter() {
  const { t } = useTranslation(); // ❌ 번역이 필요 없는데 추가됨
  return { count: 0 };
}
```

**영향:**
- **성능**: `useTranslation` 훅 호출 오버헤드 (미미함)
- **번들 크기**: `i18nexus` import 추가 (작음)
- **실제 문제**: 번역이 필요 없어도 추가되지만, 사용하지 않으면 문제 없음

**완화 방법:**
- 변환이 실제로 일어난 경우에만 `useTranslation` 추가 (현재 구현)
- `i18n-ignore` 주석으로 스킵 가능

### 3. 중첩된 함수 호출

**문제:**
```typescript
// 변환 전
function useMyHook() {
  toast("안녕하세요");
}

// 변환 후
function useMyHook() {
  const { t } = useTranslation();
  toast(t("안녕하세요")); // 중첩된 함수 호출
}
```

**영향:**
- **성능**: `t()` 함수 호출 추가 (미미함)
- **타입**: TypeScript 타입 체크 통과 (문제 없음)
- **실제 문제**: 없음

### 4. 이미 `t`가 있는 경우

**문제:**
```typescript
// 변환 전
function useMyHook() {
  const { t } = useTranslation("namespace");
  toast("안녕하세요");
}

// 변환 후 (중복)
function useMyHook() {
  const { t } = useTranslation("namespace");
  const { t } = useTranslation(); // ❌ 중복!
  toast(t("안녕하세요"));
}
```

**해결:**
- 현재 구현에서 `scope.hasBinding("t")` 체크로 중복 방지
- 이미 `t`가 있으면 추가하지 않음

```typescript
// 변환 후 (올바름)
function useMyHook() {
  const { t } = useTranslation("namespace");
  toast(t("안녕하세요")); // ✅ 기존 t 사용
}
```

### 5. 서버 컴포넌트와의 충돌

**문제:**
- 커스텀 훅은 클라이언트에서만 사용 가능
- 서버 컴포넌트에서는 사용 불가

**영향:**
- 서버 모드에서는 커스텀 훅이 처리되지 않음 (문제 없음)
- 클라이언트 모드에서만 처리됨

## 허용 가능한 사이드 이펙트

### 1. 성능 오버헤드 (미미함)

- `useTranslation` 훅 호출: React 훅이므로 매우 가벼움
- `t()` 함수 호출: 단순 문자열 조회이므로 빠름
- **결론**: 성능 영향 거의 없음

### 2. 번들 크기 증가 (작음)

- `i18nexus` import 추가: 이미 사용 중이면 증가 없음
- **결론**: 실제 증가량 미미함

### 3. 불필요한 훅 추가 (허용 가능)

- 번역이 필요 없는 훅에도 `useTranslation` 추가
- 하지만 사용하지 않으면 문제 없음
- **결론**: 허용 가능한 사이드 이펙트

## 권장 사항

### 1. 변환된 경우에만 훅 추가

```typescript
if (wasModified) {
  // 변환이 실제로 일어난 경우에만 useTranslation 추가
  componentPath.get("body").unshiftContainer("body", hook);
}
```

### 2. 중복 방지

```typescript
if (componentPath.scope.hasBinding("t")) {
  return; // 이미 t가 있으면 스킵
}
```

### 3. i18n-ignore 주석 지원

```typescript
// i18n-ignore
function useMyHook() {
  toast("안녕하세요"); // 변환 안 됨
}
```

## 결론

커스텀 훅 내부 문자열 변환을 허용해도 **심각한 사이드 이펙트는 없습니다**.

1. ✅ **성능**: 영향 거의 없음
2. ✅ **번들 크기**: 증가량 미미함
3. ✅ **중복 방지**: 이미 구현됨
4. ⚠️ **불필요한 훅 추가**: 허용 가능한 사이드 이펙트

**권장:** 커스텀 훅 내부 문자열 변환 지원을 추가하는 것이 좋습니다.

---

**작성 일자**: 2025년 11월 19일  
**관련 문서**: 
- [INTERNAL_WORKINGS.md](./INTERNAL_WORKINGS.md)
- [FLOW.md](./FLOW.md)

