/// 통합 테스트
/// 전체 워크플로우를 테스트

use t_wrapper_rust::*;

#[test]
fn test_ast_helpers_module() {
    // ast_helpers 모듈이 제대로 export되는지 확인
    assert!(is_react_component("Button"));
    // is_server_component는 제거됨 (mode 기반으로 처리)
    // assert!(is_server_component("const { t } = await getServerTranslation();"));
}

#[test]
fn test_ast_transformers_module() {
    // ast_transformers 모듈이 제대로 export되는지 확인
    let result = transform_function_body((), "function Component() { return <div>안녕하세요</div>; }");
    assert!(result.was_modified);
}

#[test]
fn test_translation_wrapper_module() {
    // translation_wrapper 모듈이 제대로 export되는지 확인
    let wrapper = TranslationWrapper::new(None);
    // 기본 생성 테스트
    assert!(true);
}

