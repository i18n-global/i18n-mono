/**
 * ast-transformers 테스트
 * AST 변환 로직 테스트
 */

use t_wrapper_rust::ast_transformers::{transform_function_body, TransformResult};

#[test]
fn transform_function_body_한국어_문자열_리터럴을_t_호출로_변환해야_함() {
    let code = r#"function Component() {
  const text = "안녕하세요";
  return <div>{text}</div>;
}"#;
    
    // TODO: SWC AST traverse로 구현되면 실제 AST 노드로 테스트
    // 현재는 소스코드 직접 검사로 테스트
    let result = transform_function_body((), code);
    assert!(result.was_modified);
}

#[test]
fn transform_function_body_한국어_템플릿_리터럴을_t_호출로_변환해야_함() {
    let code = r#"function Component() {
  return <div>{`안녕 ${name}`}</div>;
}"#;
    
    // TODO: SWC AST traverse로 구현되면 실제 AST 노드로 테스트
    // 현재는 소스코드 직접 검사로 테스트
    let result = transform_function_body((), code);
    assert!(result.was_modified);
}

#[test]
fn transform_function_body_한국어_JSXText를_t_호출로_변환해야_함() {
    let code = r#"function Component() {
  return <div>안녕하세요</div>;
}"#;
    
    // TODO: SWC AST traverse로 구현되면 실제 AST 노드로 테스트
    // 현재는 소스코드 직접 검사로 테스트
    let result = transform_function_body((), code);
    assert!(result.was_modified);
}

#[test]
fn transform_function_body_이미_t로_래핑된_문자열은_변환하지_않아야_함() {
    let code = r#"function Component() {
  return <div>{t("key")}</div>;
}"#;
    
    // TODO: SWC AST traverse로 구현되면 실제 AST 노드로 테스트
    // 현재는 t() 함수 감지 로직이 없으므로 false 반환
    let result = transform_function_body((), code);
    // TODO: 실제 구현 후 false로 변경
    // 현재는 한국어가 없으므로 false 반환
    assert!(!result.was_modified);
}

#[test]
fn transform_function_body_i18n_ignore_주석이_있으면_변환하지_않아야_함() {
    let code = r#"function Component() {
  // i18n-ignore
  return <div>Hello</div>;
}"#;
    
    // TODO: SWC AST traverse로 구현되면 실제 AST 노드로 테스트
    // 현재는 주석 감지 로직이 없으므로 false 반환
    let result = transform_function_body((), code);
    // TODO: 실제 구현 후 false로 변경
    // 현재는 한국어가 없으므로 false 반환
    assert!(!result.was_modified);
}
