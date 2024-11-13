/// t-wrapper Rust CLI
/// SWC를 사용하여 AST 변환 수행

use t_wrapper_rust::{run_translation_wrapper, CliOptions, CliHelp};
use t_wrapper_rust::constants;
use std::env;

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let mut config = t_wrapper_rust::ScriptConfig::default();

    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            CliOptions::PATTERN | CliOptions::PATTERN_SHORT => {
                if i + 1 < args.len() {
                    config.source_pattern = args[i + 1].clone();
                    i += 1;
                }
            }
            CliOptions::DRY_RUN | CliOptions::DRY_RUN_SHORT => {
                config.dry_run = true;
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

    if let Err(e) = run_translation_wrapper(config) {
        eprintln!("{} {}", constants::ConsoleMessages::FATAL_ERROR, e);
        std::process::exit(1);
    }
}

