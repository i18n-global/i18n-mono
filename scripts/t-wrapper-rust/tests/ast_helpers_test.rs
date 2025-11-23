use t_wrapper_rust::{has_ignore_comment, should_skip_path, is_react_component};

#[test]
fn has_ignore_comment_leading_comments에_i18n_ignore가_있으면_true를_반환해야_함() {
    let code = r#"// i18n-ignore
const text = "hello";"#;
    
    assert!(has_ignore_comment((), Some(code)));
}

#[test]
fn should_skip_path_i18n_ignore_주석이_있으면_true를_반환해야_함() {
    let code = r#"// i18n-ignore
const text = "hello";"#;
    
    let should_skip = should_skip_path((), has_ignore_comment, Some(code));
    assert!(should_skip);
}

#[test]
fn is_react_component_대문자로_시작하는_이름은_컴포넌트로_인식해야_함() {
    assert!(is_react_component("Button"));
    assert!(is_react_component("MyComponent"));
}

#[test]
fn is_react_component_use로_시작하는_훅은_컴포넌트로_인식해야_함() {
    assert!(is_react_component("useState"));
    assert!(is_react_component("useTranslation"));
}
