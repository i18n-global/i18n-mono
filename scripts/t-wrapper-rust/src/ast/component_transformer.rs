use crate::ast::ast_helpers::{is_react_component};
use crate::ast::ast_transformers::{transform_function_body};
use swc_ecma_ast::*;

pub fn try_transform_component(
    _fn_decl: &FnDecl,
    source_code: &str,
    modified_functions: &mut Vec<String>,
) -> bool {
    let function_name = &_fn_decl.ident.sym.to_string();
    
    if is_react_component(function_name) {
        let transform_result = transform_function_body((), source_code);
        if transform_result.was_modified {
            modified_functions.push(function_name.clone());
            return true;
        }
    }
    
    false
}

