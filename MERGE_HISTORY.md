# 커밋 히스토리 병합 가이드

기존 프로젝트들의 커밋 히스토리를 모노레포로 가져오는 방법입니다.

## 방법 1: git subtree merge (권장)

각 저장소의 히스토리를 유지하면서 경로를 변경하여 병합합니다.

### 1단계: 각 저장소를 remote로 추가

```bash
# 현재 모노레포에서
cd /Users/manwook-han/Desktop/i18nexus-turborepo

# 각 저장소를 remote로 추가
git remote add core-origin https://github.com/i18n-global/i18nexus.git
git remote add tools-origin https://github.com/i18n-global/i18nexus-tools.git
git remote add demo-origin https://github.com/i18n-global/i18nexus-demo.git

# remote 확인
git remote -v
```

### 2단계: 각 저장소의 히스토리 가져오기

```bash
# 모든 remote의 히스토리 가져오기
git fetch core-origin
git fetch tools-origin
git fetch demo-origin
```

### 3단계: 각 저장소를 서브트리로 병합

#### Core 패키지 병합

```bash
# core 저장소를 packages/core 경로로 병합
git merge -s ours --no-commit --allow-unrelated-histories core-origin/main
git read-tree --prefix=packages/core -u core-origin/main
git commit -m "merge: core 패키지 히스토리 병합"
```

#### Tools 패키지 병합

```bash
# tools 저장소를 packages/tools 경로로 병합
git merge -s ours --no-commit --allow-unrelated-histories tools-origin/main
git read-tree --prefix=packages/tools -u tools-origin/main
git commit -m "merge: tools 패키지 히스토리 병합"
```

#### Demo 앱 병합

```bash
# demo 저장소를 apps/demo 경로로 병합
git merge -s ours --no-commit --allow-unrelated-histories demo-origin/main
git read-tree --prefix=apps/demo -u demo-origin/main
git commit -m "merge: demo 앱 히스토리 병합"
```

### 4단계: 기존 파일과 충돌 해결

병합 후 기존 파일들과 충돌이 발생할 수 있습니다. 필요한 파일만 유지하고 나머지는 제거합니다.

```bash
# 충돌 확인
git status

# 필요한 파일만 유지 (예: .gitignore, README 등)
# 나머지는 병합된 버전 사용
```

---

## 방법 2: git filter-repo 사용 (더 깔끔함)

각 저장소의 히스토리를 경로를 변경하여 가져옵니다.

### 사전 준비

```bash
# git-filter-repo 설치 (필요시)
pip install git-filter-repo
# 또는
brew install git-filter-repo
```

### Core 패키지 히스토리 가져오기

```bash
# 임시 디렉토리에 core 저장소 클론
cd /tmp
git clone https://github.com/i18n-global/i18nexus.git core-temp
cd core-temp

# 모든 파일을 packages/core/ 경로로 이동
git filter-repo --to-subdirectory-filter packages/core

# 모노레포로 돌아가서 병합
cd /Users/manwook-han/Desktop/i18nexus-turborepo
git remote add core-temp /tmp/core-temp
git fetch core-temp
git merge --allow-unrelated-histories core-temp/main
git remote remove core-temp
```

### Tools 패키지 히스토리 가져오기

```bash
cd /tmp
git clone https://github.com/i18n-global/i18nexus-tools.git tools-temp
cd tools-temp
git filter-repo --to-subdirectory-filter packages/tools

cd /Users/manwook-han/Desktop/i18nexus-turborepo
git remote add tools-temp /tmp/tools-temp
git fetch tools-temp
git merge --allow-unrelated-histories tools-temp/main
git remote remove tools-temp
```

### Demo 앱 히스토리 가져오기

```bash
cd /tmp
git clone https://github.com/i18n-global/i18nexus-demo.git demo-temp
cd demo-temp
git filter-repo --to-subdirectory-filter apps/demo

cd /Users/manwook-han/Desktop/i18nexus-turborepo
git remote add demo-temp /tmp/demo-temp
git fetch demo-temp
git merge --allow-unrelated-histories demo-temp/main
git remote remove demo-temp
```

---

## 방법 3: 간단한 스크립트로 자동화

아래 스크립트를 실행하면 자동으로 병합합니다.

```bash
#!/bin/bash
# merge-history.sh

REPO_DIR="/Users/manwook-han/Desktop/i18nexus-turborepo"
TEMP_DIR="/tmp/i18n-merge"

cd "$REPO_DIR"

# 임시 디렉토리 생성
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Core 패키지
echo "Processing core package..."
git clone https://github.com/i18n-global/i18nexus.git core-temp
cd core-temp
git filter-repo --to-subdirectory-filter packages/core --force
cd "$REPO_DIR"
git remote add core-temp "$TEMP_DIR/core-temp"
git fetch core-temp
git merge --allow-unrelated-histories core-temp/main -m "merge: core 패키지 히스토리 병합"
git remote remove core-temp

# Tools 패키지
echo "Processing tools package..."
cd "$TEMP_DIR"
git clone https://github.com/i18n-global/i18nexus-tools.git tools-temp
cd tools-temp
git filter-repo --to-subdirectory-filter packages/tools --force
cd "$REPO_DIR"
git remote add tools-temp "$TEMP_DIR/tools-temp"
git fetch tools-temp
git merge --allow-unrelated-histories tools-temp/main -m "merge: tools 패키지 히스토리 병합"
git remote remove tools-temp

# Demo 앱
echo "Processing demo app..."
cd "$TEMP_DIR"
git clone https://github.com/i18n-global/i18nexus-demo.git demo-temp
cd demo-temp
git filter-repo --to-subdirectory-filter apps/demo --force
cd "$REPO_DIR"
git remote add demo-temp "$TEMP_DIR/demo-temp"
git fetch demo-temp
git merge --allow-unrelated-histories demo-temp/main -m "merge: demo 앱 히스토리 병합"
git remote remove demo-temp

# 정리
rm -rf "$TEMP_DIR"

echo "✅ 모든 히스토리 병합 완료!"
```

---

## 주의사항

### 1. 백업 필수
```bash
# 병합 전에 반드시 백업
cd /Users/manwook-han/Desktop/i18nexus-turborepo
git branch backup-before-merge
```

### 2. 충돌 해결
- 병합 후 파일 충돌이 발생할 수 있습니다
- `.gitignore`, `README.md` 등은 수동으로 병합해야 할 수 있습니다
- 각 패키지의 고유 파일들은 자동으로 병합됩니다

### 3. 히스토리 확인
```bash
# 병합 후 히스토리 확인
git log --all --oneline --graph
git log --all --oneline --graph --decorate | head -50
```

### 4. 원격 저장소 푸시
```bash
# 병합 완료 후 푸시
git push origin main --force  # 주의: force push 필요할 수 있음
```

---

## 병합 후 장점

✅ **완전한 히스토리**: 모든 커밋 히스토리 보존
✅ **blame 기능**: 각 파일의 변경 이력 추적 가능
✅ **버전 관리**: 언제 어떤 변경이 있었는지 확인 가능
✅ **통합 관리**: 하나의 저장소에서 모든 히스토리 확인

---

## 병합 후 단점

⚠️ **저장소 크기 증가**: 모든 히스토리를 포함하므로 크기가 커짐
⚠️ **복잡한 히스토리**: 여러 저장소의 히스토리가 섞임
⚠️ **충돌 가능성**: 초기 병합 시 파일 충돌 발생 가능

---

## 추천 방법

**방법 2 (git filter-repo)**를 추천합니다:
- ✅ 깔끔한 히스토리 구조
- ✅ 경로가 자동으로 변경됨
- ✅ 충돌 최소화

**방법 1 (subtree merge)**는 더 간단하지만:
- ⚠️ 수동 작업이 더 필요함
- ⚠️ 충돌 해결이 복잡할 수 있음

