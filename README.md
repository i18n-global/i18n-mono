# i18nexus Turborepo

> 이 README는 항상 LLM에게 복사해서 붙여넣으세요.  
> 이 README는 항상 LLM에게 복사해서 붙여넣으세요.

이 문서는 이 저장소의 단일 운영 문서입니다.  
목표는 다음 3가지입니다.

1. 프로젝트 구조를 빠르게 이해
2. config 파일의 역할과 활용 방식을 정확히 이해
3. README를 LLM에 그대로 붙여넣어 즉시 셋업/검증 자동 실행

---

## 0) TL;DR (사람용 빠른 시작)

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo
npm ci
npm run build
npm run test
npm run lint

cd apps/demo
cp -n .env.example .env.local
npm run dev
```

기본 개발 URL: `http://localhost:3000`

---

## 1) 모노레포 구조

```text
i18nexus-turborepo/
├─ apps/
│  └─ demo/                         # Next.js App Router 데모 앱
│     ├─ app/                       # route/layout/api
│     ├─ page/                      # 페이지 계층 (namespaceLocation과 연결)
│     ├─ features|entities|shared/  # 기능/도메인 레이어
│     ├─ locales/                   # namespace별 번역 JSON + 타입 파일
│     ├─ i18nexus.config.json       # i18n 툴 동작 핵심 설정
│     ├─ next.config.ts             # Next 빌드/웹팩 fallback 설정
│     └─ .env.example               # Firebase/GA 샘플 환경변수
├─ packages/
│  ├─ core/                         # npm: i18nexus (런타임 라이브러리)
│  │  └─ src/
│  │     ├─ components/             # I18nProvider, Devtools
│  │     ├─ hooks/                  # useTranslation, useLanguageSwitcher
│  │     └─ utils/                  # server/cookie/cache/type 등
│  └─ tools/                        # npm: i18nexus-tools (CLI)
│     ├─ bin/                       # i18n-* CLI entrypoint
│     └─ scripts/                   # extractor/wrapper/sheets/type generator
├─ turbo.json                       # Turborepo task graph
├─ package.json                     # 루트 워크스페이스 스크립트
├─ tsconfig.json                    # 루트 TS 기준 설정
├─ .commitlintrc.json               # 커밋 메시지 포맷 규칙
├─ .lintstagedrc.json               # staged 파일 검증 규칙
└─ .husky/                          # pre-commit / pre-push / commit-msg 훅
```

---

## 2) 패키지 역할

### `packages/core` (`i18nexus`)

React/Next.js 런타임 i18n 라이브러리입니다.

1. Client API

- `I18nProvider`
- `useTranslation(namespace)`
- `useLanguageSwitcher()`

2. Server API

- `import { getTranslation } from "i18nexus/server"`
- 서버에서 쿠키/헤더 기반 언어 감지 지원
- namespace 자동 추론 + fallback 옵션 지원

3. 핵심 특징

- 타입 안전 번역 키
- fallback namespace
- lazy namespace loading
- SSR/App Router 대응

### `packages/tools` (`i18nexus-tools`)

i18n 자동화 CLI입니다.

1. `i18n-wrapper`

- 코드 문자열을 `t()` 호출로 자동 래핑
- 파일 수가 많으면 SWC worker 전략 사용

2. `i18n-extractor`

- `t()` 키 추출
- `locales/[namespace]/[lang].json` 생성/병합

3. `i18n-type`

- 로케일 JSON에서 타입 정의 파일 생성
- 예: `locales/types/i18nexus.d.ts`

4. `i18n-upload`, `i18n-download`, `i18n-download-force`

- Google Sheets 양방향 워크플로우
- 시트명 = namespace 매핑

5. `i18n-clean-legacy`

- 미사용/불량 키 정리

### `apps/demo` (`i18nexus-demo`)

실제 사용 시나리오를 담은 Next.js 데모입니다.

1. App Router + i18nexus 연동
2. Firebase 기반 showcase 제출/관리 예시
3. 문서 페이지 + i18n 사용 사례

---

## 3) Config 활용 가이드 (핵심)

## 3.1 루트 `package.json`

핵심 스크립트:

1. `npm run build` => `turbo run build`
2. `npm run test` => `turbo run test`
3. `npm run lint` => `turbo run lint`
4. `npm run dev` => `turbo run dev`

의미:

1. 명령은 루트에서 실행하고, turbo가 변경/의존 그래프 기준으로 패키지별 실행을 관리합니다.
2. 엔진 요구사항: Node `>=18`, npm `>=9`.

## 3.2 `turbo.json`

핵심 포인트:

1. `build`는 `^build` 의존
2. `test`는 `build` 이후
3. `dev`는 캐시 비활성 + persistent
4. `globalEnv`: `TURBO_TOKEN`, `TURBO_TEAM`

활용:

1. CI나 로컬에서 동일 명령 재사용
2. 패키지 단위 실행: `npx turbo run build --filter=i18nexus`

## 3.3 루트 `tsconfig.json`

핵심 포인트:

1. strict 켜짐
2. include: `packages/**/*`, `apps/**/*`
3. 테스트 파일 제외 규칙 존재

활용:

1. 루트 기준 타입 정책의 baseline 역할
2. 각 패키지는 자체 tsconfig로 세부 제어

## 3.4 커밋/훅 config

### `.commitlintrc.json`

커밋 헤더 포맷:

```text
type[scope]: subject
```

유효 예시:

```text
docs[demo]: update README setup flow
feat[core]: add language fallback option
fix[tools]: handle missing credentials file
```

scope 허용값:

1. `core`
2. `tools`
3. `demo`

### `.lintstagedrc.json` + `.husky/*`

1. pre-commit에서 lint-staged + prettier 실행
2. pre-push에서 prettier check 실행
3. commit-msg에서 commitlint 실행

활용 팁:

1. 커밋 전에 메시지 포맷 반드시 맞추기
2. 포맷 이슈가 있으면 자동 수정 후 재커밋

## 3.5 `packages/core/package.json` / `exports`

핵심 포인트:

1. main 진입점: `dist/index.js`
2. 서버 전용 진입점: `./server` => `dist/utils/server.js`

활용:

1. 클라이언트: `import { useTranslation } from "i18nexus"`
2. 서버: `import { getTranslation } from "i18nexus/server"`

## 3.6 `packages/tools/package.json` / `bin`

핵심 포인트:

1. CLI 명령이 `bin`으로 직접 매핑됨
2. 예: `i18n-wrapper`, `i18n-extractor`, `i18n-type` 등

활용:

1. 프로젝트에서 `npx i18n-extractor` 식으로 즉시 사용 가능
2. demo처럼 로컬 의존(`file:../../packages/tools`)일 때도 동일 흐름

## 3.7 `apps/demo/i18nexus.config.json` (가장 중요)

현재 설정:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "en",
  "localesDir": "./locales",
  "sourcePattern": "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}",
  "translationImportSource": "i18nexus",
  "fallbackNamespace": "common",
  "namespaceLocation": "page",
  "lazy": true,
  "googleSheets": {
    "spreadsheetId": "...",
    "credentialsPath": "./credentials.json",
    "sheetName": "translation"
  }
}
```

필드별 활용:

1. `languages`

- 생성/동기화 대상 언어 목록

2. `defaultLanguage`

- 기본 언어

3. `localesDir`

- JSON/타입 생성 기본 루트

4. `sourcePattern`

- extractor/wrapper가 스캔할 코드 범위

5. `translationImportSource`

- 타입 생성 시 타깃 i18n 라이브러리

6. `fallbackNamespace`

- 누락 시 fallback 키 탐색용 namespace

7. `namespaceLocation`

- 페이지 기반 namespace 추론 기준 (`page`)

8. `lazy`

- 런타임 lazy 로딩 시나리오에 맞춘 구성

9. `googleSheets.*`

- 시트 동기화 설정

## 3.8 `apps/demo/next.config.ts`

핵심 포인트:

1. monorepo tracing root 지정
2. 빌드 시 `eslint`/`typescript` 오류 무시 옵션 켜짐
3. 브라우저 빌드에서 Node 모듈 fallback 차단
4. `transpilePackages: ["i18nexus"]`

활용 팁:

1. 프로덕션 품질 게이트는 `npm run lint`, 타입체크를 별도 파이프라인으로 보완
2. i18nexus server 전용 코드가 client bundle에 섞이지 않도록 보호

---

## 4) 매우 상세한 셋업 가이드

## 4.1 사전 요구사항

1. Node.js `>=18.0.0`
2. npm `>=9.0.0`
3. Git + GitHub CLI(`gh`) 권장

확인:

```bash
node -v
npm -v
git --version
gh --version
```

## 4.2 저장소 준비

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo
git pull --ff-only origin main
npm ci
```

## 4.3 전체 품질 검증

```bash
npm run build
npm run test
npm run lint
```

실패 시 패키지 단위로 분리:

```bash
npx turbo run build --filter=i18nexus
npx turbo run build --filter=i18nexus-tools
npx turbo run build --filter=i18nexus-demo

npx turbo run test --filter=i18nexus
npx turbo run test --filter=i18nexus-tools

npx turbo run lint --filter=i18nexus
npx turbo run lint --filter=i18nexus-tools
npx turbo run lint --filter=i18nexus-demo
```

## 4.4 demo 앱 실행

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo
cp -n .env.example .env.local
npm run dev
```

검증 포인트:

1. `http://localhost:3000` 접속
2. 홈 렌더 에러 없음
3. 언어 전환 동작 시 런타임 에러 없음

## 4.5 페이지 기반 i18n 타입 생성 (실무 절차)

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo

# 1) (선택) 하드코딩 문자열 자동 래핑
npx i18n-wrapper -p "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}"

# 2) 키 추출 + namespace별 locale 반영
npx i18n-extractor

# 3) 타입 생성
npx i18n-type
```

결과 확인:

1. `locales/types/i18nexus.d.ts` 생성
2. `locales/<namespace>/en.json`, `locales/<namespace>/ko.json` 반영
3. `TranslationNamespace`에 신규 namespace 포함

## 4.6 생성 후 i18n 사용법

### Client Component

```tsx
"use client";

import { useTranslation } from "i18nexus";

export default function ExampleClient() {
  const { t } = useTranslation<"home">("home");
  return <h1>{t("홈")}</h1>;
}
```

### Server Component

```tsx
import { getTranslation } from "i18nexus/server";

export default async function ExampleServer() {
  const { t } = await getTranslation<"home">("home");
  return <p>{t("설명")}</p>;
}
```

### fallback namespace 전략

1. 공통 문구는 `locales/common/*.json`
2. 페이지 특화 문구는 각 namespace
3. `fallbackNamespace: "common"`을 유지해 중복을 줄임

## 4.7 Google Sheets 연동 (선택)

사전 준비:

1. `apps/demo/credentials.json`
2. `apps/demo/i18nexus.config.json`의 `googleSheets.spreadsheetId`

실행:

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo
npx i18n-upload -s "<SPREADSHEET_ID>"
npx i18n-download -s "<SPREADSHEET_ID>"
```

---

## 5) 환경변수 (demo)

`apps/demo/.env.example` 기준:

1. `NEXT_PUBLIC_GA_ID`
2. `NEXT_PUBLIC_FIREBASE_API_KEY`
3. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
4. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
6. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
7. `NEXT_PUBLIC_FIREBASE_APP_ID`

주의:

1. placeholder 값이어도 서버 기동은 가능
2. Firebase/Auth/Firestore 기능은 제한될 수 있음

---

## 6) CI/CD 동작 이해

## 6.1 CI (`.github/workflows/ci.yml`)

1. 변경 경로 감지
2. `core`/`tools`/`demo` 필요한 job만 실행
3. 각 job은 `npm ci -> lint -> test(해당 시) -> build`

## 6.2 Deploy (`.github/workflows/deploy.yml`)

1. main push 또는 수동 실행
2. `packages/core`, `packages/tools` 버전 확인 후 npm publish
3. publish 성공 시 태그(`core-v*`, `tools-v*`) 생성

---

## 7) LLM 복붙용 마스터 프롬프트 (README 전체용)

아래 블록을 그대로 복사해서 LLM에게 붙여넣으세요.

```text
당신은 로컬 저장소를 직접 조작하는 개발 에이전트다.
반드시 실제 명령을 실행하고 결과를 검증해라. 설명만 하지 말아라.
작업 경로는 /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo 이다.

[최종 목표]
1) 프로젝트 셋업 완료
2) build/test/lint 검증 완료
3) apps/demo 실행 확인 완료
4) 페이지 기반 i18n 타입 생성 워크플로우(wrapper/extractor/type) 검증 완료
5) config 활용 포인트를 실행 결과로 확인

[프로젝트 핵심 구조]
- packages/core: i18n 런타임
- packages/tools: i18n CLI 자동화
- apps/demo: Next.js App Router 데모 + i18nexus.config.json

[핵심 config 체크리스트]
- root package.json scripts와 engines 확인
- turbo.json task dependency 확인
- apps/demo/i18nexus.config.json 값(namespaceLocation, sourcePattern, fallbackNamespace) 확인
- apps/demo/next.config.ts에서 transpilePackages/webpack fallback 확인
- .commitlintrc.json의 커밋 포맷(type[scope]: subject) 확인

[필수 규칙]
1. destructive git 명령 금지 (reset --hard, checkout -- 등)
2. 실패 명령은 에러 핵심 요약 + 재시도 또는 우회 시도
3. 실제 실행 없이 완료 보고 금지
4. 단계별 성공/실패를 명확히 기록

[실행 순서]
1. 환경 확인
   - cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo
   - pwd
   - node -v
   - npm -v
   - git status -sb

2. 의존성 설치
   - npm ci

3. 루트 검증
   - npm run build
   - npm run test
   - npm run lint

4. 실패 시 패키지 단위 재검증
   - npx turbo run build --filter=i18nexus
   - npx turbo run build --filter=i18nexus-tools
   - npx turbo run build --filter=i18nexus-demo
   - npx turbo run test --filter=i18nexus
   - npx turbo run test --filter=i18nexus-tools
   - npx turbo run lint --filter=i18nexus
   - npx turbo run lint --filter=i18nexus-tools
   - npx turbo run lint --filter=i18nexus-demo

5. demo 준비
   - cd apps/demo
   - cp -n .env.example .env.local

6. 페이지 기반 i18n 워크플로우 검증
   - npx i18n-wrapper -p "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}"
   - npx i18n-extractor
   - npx i18n-type
   - 파일 확인:
     - locales/types/i18nexus.d.ts
     - locales/<namespace>/en.json
     - locales/<namespace>/ko.json
   - 타입 사용 확인(코드 레벨 설명 포함):
     - client: useTranslation<"home">("home")
     - server: getTranslation<"home">("home")

7. demo 실행 확인
   - npm run dev
   - http://localhost:3000 확인
   - 홈 렌더/언어 전환 에러 여부 확인
   - 확인 후 dev 프로세스 정리

8. 최종 보고 형식
   - A. 환경/버전
   - B. 설치 결과
   - C. build/test/lint 결과
   - D. config 확인 결과 (root/turbo/demo/commitlint)
   - E. i18n 타입 생성 워크플로우 결과
   - F. demo 실행 확인 결과
   - G. 실패 항목(명령 + 핵심 에러 + 다음 조치)
   - H. 후속 권장 작업 1~3개
```

---

## 8) 문제해결 체크리스트

1. `npm ci` 실패

- Node/npm 버전 먼저 확인
- lockfile/registry 문제 여부 확인

2. commitlint 실패

- 커밋 메시지를 `type[scope]: subject` 형식으로 수정
- scope는 `core|tools|demo` 중 하나 사용

3. demo 빌드는 되는데 런타임 오류 발생

- `.env.local` 값 확인
- Firebase placeholder 여부 확인

4. 타입 파일 생성 누락

- `apps/demo` 경로에서 실행했는지 확인
- `i18n-extractor -> i18n-type` 순서 확인

---

## 중요 문구

이 README는 항상 LLM에게 복사해서 붙여넣으세요.  
이 README는 항상 LLM에게 복사해서 붙여넣으세요.
