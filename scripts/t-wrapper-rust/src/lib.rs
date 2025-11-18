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
pub use parser::*;

/// runTranslationWrapper 함수
/// TypeScript 버전과 동일한 로직:
/// 1. TranslationWrapper 생성
/// 2. processFiles 호출
/// 3. 성능 리포트 출력 (TODO)
/// 4. Sentry 데이터 플러시 (TODO)
pub fn run_translation_wrapper(config: ScriptConfig) -> anyhow::Result<()> {
    let wrapper = TranslationWrapper::new(Some(config));

    // TODO: PerformanceMonitor 추가
    // let start_time = std::time::Instant::now();

    let processed_files = wrapper.process_files()?;

    // TODO: PerformanceMonitor
    // let end_time = std::time::Instant::now();
    // let total_time = end_time.duration_since(start_time);

    // TODO: 완료 리포트 출력
    // let report = wrapper.performance_monitor.get_report();
    // PerformanceReporter::print_completion_report(
    //     report,
    //     processed_files,
    //     total_time,
    //     StringConstants::COMPLETION_TITLE,
    // );

    // TODO: 상세 리포트 출력 (verbose mode인 경우)
    // if std::env::var("I18N_PERF_VERBOSE").unwrap_or_default() == "true" {
    //     wrapper.print_performance_report(true);
    // }

    // TODO: Sentry 데이터 플러시
    // wrapper.flush_performance_data().await?;

    Ok(())
}
