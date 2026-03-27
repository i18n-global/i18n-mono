# i18nexus Turborepo

> 이 README는 항상 LLM에게 복사해서 붙여넣으세요.  
> 이 README는 항상 LLM에게 복사해서 붙여넣으세요.

## 목적

이 문서는 다음 2가지를 한 번에 해결합니다.

1. 프로젝트 구조/사용법 전체 설명
2. LLM에 그대로 복붙하면 셋업/검증을 실제 실행할 수 있는 실행 프롬프트 제공

별도 온보딩 문서 없이 이 README 하나로 진행할 수 있도록 작성되어 있습니다.

## 저장소 구조 (상세)

```text
i18nexus-turborepo/
├─ apps/
│  └─ demo/                      # Next.js App Router 데모 앱
│     ├─ app/                    # 라우트/레이아웃/API
│     ├─ locales/                # namespace별 번역 JSON
│     ├─ features|entities|...   # 기능/도메인 UI 레이어
│     ├─ i18nexus.config.json    # tools 동작 설정
│     └─ .env.example            # Firebase/GA 샘플 환경변수
├─ packages/
│  ├─ core/                      # npm: i18nexus (런타임)
│  │  └─ src/
│  │     ├─ components/          # I18nProvider, Devtools
│  │     ├─ hooks/               # useTranslation, useLanguageSwitcher
│  │     └─ utils/               # server, cookie, cache, type utils
│  └─ tools/                     # npm: i18nexus-tools (CLI)
│     ├─ bin/                    # i18n-* 실행 엔트리
│     └─ scripts/
│        ├─ extractor/           # t() 키 추출
│        ├─ t-wrapper/           # 하드코딩 문자열 자동 래핑
│        ├─ google-sheets.ts     # 시트 업/다운로드
│        └─ clean-legacy.ts      # 미사용 키 정리
├─ turbo.json                    # Turborepo task 파이프라인
└─ package.json                  # 루트 workspace 스크립트
```

## 패키지별 역할

### 1) `packages/core` (`i18nexus`)

React/Next.js 런타임 i18n 라이브러리입니다.

1. Client API

- `I18nProvider`
- `useTranslation(namespace)`
- `useLanguageSwitcher()`

2. Server API

- `import { getTranslation } from "i18nexus/server"`
- 쿠키/헤더 기반 언어 감지
- 네임스페이스 자동 추론(옵션)

3. 특징

- 타입 안전 번역 키
- namespace + fallback 지원
- lazy namespace loading 지원

### 2) `packages/tools` (`i18nexus-tools`)

i18n 자동화 CLI 패키지입니다.

1. `i18n-wrapper`

- 하드코딩 문자열을 `t()`로 자동 래핑
- 파일 수에 따라 Babel/SWC worker 전략 자동 선택

2. `i18n-extractor`

- 코드의 `t()` 호출에서 키 추출
- `locales/[namespace]/[lang].json` 생성/병합

3. `i18n-type`

- 로케일 JSON에서 타입 정의 파일 생성
- 예: `locales/types/i18nexus.d.ts`

4. `i18n-upload` / `i18n-download`

- Google Sheets 동기화
- 시트명 = namespace로 자동 매핑

5. `i18n-clean-legacy`

- 미사용/유효하지 않은 번역 키 정리

### 3) `apps/demo` (`i18nexus-demo`)

실사용 예시 앱입니다.

1. Next.js App Router 구조
2. `i18nexus` 런타임 실제 연결
3. Firebase 기반 showcase 제출/관리 샘플
4. docs/cli/provider/server 예시 페이지 포함

## 실행/개발 명령어

## 루트 (모노레포)

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo

# 설치
npm ci

# 전체 빌드/테스트/린트
npm run build
npm run test
npm run lint

# 전체 dev 파이프라인
npm run dev
```

## core 단독

```bash
npx turbo run build --filter=i18nexus
npx turbo run test --filter=i18nexus
npx turbo run lint --filter=i18nexus
```

## tools 단독

```bash
npx turbo run build --filter=i18nexus-tools
npx turbo run test --filter=i18nexus-tools
npx turbo run lint --filter=i18nexus-tools
```

## demo 단독

```bash
npx turbo run build --filter=i18nexus-demo
npx turbo run lint --filter=i18nexus-demo
```

## demo 앱 로컬 실행

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo
cp -n .env.example .env.local
npm run dev
```

기본 URL: `http://localhost:3000`

## i18n 실사용 워크플로우 (demo 기준)

`apps/demo/i18nexus.config.json` 기준입니다.

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo

# 1) 하드코딩 문자열 래핑
npx i18n-wrapper -p "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}"

# 2) 키 추출 + locale 파일 반영
npx i18n-extractor

# 3) 타입 정의 생성
npx i18n-type
```

검증 파일:

1. `apps/demo/locales/types/i18nexus.d.ts` 생성 여부
2. `apps/demo/locales/<namespace>/en.json`, `ko.json` 반영 여부

## 페이지별 타입 생성 방법 (상세)

이 리포(`apps/demo`)는 `i18nexus.config.json`에서 아래처럼 페이지 기반 설정을 사용합니다.

1. `namespaceLocation: "page"`
2. `sourcePattern: "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}"`
3. `fallbackNamespace: "common"`

즉, `page/*` 레이어를 기준으로 namespace를 관리하고 타입을 생성합니다.

### 단계별 절차

1. 번역 대상 코드 작성

- `t("키")`를 직접 쓰거나 하드코딩 문자열을 작성합니다.
- 하드코딩 문자열은 `i18n-wrapper`로 자동 변환 가능합니다.

2. 문자열 래핑 (필요한 경우)

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo
npx i18n-wrapper -p "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}"
```

3. 키 추출(페이지/네임스페이스별 JSON 생성/병합)

```bash
npx i18n-extractor
```

4. 타입 생성

```bash
npx i18n-type
```

5. 결과 확인

1. `locales/<namespace>/en.json`, `locales/<namespace>/ko.json` 생성/업데이트 확인
1. `locales/types/i18nexus.d.ts` 생성 확인
1. `TranslationNamespace`에 기대한 페이지 namespace가 포함됐는지 확인

## 페이지별 타입 생성 후 i18n 사용법 (간단)

### Client Component

```tsx
"use client";

import { useTranslation } from "i18nexus";

export default function HomeTitle() {
  const { t } = useTranslation<"home">("home");
  return <h1>{t("홈")}</h1>;
}
```

### Server Component

```tsx
import { getTranslation } from "i18nexus/server";

export default async function HomeServer() {
  const { t } = await getTranslation<"home">("home");
  return <p>{t("설명")}</p>;
}
```

### fallback namespace 사용 팁

1. 현재 demo 설정의 fallback은 `common`입니다.
2. 공통 문구는 `locales/common/*.json`에 두고, 페이지 전용 문구는 각 namespace로 분리하세요.
3. 타입 생성 후에는 존재하지 않는 키 사용 시 TypeScript 단계에서 빠르게 잡을 수 있습니다.

## Google Sheets 동기화 (선택)

사전 준비:

1. `apps/demo/credentials.json` 준비
2. `apps/demo/i18nexus.config.json`의 `googleSheets.spreadsheetId` 확인

실행:

```bash
cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo/apps/demo

# 업로드
npx i18n-upload -s "<SPREADSHEET_ID>"

# 다운로드
npx i18n-download -s "<SPREADSHEET_ID>"
```

## 환경변수 (demo)

`apps/demo/.env.example` 기준:

1. `NEXT_PUBLIC_GA_ID`
2. `NEXT_PUBLIC_FIREBASE_API_KEY`
3. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
4. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
5. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
6. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
7. `NEXT_PUBLIC_FIREBASE_APP_ID`

참고:

1. Firebase 값이 placeholder여도 앱 자체는 실행 가능
2. 다만 인증/Firestore 관련 기능은 제한될 수 있음

## LLM 복붙용 마스터 프롬프트 (구조+사용법 포함)

아래를 그대로 복사해서 LLM에게 붙여넣으세요.

```text
당신은 로컬 저장소를 직접 조작하고 명령을 실행하는 개발 에이전트다.
설명만 하지 말고 실제 명령을 실행해서 프로젝트 셋업과 검증을 완료하라.
저장소 경로는 /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo 이다.

[프로젝트 구조]
- packages/core: i18n 런타임 (I18nProvider, useTranslation, useLanguageSwitcher, i18nexus/server)
- packages/tools: i18n CLI (i18n-wrapper, i18n-extractor, i18n-type, i18n-upload, i18n-download, i18n-clean-legacy)
- apps/demo: Next.js App Router 데모 앱 + locales + i18nexus.config.json

[목표]
1) 의존성 설치
2) 모노레포 빌드/테스트/린트 검증
3) demo i18n 워크플로우(wrapper/extractor/type) 검증
4) 페이지별 타입 생성 결과 및 사용법(useTranslation/getTranslation) 검증
5) demo 앱 실행 확인
6) 실패 시 원인과 수정 시도를 포함한 최종 리포트 작성

[필수 규칙]
1. destructive git 명령 금지 (git reset --hard, checkout -- 등)
2. 실제 실행 없는 완료 보고 금지
3. 실패 명령은 에러 핵심 요약 + 재시도/우회 수행
4. 각 단계 완료 후 성공/실패를 명확히 기록

[실행 절차]
1. 저장소 이동 및 환경 확인
   - cd /Users/manwook-han/Desktop/i18nexus/i18nexus-turborepo
   - pwd
   - node -v
   - npm -v
   - Node >= 18, npm >= 9 확인

2. 설치
   - npm ci

3. 루트 기준 전체 검증
   - npm run build
   - npm run test
   - npm run lint
   - 실패 시 필터 재검증:
     - npx turbo run build --filter=i18nexus
     - npx turbo run build --filter=i18nexus-tools
     - npx turbo run build --filter=i18nexus-demo
     - npx turbo run test --filter=i18nexus
     - npx turbo run test --filter=i18nexus-tools
     - npx turbo run lint --filter=i18nexus
     - npx turbo run lint --filter=i18nexus-tools
     - npx turbo run lint --filter=i18nexus-demo

4. demo 환경 준비
   - cd apps/demo
   - .env.example 존재 확인
   - .env.local 없으면 생성: cp -n .env.example .env.local
   - placeholder 값이면 기능 제한 상태로 진행 가능하다고 명시

5. demo i18n 워크플로우 검증
   - npx i18n-wrapper -p "{app,page,widgets,features,entities,shared}/**/*.{js,jsx,ts,tsx}"
   - npx i18n-extractor
   - npx i18n-type
   - page 기반 타입 확인:
     - locales/types/i18nexus.d.ts 에서 TranslationNamespace 확인
     - locales/<namespace>/en.json, ko.json 생성 여부 확인
   - 사용법 확인:
     - client: useTranslation<"home">("home")
     - server: getTranslation<"home">("home")
   - 생성 파일 확인:
     - locales/types/i18nexus.d.ts
   - 필요한 경우 package script도 점검:
     - npm run i18n:pull

6. demo 실행 확인
   - npm run dev
   - 서버 기동 URL 확인 (보통 http://localhost:3000)
   - 최소 기능 확인:
     - 홈 페이지 렌더 에러 없음
     - 언어 전환 UI 클릭 시 런타임 에러 없음
   - 확인 후 장시간 점유 방지를 위해 dev 프로세스 정리

7. 최종 리포트 형식
   - A. 환경/버전
   - B. 설치 결과
   - C. build/test/lint 결과 (루트 + 실패한 패키지 재검증 결과)
   - D. i18n 워크플로우 결과 (wrapper/extractor/type, 생성 파일)
   - E. 페이지별 타입 생성/사용법 검증 결과
   - F. demo 실행 확인 결과
   - G. 실패 항목이 있으면 명령/에러 핵심 3줄/다음 조치
   - H. 추천 후속 작업 1~3개
```

## 빠른 문제해결

1. `npm ci` 실패

- Node/npm 버전 먼저 확인 (`node -v`, `npm -v`)
- lockfile 불일치면 루트에서 다시 `npm ci`

2. demo build에서 타입/린트 이슈

- `apps/demo/next.config.ts`는 빌드 시 타입/ESLint 완화를 사용 중일 수 있음
- 품질 검증은 `npm run lint`, `tsc`를 별도로 실행해 확인

3. i18n 타입 파일이 생성되지 않음

- `apps/demo`로 이동했는지 확인
- `npx i18n-extractor` 후 `npx i18n-type` 순서로 재실행

---

## 중요 문구

이 README는 항상 LLM에게 복사해서 붙여넣으세요.  
이 README는 항상 LLM에게 복사해서 붙여넣으세요.
