/// AST 헬퍼 함수들
/// 순수 함수로 구성되어 테스트하기 쉬움

use crate::constants::{StringConstants, RegexPatterns};

/// i18n-ignore 주석이 노드 바로 위에 있는지 확인
/// 파일의 원본 소스코드를 직접 검사하여 주석 감지
/// 
/// TypeScript 버전과 동일한 로직:
/// 1. AST의 leadingComments 확인 (TODO: SWC AST로 구현)
/// 2. 부모 노드의 leadingComments 확인 (TODO: SWC AST로 구현)
/// 3. 소스코드 직접 검사 (현재 구현됨)
pub fn has_ignore_comment(_path: (), source_code: Option<&str>) -> bool {
    // TODO: SWC AST 노드의 leadingComments 확인
    // if let Some(node) = path.node {
    //     if let Some(comments) = node.leading_comments {
    //         // 주석 확인 로직
    //     }
    // }
    
    // TODO: 부모 노드의 leadingComments 확인
    // if let Some(parent) = path.parent_path {
    //     // 부모 주석 확인 로직
    // }
    
    // 3. 소스코드 직접 검사 (node.loc가 있는 경우)
    if let Some(code) = source_code {
        let lines: Vec<&str> = code.lines().collect();
        
        // 현재 라인과 바로 위 라인 검사 (최대 3줄 전까지)
        for i in 0..lines.len().min(3) {
            let line = lines[i];
            if line.contains(StringConstants::I18N_IGNORE)
                || line.contains(StringConstants::I18N_IGNORE_COMMENT)
                || line.contains(StringConstants::I18N_IGNORE_BLOCK)
                || line.contains(StringConstants::I18N_IGNORE_JSX)
            {
                return true;
            }
        }
    }
    
    false
}

/// 문자열 리터럴 경로를 스킵해야 하는지 확인
/// 
/// TypeScript 버전과 동일한 로직:
/// 1. i18n-ignore 주석이 있는 경우 스킵
/// 2. 부모 노드에 i18n-ignore 주석이 있는 경우도 스킵
/// 3. t() 함수로 이미 래핑된 경우 스킵 (TODO: SWC AST로 구현)
/// 4. import 구문은 스킵 (TODO: SWC AST로 구현)
/// 5. 객체 프로퍼티 KEY면 무조건 스킵 (TODO: SWC AST로 구현)
pub fn should_skip_path(
    _path: (),
    has_ignore_comment_fn: fn((), Option<&str>) -> bool,
    source_code: Option<&str>,
) -> bool {
    // i18n-ignore 주석이 있는 경우 스킵
    if has_ignore_comment_fn((), source_code) {
        return true;
    }
    
    // TODO: 부모 노드에 i18n-ignore 주석이 있는 경우도 스킵
    // if path.parent && has_ignore_comment_fn(path.parent_path, source_code) {
    //     return true;
    // }
    
    // TODO: t() 함수로 이미 래핑된 경우 스킵
    // if t.isCallExpression(path.parent) && 
    //    t.isIdentifier(path.parent.callee, { name: "t" }) {
    //     return true;
    // }
    
    // TODO: import 구문은 스킵
    // let import_parent = path.find_parent(|p| t.isImportDeclaration(p.node));
    // if import_parent.is_some() {
    //     return true;
    // }
    
    // TODO: 객체 프로퍼티 KEY면 무조건 스킵
    // if t.isObjectProperty(path.parent) && path.parent.key == path.node {
    //     return true;
    // }
    
    false
}

/// React 컴포넌트 이름인지 확인
pub fn is_react_component(name: &str) -> bool {
    RegexPatterns::react_component().is_match(name)
        || RegexPatterns::react_hook().is_match(name)
}
