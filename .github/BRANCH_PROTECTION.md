# Main 브랜치 보호 설정 가이드

## 🔒 GitHub에서 Main 브랜치 보호 규칙 설정

### 설정 방법

1. **GitHub 저장소 접속**
   - https://github.com/i18n-global/i18n-mono

2. **Settings → Branches**
   - 좌측 메뉴에서 "Branches" 선택

3. **Branch protection rule 추가**
   - "Add rule" 또는 "Add branch protection rule" 클릭

4. **Branch name pattern**
   - `main` 입력

5. **보호 규칙 설정**

   ✅ **Protect matching branches** 체크

   ✅ **Require a pull request before merging**
   - ✅ Require approvals: `1` (또는 원하는 수)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from Code Owners (선택사항)

   ✅ **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - Status checks에서 선택:
     - `CI / build-and-test` (또는 `CI / Build and Test`)
     - `CI / lint` (선택사항)

   ✅ **Require conversation resolution before merging** (선택사항)

   ✅ **Do not allow bypassing the above settings** (선택사항, 관리자도 보호)

6. **Save changes** 클릭

---

## 📋 권장 설정

### 필수 체크

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### 선택 체크

- ⚪ Require review from Code Owners
- ⚪ Require conversation resolution before merging
- ⚪ Do not allow bypassing the above settings

---

## 🎯 작동 방식

### 허용되는 경우

- ✅ Pull Request를 통한 merge
- ✅ 관리자가 직접 push (설정에 따라)

### 차단되는 경우

- ❌ PR 없이 main 브랜치로 직접 push (설정 시)
- ❌ CI가 실패한 PR merge (설정 시)
- ❌ 승인 없는 PR merge (설정 시)

---

## 💡 Husky와의 연동

Husky의 `pre-push` 훅은 로컬에서 main 브랜치로 push하려고 할 때 경고를 표시합니다.

하지만 GitHub의 Branch Protection이 최종 보호막 역할을 합니다.

---

## 🔧 설정 확인

설정 후 테스트:

1. **새 브랜치 생성**

   ```bash
   git checkout -b test-branch
   ```

2. **변경사항 커밋**

   ```bash
   git add .
   git commit -m "test: branch protection test"
   ```

3. **main으로 직접 push 시도**

   ```bash
   git push origin main
   ```

   - Branch Protection이 활성화되어 있으면 차단됨

4. **PR 생성**
   - GitHub에서 Pull Request 생성
   - CI 통과 후 merge 가능
