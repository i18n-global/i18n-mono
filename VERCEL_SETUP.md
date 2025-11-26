# Vercel 배포 설정 가이드

Vercel 배포를 활성화하려면 GitHub Secrets에 다음을 설정해야 합니다.

## 🔐 필요한 Secrets

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

