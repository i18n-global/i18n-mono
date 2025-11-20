# 네임스페이스 별칭 자동 생성 기능 (계획)

## 문제 상황

현재 `i18n-wrapper`는 여러 네임스페이스를 사용할 때 변수명 충돌을 해결하지 못합니다.

```tsx
// ❌ 문제: 변수명 충돌
const { t } = useTranslation("dashboard");
const { t } = useTranslation("constant");  // 에러!
```

사용자가 수동으로 별칭을 추가해야 하지만:

```tsx
// ⚠️ 문제: extractor가 추출하지 못함
const { t: tConstant } = useTranslation("constant");
return <button>{tConstant("submit")}</button>;  // 추출 안 됨!
```

## 해결 방안

### 목표

1. **자동 별칭 생성**: 여러 네임스페이스 사용 시 자동으로 별칭 생성
2. **Extractor 호환**: 별칭을 사용한 `t()` 호출도 추출 가능하도록 개선
3. **네임스페이스 자동 감지**: 파일 경로나 설정을 기반으로 네임스페이스 자동 감지

### 구현 계획

#### 1단계: 네임스페이스 감지

**방법 A: 파일 경로 기반**

```typescript
// 파일 경로에서 네임스페이스 추론
// app/dashboard/page.tsx → "dashboard"
// app/constant/components/Button.tsx → "constant"
function detectNamespace(filePath: string): string | null {
  const pathParts = filePath.split('/');
  // 설정된 basePath 이후의 경로에서 네임스페이스 추론
  // ...
}
```

**방법 B: 설정 기반**

```json
{
  "namespaces": {
    "app/dashboard/**": "dashboard",
    "app/constant/**": "constant",
    "components/**": "common"
  }
}
```

**방법 C: 기존 useTranslation 호출 분석**

```typescript
// 파일 내에 이미 useTranslation("namespace") 호출이 있으면 그 네임스페이스 사용
function detectExistingNamespace(ast: t.File): string | null {
  // AST에서 useTranslation 호출 찾기
  // ...
}
```

#### 2단계: 별칭 자동 생성

```typescript
function createUseTranslationHook(namespace?: string, alias?: string): t.VariableDeclaration {
  const hookCall = t.callExpression(
    t.identifier(STRING_CONSTANTS.USE_TRANSLATION),
    namespace ? [t.stringLiteral(namespace)] : []
  );

  const propertyName = alias || STRING_CONSTANTS.TRANSLATION_FUNCTION;
  
  return t.variableDeclaration(STRING_CONSTANTS.VARIABLE_KIND, [
    t.variableDeclarator(
      t.objectPattern([
        t.objectProperty(
          t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
          t.identifier(propertyName),  // 별칭 사용
          false,
          true
        ),
      ]),
      hookCall
    ),
  ]);
}
```

#### 3단계: Extractor 개선

**현재 코드:**

```typescript
export function isTFunction(callee: t.Expression): boolean {
  // t() 직접 호출만 체크
  if (t.isIdentifier(callee, { name: "t" })) {
    return true;
  }
  return false;
}
```

**개선된 코드:**

```typescript
export function isTFunction(callee: t.Expression): boolean {
  // t() 직접 호출
  if (t.isIdentifier(callee, { name: "t" })) {
    return true;
  }
  
  // 별칭 사용: tConstant, tDashboard 등
  // 네임스페이스 기반 별칭 패턴 감지
  if (t.isIdentifier(callee)) {
    const name = callee.name;
    // t로 시작하고 대문자로 시작하는 별칭 (tConstant, tDashboard 등)
    if (name.startsWith("t") && name.length > 1 && /^[A-Z]/.test(name.slice(1))) {
      return true;
    }
  }
  
  return false;
}
```

또는 더 정확하게:

```typescript
// 파일 내에서 useTranslation으로 선언된 변수 추적
class TranslationExtractor {
  private translationAliases: Set<string> = new Set(["t"]);  // 기본값
  
  private detectTranslationAliases(ast: t.File): void {
    traverse(ast, {
      VariableDeclarator: (path) => {
        // const { t: alias } = useTranslation(...) 패턴 감지
        if (t.isObjectPattern(path.node.id)) {
          // ...
        }
      },
    });
  }
  
  public isTFunction(callee: t.Expression): boolean {
    if (t.isIdentifier(callee)) {
      return this.translationAliases.has(callee.name);
    }
    return false;
  }
}
```

### 사용 예시

#### Before (현재)

```tsx
// 사용자가 수동으로 별칭 추가
function Component() {
  const { t } = useTranslation("dashboard");
  const { t: tConstant } = useTranslation("constant");  // 수동 추가
  return (
    <div>
      <h1>{t("title")}</h1>
      <button>{tConstant("submit")}</button>  // extractor가 추출 안 함
    </div>
  );
}
```

#### After (개선 후)

```tsx
// i18n-wrapper가 자동으로 별칭 생성
function Component() {
  const { t: tDashboard } = useTranslation("dashboard");  // 자동 생성
  const { t: tConstant } = useTranslation("constant");  // 자동 생성
  return (
    <div>
      <h1>{tDashboard("title")}</h1>  // extractor가 추출함
      <button>{tConstant("submit")}</button>  // extractor가 추출함
    </div>
  );
}
```

## 구현 우선순위

### Phase 1: 기본 기능 (우선순위 높음)

1. ✅ 네임스페이스 사용 가이드 문서 작성
2. ⏳ Extractor 개선: 별칭 인식 기능 추가
3. ⏳ 래퍼 개선: 네임스페이스 감지 및 별칭 자동 생성

### Phase 2: 고급 기능 (우선순위 중간)

1. 파일 경로 기반 네임스페이스 자동 감지
2. 설정 파일 기반 네임스페이스 매핑
3. 네임스페이스별 번역 파일 자동 생성

### Phase 3: 최적화 (우선순위 낮음)

1. 네임스페이스 충돌 자동 해결
2. 사용하지 않는 네임스페이스 경고
3. 네임스페이스 사용 통계

## 관련 이슈

- 네임스페이스 사용 시 변수명 충돌
- Extractor가 별칭을 인식하지 못함
- 래퍼가 자동으로 별칭을 생성하지 않음

## 참고 문서

- [네임스페이스 사용 가이드](../guides/namespace-usage.md)
- [Extractor 문서](../cli/i18n-extractor.md)
- [Wrapper 문서](../cli/i18n-wrapper.md)

---

**작성 일자**: 2025년 11월  
**상태**: 계획 중  
**우선순위**: 높음

