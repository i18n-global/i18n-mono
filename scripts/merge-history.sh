#!/bin/bash
# 커밋 히스토리 병합 스크립트
# 기존 프로젝트들의 커밋 히스토리를 모노레포로 가져옵니다

set -e  # 에러 발생 시 중단

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMP_DIR="/tmp/i18n-merge-$$"

echo "🚀 커밋 히스토리 병합 시작..."
echo "📁 모노레포 디렉토리: $REPO_DIR"
echo "📁 임시 디렉토리: $TEMP_DIR"

# 백업 브랜치 생성
cd "$REPO_DIR"
echo ""
echo "📦 백업 브랜치 생성 중..."
git branch backup-before-merge-$(date +%Y%m%d-%H%M%S) || true
echo "✅ 백업 완료"

# 임시 디렉토리 생성
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Core 패키지 병합
echo ""
echo "📦 Core 패키지 히스토리 가져오는 중..."
if [ -d "core-temp" ]; then
  rm -rf core-temp
fi
git clone https://github.com/i18n-global/i18nexus.git core-temp
cd core-temp

# git-filter-repo가 설치되어 있는지 확인
if command -v git-filter-repo &> /dev/null; then
  echo "  → git-filter-repo 사용 중..."
  git filter-repo --to-subdirectory-filter packages/core --force --refs main
else
  echo "  → git filter-branch 사용 중 (git-filter-repo 미설치)..."
  # 태그 제거 후 진행
  git tag -l | xargs git tag -d 2>/dev/null || true
  git filter-branch -f --prune-empty --subdirectory-filter . -- --all
  # 수동으로 경로 변경
  git filter-branch -f --tree-filter '
    mkdir -p packages/core
    find . -maxdepth 1 -not -name . -not -name .git -not -name packages -exec mv {} packages/core/ \;
  ' -- --all
fi

cd "$REPO_DIR"
git remote add core-temp "$TEMP_DIR/core-temp" 2>/dev/null || git remote set-url core-temp "$TEMP_DIR/core-temp"
git fetch core-temp
echo "  → Core 패키지 병합 중..."
git merge --allow-unrelated-histories core-temp/main -m "merge: core 패키지 히스토리 병합" || {
  echo "  ⚠️  충돌 발생 - 수동 해결 필요"
  echo "  💡 git status로 충돌 파일 확인 후 해결하세요"
}
git remote remove core-temp
echo "✅ Core 패키지 병합 완료"

# Tools 패키지 병합
echo ""
echo "📦 Tools 패키지 히스토리 가져오는 중..."
cd "$TEMP_DIR"
if [ -d "tools-temp" ]; then
  rm -rf tools-temp
fi
git clone https://github.com/i18n-global/i18nexus-tools.git tools-temp
cd tools-temp

if command -v git-filter-repo &> /dev/null; then
  echo "  → git-filter-repo 사용 중..."
  git filter-repo --to-subdirectory-filter packages/tools --force --refs main
else
  echo "  → git filter-branch 사용 중..."
  # 태그 제거 후 진행
  git tag -l | xargs git tag -d 2>/dev/null || true
  git filter-branch -f --tree-filter '
    mkdir -p packages/tools
    find . -maxdepth 1 -not -name . -not -name .git -not -name packages -exec mv {} packages/tools/ \;
  ' -- --all
fi

cd "$REPO_DIR"
git remote add tools-temp "$TEMP_DIR/tools-temp" 2>/dev/null || git remote set-url tools-temp "$TEMP_DIR/tools-temp"
git fetch tools-temp
echo "  → Tools 패키지 병합 중..."
git merge --allow-unrelated-histories tools-temp/main -m "merge: tools 패키지 히스토리 병합" || {
  echo "  ⚠️  충돌 발생 - 수동 해결 필요"
}
git remote remove tools-temp
echo "✅ Tools 패키지 병합 완료"

# Demo 앱 병합
echo ""
echo "📦 Demo 앱 히스토리 가져오는 중..."
cd "$TEMP_DIR"
if [ -d "demo-temp" ]; then
  rm -rf demo-temp
fi
git clone https://github.com/i18n-global/i18nexus-demo.git demo-temp
cd demo-temp

if command -v git-filter-repo &> /dev/null; then
  echo "  → git-filter-repo 사용 중..."
  git filter-repo --to-subdirectory-filter apps/demo --force --refs main
else
  echo "  → git filter-branch 사용 중..."
  # 태그 제거 후 진행
  git tag -l | xargs git tag -d 2>/dev/null || true
  git filter-branch -f --tree-filter '
    mkdir -p apps/demo
    find . -maxdepth 1 -not -name . -not -name .git -not -name apps -exec mv {} apps/demo/ \;
  ' -- --all
fi

cd "$REPO_DIR"
git remote add demo-temp "$TEMP_DIR/demo-temp" 2>/dev/null || git remote set-url demo-temp "$TEMP_DIR/demo-temp"
git fetch demo-temp
echo "  → Demo 앱 병합 중..."
git merge --allow-unrelated-histories demo-temp/main -m "merge: demo 앱 히스토리 병합" || {
  echo "  ⚠️  충돌 발생 - 수동 해결 필요"
}
git remote remove demo-temp
echo "✅ Demo 앱 병합 완료"

# 정리
echo ""
echo "🧹 임시 파일 정리 중..."
rm -rf "$TEMP_DIR"
echo "✅ 정리 완료"

# 결과 확인
echo ""
echo "📊 병합 결과 확인:"
echo ""
git log --all --oneline --graph | head -30
echo ""
echo "✅ 모든 히스토리 병합 완료!"
echo ""
echo "💡 다음 단계:"
echo "   1. git status로 충돌 확인"
echo "   2. 충돌이 있다면 수동으로 해결"
echo "   3. git log --all --oneline --graph로 히스토리 확인"
echo "   4. git push origin main --force (필요시)"

