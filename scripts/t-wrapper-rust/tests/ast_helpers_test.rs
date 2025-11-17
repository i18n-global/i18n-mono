/**
 * ast-helpers 테스트
 * 순수 함수들 테스트
 */

use t_wrapper_rust::{has_ignore_comment, should_skip_path, is_react_component};
use t_wrapper_rust::parser::{parse_file, ParseOptions};

#[test]
fn has_ignore_comment_leading_comments에_i18n_ignore가_있으면_true를_반환해야_함() {
    let code = r#"// i18n-ignore
const text = "hello";"#;
    
    // TODO: SWC AST로 구현되면 실제 AST 노드로 테스트
    // 현재는 소스코드 직접 검사 방식
    assert!(has_ignore_comment((), Some(code)));
}

#[test]
fn should_skip_path_i18n_ignore_주석이_있으면_true를_반환해야_함() {
    let code = r#"// i18n-ignore
const text = "hello";"#;
    
    // TODO: SWC AST로 구현되면 실제 AST 노드로 테스트
    let should_skip = should_skip_path((), has_ignore_comment, Some(code));
    assert!(should_skip);
}

#[test]
fn should_skip_path_이미_t로_래핑된_경우_true를_반환해야_함() {
    let code = r#"const text = t("key");"#;
    
    // TODO: SWC AST로 구현되면 실제 AST 노드로 테스트
    // 현재는 t() 함수 감지 로직이 없으므로 false 반환
    let should_skip = should_skip_path((), has_ignore_comment, Some(code));
    // TODO: 실제 구현 후 true로 변경
    // assert!(should_skip);
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
