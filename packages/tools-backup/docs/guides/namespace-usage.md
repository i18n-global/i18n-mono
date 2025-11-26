# 네임스페이스 사용 가이드

## 개요

`i18n-wrapper`는 여러 네임스페이스를 사용할 때 변수명 충돌을 방지하기 위한 가이드를 제공합니다.

## 문제 상황

같은 컴포넌트에서 여러 네임스페이스를 사용할 때, 기본 `t` 변수명이 충돌할 수 있습니다.

### 예시: 변수명 충돌

```tsx
// ❌ 문제: t 변수명이 중복됨
function MyComponent() {
  const { t } = useTranslation("dashboard");
  const { t } = useTranslation("constant");  // 에러: 't' is already declared
  const { t } = useTranslation("common");    // 에러: 't' is already declared

  return (
    <div>
      <h1>{t("title")}</h1>  // 어떤 t를 사용하는지 불명확
    </div>
  );
}
```

## 해결 방법

### 방법 1: 폴백 네임스페이스 사용 (권장) ⭐

**가장 권장하는 방법**은 여러 네임스페이스를 사용하는 대신, **기본 네임스페이스와 폴백을 설정**하는 것입니다.

#### i18next 폴백 설정

```typescript
// i18n 설정
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    defaultNS: 'dashboard',  // 기본 네임스페이스
    fallbackNS: 'common',   // 폴백 네임스페이스
    // 또는 여러 폴백
    fallbackNS: ['common', 'constant'],
    // ...
  });
```

#### 사용 예시

```tsx
// ✅ 권장: 기본 네임스페이스만 사용, 폴백 자동 적용
function MyComponent() {
  const { t } = useTranslation("dashboard");  // 기본 네임스페이스

  return (
    <div>
      <h1>{t("title")}</h1>  // dashboard 네임스페이스에서 찾음
      <button>{t("submit")}</button>  // dashboard에 없으면 common에서 찾음
      <p>{t("description")}</p>  // dashboard에 없으면 common에서 찾음
    </div>
  );
}
```

**장점:**
- ✅ 변수명 충돌 없음
- ✅ Extractor와 완벽 호환 (`t`만 사용)
- ✅ 코드가 간단함
- ✅ i18next의 폴백 기능 활용
- ✅ 네임스페이스별 파일 분리 가능

#### 폴백 동작 방식

```json
// locales/ko/dashboard.json
{
  "title": "대시보드",
  "welcome": "환영합니다"
}

// locales/ko/common.json
{
  "submit": "제출",
  "cancel": "취소",
  "description": "설명"
}
```

```tsx
const { t } = useTranslation("dashboard");

t("title");  // "대시보드" (dashboard에서 찾음)
t("submit");  // "제출" (dashboard에 없어서 common에서 찾음)
t("description");  // "설명" (dashboard에 없어서 common에서 찾음)
```

### 방법 2: 하나의 네임스페이스로 통일

가능한 경우 하나의 네임스페이스만 사용하여 충돌을 피합니다.

```tsx
// ✅ 해결: 단일 네임스페이스
function MyComponent() {
  const { t } = useTranslation("dashboard");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("constant.description")}</p>  // 네임스페이스 대신 키에 포함
    </div>
  );
}
```

**장점:**
- ✅ 가장 간단함
- ✅ Extractor와 완벽 호환
- ✅ 변수명 충돌 없음

**단점:**
- ❌ 키 이름이 길어질 수 있음
- ❌ 네임스페이스별 파일 분리 어려움

### 방법 3: 네임스페이스별로 컴포넌트 분리

각 네임스페이스를 사용하는 로직을 별도의 함수나 컴포넌트로 분리합니다.

```tsx
// ✅ 해결: 로직 분리
function DashboardContent() {
  const { t } = useTranslation("dashboard");
  return <h1>{t("title")}</h1>;
}

function ConstantContent() {
  const { t } = useTranslation("constant");
  return <p>{t("description")}</p>;
}

function MyComponent() {
  return (
    <div>
      <DashboardContent />
      <ConstantContent />
    </div>
  );
}
```

**장점:**
- ✅ 각 컴포넌트에서 기본 `t` 사용 가능
- ✅ Extractor와 호환
- ✅ 컴포넌트 책임 분리

**단점:**
- ❌ 컴포넌트가 많아질 수 있음

### 방법 4: 별칭(Alias) 사용 (최후의 수단) ⚠️

**주의**: 이 방법은 Extractor와 호환되지 않습니다. 가능한 한 피하세요.

여러 네임스페이스를 반드시 사용해야 하는 경우에만 별칭을 사용합니다.

```tsx
// ⚠️ 주의: Extractor가 추출하지 못함
function MyComponent() {
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tConstant } = useTranslation("constant");
  const { t: tCommon } = useTranslation("common");

  return (
    <div>
      <h1>{tDashboard("title")}</h1>  // ✅ 추출됨
      <p>{tConstant("description")}</p>  // ❌ 추출 안 됨!
      <button>{tCommon("submit")}</button>  // ❌ 추출 안 됨!
    </div>
  );
}
```

**단점:**
- ❌ Extractor가 별칭을 인식하지 못함
- ❌ 코드가 복잡해짐
- ❌ 변수명 관리 필요

## 네임스페이스별 별칭 명명 규칙

일관된 별칭 명명 규칙을 사용하면 코드 가독성이 향상됩니다.

### 권장 명명 규칙

```tsx
// 네임스페이스 이름을 기반으로 한 별칭
const { t: tDashboard } = useTranslation("dashboard");
const { t: tConstant } = useTranslation("constant");
const { t: tCommon } = useTranslation("common");
const { t: tAuth } = useTranslation("auth");
const { t: tSettings } = useTranslation("settings");
```

### 네임스페이스 타입별 명명

```tsx
// 도메인별 네임스페이스
const { t: tUser } = useTranslation("user");
const { t: tProduct } = useTranslation("product");
const { t: tOrder } = useTranslation("order");

// 공통 네임스페이스
const { t: tCommon } = useTranslation("common");
const { t: tConstant } = useTranslation("constant");
const { t: tError } = useTranslation("error");
```

## 실제 사용 예시

### 예시 1: 대시보드 컴포넌트

```tsx
function Dashboard() {
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const { t: tConstant } = useTranslation("constant");

  return (
    <div>
      <h1>{tDashboard("welcome")}</h1>
      <p>{tCommon("loading")}</p>
      <button>{tConstant("submit")}</button>
    </div>
  );
}
```

### 예시 2: 폼 컴포넌트

```tsx
function ContactForm() {
  const { t: tForm } = useTranslation("form");
  const { t: tValidation } = useTranslation("validation");
  const { t: tCommon } = useTranslation("common");

  return (
    <form>
      <label>{tForm("name")}</label>
      <input />
      <span>{tValidation("required")}</span>
      <button>{tCommon("submit")}</button>
    </form>
  );
}
```

### 예시 3: 서버 컴포넌트

```tsx
// 서버 컴포넌트에서도 동일하게 적용
async function ServerComponent() {
  const { t: tDashboard } = await getServerTranslation("dashboard");
  const { t: tConstant } = await getServerTranslation("constant");

  return (
    <div>
      <h1>{tDashboard("title")}</h1>
      <p>{tConstant("description")}</p>
    </div>
  );
}
```

## i18n-wrapper와의 관계

### 현재 동작

`i18n-wrapper`는 자동으로 `useTranslation` 훅을 추가하지만, **기본 네임스페이스만** 사용합니다.

```tsx
// i18n-wrapper가 자동 생성
function Component() {
  const { t } = useTranslation();  // 기본 네임스페이스
  return <div>{t("안녕하세요")}</div>;
}
```

### ⚠️ 중요: Extractor와의 호환성

**현재 `i18n-extractor`는 `t`라는 이름의 함수만 인식합니다.** 별칭을 사용한 경우 추출되지 않습니다.

```tsx
// ❌ 문제: extractor가 추출하지 못함
function Component() {
  const { t: tConstant } = useTranslation("constant");
  return <button>{tConstant("submit")}</button>;  // 추출 안 됨!
}
```

### 권장 접근 방법

#### 1. 폴백 네임스페이스 설정 (가장 권장) ⭐

i18next 설정에서 폴백 네임스페이스를 설정하고, 기본 네임스페이스만 사용합니다.

```typescript
// i18n 설정
i18n.init({
  defaultNS: 'dashboard',
  fallbackNS: 'common',  // 또는 ['common', 'constant']
});
```

```tsx
// ✅ 권장: 기본 네임스페이스만 사용
function Component() {
  const { t } = useTranslation("dashboard");  // 기본 네임스페이스
  return (
    <div>
      <h1>{t("title")}</h1>  // dashboard에서 찾음
      <button>{t("submit")}</button>  // dashboard에 없으면 common에서 찾음
    </div>
  );
}
```

**장점:**
- ✅ Extractor와 완벽 호환
- ✅ 변수명 충돌 없음
- ✅ 코드가 간단함
- ✅ 네임스페이스별 파일 분리 가능

#### 2. 네임스페이스별로 파일 분리

각 네임스페이스를 사용하는 로직을 별도 파일로 분리하여 기본 `t`를 사용합니다.

```tsx
// ✅ 각 파일에서 기본 t 사용
// components/DashboardContent.tsx
function DashboardContent() {
  const { t } = useTranslation("dashboard");
  return <h1>{t("title")}</h1>;  // 추출됨
}

// components/ConstantContent.tsx
function ConstantContent() {
  const { t } = useTranslation("constant");
  return <button>{t("submit")}</button>;  // 추출됨
}
```

#### 3. 별칭 사용 (최후의 수단) ⚠️

여러 네임스페이스를 반드시 사용해야 하는 경우에만 별칭을 사용하되, **extractor가 추출하지 못한다는 점을 인지**하고 수동으로 번역 키를 관리해야 합니다.

```tsx
// ⚠️ 주의: extractor가 추출하지 못함
function Component() {
  const { t } = useTranslation("dashboard");  // i18n-wrapper가 생성
  const { t: tConstant } = useTranslation("constant");  // 수동 추가
  return (
    <div>
      <p>{t("안녕하세요")}</p>  {/* ✅ 추출됨 */}
      <button>{tConstant("submit")}</button>  {/* ❌ 추출 안 됨 */}
    </div>
  );
}
```

## 향후 개선 방향

### 계획된 기능

향후 `i18n-wrapper`가 다음과 같이 개선될 예정입니다:

1. **네임스페이스 자동 감지**: 파일 경로나 설정을 기반으로 네임스페이스 자동 감지
2. **별칭 자동 생성**: 네임스페이스가 여러 개일 때 자동으로 별칭 생성
3. **Extractor 개선**: 별칭을 사용한 `t()` 호출도 추출 가능하도록 개선

### 예상 동작

```tsx
// 향후 버전에서 자동 생성될 코드
function Component() {
  const { t } = useTranslation("dashboard");  // 기본 네임스페이스
  const { t: tConstant } = useTranslation("constant");  // 자동으로 별칭 생성
  return (
    <div>
      <h1>{t("title")}</h1>
      <button>{tConstant("submit")}</button>  // extractor가 추출 가능
    </div>
  );
}
```

## 권장 사항

### 1. 폴백 네임스페이스 설정 (가장 권장) ⭐

**여러 네임스페이스를 사용하는 대신, 폴백을 설정하는 것이 가장 좋습니다.**

```typescript
// i18n 설정
i18n.init({
  defaultNS: 'dashboard',
  fallbackNS: ['common', 'constant'],  // 여러 폴백 가능
});
```

```tsx
// ✅ 권장: 기본 네임스페이스만 사용
function Component() {
  const { t } = useTranslation("dashboard");
  
  return (
    <div>
      <h1>{t("title")}</h1>  // dashboard에서 찾음
      <button>{t("submit")}</button>  // dashboard → common → constant 순서로 찾음
    </div>
  );
}
```

**장점:**
- ✅ Extractor와 완벽 호환
- ✅ 변수명 충돌 없음
- ✅ 코드가 간단함
- ✅ 네임스페이스별 파일 분리 가능
- ✅ i18next의 표준 기능 활용

### 2. 네임스페이스 구조 설계

폴백을 활용한 네임스페이스 구조:

```
locales/
├── ko/
│   ├── common.json      # 공통 번역 (submit, cancel 등)
│   ├── constant.json    # 상수 번역 (status, type 등)
│   ├── dashboard.json   # 대시보드 전용
│   └── user.json        # 사용자 전용
```

```typescript
// 각 페이지/컴포넌트에서
const { t } = useTranslation("dashboard");  // dashboard + common + constant 자동 폴백
```

### 3. 네임스페이스별 파일 분리

각 네임스페이스를 사용하는 로직을 별도 파일로 분리:

```tsx
// ✅ 좋은 예: 컴포넌트 분리
// components/DashboardContent.tsx
function DashboardContent() {
  const { t } = useTranslation("dashboard");
  return <h1>{t("title")}</h1>;
}

// components/ConstantContent.tsx
function ConstantContent() {
  const { t } = useTranslation("constant");
  return <button>{t("submit")}</button>;
}
```

### 4. 별칭 사용은 최후의 수단

**별칭 사용은 가능한 한 피하세요.** Extractor와 호환되지 않습니다.

```tsx
// ⚠️ 피해야 할 패턴
function Component() {
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tConstant } = useTranslation("constant");
  // ...
}
```

**대신:**
```tsx
// ✅ 권장 패턴
function Component() {
  const { t } = useTranslation("dashboard");  // 폴백으로 common, constant 자동 사용
  // ...
}
```

## FAQ

### Q: 여러 네임스페이스를 사용해야 하나요?

A: **아니요. 폴백 네임스페이스를 설정하는 것이 더 좋습니다.**

```typescript
// ✅ 권장: 폴백 설정
i18n.init({
  defaultNS: 'dashboard',
  fallbackNS: ['common', 'constant'],
});

// 사용
const { t } = useTranslation("dashboard");  // dashboard → common → constant 순서로 찾음
```

### Q: 폴백 네임스페이스는 어떻게 설정하나요?

A: i18next 초기화 시 `fallbackNS` 옵션을 설정합니다.

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    defaultNS: 'dashboard',
    fallbackNS: 'common',  // 단일 폴백
    // 또는
    fallbackNS: ['common', 'constant'],  // 여러 폴백
  });
```

### Q: 서버 컴포넌트에서도 폴백이 작동하나요?

A: 네, `getServerTranslation`에서도 폴백이 작동합니다.

```tsx
async function ServerComponent() {
  const { t } = await getServerTranslation("dashboard");  // 폴백 자동 적용
  return <div>{t("submit")}</div>;  // dashboard → common 순서로 찾음
}
```

### Q: 별칭을 사용해야 하는 경우는 언제인가요?

A: **가능한 한 피하세요.** 다음 경우에만 고려하세요:

1. 폴백으로 해결할 수 없는 특수한 경우
2. Extractor가 추출하지 못한다는 점을 인지하고 수동 관리 가능한 경우
3. 네임스페이스별 컴포넌트 분리가 불가능한 경우

**하지만 대부분의 경우 폴백 설정으로 해결 가능합니다.**

## 관련 문서

- [Next.js App Router 가이드](./nextjs-app-router.md)
- [서버 컴포넌트 훅 선택](../advanced/rsc-hook-selection.md)
- [FAQ](../troubleshooting/faq.md)

---

**작성 일자**: 2025년 11월  
**관련 이슈**: 네임스페이스 사용 시 변수명 충돌

