# 🚀 자동 배포 설정 가이드

이 가이드는 GitHub Actions를 통한 자동 npm 배포를 설정하는 방법을 설명합니다.

---

## 📋 필수 설정

### 1. NPM Token 생성

1. **npm 웹사이트에 로그인**
   - https://www.npmjs.com 접속

2. **Access Token 생성**
   - 우측 상단 프로필 클릭
   - `Access Tokens` 선택
   - `Generate New Token` 클릭
   - `Classic Token` 선택

3. **Token 타입 선택**
   - **Automation** 선택 (권장)
   - 또는 **Publish** 선택

4. **Token 복사**
   - 생성된 토큰을 복사 (다시 볼 수 없습니다!)

### 2. GitHub Secrets 설정

1. **GitHub 저장소로 이동**
   - https://github.com/manNomi/i18nexus

2. **Settings 탭 클릭**

3. **Secrets and variables > Actions 선택**

4. **New repository secret 클릭**

5. **Secret 추가**
   - Name: `NPM_TOKEN`
   - Secret: (복사한 npm token 붙여넣기)
   - `Add secret` 클릭

### 3. GitHub Permissions 확인

저장소 설정에서 Actions 권한 확인:

1. **Settings > Actions > General**

2. **Workflow permissions 설정**
   - ✅ `Read and write permissions` 선택
   - ✅ `Allow GitHub Actions to create and approve pull requests` 체크

---

## 🔄 배포 프로세스

### 자동 배포 트리거

`main` 브랜치에 푸시하면 자동으로:

1. ✅ 테스트 실행
2. ✅ 린터 실행
3. ✅ 빌드 실행
4. ✅ 버전 확인 (이미 배포된 버전인지 체크)
5. ✅ npm 배포 (새 버전인 경우)
6. ✅ Git 태그 생성
7. ✅ GitHub Release 생성

### 버전 업데이트 방법

#### 방법 1: package.json 직접 수정 (권장)

```bash
# package.json 파일에서 버전 수정
# "version": "2.7.0" → "version": "2.8.0"

git add package.json
git commit -m "chore: bump version to 2.8.0"
git push origin main
```

#### 방법 2: npm version 명령어 사용

```bash
# Patch 버전 (2.7.0 → 2.7.1)
npm version patch

# Minor 버전 (2.7.0 → 2.8.0)
npm version minor

# Major 버전 (2.7.0 → 3.0.0)
npm version major

# 자동으로 커밋 & 태그 생성됨
git push origin main
git push origin --tags
```

---

## 📊 배포 확인

### GitHub Actions 확인

1. **저장소의 Actions 탭 이동**
   - https://github.com/manNomi/i18nexus/actions

2. **Publish to NPM workflow 확인**
   - 최근 실행 내역 확인
   - 실패 시 로그 확인

### npm 배포 확인

```bash
# 최신 버전 확인
npm view i18nexus version

# 모든 버전 확인
npm view i18nexus versions

# 특정 버전 정보 확인
npm view i18nexus@2.7.0
```

### GitHub Release 확인

- https://github.com/manNomi/i18nexus/releases

---

## 🐛 문제 해결

### 1. "NPM_TOKEN not found" 에러

**원인:** NPM_TOKEN Secret이 설정되지 않음

**해결:**
1. GitHub Settings > Secrets and variables > Actions
2. NPM_TOKEN Secret 추가

### 2. "Version already published" 메시지

**원인:** 동일한 버전이 이미 npm에 배포됨

**해결:**
1. `package.json`의 버전 번호 증가
2. 커밋 후 푸시

### 3. "Permission denied" 에러

**원인:** GitHub Actions 권한 부족

**해결:**
1. Settings > Actions > General
2. Workflow permissions를 "Read and write permissions"로 변경

### 4. 테스트 실패

**원인:** 코드에 오류가 있거나 테스트 실패

**해결:**
```bash
# 로컬에서 테스트 실행
npm test

# 빌드 확인
npm run build

# 린터 확인
npm run lint
```

### 5. "npm ci failed" 에러

**원인:** package-lock.json 파일 문제

**해결:**
```bash
# package-lock.json 재생성
rm -f package-lock.json
npm install

# 커밋 후 푸시
git add package-lock.json
git commit -m "chore: update package-lock.json"
git push origin main
```

---

## 🔒 보안 고려사항

### NPM Token 보안

- ✅ **절대** 토큰을 코드에 직접 넣지 마세요
- ✅ GitHub Secrets에만 저장
- ✅ Automation 타입 토큰 사용
- ✅ 정기적으로 토큰 갱신
- ✅ 불필요한 권한 제거

### GitHub Permissions

- ✅ 최소 권한 원칙 적용
- ✅ Write 권한은 필요한 경우만
- ✅ Third-party actions 검토

---

## 📝 Workflow 파일

### publish.yml

배포 워크플로우:

```yaml
name: Publish to NPM

on:
  push:
    branches:
      - main
    paths-ignore:
      - "**.md"
      - "docs/**"
      - "examples/**"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
      - name: Setup Node.js
      - name: Install dependencies
      - name: Run tests
      - name: Build package
      - name: Check version
      - name: Publish to NPM
      - name: Create Git Tag
      - name: Create GitHub Release
```

### ci.yml

CI 워크플로우:

```yaml
name: CI

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  test:
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - name: Checkout code
      - name: Setup Node.js
      - name: Install dependencies
      - name: Run linter
      - name: Run tests
      - name: Build package
```

---

## 🎯 체크리스트

배포 전 확인사항:

- [ ] NPM Token이 GitHub Secrets에 설정됨
- [ ] GitHub Actions 권한이 "Read and write"로 설정됨
- [ ] package.json의 버전이 증가됨
- [ ] 로컬에서 테스트 통과 (`npm test`)
- [ ] 로컬에서 빌드 성공 (`npm run build`)
- [ ] CHANGELOG.md 업데이트됨
- [ ] Release notes 준비됨

---

## 📞 도움이 필요하신가요?

- 📧 이메일: hanmw110@naver.com
- 🐛 이슈: https://github.com/manNomi/i18nexus/issues
- 💬 토론: https://github.com/manNomi/i18nexus/discussions

---

## 🔗 관련 문서

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [npm 배포 가이드](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)

