// 입력 -> 기대 아웃풋만 검증 (블랙박스)
use t_wrapper_rust::{has_ignore_comment, is_react_component};

#[test]
fn has_ignore_comment_detects_line_comment() {
    let code = "// i18n-ignore\nconst text = \"hello\";";
    assert!(has_ignore_comment((), Some(code)));
    
    let code = "const text = \"hello\";";
    assert!(!has_ignore_comment((), Some(code)));
}

#[test]
fn is_react_component_validates_naming() {
    assert!(is_react_component("Button"));
    assert!(is_react_component("MyComponent"));
    assert!(is_react_component("useState"));
    assert!(is_react_component("useTranslation"));
    assert!(!is_react_component("button"));
    assert!(!is_react_component("myFunction"));
}


