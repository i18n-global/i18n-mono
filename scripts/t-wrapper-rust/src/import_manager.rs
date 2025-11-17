/// Import 관리 유틸리티

use crate::constants::StringConstants;
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

/// useTranslation 훅을 생성하는 AST 노드 생성
/// TODO: SWC AST 노드 생성으로 구현 필요
pub fn create_use_translation_hook() -> String {
    format!(
        "const {{ {} }} = {}();",
        StringConstants::TRANSLATION_FUNCTION,
        StringConstants::USE_TRANSLATION
    )
}

/// AST에 useTranslation import가 필요한지 확인하고 추가
pub fn add_import_if_needed(module: &mut Module, translation_import_source: &str) -> bool {
    let mut has_import = false;
    let mut has_use_translation = false;

    // 기존 import 확인
    for stmt in &module.body {
        if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = stmt {
            // TODO: Wtf8Atom을 문자열로 변환하는 올바른 방법 찾기
            // 현재는 임시로 소스코드에서 직접 검사
            let src_str = format!("{}", import_decl.src.value);
            if src_str == translation_import_source {
                has_import = true;
                // useTranslation이 있는지 확인
                for spec in &import_decl.specifiers {
                    if let ImportSpecifier::Named(named_spec) = spec {
                        if let Some(imported) = &named_spec.imported {
                            if let ModuleExportName::Ident(ident) = imported {
                                let ident_str = format!("{}", ident.sym);
                                if ident_str == StringConstants::USE_TRANSLATION {
                                    has_use_translation = true;
                                    break;
                                }
                            }
                        } else {
                            let local_str = format!("{}", named_spec.local.sym);
                            if local_str == StringConstants::USE_TRANSLATION {
                                has_use_translation = true;
                                break;
                            }
                        }
                    }
                }
                break;
            }
        }
    }

    // useTranslation이 없으면 추가
    if has_import && !has_use_translation {
        // TODO: 기존 import에 specifier 추가
        return true;
    }

    // import가 아예 없으면 새로 생성
    if !has_import {
        // TODO: 새 import declaration 생성 및 추가
        return true;
    }

    false
}

/// Server translation function import 추가
pub fn add_server_translation_import(
    module: &mut Module,
    translation_import_source: &str,
    server_function_name: &str,
) -> bool {
    // TODO: server translation function import 추가
    let _ = (module, translation_import_source, server_function_name);
    true
}
