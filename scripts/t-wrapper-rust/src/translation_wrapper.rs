/// TranslationWrapper 구조체
/// 한국어 문자열을 t() 함수로 변환하고 useTranslation 훅을 추가

use crate::ast_helpers::is_server_component;
use crate::ast_transformers::transform_function_body;
use crate::import_manager::{add_import_if_needed, create_use_translation_hook};
use anyhow::Result;
use glob::glob;
use std::fs;

/// 설정 구조체
#[derive(Debug, Clone)]
pub struct ScriptConfig {
    pub source_pattern: String,
    pub dry_run: bool,
    pub translation_import_source: String,
    pub enable_performance_monitoring: bool,
    pub sentry_dsn: Option<String>,
}

impl Default for ScriptConfig {
    fn default() -> Self {
        Self {
            source_pattern: "src/**/*.{js,jsx,ts,tsx}".to_string(),
            dry_run: false,
            translation_import_source: "i18nexus".to_string(),
            enable_performance_monitoring: false,
            sentry_dsn: None,
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

    fn process_function_body(&self, _path: (), source_code: &str) -> (bool, bool) {
        let is_server_component_result = is_server_component(source_code);
        let transform_result = transform_function_body((), source_code);

        (
            transform_result.was_modified,
            is_server_component_result,
        )
    }

    pub fn process_files(&self) -> Result<Vec<String>> {
        let file_paths = glob(&self.config.source_pattern)?
            .filter_map(|entry| entry.ok())
            .collect::<Vec<_>>();
        
        let mut processed_files = Vec::new();

        for file_path in file_paths {
            let code = fs::read_to_string(&file_path)?;
            // TODO: SWC로 파싱 및 변환
            let (was_modified, is_server_component) = self.process_function_body((), &code);

            if was_modified {

                // 서버 컴포넌트는 useTranslation 훅을 추가하지 않음
                if !is_server_component {
                    // TODO: useTranslation 훅 추가
                    let _hook = create_use_translation_hook();
                    
                    // TODO: import 추가
                    let _ast = ();
                    add_import_if_needed(_ast, &self.config.translation_import_source);
                }

                if !self.config.dry_run {
                    // TODO: 변환된 코드를 파일에 쓰기
                    // fs::write(&file_path, transformed_code)?;
                }

                processed_files.push(file_path.to_string_lossy().to_string());
            }
        }

        Ok(processed_files)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_translation_wrapper_new() {
        let wrapper = TranslationWrapper::new(None);
        // 기본 생성 테스트
        assert!(true);
    }

    #[test]
    fn test_process_function_body() {
        let wrapper = TranslationWrapper::new(None);
        let code = "function Component() { return <div>안녕하세요</div>; }";
        let (was_modified, is_server) = wrapper.process_function_body((), code);
        assert!(was_modified);
        assert!(!is_server);
    }
}

