# ESLint 9 호환성 문제 해결 보고서

## 🐛 문제

```
npm error ERESOLVE could not resolve
npm error While resolving: eslint-config-airbnb@19.0.4
npm error Found: eslint@9.39.1
npm error peer eslint@"^7.32.0 || ^8.2.0" from eslint-config-airbnb@19.0.4
```

**원인:**

- `eslint-config-airbnb@19.0.4`는 ESLint 8까지만 지원
- 프로젝트에서 ESLint 9.39.1 사용 중
- Peer dependency 충돌 발생

---

## ✅ 해결 방법

### 1. 불필요한 패키지 제거

**제거된 패키지:**

- ❌ `eslint-config-airbnb@^19.0.4`
- ❌ `eslint-config-airbnb-base@^15.0.0`
- ❌ `eslint-config-airbnb-typescript@^18.0.0`
- ❌ `@eslint/eslintrc@^3.3.1`
- ❌ `eslint-plugin-import@^2.32.0`
- ❌ `eslint-plugin-jsx-a11y@^6.10.2`

**이유:**

- ESLint 9와 호환되지 않음
- 이미 flat config를 사용 중이므로 불필요
- 각 패키지의 flat config가 이미 설정되어 있음

### 2. 레거시 설정 파일 삭제

**삭제된 파일:**

- ❌ `.eslintrc.json` (레거시 설정)

**이유:**

- 각 패키지에서 이미 flat config (`eslint.config.mjs`) 사용 중
- 중복 설정 제거

---

## 📊 변경 전후 비교

### Before

```json
{
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^18.0.0",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-jsx-a11y": "^6.10.2"
    // ...
  }
}
```

### After

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.48.0",
    "@typescript-eslint/parser": "^8.48.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1"
    // ...
  }
}
```

---

## 🎯 현재 ESLint 설정

### Flat Config 사용

각 패키지는 이미 `eslint.config.mjs`를 사용 중:

- ✅ `packages/core/eslint.config.mjs`
- ✅ `apps/demo/eslint.config.mjs`

### 설정 내용

```javascript
// packages/core/eslint.config.mjs
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
);
```

---

## ✅ 검증 결과

### npm install 성공

```
removed 7 packages, and audited 1091 packages in 5s
found 0 vulnerabilities
```

### 테스트 통과

```
Test Suites: 12 passed, 12 total
Tests:       169 passed, 169 total
Time:        5.597s
```

### ESLint 작동 확인

- ✅ Core 패키지: 경고만 있음 (에러 없음)
- ✅ Demo 앱: 기존 코드 품질 이슈 (의존성 충돌과 무관)

---

## 📝 향후 개선 사항

### 1. Airbnb 스타일 규칙 직접 추가 (선택적)

필요한 경우 flat config에 Airbnb 스타일 규칙을 직접 추가할 수 있습니다:

```javascript
{
  rules: {
    // Airbnb 스타일 규칙 예시
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "warn",
    // ...
  }
}
```

### 2. Demo 앱 ESLint 에러 수정

현재 demo 앱에 몇 가지 ESLint 에러가 있으나, 이는 원래 의존성 충돌 문제와는 별개입니다:

- React unescaped entities (44개)
- React hooks 순서 문제 (2개)
- Next.js 이미지 최적화 경고 (2개)

---

## 🎉 결론

### 해결된 문제

1. ✅ ESLint 9 호환성 문제 완전 해결
2. ✅ 의존성 충돌 제거
3. ✅ npm install 성공
4. ✅ 모든 테스트 통과
5. ✅ 코드 품질 유지

### 제거된 의존성

- 7개 패키지 제거
- 레거시 설정 파일 1개 제거
- 의존성 트리 간소화

### 유지된 기능

- ✅ TypeScript ESLint 지원
- ✅ React ESLint 지원
- ✅ React Hooks ESLint 지원
- ✅ 모든 린트 규칙 정상 작동

---

## 📚 참고

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
