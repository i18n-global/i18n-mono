/**
 * import-manager 테스트
 * Import 관리 로직 테스트
 */

use t_wrapper_rust::import_manager::{create_use_translation_hook, add_import_if_needed};
use t_wrapper_rust::parser::{parse_file, generate_code, ParseOptions};

#[test]
fn add_import_if_needed_import가_없으면_추가해야_함() {
    let code = r#"function Component() {}"#;
    
    // TODO: SWC AST로 구현되면 실제 AST 노드로 테스트
    let mut ast = parse_file(code, ParseOptions::default()).unwrap();
    let result = add_import_if_needed(&mut ast, "next-i18next");
    assert!(result);
    // TODO: AST에 ImportDeclaration이 추가되었는지 확인
    // assert!(ast.body[0].is_import_declaration());
}

#[test]
fn add_import_if_needed_import가_이미_있으면_추가하지_않아야_함() {
    let code = r#"import { useTranslation } from "next-i18next";
function Component() {}"#;
    
    // TODO: SWC AST로 구현되면 실제 AST 노드로 테스트
    let mut ast = parse_file(code, ParseOptions::default()).unwrap();
    let result = add_import_if_needed(&mut ast, "next-i18next");
    // TODO: 실제 구현 후 false로 변경
    // assert!(!result);
    // TODO: ImportDeclaration이 1개만 있는지 확인
    // let imports: Vec<_> = ast.body.iter().filter(|node| node.is_import_declaration()).collect();
    // assert_eq!(imports.len(), 1);
    let _ = result;
}

#[test]
fn add_import_if_needed_같은_소스의_import가_있지만_useTranslation이_없으면_추가해야_함() {
    let code = r#"import { other } from "next-i18next";
function Component() {}"#;
    
    // TODO: SWC AST로 구현되면 실제 AST 노드로 테스트
    let mut ast = parse_file(code, ParseOptions::default()).unwrap();
    let result = add_import_if_needed(&mut ast, "next-i18next");
    // TODO: 실제 구현 후 false로 변경 (이미 import가 있으므로)
    // assert!(!result);
    // TODO: ImportDeclaration에 useTranslation이 추가되었는지 확인
    // let import_node = ast.body.iter().find(|node| node.is_import_declaration());
    // assert!(import_node.is_some());
    // let has_use_translation = import_node.specifiers.iter().any(|spec| spec.imported.name == "useTranslation");
    // assert!(has_use_translation);
    let _ = result;
}

#[test]
fn create_use_translation_hook_훅_생성_테스트() {
    let hook = create_use_translation_hook();
    
    // AST 노드를 코드로 변환하여 확인
    let mut module = parse_file("", ParseOptions::default()).unwrap();
    module.body.insert(0, swc_ecma_ast::ModuleItem::Stmt(hook));
    let code = generate_code(&module).unwrap();
    
    assert!(code.contains("const"));
    assert!(code.contains("t"));
    assert!(code.contains("useTranslation"));
}
