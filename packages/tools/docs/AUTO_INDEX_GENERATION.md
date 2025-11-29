# i18n-extractor: 자동 index.ts 생성 기능

## 개요

`i18n-extractor`가 이제 네임스페이스 모드에서 자동으로 `locales/index.ts` 파일을 생성합니다.

## 기능

extractor가 번역 키를 추출할 때마다 자동으로:

1. 모든 네임스페이스의 JSON 파일 import
2. `translations` 객체 생성 (네임스페이스 최상위 구조)
3. `createI18n`으로 `i18n` 객체 생성
4. `fallbackNamespace` 자동 설정

## 사용법

```bash
npx i18n-extractor
```

실행 시 다음과 같은 `locales/index.ts` 파일이 자동 생성됩니다:

```typescript
import { createI18n } from "i18nexus";

import enCommon from "./common/en.json";
import koCommon from "./common/ko.json";
import enHome from "./home/en.json";
import koHome from "./home/ko.json";
// ... 모든 네임스페이스 import

// i18nexus는 namespace가 최상위인 구조를 기대합니다
// { namespace: { language: { key: value } } }
export const translations = {
  common: {
    en: enCommon,
    ko: koCommon,
  },
  home: {
    en: enHome,
    ko: koHome,
  },
  // ... 모든 네임스페이스
} as const;

// createI18n으로 i18n 객체 생성
export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});
```

## 장점

1. **자동화**: 새 네임스페이스 추가 시 수동으로 import 추가 불필요
2. **타입 안전성**: `as const`로 타입 추론 자동화
3. **일관성**: 모든 프로젝트에서 동일한 구조 유지
4. **유지보수**: 네임스페이스 추가/삭제 시 자동 반영

## 설정

`i18nexus.config.json`에서 `fallbackNamespace` 설정:

```json
{
  "fallbackNamespace": "common",
  "namespaceLocation": "pages"
}
```

이 설정은 자동으로 생성된 `index.ts`의 `createI18n` 호출에 반영됩니다.

## 구현 세부사항

### 파일 위치

- `packages/tools/scripts/extractor/output-generator.ts`: `generateNamespaceIndexFile()` 함수
- `packages/tools/scripts/extractor/index.ts`: `extract()` 메서드에서 호출

### 주요 함수

#### `generateNamespaceIndexFile()`

```typescript
export function generateNamespaceIndexFile(
  namespaces: string[],
  languages: string[],
  outputDir: string,
  fallbackNamespace: string,
  dryRun: boolean,
): void;
```

**매개변수:**

- `namespaces`: 추출된 모든 네임스페이스 목록
- `languages`: 지원하는 언어 목록 (예: `["en", "ko"]`)
- `outputDir`: 출력 디렉토리 (예: `"./locales"`)
- `fallbackNamespace`: fallback 네임스페이스 (예: `"common"`)
- `dryRun`: dry-run 모드 여부

**기능:**

1. 네임스페이스를 알파벳 순으로 정렬
2. 각 네임스페이스의 모든 언어 파일 import 생성
3. 변수명 자동 생성 (kebab-case → PascalCase)
4. `translations` 객체 구조 생성
5. `createI18n` 호출 코드 생성

### 변수명 규칙

kebab-case 네임스페이스를 PascalCase 변수명으로 변환:

- `"admin-dashboard"` → `enAdminDashboard`, `koAdminDashboard`
- `"docs-i18nexus-tools"` → `enDocsI18nexusTools`, `koDocsI18nexusTools`
- `"getting-started"` → `enGettingStarted`, `koGettingStarted`

## 예제

### Before (수동 관리)

```typescript
// locales/index.ts - 수동으로 작성 및 유지보수 필요
import enCommon from "./common/en.json";
import koCommon from "./common/ko.json";
// 새 네임스페이스 추가 시 수동으로 import 추가 필요

export const translations = {
  common: { en: enCommon, ko: koCommon },
  // 새 네임스페이스 추가 시 수동으로 객체에 추가 필요
};

export const i18n = createI18n(translations);
```

### After (자동 생성)

```bash
npx i18n-extractor
# ✅ Generated index.ts with 20 namespaces
```

```typescript
// locales/index.ts - 자동 생성됨!
import { createI18n } from "i18nexus";

import enAdminDashboard from "./admin-dashboard/en.json";
import koAdminDashboard from "./admin-dashboard/ko.json";
// ... 모든 네임스페이스 자동 import

export const translations = {
  "admin-dashboard": {
    en: enAdminDashboard,
    ko: koAdminDashboard,
  },
  // ... 모든 네임스페이스 자동 생성
} as const;

export const i18n = createI18n(translations, {
  fallbackNamespace: "common",
});
```

## 로그

extractor 실행 시 생성 로그 확인:

```bash
$ npx i18n-extractor
✅ Generated index.ts with 20 namespaces
```

## 주의사항

1. **기존 `locales/index.ts` 덮어쓰기**: extractor 실행 시 기존 파일을 덮어씁니다
2. **수동 수정 유실**: 수동으로 추가한 코드는 extractor 재실행 시 사라집니다
3. **파싱 오류**: 일부 파일에서 파싱 오류 발생 시 해당 네임스페이스는 누락될 수 있습니다

## 향후 개선사항

- [ ] 기존 `index.ts`의 커스텀 코드 보존
- [ ] 파싱 오류 발생 시에도 기존 네임스페이스 폴더 기반으로 생성
- [ ] dry-run 모드에서 변경사항 미리보기
- [ ] 생성된 파일에 타임스탬프 및 경고 주석 추가

## 관련 파일

- `packages/tools/scripts/extractor/output-generator.ts`
- `packages/tools/scripts/extractor/index.ts`
- `packages/tools/scripts/extractor/namespace-inference.ts`
