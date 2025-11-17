/// AST 변환 로직
/// 문자열 리터럴, 템플릿 리터럴, JSX 텍스트를 t() 함수로 변환

use crate::constants::{StringConstants, RegexPatterns};
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMut;

/// 변환 결과
#[derive(Debug, Clone)]
pub struct TransformResult {
    pub was_modified: bool,
}

impl TransformResult {
    pub fn new(was_modified: bool) -> Self {
        Self { was_modified }
    }
}

/// 함수 body 내의 AST 노드들을 변환
/// TODO: 실제 SWC AST traverse로 구현 필요
/// 현재는 소스코드에서 한국어 감지만 수행
pub fn transform_function_body(_path: (), source_code: &str) -> TransformResult {
    let mut was_modified = false;

    // 임시로 한국어가 포함되어 있으면 수정되었다고 가정
    if RegexPatterns::korean_text().is_match(source_code) {
        was_modified = true;
    }

    TransformResult::new(was_modified)
}

/// SWC AST Module을 변환하는 Transformer
pub struct TranslationTransformer {
    pub was_modified: bool,
    source_code: String,
}

impl TranslationTransformer {
    pub fn new(source_code: String) -> Self {
        Self {
            was_modified: false,
            source_code,
        }
    }

    /// t() 함수 호출 생성
    fn create_t_call(&self, _value: &str) -> Expr {
        // TODO: 실제 AST 노드 생성 구현
        // 현재는 플레이스홀더
        Expr::Ident(Ident {
            span: Default::default(),
            sym: StringConstants::TRANSLATION_FUNCTION.into(),
            optional: false,
        })
    }
}

impl VisitMut for TranslationTransformer {
    /// StringLiteral 변환
    fn visit_mut_str(&mut self, n: &mut Str) {
        // 한국어가 포함된 문자열만 처리
        if RegexPatterns::korean_text().is_match(&n.value) {
            self.was_modified = true;
            // TODO: 실제로는 부모 노드를 교체해야 함
            // 현재는 플래그만 설정
        }
    }

    /// TemplateLiteral 변환
    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        // 템플릿 리터럴의 모든 부분에 하나라도 한국어가 있는지 확인
        let has_korean = n.quasis.iter().any(|quasi| {
            RegexPatterns::korean_text().is_match(&quasi.raw)
        });

        if has_korean {
            self.was_modified = true;
            // TODO: 실제로는 i18next interpolation 형식으로 변환
            // 예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
        }
    }

    /// JSXText 변환
    fn visit_mut_jsx_text(&mut self, n: &mut JSXText) {
        let text = n.value.trim();
        if !text.is_empty() && RegexPatterns::korean_text().is_match(text) {
            self.was_modified = true;
            // TODO: 실제로는 JSXExpressionContainer로 감싸야 함
            // 현재는 플래그만 설정
        }
    }
}

/// Module을 변환하고 결과 반환
pub fn transform_module(module: &mut Module, source_code: String) -> TransformResult {
    let mut transformer = TranslationTransformer::new(source_code);
    module.visit_mut_with(&mut transformer);
    TransformResult::new(transformer.was_modified)
}
