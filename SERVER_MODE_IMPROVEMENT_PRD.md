# Server Mode Improvement PRD

## 문제 정의 (Problem Statement)

### 현재 문제점

1. **`i18n-sheets init` 명령이 서버 모드를 지원하지 않음**
   - 초기화 시 클라이언트/서버 모드 선택 없음
   - 생성되는 `i18nexus.config.json`에 `mode` 필드가 없음
   - 사용자가 수동으로 설정 파일을 수정해야 함

2. **`getTranslation` 함수의 기능 부족**
   - 네임스페이스 자동 감지 없음 (항상 수동으로 지정 필요)
   - fallbackNamespace 설정 무시됨
   - 타입 추론이 약함 (제네릭 타입 명시 필요)
   - 에러 처리가 미흡함 (namespace 로드 실패 시 조용히 실패)

3. **설정과 도구의 불일치**
   - `i18nexus.config.json`에 `mode` 필드가 있지만 활용도가 낮음
   - `i18n-wrapper`는 `mode`를 보지만, `i18n-sheets init`은 생성하지 않음
   - 서버/클라이언트 모드가 프로젝트 전반에 통합되지 않음

4. **개발자 경험 문제**
   - 서버 컴포넌트 사용 시 매번 `await getTranslation("namespace")`로 명시 필요
   - 클라이언트 컴포넌트는 `useTranslation()`만 호출하면 되는데 일관성 없음
   - 타입 안정성이 클라이언트보다 낮음

---

## 목표 (Goals)

### 1차 목표: `i18n-sheets init` 개선

- ✅ 초기화 시 프로젝트 모드 선택 (Client/Server/Both)
- ✅ 선택에 따라 적절한 `i18nexus.config.json` 생성
- ✅ 서버 모드 선택 시 `mode`, `serverTranslationFunction` 자동 설정
- ✅ 샘플 파일 생성 (서버/클라이언트 예제)

### 2차 목표: `getTranslation` 함수 개선

- ✅ fallbackNamespace 자동 적용
- ✅ 네임스페이스 자동 추론 (파일 경로 기반)
- ✅ 타입 안정성 강화
- ✅ 에러 처리 개선 및 명확한 에러 메시지
- ✅ 성능 최적화 (번역 캐싱)

### 3차 목표: 통합 개발 경험

- ✅ `i18n-wrapper`와 `i18n-extractor` 자동 연동
- ✅ 타입 생성 자동화
- ✅ 서버/클라이언트 혼합 프로젝트 지원

---

## 요구사항 (Requirements)

### 1. `i18n-sheets init` 개선

#### 1.1 대화형 모드 선택

```bash
npx i18n-sheets init

? Select your project mode: (Use arrow keys)
  ❯ Client Components (React, Next.js with 'use client')
    Server Components (Next.js App Router, RSC)
    Both (Mixed client and server components)

? Select default language: (Use arrow keys)
  ❯ Korean (ko)
    English (en)
    Japanese (ja)
    Other

? Enter languages (comma-separated): ko,en

? Where is your source code? (app/**/*.{ts,tsx})

? Enable namespace support? (Y/n) Y

? Namespace location (for automatic inference): app/(routes)

✨ Configuration created successfully!
```

#### 1.2 생성되는 설정 파일

**Client Mode 선택 시:**

```json
{
  "languages": ["ko", "en"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus",
  "mode": "client",
  "framework": "nextjs",
  "namespaceLocation": "app/(routes)",
  "fallbackNamespace": "common",
  "googleSheets": {
    "spreadsheetId": "",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

**Server Mode 선택 시:**

```json
{
  "languages": ["ko", "en"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus/server",
  "mode": "server",
  "serverTranslationFunction": "getTranslation",
  "framework": "nextjs",
  "namespaceLocation": "app/(routes)",
  "fallbackNamespace": "common",
  "googleSheets": {
    "spreadsheetId": "",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

**Both Mode 선택 시:**

```json
{
  "languages": ["ko", "en"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "app/**/*.{ts,tsx}",
  "translationImportSource": "i18nexus",
  "mode": "auto",
  "serverTranslationFunction": "getTranslation",
  "framework": "nextjs",
  "namespaceLocation": "app/(routes)",
  "fallbackNamespace": "common",
  "googleSheets": {
    "spreadsheetId": "",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

#### 1.3 샘플 파일 생성

**Server Mode 선택 시 생성되는 예제:**

```tsx
// examples/server-component-example.tsx
import { getTranslation } from "i18nexus/server";

export default async function ServerExample() {
  const { t } = await getTranslation();

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("서버 컴포넌트 예제입니다")}</p>
    </div>
  );
}
```

**Client Mode 선택 시 생성되는 예제:**

```tsx
// examples/client-component-example.tsx
"use client";

import { useTranslation } from "i18nexus";

export default function ClientExample() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("환영합니다")}</h1>
      <p>{t("클라이언트 컴포넌트 예제입니다")}</p>
    </div>
  );
}
```

---

### 2. `getTranslation` 함수 개선

#### 2.1 네임스페이스 자동 추론

**현재 (수동 지정 필요):**

```tsx
// app/dashboard/page.tsx
import { getTranslation } from "i18nexus/server";

export default async function DashboardPage() {
  const { t } = await getTranslation("dashboard"); // 매번 명시 필요
  return <h1>{t("제목")}</h1>;
}
```

**개선 후 (자동 추론):**

```tsx
// app/dashboard/page.tsx
import { getTranslation } from "i18nexus/server";

export default async function DashboardPage() {
  const { t } = await getTranslation(); // 파일 경로에서 자동 추론
  return <h1>{t("제목")}</h1>;
}
```

**구현 방식:**

- `Error.stack`을 사용하여 호출한 파일의 경로 추출
- `i18nexus.config.json`의 `namespaceLocation` 설정 활용
- 파일 경로에서 네임스페이스 추론 (기존 `namespace-inference.ts` 로직 재사용)

#### 2.2 fallbackNamespace 자동 적용

**현재:**

```tsx
// 네임스페이스 외부 파일
import { getTranslation } from "i18nexus/server";

export default async function Component() {
  const { t } = await getTranslation("common"); // 수동으로 common 지정
  return <h1>{t("버튼")}</h1>;
}
```

**개선 후:**

```tsx
// 네임스페이스 외부 파일
import { getTranslation } from "i18nexus/server";

export default async function Component() {
  const { t } = await getTranslation(); // config의 fallbackNamespace 자동 사용
  return <h1>{t("버튼")}</h1>;
}
```

#### 2.3 타입 안정성 강화

**개선된 함수 시그니처:**

```typescript
// packages/core/src/utils/server.ts

/**
 * 타입 안전한 서버 번역 함수
 *
 * @param namespace - 네임스페이스 (생략 시 자동 추론)
 * @param options - 추가 옵션
 *
 * @example
 * // 자동 추론
 * const { t } = await getTranslation();
 *
 * @example
 * // 명시적 지정
 * const { t } = await getTranslation<"home">("home");
 */
export async function getTranslation<
  NS extends TranslationNamespace = TranslationNamespace,
>(
  namespace?: NS,
  options?: GetTranslationOptions,
): Promise<GetTranslationReturn<NS>>;

interface GetTranslationOptions {
  localesDir?: string;
  cookieName?: string;
  defaultLanguage?: string;
  availableLanguages?: string[];
  /** 자동 추론 비활성화 */
  disableAutoInference?: boolean;
  /** 에러 발생 시 fallback 네임스페이스 사용 */
  useFallbackOnError?: boolean;
}

interface GetTranslationReturn<NS extends TranslationNamespace> {
  /** 타입 안전한 번역 함수 */
  t: TranslationFunction<NS>;
  /** 현재 언어 */
  language: string;
  /** 언어 별칭 (react-i18next 호환) */
  lng: string;
  /** 현재 네임스페이스 */
  namespace: NS;
  /** 번역 객체 */
  translations: Record<string, Record<string, string>>;
  /** 현재 언어의 번역 딕셔너리 */
  dict: Record<string, string>;
}
```

#### 2.4 에러 처리 개선

**현재 문제:**

- 네임스페이스 로드 실패 시 조용히 전체 번역 로드로 fallback
- 에러 원인을 알 수 없음

**개선 후:**

```typescript
export async function getTranslation<NS extends string = string>(
  namespace?: NS,
  options?: GetTranslationOptions,
) {
  const config = await loadConfigSilently();

  // 1. 네임스페이스 결정 (우선순위)
  let resolvedNamespace = namespace;

  if (!resolvedNamespace && !options?.disableAutoInference) {
    // 자동 추론 시도
    try {
      resolvedNamespace = inferNamespaceFromCallSite(config);
    } catch (error) {
      console.warn("⚠️  Failed to infer namespace from call site:", error);
    }
  }

  // fallback으로 설정 파일의 fallbackNamespace 사용
  if (!resolvedNamespace) {
    resolvedNamespace = config?.fallbackNamespace as NS;
  }

  // 여전히 없으면 "common" 사용
  if (!resolvedNamespace) {
    resolvedNamespace = "common" as NS;
  }

  // 2. 번역 로드
  let translations: Record<string, Record<string, string>>;

  try {
    const nsTranslations = await import(
      `${localesDir}/${resolvedNamespace}/${language}.json`
    );
    translations = { [resolvedNamespace]: nsTranslations.default };
  } catch (error) {
    if (options?.useFallbackOnError && config?.fallbackNamespace) {
      console.warn(
        `⚠️  Namespace '${resolvedNamespace}' not found, using fallback '${config.fallbackNamespace}'`,
      );

      try {
        const fallbackTranslations = await import(
          `${localesDir}/${config.fallbackNamespace}/${language}.json`
        );
        translations = {
          [config.fallbackNamespace]: fallbackTranslations.default,
        };
        resolvedNamespace = config.fallbackNamespace as NS;
      } catch (fallbackError) {
        throw new Error(
          `Failed to load namespace '${resolvedNamespace}' and fallback '${config.fallbackNamespace}': ${fallbackError}`,
        );
      }
    } else {
      throw new Error(
        `Failed to load namespace '${resolvedNamespace}': ${error}\n` +
          `Make sure the file exists at: ${localesDir}/${resolvedNamespace}/${language}.json`,
      );
    }
  }

  // 3. 번역 함수 생성
  const t = createServerTranslation(language, translations);
  const dict = getServerTranslations(language, translations);

  return {
    t,
    language,
    lng: language,
    namespace: resolvedNamespace,
    translations,
    dict,
  };
}
```

#### 2.5 네임스페이스 자동 추론 구현

**callsite 추론 함수:**

```typescript
// packages/core/src/utils/callsite-inference.ts

/**
 * Error.stack을 파싱하여 호출한 파일의 경로를 추출
 */
function getCallSiteFilePath(): string | null {
  const error = new Error();
  const stack = error.stack;

  if (!stack) return null;

  // 스택 트레이스 파싱
  const lines = stack.split("\n");

  // getTranslation을 호출한 파일 찾기 (첫 번째 외부 호출)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // node_modules, i18nexus 내부 파일은 스킵
    if (line.includes("node_modules") || line.includes("i18nexus/dist")) {
      continue;
    }

    // 파일 경로 추출 (여러 형식 지원)
    const match =
      line.match(/\((.+):(\d+):(\d+)\)/) || line.match(/at (.+):(\d+):(\d+)/);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * 파일 경로에서 네임스페이스 추론
 */
export function inferNamespaceFromCallSite(
  config: I18nexusConfig | null,
): string | null {
  const filePath = getCallSiteFilePath();

  if (!filePath || !config?.namespaceLocation) {
    return null;
  }

  // 기존 namespace-inference 로직 재사용
  const namespacingConfig = {
    enabled: true,
    basePath: config.namespaceLocation,
    defaultNamespace: config.fallbackNamespace || "common",
    framework: config.namespacing?.framework || "nextjs-app",
    strategy: config.namespacing?.strategy || "first-folder",
  };

  return inferNamespaceFromFile(filePath, "", namespacingConfig);
}
```

#### 2.6 성능 최적화 (번역 캐싱)

**캐싱 전략:**

```typescript
// packages/core/src/utils/translation-cache.ts

interface CacheEntry {
  translations: Record<string, Record<string, string>>;
  timestamp: number;
  language: string;
  namespace: string;
}

const translationCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000; // 1분

/**
 * 캐시 키 생성
 */
function getCacheKey(namespace: string, language: string): string {
  return `${namespace}:${language}`;
}

/**
 * 캐시에서 번역 로드
 */
export function getCachedTranslations(
  namespace: string,
  language: string,
): Record<string, Record<string, string>> | null {
  const key = getCacheKey(namespace, language);
  const entry = translationCache.get(key);

  if (!entry) return null;

  // TTL 확인
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    translationCache.delete(key);
    return null;
  }

  return entry.translations;
}

/**
 * 번역을 캐시에 저장
 */
export function cacheTranslations(
  namespace: string,
  language: string,
  translations: Record<string, Record<string, string>>,
): void {
  const key = getCacheKey(namespace, language);

  translationCache.set(key, {
    translations,
    timestamp: Date.now(),
    language,
    namespace,
  });
}

/**
 * 캐시 무효화
 */
export function invalidateCache(namespace?: string, language?: string): void {
  if (!namespace && !language) {
    // 전체 캐시 삭제
    translationCache.clear();
    return;
  }

  if (namespace && language) {
    // 특정 네임스페이스+언어 삭제
    const key = getCacheKey(namespace, language);
    translationCache.delete(key);
    return;
  }

  // 네임스페이스 또는 언어 기준으로 삭제
  for (const [key, entry] of translationCache.entries()) {
    if (
      (namespace && entry.namespace === namespace) ||
      (language && entry.language === language)
    ) {
      translationCache.delete(key);
    }
  }
}
```

**getTranslation에 캐싱 적용:**

```typescript
export async function getTranslation<NS extends string = string>(
  namespace?: NS,
  options?: GetTranslationOptions,
) {
  // ... 네임스페이스 결정 로직 ...

  // 캐시 확인
  if (!options?.disableCache) {
    const cached = getCachedTranslations(resolvedNamespace, language);
    if (cached) {
      const t = createServerTranslation(language, cached);
      const dict = getServerTranslations(language, cached);

      return {
        t,
        language,
        lng: language,
        namespace: resolvedNamespace,
        translations: cached,
        dict,
      };
    }
  }

  // 번역 로드
  const translations = await loadNamespaceTranslations(
    resolvedNamespace,
    language,
    localesDir,
  );

  // 캐시 저장
  if (!options?.disableCache) {
    cacheTranslations(resolvedNamespace, language, translations);
  }

  // ... 나머지 로직 ...
}
```

---

### 3. 통합 개발 워크플로우

#### 3.1 프로젝트 초기화 자동화

```bash
# 1. 프로젝트 초기화 (대화형)
npx i18n-sheets init

# 2. 설정 확인
cat i18nexus.config.json

# 3. 예제 파일 자동 생성됨
# - examples/server-component-example.tsx (server mode)
# - examples/client-component-example.tsx (client mode)

# 4. 개발 시작
# 코드 작성 → wrapper 실행 → extractor 실행 → sheets 동기화
```

#### 3.2 통합 명령어 추가

```bash
# 전체 워크플로우 자동 실행
npx i18n-workflow

# 내부적으로 실행되는 순서:
# 1. i18n-wrapper (코드 변환)
# 2. i18n-extractor (키 추출)
# 3. i18n-sheets upload (Google Sheets 업로드)
# 4. 타입 생성
```

---

## 구현 계획 (Implementation Plan)

### Phase 1: `i18n-sheets init` 개선 (2-3일)

**파일 수정:**

- `packages/tools/bin/i18n-sheets.ts` - init 명령 개선
- `packages/tools/scripts/config-loader.ts` - 설정 타입 확장

**작업 내용:**

1. ✅ `inquirer` 라이브러리 추가 (대화형 CLI)
2. ✅ 프로젝트 모드 선택 UI 구현
3. ✅ 모드별 설정 파일 템플릿 작성
4. ✅ 예제 파일 자동 생성 로직
5. ✅ 테스트 작성

### Phase 2: `getTranslation` 함수 개선 (3-4일)

**파일 생성:**

- `packages/core/src/utils/callsite-inference.ts` - callsite 추론
- `packages/core/src/utils/translation-cache.ts` - 캐싱 시스템

**파일 수정:**

- `packages/core/src/utils/server.ts` - getTranslation 개선
- `packages/core/src/utils/config-loader.ts` - 설정 로더 개선

**작업 내용:**

1. ✅ callsite 추론 함수 구현
2. ✅ 네임스페이스 자동 추론 로직
3. ✅ fallbackNamespace 자동 적용
4. ✅ 에러 처리 개선
5. ✅ 캐싱 시스템 구현
6. ✅ 타입 정의 강화
7. ✅ 단위 테스트 작성
8. ✅ 통합 테스트 작성

### Phase 3: 타입 시스템 개선 (2일)

**파일 수정:**

- `packages/tools/scripts/extractor/type-generator.ts` - 서버용 타입 생성

**작업 내용:**

1. ✅ 서버 컴포넌트용 타입 정의 생성
2. ✅ `TranslationFunction<NS>` 타입 개선
3. ✅ 네임스페이스 타입 자동 생성
4. ✅ 타입 추론 테스트

### Phase 4: 통합 및 문서화 (2일)

**파일 수정:**

- `packages/core/README.md` - 서버 모드 문서 추가
- `packages/tools/README.md` - init 명령 가이드 추가
- `packages/tools/docs/guides/server-components.md` - 새 가이드 작성

**작업 내용:**

1. ✅ README 업데이트
2. ✅ 마이그레이션 가이드 작성
3. ✅ 예제 코드 추가
4. ✅ 데모 앱 업데이트

---

## 성공 지표 (Success Metrics)

1. **개발자 경험**
   - `i18n-sheets init` 실행 후 추가 수동 설정 없이 바로 사용 가능
   - 서버 컴포넌트에서 `await getTranslation()` 만으로 자동 추론
   - 타입 에러가 명확하고 해결 방법 제시

2. **성능**
   - 번역 로드 시간 50% 감소 (캐싱 적용)
   - 타입 추론 속도 향상

3. **코드 품질**
   - 수동으로 네임스페이스 지정하는 코드 80% 감소
   - 타입 안정성 100% (모든 키와 네임스페이스 타입 체크)

---

## 위험 요소 및 완화 방안 (Risks & Mitigation)

### 위험 1: callsite 추론이 모든 환경에서 작동하지 않을 수 있음

**완화 방안:**

- `disableAutoInference` 옵션 제공
- fallback으로 명시적 네임스페이스 지정 지원
- 에러 메시지에 해결 방법 명시

### 위험 2: 캐싱으로 인한 번역 업데이트 지연

**완화 방안:**

- 개발 모드에서는 캐싱 비활성화 옵션
- `invalidateCache()` API 제공
- TTL을 짧게 설정 (1분)

### 위험 3: 기존 코드와의 호환성

**완화 방안:**

- 모든 변경사항은 하위 호환성 유지
- 기존 명시적 네임스페이스 지정 방식도 계속 지원
- 마이그레이션 가이드 제공

---

## 향후 계획 (Future Plans)

1. **AI 기반 번역 제안**
   - OpenAI/Claude API 연동
   - 자동 번역 + 검토 워크플로우

2. **실시간 번역 동기화**
   - WebSocket 기반 실시간 동기화
   - 여러 개발자가 동시에 번역 작업 가능

3. **번역 품질 검증**
   - 번역 키 컨벤션 체크
   - 번역 누락 감지
   - 번역 일관성 검증

---

## 결론 (Conclusion)

이 PRD에서 제안하는 개선사항들은 i18nexus의 서버 컴포넌트 지원을 크게 향상시킬 것입니다:

1. **개발자 경험 향상**: `i18n-sheets init`으로 프로젝트 설정이 간편해지고, 자동 추론으로 보일러플레이트 코드 감소
2. **타입 안정성**: 서버 컴포넌트에서도 클라이언트와 동일한 수준의 타입 안정성 제공
3. **성능 최적화**: 캐싱으로 번역 로드 성능 향상
4. **통합 워크플로우**: 초기화부터 배포까지 일관된 개발 경험 제공

이를 통해 i18nexus는 Next.js App Router와 서버 컴포넌트를 지원하는 가장 개발자 친화적인 i18n 솔루션이 될 것입니다.
