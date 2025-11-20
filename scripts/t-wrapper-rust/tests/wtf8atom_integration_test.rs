/**
 * Wtf8Atom 변환 통합 테스트
 * ast_transformers에서 실제로 사용되는 변환 로직이 올바르게 작동하는지 확인
 */

use t_wrapper_rust::parser::{parse_file, generate_code};
use t_wrapper_rust::ast_transformers::transform_module;

#[test]
fn test_wtf8atom_conversion_in_ast_transform() {
    // 한국어가 포함된 간단한 코드 (JSX 없이)
    let code = r#"const text = "안녕하세요";"#;
    
    let mut module = parse_file(code, Default::default()).unwrap();
    let (result, _) = transform_module(&mut module, code.to_string());
    
    // 변환이 일어났는지 확인
    assert!(result.was_modified, "한국어 문자열이 t() 호출로 변환되어야 함");
    
    // 변환된 코드 확인
    let generated_code = generate_code(&module).unwrap();
    
    // t() 호출이 포함되어 있는지 확인
    assert!(generated_code.contains("t("), "변환된 코드에 t() 호출이 포함되어야 함");
    println!("변환된 코드:\n{}", generated_code);
}

#[test]
fn test_wtf8atom_conversion_only_korean_strings() {
    // 영어만 포함된 코드 (변환되지 않아야 함)
    let code = r#"const text = "Hello";"#;
    
    let mut module = parse_file(code, Default::default()).unwrap();
    let (result, _) = transform_module(&mut module, code.to_string());
    
    // 변환이 일어나지 않아야 함
    assert!(!result.was_modified, "영어 문자열은 변환되지 않아야 함");
}

#[test]
fn test_wtf8atom_conversion_mixed_strings() {
    // 한국어와 영어가 섞인 코드
    let code = r#"const korean = "안녕하세요";
const english = "Hello";"#;
    
    let mut module = parse_file(code, Default::default()).unwrap();
    let (result, _) = transform_module(&mut module, code.to_string());
    
    // 한국어 문자열만 변환되어야 함
    assert!(result.was_modified, "한국어 문자열이 포함되어 있으면 변환되어야 함");
    
    // 변환된 코드 확인
    let generated_code = generate_code(&module).unwrap();
    
    // 한국어 문자열이 t() 호출로 변환되었는지 확인
    assert!(generated_code.contains("t("), "한국어 문자열이 t() 호출로 변환되어야 함");
    // 영어 문자열은 그대로 유지되어야 함
    assert!(generated_code.contains("\"Hello\""), "영어 문자열은 그대로 유지되어야 함");
    println!("변환된 코드:\n{}", generated_code);
}

