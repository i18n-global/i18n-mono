# GitHub Actions 설정 정리

이 문서는 모노레포에서 설정된 모든 GitHub Actions 워크플로우를 정리합니다.

---

## 📋 워크플로우 목록

### 1. CI 워크플로우 (`.github/workflows/ci.yml`)
**목적**: 코드 품질 검증 및 통합 테스트

**트리거**:
- `main` 브랜치에 push
- Pull Request 생성/업데이트

**작업**:
- ✅ 모든 패키지 빌드 (`turbo run build`)
- ✅ 모든 패키지 테스트 (`turbo run test`)
- ✅ 모든 패키지 린트 (`turbo run lint`)

**특징**:
- Turborepo를 사용하여 병렬 빌드/테스트
- 변경되지 않은 패키지는 캐시 사용
- `continue-on-error: true`로 일부 실패해도 계속 진행

---

### 2. 배포 워크플로우 (`.github/workflows/deploy.yml`)
**목적**: 변경된 패키지만 자동 배포

**트리거**:
- `main` 브랜치에 push (특정 경로 변경 시)
- 수동 실행 (`workflow_dispatch`)

**경로 필터**:
- `packages/**` - Core/Tools 패키지 변경
- `apps/**` - Demo 앱 변경
- `turbo.json`, `package.json` - 설정 변경

**작업 흐름**:

#### Step 1: 변경 감지 (`detect-changes`)
- `dorny/paths-filter`를 사용하여 변경된 패키지 감지
- Core, Tools, Demo 각각 독립적으로 감지

#### Step 2: Core 패키지 배포 (`deploy-core`)
**조건**: `packages/core/**` 변경 또는 수동 선택

**작업**:
1. Node.js 20 설정
2. npm 인증 설정 (`NPM_TOKEN`)
3. 의존성 설치 (`npm ci`)
4. Turborepo로 빌드 (`npx turbo run build --filter=i18nexus`)
5. 버전 확인 (npm에 이미 존재하는지 체크)
6. npm 배포 (새 버전인 경우만)
7. Git 태그 생성 (`core-v{version}`)

**필수 Secrets**:
- `NPM_TOKEN` - npm 배포용 토큰

#### Step 3: Tools 패키지 배포 (`deploy-tools`)
**조건**: `packages/tools/**` 변경 또는 수동 선택

**작업**:
1. Node.js 20 설정
2. npm 인증 설정 (`NPM_TOKEN`)
3. 의존성 설치 (`npm ci`)
4. Turborepo로 빌드 (`npx turbo run build --filter=i18nexus-tools`)
5. 버전 확인 (npm에 이미 존재하는지 체크)
6. npm 배포 (새 버전인 경우만)
7. Git 태그 생성 (`tools-v{version}`)

**필수 Secrets**:
- `NPM_TOKEN` - npm 배포용 토큰

#### Step 4: Demo 앱 빌드 (`deploy-demo`)
**조건**: `apps/demo/**` 또는 `packages/core/**`, `packages/tools/**` 변경

**작업**:
1. Node.js 20 설정
2. 의존성 설치 (`npm ci`)
3. Turborepo로 빌드 (`npx turbo run build --filter=i18nexus-demo`)
4. 빌드 성공 확인

**특징**:
- ⚠️ **배포는 Vercel Dashboard에서 자동 처리**
- GitHub Actions는 빌드만 수행
- Secrets 불필요

---

## 🔧 필수 설정

### NPM 배포를 위한 Secrets

GitHub 저장소 (`i18n-global/i18n-mono`) → **Settings → Secrets and variables → Actions**

#### 1. NPM_TOKEN

**생성 방법**:
1. https://www.npmjs.com 접속
2. 프로필 → **Access Tokens**
3. **Generate New Token** → **Classic Token**
4. Token Type: **Automation** 선택
5. 생성된 토큰 복사

**GitHub Secret 추가**:
- Name: `NPM_TOKEN`
- Secret: (복사한 npm 토큰)

**사용 위치**:
- `deploy-core` job
- `deploy-tools` job

---

## 🎯 작동 방식

### 자동 배포 시나리오

#### 시나리오 1: Core 패키지 변경
```
packages/core/src/... 수정
    ↓
push to main
    ↓
detect-changes → core: true
    ↓
deploy-core 실행
    ↓
npm에 i18nexus 배포
```

#### 시나리오 2: Tools 패키지 변경
```
packages/tools/src/... 수정
    ↓
push to main
    ↓
detect-changes → tools: true
    ↓
deploy-tools 실행
    ↓
npm에 i18nexus-tools 배포
```

#### 시나리오 3: Demo 앱 변경
```
apps/demo/app/... 수정
    ↓
push to main
    ↓
detect-changes → demo: true
    ↓
deploy-demo 실행 (빌드만)
    ↓
Vercel Dashboard에서 자동 배포 감지
    ↓
Vercel 자동 배포
```

#### 시나리오 4: Core/Tools 변경 → Demo도 감지
```
packages/core/... 수정
    ↓
push to main
    ↓
detect-changes → core: true, demo: true
    ↓
deploy-core 실행 (npm 배포)
deploy-demo 실행 (빌드만)
    ↓
Vercel Dashboard에서 자동 배포
```

---

## 🚀 수동 배포

워크플로우를 수동으로 실행할 수 있습니다:

1. **GitHub 저장소 → Actions 탭**
2. **Deploy Packages** 워크플로우 선택
3. **Run workflow** 클릭
4. 배포할 패키지 선택:
   - `all` - 모든 패키지
   - `core` - Core만
   - `tools` - Tools만
   - `demo` - Demo만

---

## 📊 최적화 포인트

### 1. 변경 감지 자동화
- `dorny/paths-filter`로 변경된 패키지만 감지
- 불필요한 빌드/배포 방지

### 2. Turborepo 캐싱
- 변경되지 않은 패키지는 재빌드하지 않음
- 빌드 시간 단축

### 3. 버전 중복 체크
- npm에 이미 존재하는 버전은 배포하지 않음
- 중복 배포 방지

### 4. 병렬 배포
- Core, Tools, Demo를 동시에 처리
- 전체 배포 시간 단축

### 5. 의존성 인식
- Core/Tools 변경 시 Demo도 자동 감지
- 의존성 그래프 기반 배포

---

## 🔍 문제 해결

### npm 배포 실패
**증상**: `ENEEDAUTH` 오류

**해결**:
1. `NPM_TOKEN` Secret이 설정되어 있는지 확인
2. npm 토큰이 유효한지 확인
3. 토큰 권한이 `Automation` 또는 `Publish`인지 확인

### 빌드 실패
**증상**: TypeScript 컴파일 오류

**해결**:
1. 로컬에서 `npm run build` 실행하여 오류 확인
2. `packages/core` 또는 `packages/tools`에서 빌드 테스트
3. 오류 수정 후 다시 push

### Vercel 배포 안 됨
**증상**: Demo 앱이 배포되지 않음

**해결**:
1. Vercel Dashboard에서 저장소 연결 확인
2. Root Directory가 `apps/demo`로 설정되어 있는지 확인
3. Vercel Dashboard → Deployments에서 수동 배포 시도

---

## 📝 워크플로우 파일 구조

```
.github/workflows/
├── ci.yml          # 통합 테스트
├── deploy.yml      # 자동 배포
└── test-workflow.yml  # 테스트용 (선택사항)
```

---

## ✅ 체크리스트

배포가 정상 작동하는지 확인:

- [ ] `NPM_TOKEN` Secret 설정됨
- [ ] 로컬에서 `npm run build` 성공
- [ ] GitHub Actions에서 CI 통과
- [ ] Core 패키지 변경 시 npm 배포 확인
- [ ] Tools 패키지 변경 시 npm 배포 확인
- [ ] Vercel Dashboard에서 저장소 연결됨
- [ ] Demo 앱 변경 시 Vercel 자동 배포 확인

---

## 🔗 관련 문서

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 전체 배포 가이드
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Vercel 설정 가이드
- [TURBOREPO_SETUP.md](./TURBOREPO_SETUP.md) - Turborepo 설정

