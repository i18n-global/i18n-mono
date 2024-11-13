/// 통합 테스트
/// 전체 워크플로우를 테스트

use t_wrapper_rust::*;

#[test]
fn test_utils_module() {
    // utils 모듈이 제대로 export되는지 확인
    assert!(contains_korean("안녕하세요"));
    assert!(is_react_component("Button"));
}

#[test]
fn test_parser_module() {
    // parser 모듈이 제대로 export되는지 확인
    let parser = FileParser::new();
    assert!(parser.parse_file("test.tsx", "function Component() {}").is_ok());
}

#[test]
fn test_transformer_module() {
    // transformer 모듈이 제대로 export되는지 확인
    let transformer = Transformer::new();
    assert!(transformer.transform(()).is_ok());
}

