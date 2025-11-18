use t_wrapper_rust::parser::*;

#[test]
fn test_parse_simple_function() {
    // JSX가 없는 간단한 함수로 테스트
    let code = r#"
function Component() {
  return "안녕하세요";
}
"#;
    
    let options = ParseOptions::default();
    let result = parse_file(code, options);
    
    if let Err(e) = &result {
        eprintln!("Parse error: {:?}", e);
    }
    assert!(result.is_ok());
    let module = result.unwrap();
    assert!(!module.body.is_empty());
}

#[test]
fn test_parse_with_korean() {
    // JSX가 없는 간단한 함수로 테스트
    let code = r#"
export default function Page() {
  return "홈페이지";
}
"#;
    
    let options = ParseOptions::default();
    let result = parse_file(code, options);
    
    assert!(result.is_ok());
}

