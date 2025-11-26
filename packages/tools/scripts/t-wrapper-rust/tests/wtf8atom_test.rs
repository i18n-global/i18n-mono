/**
 * Wtf8Atom 변환 테스트
 * to_atom_lossy()와 as_wtf8().to_string_lossy() 메서드가 작동하는지 확인
 */

use t_wrapper_rust::parser::parse_file;
use swc_ecma_ast::*;

#[test]
fn test_to_atom_lossy() {
    // 간단한 코드 파싱
    let code = r#"const text = "안녕하세요";"#;
    
    let module = parse_file(code, Default::default()).unwrap();
    
    // StringLiteral 찾기
    let mut found_str_lit: Option<&Str> = None;
    for item in &module.body {
        if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))) = item {
            for decl in &var_decl.decls {
                if let Some(init) = &decl.init {
                    if let Expr::Lit(Lit::Str(str_lit)) = init.as_ref() {
                        found_str_lit = Some(str_lit);
                        break;
                    }
                }
            }
        }
    }
    
    if let Some(str_lit) = found_str_lit {
        // 방법 1: to_atom_lossy() 테스트
        let atom = str_lit.value.to_atom_lossy();
        let value: &str = atom.as_ref();
        
        println!("to_atom_lossy() 결과: {}", value);
        assert_eq!(value, "안녕하세요");
    } else {
        panic!("StringLiteral을 찾을 수 없습니다");
    }
}

#[test]
fn test_as_wtf8_to_string_lossy() {
    // 간단한 코드 파싱
    let code = r#"const text = "안녕하세요";"#;
    
    let module = parse_file(code, Default::default()).unwrap();
    
    // StringLiteral 찾기
    let mut found_str_lit: Option<&Str> = None;
    for item in &module.body {
        if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))) = item {
            for decl in &var_decl.decls {
                if let Some(init) = &decl.init {
                    if let Expr::Lit(Lit::Str(str_lit)) = init.as_ref() {
                        found_str_lit = Some(str_lit);
                        break;
                    }
                }
            }
        }
    }
    
    if let Some(str_lit) = found_str_lit {
        // 방법 2: as_wtf8() + to_string_lossy() 테스트
        let value = str_lit.value.as_wtf8().to_string_lossy();
        let str_value: &str = value.as_ref();
        
        println!("as_wtf8().to_string_lossy() 결과: {}", str_value);
        assert_eq!(str_value, "안녕하세요");
    } else {
        panic!("StringLiteral을 찾을 수 없습니다");
    }
}

