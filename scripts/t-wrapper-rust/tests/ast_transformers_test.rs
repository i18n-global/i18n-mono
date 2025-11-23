use t_wrapper_rust::ast_transformers::{transform_function_body, TransformResult};

#[test]
fn transform_function_body_한국어_문자열_리터럴을_t_호출로_변환해야_함() {
    let code = r#"function Component() {
  const text = "안녕하세요";
  return <div>{text}</div>;
}"#;
    
    let result = transform_function_body((), code);
    assert!(result.was_modified);
}

#[test]
fn transform_function_body_한국어_템플릿_리터럴을_t_호출로_변환해야_함() {
    let code = r#"function Component() {
  return <div>{`안녕 ${name}`}</div>;
}"#;
    
    let result = transform_function_body((), code);
    assert!(result.was_modified);
}

#[test]
fn transform_function_body_한국어_JSXText를_t_호출로_변환해야_함() {
    let code = r#"function Component() {
  return <div>안녕하세요</div>;
}"#;
    
    let result = transform_function_body((), code);
    assert!(result.was_modified);
}

#[test]
fn transform_function_body_이미_t로_래핑된_문자열은_변환하지_않아야_함() {
    let code = r#"function Component() {
  return <div>{t("key")}</div>;
}"#;
    
    let result = transform_function_body((), code);
    assert!(!result.was_modified);
}

#[test]
fn transform_function_body_i18n_ignore_주석이_있으면_변환하지_않아야_함() {
    let code = r#"function Component() {
  // i18n-ignore
  return <div>Hello</div>;
}"#;
    
    let result = transform_function_body((), code);
    assert!(!result.was_modified);
}
