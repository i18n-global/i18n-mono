/// SWC 파서 모듈
/// TypeScript/JavaScript 파일을 AST로 파싱

use swc_ecma_parser::{Parser, StringInput, Syntax, lexer::Lexer};
use swc_common::{SourceMap, FileName, BytePos, source_map::SmallPos};
use swc_ecma_ast::Module;
use anyhow::{Result, Context};

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

/// 파일을 AST로 파싱
pub fn parse_file(code: &str, options: ParseOptions) -> Result<Module> {
    let source_map = SourceMap::default();
    
    let file = source_map.new_source_file(
        FileName::Anon.into(),
        code,
    );
    
    let syntax = if options.tsx {
        Syntax::Typescript(Default::default())
    } else {
        Syntax::Es(Default::default())
    };
    
    let input = StringInput::new(
        &file.src,
        BytePos::from_u32(0),
        BytePos::from_u32(file.src.len() as u32),
    );
    
    let lexer = Lexer::new(syntax, Default::default(), input, None);
    let mut parser = Parser::new_from(lexer);
    
    parser
        .parse_module()
        .map_err(|e| {
            let msg = format!("Parse error: {:?}", e);
            anyhow::anyhow!(msg)
        })
        .context("Failed to parse file")
}
