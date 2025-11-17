/// SWC 파서 모듈
/// TypeScript/JavaScript 파일을 AST로 파싱

use std::sync::Arc;
use swc::{Compiler, config::IsModule};
use swc_common::{
    errors::Handler,
    FileName, SourceMap, GLOBALS, sync::Lrc,
};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_ast::{EsVersion, Module, Program};
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
/// 
/// SWC 고수준 API를 사용하여 파싱합니다.
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
        let compiler = Compiler::new(cm.clone());
        
        let filename: Lrc<FileName> = FileName::Custom("input.tsx".into()).into();
        let source = cm.new_source_file(filename, code.to_string());

        let syntax = if options.tsx {
            Syntax::Typescript(TsConfig {
                tsx: true,
                decorators: options.decorators,
                ..Default::default()
            })
        } else {
            Syntax::Es(Default::default())
        };

        let parsed = compiler
            .parse_js(
                source,
                &handler,
                EsVersion::Es2020,
                syntax,
                IsModule::Bool(true),
                Some(compiler.comments()),
            )
            .map_err(|e| {
                let msg = format!("Parse error: {:?}", e);
                anyhow::anyhow!(msg)
            })
            .context("Failed to parse file")?;

        match parsed {
            Program::Module(module) => Ok(module),
            Program::Script(_) => Err(anyhow::anyhow!("Expected module, got script")),
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_function() {
        let code = r#"
function Component() {
  return <div>안녕하세요</div>;
}
"#;
        
        let options = ParseOptions::default();
        let result = parse_file(code, options);
        
        if let Err(e) = &result {
            eprintln!("Parse error: {:?}", e);
        }
        assert!(result.is_ok());
        let module = result.unwrap();
        assert!(!module.body.is_empty());
    }

    #[test]
    fn test_parse_with_korean() {
        let code = r#"
export default function Page() {
  return <h1>홈페이지</h1>;
}
"#;
        
        let options = ParseOptions::default();
        let result = parse_file(code, options);
        
        assert!(result.is_ok());
    }
}
