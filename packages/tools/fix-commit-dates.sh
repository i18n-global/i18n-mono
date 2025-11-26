#!/bin/bash

# 모든 커밋의 날짜를 2024년에서 2025년으로 변경하는 스크립트

echo "⚠️  이 스크립트는 Git 히스토리를 재작성합니다."
echo "⚠️  진행하기 전에 현재 브랜치를 백업하세요."
read -p "계속하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# 백업 브랜치 생성
git branch backup-before-date-fix-$(date +%Y%m%d-%H%M%S)
echo "✅ 백업 브랜치 생성 완료"

# 모든 커밋의 날짜를 2024 -> 2025로 변경
git filter-branch -f --env-filter '
    # COMMITTER_DATE 변경
    if [ -n "$GIT_COMMITTER_DATE" ]; then
        # 2024를 2025로 변경 (모든 형식 지원)
        NEW_COMMITTER_DATE=$(echo "$GIT_COMMITTER_DATE" | sed "s/2024/2025/g")
        export GIT_COMMITTER_DATE="$NEW_COMMITTER_DATE"
    fi
    
    # AUTHOR_DATE 변경
    if [ -n "$GIT_AUTHOR_DATE" ]; then
        # 2024를 2025로 변경 (모든 형식 지원)
        NEW_AUTHOR_DATE=$(echo "$GIT_AUTHOR_DATE" | sed "s/2024/2025/g")
        export GIT_AUTHOR_DATE="$NEW_AUTHOR_DATE"
    fi
' --tag-name-filter cat -- --all

echo ""
echo "✅ 커밋 날짜 수정 완료"
echo "📊 변경 사항 확인: git log --date=short | grep 2024"
echo "⚠️  백업 브랜치 목록: git branch | grep backup"
echo ""
echo "⚠️  원래 상태로 돌아가려면:"
echo "   git reset --hard backup-before-date-fix-YYYYMMDD-HHMMSS"

