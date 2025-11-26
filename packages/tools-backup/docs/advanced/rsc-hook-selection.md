# RSC-Aware Hook Selection Design

## Summary
- 목적: `i18n-wrapper` 실행 시 파일이 **React Server Component(RSC)** 인지 자동으로 판별하고, 서버/클라이언트에 맞는 번역 훅을 삽입한다.
- 핵심 변화: `i18nexus.config.json`에 **서버 전용 훅 이름**을 추가하고, 래퍼가 AST 기반으로 파일 종류를 감지하여 적절한 훅(`useTranslation` vs 서버 훅)을 주입한다.
- 기대 효과: 서버 컴포넌트에서 클라이언트 훅이 잘못 삽입되는 문제 제거, Next.js App Router 프로젝트의 DX 개선.

## Requirements
- `i18n-wrapper` 실행 시 아래를 만족해야 한다.
  - 파일이 RSC인지 CSR(Component)인지 감지한다.
  - RSC로 판정된 경우, 새로 정의할 **서버용 번역 함수**를 사용한다.
  - CSR 또는 "use client" 지시문이 있는 파일은 기존 `useTranslation` 훅을 사용한다.
  - 감지 결과를 기반으로 필요한 import/선언을 자동 관리한다.

## Configuration Changes (`i18nexus.config.json`)
```jsonc
{
  "sourcePattern": "src/**/*.{ts,tsx}",
  "translationImportSource": "@i18nexus/core",
  "constantPatterns": ["_ITEMS", "_MENU"],
  "clientTranslationHook": "useTranslation",          // 기본값
  "serverTranslationFunction": "getServerTranslation"   // 신규 옵션
}
```
- **`clientTranslationHook`**: 기존에 사용 중인 클라이언트 훅 이름(기본 `useTranslation`).
- **`serverTranslationFunction`**: RSC에서 사용할 서버 전용 함수/훅 이름. 기본 제공 함수가 없으면 명시적으로 설정하도록 가이드.
- (선택) `serverTranslationImportSource`: 서버 훅이 다른 패키지에 존재하면 경로를 지정할 수 있게 확장 고려.

## AST 기반 감지 전략
1. **파일 단위 힌트 수집**
   - 상단 `DirectiveLiteral`로 `'use client'` 존재 ⇒ 무조건 CSR로 분류.
   - 파일명 접미사가 `.client.tsx` / `.client.jsx` ⇒ CSR.
   - 파일명 접미사 `.server.tsx` / `.server.jsx` ⇒ 우선 RSC로 간주.
   - `export const dynamic = "force-static"` 등 Next.js 서버 전용 메타 필드 존재 ⇒ RSC 가능성 높음.
2. **AST 노드 기반 Heuristic**
   - `CallExpression`/`ImportSpecifier`에서 `useState`, `useEffect`, `useMemo`, `useLayoutEffect` 등 React Client 전용 훅 사용 ⇒ CSR.
   - `next/navigation`의 `useRouter`, `useSearchParams` 등 `use*` 훅 사용 ⇒ CSR.
   - 반대로 `headers`, `cookies`, `draftMode` 등 서버 전용 API 사용 ⇒ RSC.
   - 감지된 힌트를 점수화하여 최종 판정(예: CSR 점수 > RSC 점수 ⇒ CSR, 동일 시 기본값은 RSC).
3. **Fallback 전략**
   - 어떠한 힌트도 없으면 Next.js App Router 규칙에 따라 **기본 RSC** 로 간주.
   - 사용자가 CLI 플래그 `--force-client` / `--force-server` 등을 제공하여 수동 override 할 수 있도록 확장 여지 문서화.

## Hook 주입 로직 변화
1. 기존 로직: 무조건 `useTranslation()` 훅을 삽입.
2. 변경 로직:
   ```ts
   if (detectedKind === "client") {
     ensureClientHook(); // import 추가 + 기존 로직 유지
   } else {
     ensureServerFunction(); // 신규 서버 함수 import + 호출부 교체
   }
   ```
3. 서버용 함수는 `const { t } = await getServerTranslation(locale)` 같은 비동기 패턴일 수 있으므로, 반환 형태에 따라 destructuring/await 처리 커스터마이징 필요. 구성 옵션에 `serverReturnStyle`(예: `hook`, `asyncFunction`, `directObject`) 추가 가능성을 문서에서 언급.

## Implementation Plan
1. **Config & Loader 업데이트**
   - `scripts/config-loader.ts`에 `serverTranslationFunction`, `serverTranslationImportSource`, (선택) `serverHookReturnType` 필드를 추가.
   - 타입 강화 및 기본값 제공(`serverTranslationFunction` 미설정 시 경고 출력).
2. **AST 분석 유틸 추가**
   - `scripts/t-wrapper.ts` 혹은 별도 `rsc-detector.ts` 모듈에 감지 로직 구현.
   - 기존 `processFiles:parse` 단계 이후 감지 결과를 캐싱하여 후속 단계에서 재사용.
3. **Hook 주입 단계 수정**
   - `ensureTranslationHook` 함수 리팩토링 → `ensureClientHook`, `ensureServerHook` 두 가지 분기.
   - 서버 함수 주입 시 `await` 필요 여부 판단 후 코드 생성 (`t-wrapper` 의 코드 생성 로직 확장).
4. **테스트 플랜**
   - `__fixtures__/app/client-component.tsx` → `useTranslation` 삽입 확인.
   - `__fixtures__/app/layout.tsx` (RSC) → `getServerTranslation` 삽입 + `await` 동작 확인.
   - 기 존 CLI 옵션들과의 상호 작용 (`--dry-run`, `--pattern`) 회귀 테스트.
5. **릴리즈 체크리스트**
   - 문서/README 반영.
   - 마이그레이션 가이드에 신규 설정 안내.
   - 샘플 프로젝트에 서버/클라이언트 컴포넌트 예시 추가.

## Documentation Updates
- **`docs/guides/nextjs-app-router.md`**
  - 서버/클라이언트 컴포넌트 구분용 신규 설정 섹션 추가.
  - `serverTranslationFunction` 예제와 RSC 파일 구조 설명.
- **`docs/guides/configuration.md`**
  - 신규 설정 키 설명, 기본값/예제 JSON 스니펫 업데이트.
- **`docs/cli/i18n-wrapper.md`**
  - RSC 감지 플로우 다이어그램 및 `--force-client`/`--force-server` (추가 예정 옵션) 문서화.
- **신규 문서 현재 파일 (`docs/advanced/rsc-hook-selection.md`)**
  - 유지보수: 구현 진행에 따라 감지 규칙/옵션을 최신 상태로 업데이트.

## Open Questions
- 서버용 번역 함수가 비동기(`await`)인지, 동기인지 프로젝트마다 다를 수 있음 → 설정 값으로 처리할지, AST 분석으로 추론할지 결정 필요.
- RSC 감지 실패(오탐/누락) 시 사용자 경험: 경고를 출력하고 기본값 유지? 사용자에게 diff 미리보기 제공?
- `getServerTranslation`이 locale 파라미터를 필요로 한다면, 파일 내에서 locale 정보를 어디서 얻을지(예: Next.js `params`, `headers`).

## Next Steps
1. 설정 스키마/타입 업데이트 → Config 문서 반영.
2. RSC 감지 프로토타입 구현 및 샘플 프로젝트에서 검증.
3. Hook 주입 분기 로직 완성 후 `npm` 베타 태그(`next` dist-tag)로 배포.
4. 사용 피드백 수집 후 정식 릴리즈(예: `v1.8.0`).
