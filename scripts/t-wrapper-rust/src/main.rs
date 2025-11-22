/// t-wrapper Rust CLI
/// TypeScript의 index.ts와 동일

use t_wrapper_rust::{wrap_translations, ScriptConfig};
use t_wrapper_rust::utils::constants::{ConsoleMessages, CliOptions, CliHelp};
use std::env;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let mut config = ScriptConfig::default();

    // CLI 옵션 파싱
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            CliOptions::PATTERN | CliOptions::PATTERN_SHORT => {
                if i + 1 < args.len() {
                    config.source_pattern = args[i + 1].clone();
                    i += 1;
                }
            }
            CliOptions::HELP | CliOptions::HELP_SHORT => {
                println!(
                    "\n{}\n\n{}\n\n{}",
                    CliHelp::USAGE,
                    CliHelp::OPTIONS,
                    CliHelp::EXAMPLES
                );
                return;
            }
            _ => {
                eprintln!("Unknown option: {}", args[i]);
                std::process::exit(1);
            }
        }
        i += 1;
    }

    // wrap_translations 호출
    match wrap_translations(Some(config)) {
        Ok(result) => {
            let time_in_seconds = result.total_time_ms as f64 / 1000.0;
            println!(
                "✅ Processed {} file(s) in {:.2}s",
                result.processed_files.len(),
                time_in_seconds
            );
        }
        Err(e) => {
            eprintln!("{} {}", ConsoleMessages::FATAL_ERROR, e);
            std::process::exit(1);
        }
    }
}
