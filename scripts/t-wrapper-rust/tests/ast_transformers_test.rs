use t_wrapper_rust::transform_function_body;

#[test]
fn test_transform_function_body() {
    let code = "function Component() { return <div>안녕하세요</div>; }";
    let result = transform_function_body((), code);
    assert!(result.was_modified);
    
    let code = "function Component() { return <div>Hello</div>; }";
    let result = transform_function_body((), code);
    assert!(!result.was_modified);
}


