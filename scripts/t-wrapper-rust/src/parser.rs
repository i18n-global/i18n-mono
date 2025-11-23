/// SWC 파서 모듈
/// TypeScript/JavaScript 파일을 AST로 파싱

use std::sync::Arc;
use swc_common::{
    errors::Handler,
    FileName, SourceMap, GLOBALS, sync::Lrc,
    comments::SingleThreadedComments,
};
use swc_ecma_parser::{Parser, StringInput, Syntax, lexer::Lexer};
use swc_ecma_ast::{EsVersion, Module};
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

/// AST를 코드로 변환
/// 
/// SWC 코드 생성 API를 사용하여 AST를 JavaScript/TypeScript 코드로 변환합니다.
pub fn generate_code(module: &Module) -> Result<String> {
    use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
    use swc_common::{SourceMap, sync::Lrc};
    
    let cm: Lrc<SourceMap> = Default::default();
    let mut buf = Vec::new();
    let writer = JsWriter::new(cm.clone(), "\n", &mut buf, None);
    
    let mut emitter = Emitter {
        cfg: swc_ecma_codegen::Config::default(),
        cm: cm.clone(),
        comments: None,
        wr: writer,
    };
    
    emitter.emit_module(module)
        .map_err(|e| anyhow::anyhow!("Code generation error: {:?}", e))?;
    
    String::from_utf8(buf)
        .map_err(|e| anyhow::anyhow!("UTF-8 conversion error: {:?}", e))
}

/// 파일을 AST로 파싱
/// 
/// SWC 저수준 API를 직접 사용하여 파싱합니다.
/// GLOBALS.set 패턴을 사용해야 합니다.
pub fn parse_file(code: &str, options: ParseOptions) -> Result<Module> {
    let cm = Arc::new(SourceMap::default());
    let emitter = Box::new(swc_common::errors::emitter::EmitterWriter::new(
        Box::new(std::io::stderr()),
        None,
        false,
        false,
    ));
    let handler = Handler::with_emitter(false, true, emitter);

    GLOBALS.set(&Default::default(), || {
        let filename: Lrc<FileName> = if options.tsx {
            FileName::Custom("input.tsx".into()).into()
        } else {
            FileName::Custom("input.ts".into()).into()
        };
        let source = cm.new_source_file(filename, code.to_string());

        let syntax = if options.tsx {
            // TSX 파싱을 위한 설정
            use swc_ecma_parser::TsSyntax;
            Syntax::Typescript(TsSyntax {
                tsx: true,
                decorators: options.decorators,
                ..Default::default()
            })
        } else {
            Syntax::Es(Default::default())
        };

        let comments = SingleThreadedComments::default();
        let lexer = Lexer::new(
            syntax,
            EsVersion::Es2020,
            StringInput::from(&*source),
            Some(&comments),
        );
        let mut parser = Parser::new_from(lexer);

        parser
            .parse_module()
            .map_err(|e| {
                let msg = format!("Parse error: {:?}", e);
                e.into_diagnostic(&handler).emit();
                anyhow::anyhow!(msg)
            })
            .context("Failed to parse file")
    })
}
