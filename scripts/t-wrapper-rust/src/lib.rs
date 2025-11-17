/// t-wrapper Rust 라이브러리
/// 
/// 한국어 문자열을 t() 함수로 변환하고 useTranslation 훅을 추가하는 기능 제공

pub mod constants;
pub mod ast_helpers;
pub mod ast_transformers;
pub mod import_manager;
pub mod translation_wrapper;
pub mod parser;

pub use constants::*;
pub use ast_helpers::*;
pub use ast_transformers::*;
pub use import_manager::*;
pub use translation_wrapper::*;

/// runTranslationWrapper 함수
/// TypeScript 버전과 동일한 인터페이스
pub fn run_translation_wrapper(config: ScriptConfig) -> anyhow::Result<()> {
    let wrapper = TranslationWrapper::new(Some(config));
    
    let processed_files = wrapper.process_files()?;
    
    // TODO: 성능 리포트 출력
    println!("✅ Translation Wrapper Completed");
    println!("   Processed {} files", processed_files.len());
    
    Ok(())
}
