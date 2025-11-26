# 배포 가이드

## 현재 GitHub Actions 역할

### 1. CI 워크플로우 (`.github/workflows/ci.yml`)

**위치**: 모노레포 루트 (i18n-mono)

**역할**:
- ✅ **코드 테스트**: 모든 패키지 빌드 및 테스트
- ✅ **자동 검증**: main 브랜치 push 시 자동 실행
- ✅ **PR 검증**: Pull Request 시 테스트 실행

**실행되는 작업**:
1. **test-core**: `packages/core` 패키지 빌드 및 테스트
2. **test-tools**: `packages/tools` 패키지 빌드 및 테스트
3. **test-demo**: `apps/demo` 앱 빌드 테스트 (로컬 패키지 링크 포함)

**트리거**:
- `main` 브랜치에 push
- Pull Request 생성/업데이트

---

### 2. NPM 배포 워크플로우

**위치**: 각 패키지별 별도 저장소

#### `packages/core` → `i18n-global/i18nexus`
- **파일**: `packages/core/.github/workflows/publish.yml`
- **역할**: npm에 `i18nexus` 패키지 자동 배포
- **트리거**: `main` 브랜치 push 시 자동 배포

#### `packages/tools` → `i18n-global/i18nexus-tools`
- **파일**: `packages/tools/.github/workflows/npm-publish.yml`
- **역할**: npm에 `i18nexus-tools` 패키지 자동 배포
- **트리거**: `main` 브랜치 push 시 자동 배포

---

### 3. Vercel 배포 워크플로우

**위치**: `apps/demo/.github/workflows/vercel-deploy.yml`

**역할**:
- ✅ **자동 배포**: main 브랜치 push 시 Vercel에 자동 배포
- ✅ **Preview 배포**: Pull Request 시 preview URL 생성
- ✅ **로컬 패키지 빌드**: Core와 Tools 패키지를 별도 저장소에서 가져와 빌드

**트리거**:
- `main` 브랜치 push
- Pull Request 생성/업데이트
- 수동 실행 (workflow_dispatch)

---

## Vercel 연결 방법

### 방법 1: Vercel 대시보드에서 직접 연결 (권장)

이 방법이 가장 간단하고 자동화됩니다.

#### 1단계: Vercel 계정 생성 및 로그인
- https://vercel.com 접속
- GitHub 계정으로 로그인

#### 2단계: 프로젝트 Import
1. Vercel 대시보드에서 **"Add New..." → "Project"** 클릭
2. GitHub 저장소 선택: `i18n-global/i18nexus-demo`
3. **Root Directory** 설정: `apps/demo`로 변경
4. **Framework Preset**: Next.js 자동 감지
5. **Build Command**: `npm run build` (기본값)
6. **Output Directory**: `.next` (기본값)

#### 3단계: 환경 변수 설정 (필요시)
- Vercel 대시보드 → Project Settings → Environment Variables
- 필요한 환경 변수 추가 (예: `NEXT_PUBLIC_VERCEL_ENV`)

#### 4단계: Deploy
- **"Deploy"** 버튼 클릭
- 자동으로 빌드 및 배포 시작

#### 장점:
- ✅ 자동 배포: GitHub push 시 자동 배포
- ✅ Preview URL: PR마다 자동 생성
- ✅ 간단한 설정: 대시보드에서 쉽게 설정
- ✅ 자동 HTTPS: SSL 인증서 자동 설정

---

### 방법 2: GitHub Actions를 통한 배포 (현재 설정됨)

이미 `apps/demo/.github/workflows/vercel-deploy.yml`이 설정되어 있습니다.

#### 필요한 Secrets 설정

GitHub 저장소 (`i18n-global/i18nexus-demo`)의 Settings → Secrets and variables → Actions에서:

1. **VERCEL_TOKEN**
   - Vercel Dashboard → Settings → Tokens
   - "Create Token" 클릭
   - 이름: `github-actions`
   - Scope: Full Account
   - 생성된 토큰을 `VERCEL_TOKEN`으로 저장

2. **VERCEL_ORG_ID**
   - Vercel Dashboard → Settings → General
   - "Organization ID" 복사
   - `VERCEL_ORG_ID`로 저장

3. **VERCEL_PROJECT_ID**
   - Vercel Dashboard → 프로젝트 선택 → Settings → General
   - "Project ID" 복사
   - `VERCEL_PROJECT_ID`로 저장

#### 작동 방식:
- `main` 브랜치에 push하면 자동으로 Vercel에 배포
- Pull Request 시 preview 배포
- PR에 배포 URL 자동 댓글 추가

---

## 현재 구조 요약

```
i18n-mono (모노레포)
├── .github/workflows/
│   └── ci.yml                    # 통합 테스트만 (배포 안 함)
│
├── packages/
│   ├── core/
│   │   └── .github/workflows/
│   │       └── publish.yml       # npm 배포 (별도 저장소)
│   │
│   └── tools/
│       └── .github/workflows/
│           └── npm-publish.yml   # npm 배포 (별도 저장소)
│
└── apps/
    └── demo/
        └── .github/workflows/
            └── vercel-deploy.yml # Vercel 배포 (별도 저장소)
```

---

## 권장 사항

### 모노레포에서:
- ✅ **CI**: 통합 테스트만 실행 (현재 설정됨)
- ❌ **배포**: 각 패키지별 별도 저장소에서 처리

### 각 패키지별 저장소에서:
- ✅ **Core**: npm 자동 배포 (이미 설정됨)
- ✅ **Tools**: npm 자동 배포 (이미 설정됨)
- ✅ **Demo**: Vercel 자동 배포 (설정 필요)

---

## Vercel 연결 체크리스트

- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] `i18n-global/i18nexus-demo` 저장소 Import
- [ ] Root Directory를 `apps/demo`로 설정
- [ ] 환경 변수 설정 (필요시)
- [ ] 첫 배포 실행
- [ ] GitHub Actions Secrets 설정 (방법 2 사용 시)
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID

---

## 문제 해결

### Vercel 배포 실패 시:
1. Vercel 대시보드에서 빌드 로그 확인
2. Root Directory가 `apps/demo`로 설정되었는지 확인
3. 환경 변수가 올바르게 설정되었는지 확인
4. `package.json`의 빌드 스크립트 확인

### GitHub Actions 배포 실패 시:
1. Actions 탭에서 로그 확인
2. Secrets가 올바르게 설정되었는지 확인
3. Vercel 토큰이 유효한지 확인

