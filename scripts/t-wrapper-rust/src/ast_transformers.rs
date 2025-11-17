/// AST 변환 로직
/// 문자열 리터럴, 템플릿 리터럴, JSX 텍스트를 t() 함수로 변환

use crate::constants::RegexPatterns;

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
pub fn transform_function_body(_path: (), source_code: &str) -> TransformResult {
    let mut was_modified = false;

    // TODO: SWC AST traverse로 구현
    // 1. StringLiteral 변환
    // 2. TemplateLiteral 변환
    // 3. JSXText 변환
    
    // 임시로 한국어가 포함되어 있으면 수정되었다고 가정
    if RegexPatterns::korean_text().is_match(source_code) {
        was_modified = true;
    }

    TransformResult::new(was_modified)
}

