use t_wrapper_rust::parser::{parse_file, ParseOptions};

#[test]
fn test_parse_simple_function() {
    let code = r#"
function Component() {
  return <div>안녕하세요</div>;
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
    let code = r#"
export default function Page() {
  return <h1>홈페이지</h1>;
}
"#;
    
    let options = ParseOptions::default();
    let result = parse_file(code, options);
    
    assert!(result.is_ok());
}

