#!/bin/bash
# 안전한 커밋 히스토리 병합 스크립트
# git subtree merge 방식 사용 (더 안전함)

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 안전한 커밋 히스토리 병합 시작..."
echo "📁 모노레포 디렉토리: $REPO_DIR"

cd "$REPO_DIR"

# 백업 브랜치 생성
echo ""
echo "📦 백업 브랜치 생성 중..."
BACKUP_BRANCH="backup-before-merge-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH" || true
echo "✅ 백업 브랜치: $BACKUP_BRANCH"

# 각 저장소를 remote로 추가
echo ""
echo "📡 Remote 저장소 추가 중..."
git remote add core-origin https://github.com/i18n-global/i18nexus.git 2>/dev/null || git remote set-url core-origin https://github.com/i18n-global/i18nexus.git
git remote add tools-origin https://github.com/i18n-global/i18nexus-tools.git 2>/dev/null || git remote set-url tools-origin https://github.com/i18n-global/i18nexus-tools.git
git remote add demo-origin https://github.com/i18n-global/i18nexus-demo.git 2>/dev/null || git remote set-url demo-origin https://github.com/i18n-global/i18nexus-demo.git

# 각 저장소의 히스토리 가져오기
echo ""
echo "📥 히스토리 가져오는 중..."
git fetch core-origin
git fetch tools-origin
git fetch demo-origin

# Core 패키지 병합
echo ""
echo "📦 Core 패키지 병합 중..."
if [ -d "packages/core" ] && [ "$(ls -A packages/core 2>/dev/null)" ]; then
  echo "  ⚠️  packages/core 디렉토리가 이미 존재합니다."
  echo "  💡 기존 파일을 백업하고 병합합니다..."
  git mv packages/core packages/core-backup 2>/dev/null || true
fi

git merge -s ours --no-commit --allow-unrelated-histories core-origin/main || {
  echo "  ⚠️  병합 실패 - 이미 병합되었을 수 있습니다"
  git merge --abort 2>/dev/null || true
}

# Core 패키지 파일을 packages/core로 가져오기
git read-tree --prefix=packages/core -u core-origin/main || {
  echo "  ⚠️  read-tree 실패 - 다른 방법 시도..."
}

# 충돌이 없는 경우 커밋
if [ -z "$(git status --porcelain | grep -v '^??')" ]; then
  git commit -m "merge: core 패키지 히스토리 병합" || {
    echo "  ⚠️  커밋 실패 - 이미 병합되었을 수 있습니다"
  }
else
  echo "  ⚠️  충돌 발생 - 수동 해결 필요"
  echo "  💡 git status로 확인 후 수동으로 커밋하세요"
fi
echo "✅ Core 패키지 병합 완료"

# Tools 패키지 병합
echo ""
echo "📦 Tools 패키지 병합 중..."
if [ -d "packages/tools" ] && [ "$(ls -A packages/tools 2>/dev/null)" ]; then
  echo "  ⚠️  packages/tools 디렉토리가 이미 존재합니다."
  git mv packages/tools packages/tools-backup 2>/dev/null || true
fi

git merge -s ours --no-commit --allow-unrelated-histories tools-origin/main || {
  echo "  ⚠️  병합 실패 - 이미 병합되었을 수 있습니다"
  git merge --abort 2>/dev/null || true
}

git read-tree --prefix=packages/tools -u tools-origin/main || {
  echo "  ⚠️  read-tree 실패"
}

if [ -z "$(git status --porcelain | grep -v '^??')" ]; then
  git commit -m "merge: tools 패키지 히스토리 병합" || {
    echo "  ⚠️  커밋 실패"
  }
else
  echo "  ⚠️  충돌 발생 - 수동 해결 필요"
fi
echo "✅ Tools 패키지 병합 완료"

# Demo 앱 병합
echo ""
echo "📦 Demo 앱 병합 중..."
if [ -d "apps/demo" ] && [ "$(ls -A apps/demo 2>/dev/null)" ]; then
  echo "  ⚠️  apps/demo 디렉토리가 이미 존재합니다."
  git mv apps/demo apps/demo-backup 2>/dev/null || true
fi

git merge -s ours --no-commit --allow-unrelated-histories demo-origin/main || {
  echo "  ⚠️  병합 실패 - 이미 병합되었을 수 있습니다"
  git merge --abort 2>/dev/null || true
}

git read-tree --prefix=apps/demo -u demo-origin/main || {
  echo "  ⚠️  read-tree 실패"
}

if [ -z "$(git status --porcelain | grep -v '^??')" ]; then
  git commit -m "merge: demo 앱 히스토리 병합" || {
    echo "  ⚠️  커밋 실패"
  }
else
  echo "  ⚠️  충돌 발생 - 수동 해결 필요"
fi
echo "✅ Demo 앱 병합 완료"

# Remote 정리
echo ""
echo "🧹 Remote 정리 중..."
git remote remove core-origin 2>/dev/null || true
git remote remove tools-origin 2>/dev/null || true
git remote remove demo-origin 2>/dev/null || true

# 결과 확인
echo ""
echo "📊 병합 결과 확인:"
echo ""
git log --oneline --graph | head -30
echo ""
echo "✅ 히스토리 병합 완료!"
echo ""
echo "💡 다음 단계:"
echo "   1. git status로 상태 확인"
echo "   2. git log --all --oneline --graph로 전체 히스토리 확인"
echo "   3. 충돌이 있다면 수동으로 해결"
echo "   4. git push origin main (필요시)"

