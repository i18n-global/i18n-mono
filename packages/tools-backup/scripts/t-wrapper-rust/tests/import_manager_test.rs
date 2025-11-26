use t_wrapper_rust::{create_use_translation_hook, add_import_if_needed};
use t_wrapper_rust::parser::{parse_file, generate_code, ParseOptions};

#[test]
fn add_import_if_needed_import가_없으면_추가해야_함() {
    let code = r#"function Component() {}"#;
    
    let mut ast = parse_file(code, ParseOptions::default()).unwrap();
    let result = add_import_if_needed(&mut ast, "next-i18next");
    assert!(result);
}

#[test]
fn add_import_if_needed_import가_이미_있으면_추가하지_않아야_함() {
    let code = r#"import { useTranslation } from "next-i18next";
function Component() {}"#;
    
    let mut ast = parse_file(code, ParseOptions::default()).unwrap();
    let result = add_import_if_needed(&mut ast, "next-i18next");
    assert!(!result);
}

#[test]
fn create_use_translation_hook_훅_생성_테스트() {
    let hook = create_use_translation_hook();
    
    let mut module = parse_file("", ParseOptions::default()).unwrap();
    module.body.insert(0, swc_ecma_ast::ModuleItem::Stmt(hook));
    let code = generate_code(&module).unwrap();
    
    assert!(code.contains("const"));
    assert!(code.contains("t"));
    assert!(code.contains("useTranslation"));
}
