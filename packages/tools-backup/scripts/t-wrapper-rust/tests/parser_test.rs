use t_wrapper_rust::parser::*;

#[test]
fn test_parse_simple_function() {
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
    let code = r#"
export default function Page() {
  return "홈페이지";
}
"#;
    
    let options = ParseOptions::default();
    let result = parse_file(code, options);
    
    assert!(result.is_ok());
}

#[test]
fn test_parse_jsx_with_file() {
    use std::fs;
    use std::path::Path;
    
    let test_file = Path::new("test-src/test.tsx");
    if test_file.exists() {
        let code = fs::read_to_string(test_file).unwrap();
        let options = ParseOptions::default();
        let result = parse_file(&code, options);
        
        assert!(result.is_ok(), "JSX 파일 파싱 실패");
        let module = result.unwrap();
        assert!(!module.body.is_empty());
        
        // 코드 생성도 테스트
        let generated = generate_code(&module);
        assert!(generated.is_ok(), "JSX 코드 생성 실패");
    }
}

#[test]
fn test_parse_and_generate_code() {
    let code = r#"
function Component() {
  return "안녕하세요";
}
"#;
    
    let options = ParseOptions::default();
    let module = parse_file(code, options).unwrap();
    
    let generated = generate_code(&module);
    assert!(generated.is_ok(), "코드 생성 실패");
    let output = generated.unwrap();
    assert!(!output.is_empty());
    assert!(output.contains("Component"));
}

#[test]
fn test_parse_typescript() {
    let code = r#"
interface Props {
  name: string;
}

export function Greeting({ name }: Props) {
  return `안녕하세요 ${name}님`;
}
"#;
    
    let options = ParseOptions::default();
    let result = parse_file(code, options);
    
    assert!(result.is_ok(), "TypeScript 파싱 실패");
}

