/// SWC 파서 모듈
/// TypeScript/JavaScript 파일을 AST로 파싱

use anyhow::Result;

/// 파싱 옵션
#[derive(Debug, Clone)]
pub struct ParseOptions {
    pub tsx: bool,
    pub decorators: bool,
}

impl Default for ParseOptions {
    fn default() -> Self {
        Self {
            tsx: true,
            decorators: true,
        }
    }
}
