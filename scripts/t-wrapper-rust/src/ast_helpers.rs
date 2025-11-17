/// AST 헬퍼 함수들
/// 순수 함수로 구성되어 테스트하기 쉬움

use crate::constants::{StringConstants, RegexPatterns};

/// i18n-ignore 주석이 노드 바로 위에 있는지 확인
/// 파일의 원본 소스코드를 직접 검사하여 주석 감지
pub fn has_ignore_comment(_path: (), source_code: Option<&str>) -> bool {
    // TODO: SWC AST 노드로 구현
    if let Some(code) = source_code {
        // 소스코드 직접 검사
        let lines: Vec<&str> = code.lines().collect();
        for line in lines.iter().take(3) {
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
pub fn should_skip_path(_path: (), has_ignore_comment_fn: fn((), Option<&str>) -> bool, source_code: Option<&str>) -> bool {
    // TODO: SWC AST 노드로 구현
    // i18n-ignore 주석이 있는 경우 스킵
    if has_ignore_comment_fn((), source_code) {
        return true;
    }
    
    // TODO: t() 함수로 이미 래핑된 경우 스킵
    // TODO: import 구문은 스킵
    // TODO: 객체 프로퍼티 KEY면 무조건 스킵
    
    false
}

/// React 컴포넌트 이름인지 확인
pub fn is_react_component(name: &str) -> bool {
    RegexPatterns::react_component().is_match(name)
        || RegexPatterns::react_hook().is_match(name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_has_ignore_comment() {
        let code = "// i18n-ignore\nconst text = \"hello\";";
        assert!(has_ignore_comment((), Some(code)));
        
        let code = "const text = \"hello\";";
        assert!(!has_ignore_comment((), Some(code)));
    }

    #[test]
    fn test_is_react_component() {
        assert!(is_react_component("Button"));
        assert!(is_react_component("MyComponent"));
        assert!(is_react_component("useState"));
        assert!(is_react_component("useTranslation"));
        assert!(!is_react_component("button"));
        assert!(!is_react_component("myFunction"));
    }
}

