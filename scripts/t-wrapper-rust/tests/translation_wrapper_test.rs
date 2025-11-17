use t_wrapper_rust::TranslationWrapper;

#[test]
fn test_translation_wrapper_new() {
    let wrapper = TranslationWrapper::new(None);
    // 기본 생성 테스트
    assert!(true);
}

#[test]
fn test_process_function_body() {
    let wrapper = TranslationWrapper::new(None);
    let code = "function Component() { return <div>안녕하세요</div>; }";
    let was_modified = wrapper.process_function_body((), code);
    assert!(was_modified);
}


