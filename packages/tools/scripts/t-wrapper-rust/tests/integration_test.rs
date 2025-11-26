use t_wrapper_rust::*;

#[test]
fn test_ast_helpers_module() {
    assert!(is_react_component("Button"));
}

#[test]
fn test_ast_transformers_module() {
    let result = transform_function_body((), "function Component() { return <div>안녕하세요</div>; }");
    assert!(result.was_modified);
}

#[test]
fn test_wrap_translations_module() {
    let config = ScriptConfig::default();
    let result = wrap_translations(Some(config));
    assert!(result.is_ok());
}

