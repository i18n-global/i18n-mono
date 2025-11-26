# Vercel 배포 설정 가이드

## 🎯 권장 방법: Vercel Dashboard에서 직접 연결 (Secrets 불필요)

Vercel은 GitHub 저장소를 직접 연결하면 자동으로 배포됩니다. 이 방법이 가장 간단하고 권장됩니다.

## 방법 1: Vercel Dashboard에서 직접 연결 (권장) ⭐

### 설정 단계

1. **Vercel Dashboard 접속**
   - https://vercel.com 접속
   - 로그인

2. **프로젝트 Import**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소: `i18n-global/i18n-mono` 선택
   - **Root Directory**: `apps/demo` 설정 ⚠️ 중요!
   - Framework Preset: Next.js (자동 감지)
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)

3. **Deploy**
   - "Deploy" 버튼 클릭
   - 자동으로 빌드 및 배포 시작

### 장점
- ✅ Secrets 설정 불필요
- ✅ 자동 배포: GitHub push 시 자동 배포
- ✅ Preview URL: PR마다 자동 생성
- ✅ 간단한 설정: 대시보드에서 쉽게 설정

### 작동 방식
- `main` 브랜치 push → Production 배포
- Pull Request → Preview 배포
- 자동 HTTPS 및 SSL 인증서

---

## 방법 2: GitHub Actions를 통한 배포 (선택사항)

GitHub Actions를 통해 배포하려면 Secrets가 필요합니다. 일반적으로는 방법 1을 권장합니다.

### 🔐 필요한 Secrets

GitHub 저장소 (`i18n-global/i18n-mono`)의 **Settings → Secrets and variables → Actions**에서 설정:

### 1. VERCEL_TOKEN

1. **Vercel Dashboard 접속**
   - https://vercel.com 접속
   - 로그인

2. **Token 생성**
   - Settings → Tokens
   - "Create Token" 클릭
   - 이름: `github-actions`
   - Scope: **Full Account**
   - 생성된 토큰 복사 (다시 볼 수 없습니다!)

3. **GitHub Secret 추가**
   - Name: `VERCEL_TOKEN`
   - Secret: (복사한 토큰)

### 2. VERCEL_ORG_ID

1. **Vercel Dashboard → Settings → General**
2. **Organization ID** 복사
3. **GitHub Secret 추가**
   - Name: `VERCEL_ORG_ID`
   - Secret: (복사한 Organization ID)

### 3. VERCEL_PROJECT_ID

1. **Vercel Dashboard → 프로젝트 선택**
2. **Settings → General**
3. **Project ID** 복사
4. **GitHub Secret 추가**
   - Name: `VERCEL_PROJECT_ID`
   - Secret: (복사한 Project ID)

## ✅ 설정 확인

Secrets 설정 후:
- `apps/demo` 변경 시 자동으로 Vercel에 배포됩니다
- Pull Request 시 preview URL이 생성됩니다
- 배포 실패 시 GitHub Actions 로그에서 확인 가능합니다

## ⚠️ Secrets가 없는 경우

Secrets가 설정되지 않은 경우:
- ✅ 빌드는 정상적으로 실행됩니다
- ⏭️ Vercel 배포만 건너뜁니다
- 📝 로그에 안내 메시지가 표시됩니다

## 🔗 참고

- [Vercel 공식 문서](https://vercel.com/docs)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 전체 배포 가이드

