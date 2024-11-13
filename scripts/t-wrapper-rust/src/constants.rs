/// t-wrapper 상수 정의
/// 모든 상수를 중앙화

use std::sync::LazyLock;
use regex::Regex;

/// Console 메시지 (에러만 출력)
pub struct ConsoleMessages;

impl ConsoleMessages {
    pub fn error_processing(file_path: &str) -> String {
        format!("❌ Error processing {}:", file_path)
    }

    pub const FATAL_ERROR: &'static str = "❌ Fatal error:";
}

/// CLI 옵션
pub struct CliOptions;

impl CliOptions {
    pub const PATTERN: &'static str = "--pattern";
    pub const PATTERN_SHORT: &'static str = "-p";
    pub const DRY_RUN: &'static str = "--dry-run";
    pub const DRY_RUN_SHORT: &'static str = "-d";
    pub const HELP: &'static str = "--help";
    pub const HELP_SHORT: &'static str = "-h";
}

/// CLI Help 메시지
pub struct CliHelp;

impl CliHelp {
    pub const USAGE: &'static str = "Usage: t-wrapper [options]";
    pub const OPTIONS: &'static str = "Options:
  -p, --pattern <pattern>    Source file pattern (default: \"src/**/*.{js,jsx,ts,tsx}\")
  -d, --dry-run             Preview changes without modifying files
  -h, --help                Show this help message";
    pub const EXAMPLES: &'static str = "Examples:
  t-wrapper
  t-wrapper -p \"app/**/*.tsx\"
  t-wrapper --dry-run";
}

/// 문자열 상수
pub struct StringConstants;

impl StringConstants {
    pub const I18N_IGNORE: &'static str = "i18n-ignore";
    pub const I18N_IGNORE_COMMENT: &'static str = "// i18n-ignore";
    pub const I18N_IGNORE_BLOCK: &'static str = "/* i18n-ignore";
    pub const I18N_IGNORE_JSX: &'static str = "{/* i18n-ignore";
    pub const TRANSLATION_FUNCTION: &'static str = "t";
    pub const USE_TRANSLATION: &'static str = "useTranslation";
    pub const GET_SERVER_TRANSLATION: &'static str = "getServerTranslation";
    pub const COMPLETION_TITLE: &'static str = "Translation Wrapper Completed";
    pub const DEFAULT_ENV: &'static str = "production";
    pub const VARIABLE_KIND: &'static str = "const";
    pub const EXPR_PREFIX: &'static str = "expr";
    pub const INTERPOLATION_START: &'static str = "{{";
    pub const INTERPOLATION_END: &'static str = "}}";
    pub const MEMBER_SEPARATOR: &'static str = "_";
}

/// 정규식 패턴
pub struct RegexPatterns;

impl RegexPatterns {
    pub fn react_component() -> &'static Regex {
        static REACT_COMPONENT: LazyLock<Regex> = LazyLock::new(|| {
            Regex::new(r"^[A-Z]").unwrap()
        });
        &REACT_COMPONENT
    }

    pub fn react_hook() -> &'static Regex {
        static REACT_HOOK: LazyLock<Regex> = LazyLock::new(|| {
            Regex::new(r"^use[A-Z]").unwrap()
        });
        &REACT_HOOK
    }

    pub fn korean_text() -> &'static Regex {
        static KOREAN_TEXT: LazyLock<Regex> = LazyLock::new(|| {
            Regex::new(r"[가-힣]").unwrap()
        });
        &KOREAN_TEXT
    }
}

