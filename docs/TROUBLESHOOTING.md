# 🔧 문제 해결 가이드

GitHub Actions 자동 배포 시 발생할 수 있는 문제와 해결 방법입니다.

---

## ❌ npm error code ENEEDAUTH

### 에러 메시지
```
npm error code ENEEDAUTH
npm error need auth This command requires you to be logged in to https://registry.npmjs.org/
npm error need auth You need to authorize this machine using `npm adduser`
```

### 원인
NPM 인증 토큰이 설정되지 않았거나 잘못되었습니다.

### 해결 방법

#### 1️⃣ NPM Token이 설정되어 있는지 확인

**GitHub 저장소에서:**
```
https://github.com/manNomi/i18nexus/settings/secrets/actions
```

- `NPM_TOKEN`이라는 Secret이 있는지 확인
- 없다면 아래 단계로 생성

#### 2️⃣ 새로운 NPM Token 생성

**A. npm 웹사이트 접속**
```
1. https://www.npmjs.com 로그인
2. 우측 상단 프로필 아이콘 클릭
3. "Access Tokens" 선택
```

**B. Token 생성**
```
1. "Generate New Token" 클릭
2. "Classic Token" 선택
3. Token Type 선택:
   ✅ Automation (권장) - CI/CD용
   또는
   ✅ Publish - 패키지 배포용
```

**C. Token 복사**
```
⚠️ 중요: 생성된 토큰은 한 번만 표시됩니다!
토큰을 복사해서 안전한 곳에 보관하세요.
```

#### 3️⃣ GitHub Secrets에 Token 추가

**A. GitHub 저장소 Settings로 이동**
```
https://github.com/manNomi/i18nexus/settings/secrets/actions
```

**B. Secret 추가**
```
1. "New repository secret" 클릭
2. Name: NPM_TOKEN (정확히 이 이름으로!)
3. Secret: (복사한 npm token 붙여넣기)
4. "Add secret" 클릭
```

**C. 기존 Secret 업데이트 (이미 있는 경우)**
```
1. NPM_TOKEN Secret 옆 "Update" 클릭
2. 새로운 token 붙여넣기
3. "Update secret" 클릭
```

#### 4️⃣ 다시 배포 시도

**방법 1: 워크플로우 재실행**
```
1. GitHub → Actions 탭
2. 실패한 workflow 클릭
3. "Re-run all jobs" 클릭
```

**방법 2: 새로운 커밋 푸시**
```bash
# 버전 업데이트 (package.json)
# "version": "2.7.0" → "version": "2.7.1"

git add package.json
git commit -m "chore: bump version to 2.7.1"
git push origin main
```

---

## ❌ Permission denied

### 에러 메시지
```
Error: Permission denied to create tag
```

### 원인
GitHub Actions에 쓰기 권한이 없습니다.

### 해결 방법

#### 1️⃣ Workflow Permissions 확인

**A. Settings로 이동**
```
https://github.com/manNomi/i18nexus/settings/actions
```

**B. Workflow permissions 설정**
```
Actions → General → Workflow permissions

✅ "Read and write permissions" 선택
✅ "Allow GitHub Actions to create and approve pull requests" 체크

→ Save 클릭
```

#### 2️⃣ 다시 워크플로우 실행

---

## ❌ Version already published

### 메시지
```
Version 2.7.0 is already published
should_publish=false
```

### 원인
현재 버전이 이미 npm에 배포되어 있습니다. (정상 동작)

### 해결 방법

#### 버전 업데이트

**package.json 수정:**
```json
{
  "version": "2.7.1"  // 버전 증가
}
```

**커밋 & 푸시:**
```bash
git add package.json
git commit -m "chore: bump version to 2.7.1"
git push origin main
```

**Semantic Versioning 규칙:**
```
- Patch: 2.7.0 → 2.7.1 (버그 수정)
- Minor: 2.7.0 → 2.8.0 (새 기능, 하위 호환)
- Major: 2.7.0 → 3.0.0 (주요 변경, 하위 호환 X)
```

---

## ❌ Tests failed

### 에러 메시지
```
Error: Process completed with exit code 1
FAIL src/__tests__/...
```

### 원인
코드에 오류가 있거나 테스트가 실패했습니다.

### 해결 방법

#### 1️⃣ 로컬에서 테스트 실행

```bash
# 모든 테스트 실행
npm test

# Watch 모드
npm run test:watch

# 특정 테스트만
npm test -- src/__tests__/cookie.test.ts
```

#### 2️⃣ 오류 수정 후 푸시

```bash
# 코드 수정
# ...

# 테스트 확인
npm test

# 커밋 & 푸시
git add .
git commit -m "fix: resolve test failures"
git push origin main
```

---

## ❌ Build failed

### 에러 메시지
```
Error: Process completed with exit code 2
src/... error TS2307: Cannot find module
```

### 원인
TypeScript 컴파일 오류 또는 의존성 문제

### 해결 방법

#### 1️⃣ 로컬에서 빌드 확인

```bash
# 빌드 실행
npm run build

# 의존성 재설치
rm -rf node_modules
npm install

# 다시 빌드
npm run build
```

#### 2️⃣ 타입 에러 수정

```bash
# 타입 에러 확인
npm run build

# 에러 수정 후
git add .
git commit -m "fix: resolve build errors"
git push origin main
```

---

## ❌ npm ci failed

### 에러 메시지
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

### 원인
package-lock.json 파일이 없거나 워크플로우가 `npm ci`를 사용

### 해결 방법

이미 수정되었습니다! 워크플로우가 `npm install`을 사용하도록 변경되었습니다.

---

## ❌ Tag already exists

### 에러 메시지
```
fatal: tag 'v2.7.0' already exists
Error: Process completed with exit code 128
```

### 원인
Git 태그가 이미 존재합니다. 동일한 버전을 다시 배포하려고 시도했습니다.

### 해결 방법

#### 권장: 버전 업데이트

**A. package.json 버전 증가**
```json
{
  "version": "2.8.0"  // 2.7.0 → 2.8.0
}
```

**B. 커밋 & 푸시**
```bash
git add package.json
git commit -m "chore: bump version to 2.8.0"
git push origin main
```

#### 대안 1: 기존 태그 삭제 (권장하지 않음)

```bash
# 로컬 태그 삭제
git tag -d v2.7.0

# 원격 태그 삭제
git push origin :refs/tags/v2.7.0

# 다시 푸시
git push origin main
```

⚠️ **주의:** 이미 배포된 버전의 태그를 삭제하는 것은 권장하지 않습니다.

#### 대안 2: 태그를 강제로 업데이트 (권장하지 않음)

```bash
# 로컬에서 태그 강제 생성
git tag -f v2.7.0

# 원격에 강제 푸시
git push origin v2.7.0 --force
```

⚠️ **주의:** 이미 존재하는 태그를 강제로 변경하는 것은 문제를 일으킬 수 있습니다.

### 예방

워크플로우가 이미 업데이트되어 이 문제를 자동으로 처리합니다:
- 태그가 이미 있으면 건너뛰기
- 에러 대신 경고 메시지만 표시

---

## ❌ 403 Forbidden

### 에러 메시지
```
npm error 403 Forbidden - PUT https://registry.npmjs.org/i18nexus
npm error 403 You do not have permission to publish "i18nexus"
```

### 원인
1. 토큰 권한이 부족하거나
2. 패키지 이름이 이미 다른 사람이 소유

### 해결 방법

#### 1️⃣ 토큰 권한 확인

**새 토큰 생성:**
- Token Type: **Automation** 또는 **Publish** 선택
- Read-only 토큰은 배포할 수 없습니다

#### 2️⃣ npm 패키지 소유권 확인

```bash
# 패키지 소유자 확인
npm owner ls i18nexus

# 본인이 소유자인지 확인
npm whoami
```

**본인이 소유자가 아니라면:**
- 다른 패키지 이름 사용
- 또는 스코프 패키지로 변경 (`@username/i18nexus`)

---

## ❌ GitHub Release 생성 실패

### 에러 메시지
```
Error: Resource not accessible by integration
```

### 원인
GitHub Actions 권한 부족

### 해결 방법

**Workflow permissions 확인:**
```
Settings → Actions → General → Workflow permissions

✅ "Read and write permissions" 선택

→ Save
```

---

## 🔍 디버깅 팁

### 1. GitHub Actions 로그 확인

```
1. GitHub → Actions 탭
2. 실패한 workflow 클릭
3. 각 step 확장해서 에러 확인
4. 빨간색 에러 메시지 찾기
```

### 2. Secrets 확인

```
Settings → Secrets and variables → Actions

확인사항:
- NPM_TOKEN이 존재하는가?
- 이름이 정확히 "NPM_TOKEN"인가?
- 토큰이 유효한가?
```

### 3. 로컬에서 테스트

```bash
# 테스트
npm test

# 빌드
npm run build

# 린터
npm run lint

# 모두 성공하는지 확인
```

### 4. 토큰 테스트 (로컬)

```bash
# npm 로그인 확인
npm whoami

# 로그아웃
npm logout

# 새 토큰으로 로그인
npm login
```

---

## 📞 추가 도움

### 여전히 문제가 해결되지 않나요?

**1. GitHub Issues**
- https://github.com/manNomi/i18nexus/issues
- 에러 메시지 전체 복사
- 스크린샷 첨부

**2. npm 지원**
- https://www.npmjs.com/support
- 토큰 관련 문제

**3. GitHub Actions 지원**
- https://github.com/community
- 워크플로우 관련 문제

---

## 📝 체크리스트

문제 발생 시 확인:

- [ ] NPM_TOKEN이 GitHub Secrets에 있는가?
- [ ] 토큰 이름이 정확히 "NPM_TOKEN"인가?
- [ ] 토큰 타입이 Automation 또는 Publish인가?
- [ ] GitHub Actions 권한이 "Read and write"인가?
- [ ] package.json의 버전이 증가했는가?
- [ ] 로컬에서 테스트가 통과하는가?
- [ ] 로컬에서 빌드가 성공하는가?

---

## 🎯 빠른 해결 가이드

### 대부분의 문제 해결 순서:

```
1. NPM Token 재생성
   ↓
2. GitHub Secrets에 추가/업데이트
   ↓
3. GitHub Actions 권한 확인
   ↓
4. 버전 업데이트
   ↓
5. 다시 Push
```

이 순서대로 하면 대부분의 문제가 해결됩니다!

---

**Made with ❤️ for troubleshooting**

