/// TranslationWrapper 구조체
/// 한국어 문자열을 t() 함수로 변환하고 useTranslation 훅을 추가

use crate::ast_helpers::is_react_component;
use crate::ast_transformers::transform_function_body;
use crate::import_manager::{add_import_if_needed, create_use_translation_hook, add_server_translation_import};
use crate::constants::StringConstants;
use crate::parser::{parse_file, ParseOptions};
use anyhow::Result;
use glob::glob;
use std::fs;
use swc_ecma_ast::*;

/// 설정 구조체
#[derive(Debug, Clone)]
pub struct ScriptConfig {
    pub source_pattern: String,
    pub dry_run: bool,
    pub translation_import_source: String,
    pub enable_performance_monitoring: bool,
    pub sentry_dsn: Option<String>,
    pub mode: Option<String>, // "client" | "server"
    pub server_translation_function: Option<String>,
}

impl Default for ScriptConfig {
    fn default() -> Self {
        Self {
            source_pattern: "src/**/*.{js,jsx,ts,tsx}".to_string(),
            dry_run: false,
            translation_import_source: "i18nexus".to_string(),
            enable_performance_monitoring: false,
            sentry_dsn: None,
            mode: None,
            server_translation_function: None,
        }
    }
}

/// TranslationWrapper 구조체
pub struct TranslationWrapper {
    config: ScriptConfig,
}

impl TranslationWrapper {
    pub fn new(config: Option<ScriptConfig>) -> Self {
        Self {
            config: config.unwrap_or_default(),
        }
    }

    /// 'use client' 디렉티브 보장
    /// TypeScript 버전과 동일한 로직:
    /// 이미 존재하면 패스, 없으면 추가
    fn ensure_use_client_directive(&self, _module: &mut Module) {
        // TODO: SWC AST로 구현
        // let has_directive = module.body.iter().any(|item| {
        //     if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
        //         // directive 확인 로직
        //     }
        //     false
        // });
        // if !has_directive {
        //     // directive 추가
        // }
    }

    /// Named import 보장
    /// TypeScript 버전과 동일한 로직:
    /// 같은 소스의 import가 있고 specifier가 있으면 true 반환
    /// 같은 소스의 import가 있지만 specifier가 없으면 추가
    /// import가 없으면 새로 생성
    fn ensure_named_import(&self, _module: &mut Module, _source: &str, _imported_name: &str) -> bool {
        // TODO: SWC AST로 구현
        // let mut has_source = false;
        // let mut has_specifier = false;
        // for item in &module.body {
        //     if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
        //         // Wtf8Atom 처리 필요
        //         // if import_decl.src.value == source {
        //         //     has_source = true;
        //         //     // specifier 확인 및 추가
        //         // }
        //     }
        // }
        // if !has_source {
        //     // 새 import declaration 생성 및 추가
        // }
        true
    }

    /// Server 모드에서 t 바인딩 생성
    /// TypeScript 버전과 동일한 로직:
    /// const { t } = await getServerTranslation();
    fn create_server_t_binding(&self, _server_fn_name: &str) -> VariableDeclarator {
        // TODO: SWC AST 노드 생성으로 구현
        // VariableDeclarator {
        //     name: Pat::Object(ObjectPat {
        //         props: vec![ObjectPatProp::KeyValue(KeyValuePatProp {
        //             key: PropName::Ident(Ident {
        //                 sym: StringConstants::TRANSLATION_FUNCTION.into(),
        //                 ...
        //             }),
        //             value: Box::new(Pat::Ident(BindingIdent {
        //                 id: Ident {
        //                     sym: StringConstants::TRANSLATION_FUNCTION.into(),
        //                     ...
        //                 },
        //                 ...
        //             })),
        //         })],
        //         ...
        //     }),
        //     init: Some(Box::new(Expr::Await(AwaitExpr {
        //         arg: Box::new(Expr::Call(CallExpr {
        //             callee: Callee::Expr(Box::new(Expr::Ident(Ident {
        //                 sym: server_fn_name.into(),
        //                 ...
        //             }))),
        //             args: vec![],
        //             ...
        //         })),
        //         ...
        //     }))),
        //     ...
        // }
        todo!("create_server_t_binding not implemented")
    }

    /// 함수 body 내의 AST 노드들을 변환
    /// TypeScript 버전과 동일한 로직:
    /// transformFunctionBody 호출
    fn process_function_body(&self, _path: (), source_code: &str) -> bool {
        let transform_result = transform_function_body((), source_code);
        transform_result.was_modified
    }

    /// 파일들을 처리
    /// TypeScript 버전과 동일한 로직:
    /// 1. glob으로 파일 목록 가져오기
    /// 2. 각 파일을 파싱 및 변환
    /// 3. mode에 따라 client/server 처리
    /// 4. 필요한 import 추가
    /// 5. 변환된 코드를 파일에 쓰기 (dry_run이 아닌 경우)
    pub fn process_files(&self) -> Result<Vec<String>> {
        // TODO: PerformanceMonitor 추가
        // let performance_monitor = PerformanceMonitor::new(...);
        // performance_monitor.start("translation_wrapper:total");

        let file_paths = glob(&self.config.source_pattern)?
            .filter_map(|entry| entry.ok())
            .collect::<Vec<_>>();
        
        let mut processed_files = Vec::new();

        for file_path in file_paths {
            // TODO: PerformanceMonitor
            // performance_monitor.start("file_processing", { file_path });

            let code = fs::read_to_string(&file_path)?;
            let mut is_file_modified = false;

            // TODO: SWC로 파싱
            // let mut ast = parse_file(&code, ParseOptions::default())?;
            
            // TODO: SWC AST traverse로 함수 찾기
            // let mut modified_component_paths: Vec<()> = Vec::new();
            // ast.visit_mut_with(&mut FunctionVisitor {
            //     modified_paths: &mut modified_component_paths,
            //     source_code: &code,
            //     wrapper: self,
            // });

            // 임시로 한국어가 포함되어 있으면 수정되었다고 가정
            if self.process_function_body((), &code) {
                is_file_modified = true;
            }

            if is_file_modified {
                let mut was_use_hook_added = false;
                let mut was_server_import_added = false;

                let is_server_mode = self.config.mode.as_deref() == Some("server");
                let is_client_mode = self.config.mode.as_deref() == Some("client");

                // TODO: SWC AST로 구현
                // if is_client_mode {
                //     self.ensure_use_client_directive(&mut ast);
                // }

                // TODO: SWC AST traverse로 함수 처리
                // for component_path in modified_component_paths {
                //     // t() 바인딩이 이미 있는지 확인
                //     // if component_path.scope.has_binding(StringConstants::TRANSLATION_FUNCTION) {
                //     //     continue;
                //     // }

                //     if is_server_mode {
                //         // server 모드: config에 정의된 서버형 함수 사용
                //         // component_path.node.async = true;
                //         // let body = component_path.get("body");
                //         // let decl = self.create_server_t_binding(
                //         //     self.config.server_translation_function.as_deref().unwrap_or("getServerTranslation")
                //         // );
                //         // if body.is_block_statement() {
                //         //     body.unshift_container("body", decl);
                //         //     was_server_import_added = true;
                //         // } else {
                //         //     // concise body → block으로 감싼 후 return 유지
                //         //     let original = body.node;
                //         //     let block = BlockStmt {
                //         //         stmts: vec![
                //         //             Stmt::Decl(Decl::Var(VarDecl {
                //         //                 decls: vec![decl],
                //         //                 ...
                //         //             })),
                //         //             Stmt::Return(ReturnStmt {
                //         //                 arg: Some(Box::new(original)),
                //         //                 ...
                //         //             }),
                //         //         ],
                //         //         ...
                //         //     };
                //         //     component_path.node.body = block;
                //         //     was_server_import_added = true;
                //         // }
                //     } else {
                //         // client 모드 (또는 기본값): useTranslation 사용
                //         // let body = component_path.get("body");
                //         // if body.is_block_statement() {
                //         //     let mut has_hook = false;
                //         //     body.traverse({
                //         //         CallExpression: (p) => {
                //         //             if p.node.callee.name == StringConstants::USE_TRANSLATION {
                //         //                 has_hook = true;
                //         //             }
                //         //         },
                //         //     });
                //         //     if !has_hook {
                //         //         body.unshift_container("body", create_use_translation_hook());
                //         //         was_use_hook_added = true;
                //         //     }
                //         // }
                //     }
                // }

                // 필요한 import 추가
                if was_use_hook_added {
                    // TODO: SWC AST로 구현
                    // add_import_if_needed(&mut ast, &self.config.translation_import_source);
                }
                if was_server_import_added {
                    // TODO: SWC AST로 구현
                    // let server_fn = self.config.server_translation_function.as_deref().unwrap_or("getServerTranslation");
                    // add_server_translation_import(
                    //     &mut ast,
                    //     &self.config.translation_import_source,
                    //     server_fn,
                    // );
                }

                if !self.config.dry_run {
                    // TODO: 변환된 코드를 파일에 쓰기
                    // let output = generate_code(&ast, ...);
                    // fs::write(&file_path, output)?;
                }

                processed_files.push(file_path.to_string_lossy().to_string());
            }

            // TODO: PerformanceMonitor
            // performance_monitor.end("file_processing", { file_path, modified: is_file_modified });
        }

        // TODO: PerformanceMonitor
        // performance_monitor.end("translation_wrapper:total", {
        //     total_files: file_paths.len(),
        //     processed_files: processed_files.len(),
        // });

        Ok(processed_files)
    }
}
