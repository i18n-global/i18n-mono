# Deployment Guide

## Vercel 배포 설정

이 워크플로우는 GitHub Actions를 통해 Vercel에 자동 배포합니다.

### 필요한 Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 추가해야 합니다:

1. **VERCEL_TOKEN**: Vercel 계정의 Access Token
   - Vercel Dashboard > Settings > Tokens에서 생성
   
2. **VERCEL_ORG_ID**: Vercel Organization ID
   - Vercel Dashboard > Settings > General에서 확인
   
3. **VERCEL_PROJECT_ID**: Vercel Project ID
   - Vercel Dashboard > Project Settings > General에서 확인

### 로컬 패키지 링크

데모 앱은 로컬 패키지를 사용하도록 설정되어 있습니다:
- `i18nexus`: `file:../../packages/core`
- `i18nexus-tools`: `file:../../packages/tools`

로컬 개발 시에는 다음 명령어로 패키지를 빌드하고 링크해야 합니다:

```bash
# 패키지 빌드
cd ../../packages/core && npm install && npm run build
cd ../tools && npm install && npm run build

# 데모 앱으로 돌아와서 설치
cd ../../apps/demo
npm install
```

### 배포 트리거

- `main` 브랜치에 push 시 자동 배포
- Pull Request 시 preview 배포
- GitHub Actions에서 수동 실행 가능

### 배포 프로세스

1. Core 패키지 체크아웃 및 빌드
2. Tools 패키지 체크아웃 및 빌드
3. 데모 앱 의존성 설치
4. Next.js 빌드
5. Vercel에 배포

