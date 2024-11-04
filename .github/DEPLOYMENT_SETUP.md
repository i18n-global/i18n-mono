# 자동 배포 설정 가이드

이 프로젝트는 GitHub Actions를 통해 main 브랜치에 push할 때 자동으로 npm에 배포됩니다.

## 🔐 필수 설정: NPM_TOKEN

### 1. NPM Access Token 생성

1. [npmjs.com](https://www.npmjs.com)에 로그인
2. 우측 상단 프로필 → **Access Tokens** 클릭
3. **Generate New Token** → **Classic Token** 선택
4. Token Type: **Automation** 선택 (CI/CD용)
5. 생성된 토큰 복사 (다시 볼 수 없으니 안전하게 보관)

### 2. GitHub Repository에 Secret 추가

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭
4. 다음과 같이 입력:
   - **Name**: `NPM_TOKEN`
   - **Secret**: 복사한 npm access token 붙여넣기
5. **Add secret** 클릭

## 🚀 자동 배포 워크플로우

### 배포 조건

main 브랜치에 push되면 자동으로 실행되며, 다음을 체크합니다:

1. ✅ `package.json`의 버전이 npm에 없는 새 버전인지 확인
2. ✅ 이미 배포된 버전이면 자동으로 스킵
3. ✅ 새 버전이면 빌드 → 테스트 → 배포

### 배포 프로세스

```bash
main 브랜치 push
    ↓
버전 중복 체크
    ↓
의존성 설치 (npm ci)
    ↓
빌드 (npm run build)
    ↓
테스트 (npm test --if-present)
    ↓
npm publish
    ↓
Git tag 생성 (v1.5.7)
    ↓
GitHub Release 생성
```

### 제외되는 파일

다음 파일들의 변경은 배포를 트리거하지 않습니다:

- `**.md` - 문서 파일
- `docs/**` - 문서 디렉토리
- `test-*.tsx` - 테스트 파일
- `src/test-*.tsx` - 소스 테스트 파일

## 📦 배포 방법

### 방법 1: 커밋 메시지로 자동 버전 증가 (권장) ⭐

커밋 메시지에 버전 타입을 포함하면 자동으로 버전이 올라갑니다:

```bash
# Patch 버전 증가 (1.5.7 → 1.5.8)
git commit -m "fix: 버그 수정 [patch]"
git push origin main

# 또는
git commit -m "fix: 버그 수정 release: patch"
git push origin main

# Minor 버전 증가 (1.5.7 → 1.6.0)
git commit -m "feat: 새 기능 추가 [minor]"
git push origin main

# Major 버전 증가 (1.5.7 → 2.0.0)
git commit -m "feat: breaking change [major]"
git push origin main
```

**커밋 메시지 형식:**
- `[patch]` 또는 `release: patch` → 1.5.7 → 1.5.8
- `[minor]` 또는 `release: minor` → 1.5.7 → 1.6.0
- `[major]` 또는 `release: major` → 1.5.7 → 2.0.0

### 방법 2: GitHub Actions에서 수동 실행

1. GitHub 저장소 → **Actions** 탭
2. **Publish to npm** 워크플로우 선택
3. **Run workflow** 클릭
4. **Version bump type** 선택:
   - 빈 값: 현재 버전 그대로 사용
   - `patch`: 1.5.7 → 1.5.8
   - `minor`: 1.5.7 → 1.6.0
   - `major`: 1.5.7 → 2.0.0
5. **Run workflow** 클릭

### 방법 3: 수동 버전 수정 후 배포

```bash
# 1. package.json의 version 수동 수정
# "version": "1.5.8"

# 2. CHANGELOG.md 업데이트

# 3. commit & push (버전 타입 없이)
git add .
git commit -m "Release v1.5.8"
git push origin main

# ✅ 자동으로 npm에 배포됨 (현재 버전 그대로)
```

## 🔍 배포 확인

### GitHub Actions에서 확인

1. GitHub 저장소 → **Actions** 탭
2. 최신 워크플로우 실행 확인
3. 각 단계의 로그 확인 가능

### npm에서 확인

```bash
# 최신 버전 확인
npm view i18nexus-tools version

# 모든 버전 보기
npm view i18nexus-tools versions

# 설치 테스트
npm install -g i18nexus-tools@latest
```

## 📋 체크리스트

배포 전 확인사항:

- [ ] `package.json` 버전이 새로운 버전인가?
- [ ] `CHANGELOG.md`가 업데이트되었는가?
- [ ] `README.md`가 최신 상태인가?
- [ ] 로컬에서 `npm run build`가 성공하는가?
- [ ] 테스트가 통과하는가? (있는 경우)
- [ ] GitHub Secrets에 `NPM_TOKEN`이 설정되어 있는가?

## 🐛 문제 해결

### "npm publish failed: 403"

**원인**: NPM_TOKEN이 없거나 잘못됨

**해결**:

1. npm 토큰이 만료되지 않았는지 확인
2. GitHub Secrets에 `NPM_TOKEN`이 올바르게 설정되었는지 확인
3. npm 토큰 타입이 **Automation**인지 확인

### "Version already exists"

**원인**: 같은 버전이 이미 npm에 배포됨

**해결**:

1. `package.json`의 버전을 증가시키기
2. npm에서 기존 버전 확인: `npm view i18nexus-tools versions`

### "Build failed"

**원인**: TypeScript 컴파일 에러

**해결**:

1. 로컬에서 `npm run build` 실행하여 에러 확인
2. 에러 수정 후 다시 push

## 🔄 롤백

잘못된 버전이 배포된 경우:

```bash
# npm에서 특정 버전 deprecate
npm deprecate i18nexus-tools@1.5.8 "This version has issues, please use 1.5.7"

# 또는 완전히 제거 (배포 후 72시간 이내만 가능)
npm unpublish i18nexus-tools@1.5.8
```

## 📚 추가 리소스

- [npm Access Tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 🎯 현재 설정 상태

- ✅ GitHub Actions 워크플로우 설정 완료
- ✅ 버전 중복 체크 활성화
- ✅ 자동 태그 생성 활성화
- ✅ GitHub Release 자동 생성 활성화
- ⏳ NPM_TOKEN Secret 설정 필요 (사용자가 직접 설정)

---

**설정 완료 후 main 브랜치에 push하면 자동으로 배포가 시작됩니다!** 🚀
