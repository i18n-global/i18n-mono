/// 메인 변환 함수
/// TypeScript의 wrapper.ts와 동일

use anyhow::Result;
use glob::glob;
use std::fs;
use std::time::Instant;
use swc_ecma_ast::*;
use crate::ast::ast_transformers::transform_module;
use crate::applier::translation_applier::{apply_translations_to_ast, write_ast_to_file, ApplierConfig};
use crate::parser::{parse_file, ParseOptions};

/// 설정 구조체
#[derive(Debug, Clone)]
pub struct ScriptConfig {
    pub source_pattern: String,
    pub translation_import_source: String,
    /// 번역 함수 모드
    /// - "client": useTranslation() 사용
    /// - "server": getServerTranslation() 사용
    pub mode: Option<String>,
    /// 프레임워크 타입
    /// - "nextjs": Next.js (client 모드일 때 "use client" 추가)
    /// - "react": React
    pub framework: Option<String>,
    pub server_translation_function: Option<String>,
}

impl Default for ScriptConfig {
    fn default() -> Self {
        Self {
            source_pattern: "src/**/*.{js,jsx,ts,tsx}".to_string(),
            translation_import_source: "i18nexus".to_string(),
            mode: None,
            framework: None,
            server_translation_function: Some("getTranslations".to_string()),
        }
    }
}

/// 변환 결과
#[derive(Debug)]
pub struct WrapResult {
    pub processed_files: Vec<String>,
    pub total_time_ms: u128,
}

/// 번역 래핑 함수
/// 
/// TypeScript 버전과 동일한 로직:
/// 1. glob으로 파일 목록 가져오기
/// 2. 각 파일 처리:
///    - parseFile로 AST 파싱
///    - traverse로 FunctionDeclaration/ArrowFunctionExpression 찾기
///    - tryTransformComponent로 변환 시도
///    - 변환 성공 시 applyTranslationsToAST로 바인딩 추가
///    - writeASTToFile로 파일 쓰기
/// 3. 처리된 파일 목록과 총 시간 반환
pub fn wrap_translations(config: Option<ScriptConfig>) -> Result<WrapResult> {
    let config = config.unwrap_or_default();
    let start_time = Instant::now();
    
    // glob으로 파일 목록 가져오기
    let file_paths: Vec<_> = glob(&config.source_pattern)?
        .filter_map(|entry| entry.ok())
        .collect();
    
    let mut processed_files = Vec::new();
    
    for file_path in file_paths {
        let code = match fs::read_to_string(&file_path) {
            Ok(c) => c,
            Err(_) => continue,
        };
        
        // AST 파싱
        let mut ast = match parse_file(&code, ParseOptions::default()) {
            Ok(module) => module,
            Err(e) => {
                eprintln!("❌ Error parsing {}: {}", file_path.display(), e);
                continue;
            }
        };
        
        // TODO: traverse 구현
        // TypeScript 버전의 로직:
        // traverse(ast, {
        //   FunctionDeclaration: (path) => {
        //     if (tryTransformComponent(path, code, modifiedComponentPaths)) {
        //       isFileModified = true;
        //     }
        //   },
        //   ArrowFunctionExpression: (path) => {
        //     if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
        //       if (tryTransformComponent(path, code, modifiedComponentPaths)) {
        //         isFileModified = true;
        //       }
        //     }
        //   },
        // });
        
        // AST 변환 (한국어 문자열을 t() 함수로 변환)
        let (transform_result, modified_functions) = transform_module(&mut ast, code.clone());
        
        if transform_result.was_modified {
            // 번역 바인딩 및 import 추가
            let applier_config = ApplierConfig {
                mode: config.mode.clone(),
                framework: config.framework.clone(),
                server_translation_function: config.server_translation_function.clone(),
                translation_import_source: config.translation_import_source.clone(),
            };
            
            apply_translations_to_ast(&mut ast, &modified_functions, &applier_config);
            
            // 파일 쓰기
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
