use anyhow::Result;
use glob::glob;
use std::fs;
use std::time::Instant;
use swc_ecma_ast::*;
use crate::common::ScriptConfig;
use crate::ast::ast_transformers::transform_module;
use crate::applier::translation_applier::{apply_translations_to_ast, write_ast_to_file, ApplierConfig};
use crate::parser::{parse_file, ParseOptions};

#[derive(Debug)]
pub struct WrapResult {
    pub processed_files: Vec<String>,
    pub total_time_ms: u128,
}

pub fn wrap_translations(config: Option<ScriptConfig>) -> Result<WrapResult> {
    let config = config.unwrap_or_default();
    let start_time = Instant::now();
    
    let file_paths: Vec<_> = glob(&config.source_pattern)?
        .filter_map(|entry| entry.ok())
        .collect();
    
    let mut processed_files = Vec::new();
    
    for file_path in file_paths {
        let code = match fs::read_to_string(&file_path) {
            Ok(c) => c,
            Err(_) => continue,
        };
        
        let mut ast = match parse_file(&code, ParseOptions::default()) {
            Ok(module) => module,
            Err(e) => {
                eprintln!("❌ Error parsing {}: {}", file_path.display(), e);
                continue;
            }
        };
        
        let (transform_result, modified_functions) = transform_module(&mut ast, code.clone());
        
        if transform_result.was_modified {
            let applier_config = ApplierConfig {
                mode: config.mode.clone(),
                framework: config.framework.clone(),
                server_translation_function: config.server_translation_function.clone(),
                translation_import_source: config.translation_import_source.clone(),
            };
            
            apply_translations_to_ast(&mut ast, &modified_functions, &applier_config);
            write_ast_to_file(&ast, &file_path.to_string_lossy())?;
            processed_files.push(file_path.to_string_lossy().to_string());
        }
    }
    
    let total_time_ms = start_time.elapsed().as_millis();
    
    Ok(WrapResult {
        processed_files,
        total_time_ms,
    })
}

