#!/bin/bash

# 긴 커밋 메시지를 COMMIT.md 가이드에 맞춰 축약하는 스크립트

echo "⚠️  이 스크립트는 Git 히스토리를 재작성합니다."
echo "⚠️  진행하기 전에 현재 브랜치를 백업하세요."
read -p "계속하시겠습니까? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# 백업 브랜치 생성
git branch backup-before-message-fix-$(date +%Y%m%d-%H%M%S)
echo "✅ 백업 브랜치 생성 완료"

# 커밋 메시지 수정
git filter-branch -f --msg-filter '
    MSG="$GIT_COMMIT_MSG"
    
    # 가장 긴 메시지부터 매칭 (순서 중요)
    case "$MSG" in
        *"TypeScript 테스트와 1:1 매칭하는 테스트 코드 작성 (ast_helpers, ast_transformers, import_manager)"*)
            echo "test(rust): TypeScript 테스트 1:1 매칭 구현"
            ;;
        *"translation_wrapper와 E2E 테스트 작성 (TypeScript 1:1 매칭)"*)
            echo "test(rust): translation_wrapper E2E 테스트 추가"
            ;;
        *"ast_transformers에 SWC AST Visitor 패턴 기본 구조 추가"*)
            echo "feat(rust): ast_transformers Visitor 패턴 구조 추가"
            ;;
        *"framework 옵션 추가하여 use client 디렉티브 조건 명확화"*)
            echo "feat: framework 옵션으로 use client 조건 명확화"
            ;;
        *"Next.js 환경에서만 use client 디렉티브 추가하도록 수정"*)
            echo "fix: Next.js에서만 use client 추가하도록 수정"
            ;;
        *"framework 옵션에 따른 use client 디렉티브 테스트 추가"*)
            echo "test: framework 옵션 use client 테스트 추가"
            ;;
        *"translation-wrapper TypeScript 코드를 Rust로 이식"*)
            echo "feat: translation-wrapper Rust로 이식"
            ;;
        *"translation-wrapper 테스트 코드 TypeScript와 1:1 매칭"*)
            echo "test: translation-wrapper 테스트 1:1 매칭"
            ;;
        *"import-manager TypeScript 코드를 Rust로 이식"*)
            echo "feat: import-manager Rust로 이식"
            ;;
        *"import-manager 테스트 코드 TypeScript와 1:1 매칭"*)
            echo "test: import-manager 테스트 1:1 매칭"
            ;;
        *"ast-transformers TypeScript 코드를 Rust로 이식"*)
            echo "feat: ast-transformers Rust로 이식"
            ;;
        *"ast-transformers 테스트 코드 TypeScript와 1:1 매칭"*)
            echo "test: ast-transformers 테스트 1:1 매칭"
            ;;
        *"ast-helpers TypeScript 코드를 Rust로 이식"*)
            echo "feat: ast-helpers Rust로 이식"
            ;;
        *"ast-helpers 테스트 코드 TypeScript와 1:1 매칭"*)
            echo "test: ast-helpers 테스트 1:1 매칭"
            ;;
        *"Wtf8Atom 변환 문제로 임시 소스코드 검사 방식 사용"*)
            echo "fix: Wtf8Atom 변환 임시 소스코드 검사 사용"
            ;;
        *"JSX 없는 코드로 translation_wrapper 테스트 수정"*)
            echo "fix: translation_wrapper 테스트 수정"
            ;;
        *"JSX 없는 코드로 파서 테스트 수정"*)
            echo "fix: 파서 테스트 수정"
            ;;
        *"실제 파일 파싱 및 코드 생성 워크플로우 구현"*)
            echo "feat: 파일 파싱 및 코드 생성 워크플로우 구현"
            ;;
        *"translation_wrapper 테스트 코드를 tests 폴더로 이동"*)
            echo "refactor(rust): translation_wrapper 테스트 이동"
            ;;
        *"import_manager 테스트 코드를 tests 폴더로 이동"*)
            echo "refactor(rust): import_manager 테스트 이동"
            ;;
        *"ast_transformers 테스트 코드를 tests 폴더로 이동"*)
            echo "refactor(rust): ast_transformers 테스트 이동"
            ;;
        *"Wtf8Atom 처리 임시로 소스코드 직접 검사로 변경"*)
            echo "fix(rust): Wtf8Atom 임시 소스코드 검사로 변경"
            ;;
        *)
            echo "$MSG"
            ;;
    esac
' --tag-name-filter cat -- --all

echo ""
echo "✅ 커밋 메시지 수정 완료"
echo "📊 변경 사항 확인: git log --oneline | head -20"

