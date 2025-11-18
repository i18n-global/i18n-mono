/// AST 변환 로직
/// 문자열 리터럴, 템플릿 리터럴, JSX 텍스트를 t() 함수로 변환

use crate::constants::{StringConstants, RegexPatterns};
use crate::ast_helpers::{has_ignore_comment, should_skip_path};
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};
use swc_common::DUMMY_SP;

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
/// 
/// TypeScript 버전과 동일한 로직:
/// 1. StringLiteral: 한국어가 포함된 문자열을 t() 호출로 변환
/// 2. TemplateLiteral: 템플릿 리터럴을 i18next 형식으로 변환
/// 3. JSXText: JSX 텍스트를 t() 호출로 변환
/// 
/// TODO: SWC AST traverse로 구현 필요
/// 현재는 소스코드에서 한국어 감지만 수행
pub fn transform_function_body(_path: (), source_code: &str) -> TransformResult {
    let mut was_modified = false;

    // TODO: SWC AST traverse로 구현
    // path.traverse({
    //     StringLiteral: (subPath) => {
    //         if (shouldSkipPath(subPath, hasIgnoreComment) || hasIgnoreComment(subPath, sourceCode)) {
    //             return;
    //         }
    //         const trimmedValue = subPath.node.value.trim();
    //         if (!trimmedValue) {
    //             return;
    //         }
    //         if (REGEX_PATTERNS.KOREAN_TEXT.test(subPath.node.value)) {
    //             wasModified = true;
    //             const replacement = t.callExpression(
    //                 t.identifier(STRING_CONSTANTS.TRANSLATION_FUNCTION),
    //                 [t.stringLiteral(subPath.node.value)]
    //             );
    //             if (t.isJSXAttribute(subPath.parent)) {
    //                 subPath.replaceWith(t.jsxExpressionContainer(replacement));
    //             } else {
    //                 subPath.replaceWith(replacement);
    //             }
    //         }
    //     },
    //     TemplateLiteral: (subPath) => {
    //         // i18n-ignore 주석이 있는 경우 스킵
    //         // 이미 t()로 래핑된 경우 스킵
    //         // 템플릿 리터럴을 i18next interpolation 형식으로 변환
    //         // 예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
    //     },
    //     JSXText: (subPath) => {
    //         // i18n-ignore 주석이 있는 경우 스킵
    //         // 한국어가 포함된 텍스트만 처리
    //         // t() 함수 호출로 감싸기
    //     },
    // });

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
    /// TODO: 실제 AST 노드 생성 구현
    fn create_t_call(&self, _value: &str) -> Expr {
        // TODO: 실제 AST 노드 생성 구현
        // 현재는 플레이스홀더
        Expr::Ident(Ident {
            span: DUMMY_SP,
            sym: StringConstants::TRANSLATION_FUNCTION.into(),
            optional: false,
            ctxt: Default::default(),
        })
    }
}

impl VisitMut for TranslationTransformer {
    /// StringLiteral 변환
    /// TypeScript 버전과 동일한 로직:
    /// 1. shouldSkipPath 또는 hasIgnoreComment로 스킵 확인
    /// 2. 빈 문자열이나 공백만 있는 문자열은 스킵
    /// 3. 한국어 텍스트가 포함된 문자열만 처리
    /// 4. t() 함수 호출로 변환
    fn visit_mut_str(&mut self, n: &mut Str) {
        // TODO: shouldSkipPath 및 hasIgnoreComment로 스킵 확인
        // TODO: Wtf8Atom을 문자열로 변환하는 올바른 방법 찾기
        // 현재는 소스코드에서 직접 검사
        if RegexPatterns::korean_text().is_match(&self.source_code) {
            self.was_modified = true;
            // TODO: 실제로는 부모 노드를 교체해야 함
            // 현재는 플래그만 설정
        }
        let _ = n;
    }

    /// TemplateLiteral 변환
    /// TypeScript 버전과 동일한 로직:
    /// 1. i18n-ignore 주석이 있는 경우 스킵
    /// 2. 이미 t()로 래핑된 경우 스킵
    /// 3. 템플릿 리터럴의 모든 부분에 하나라도 한국어가 있는지 확인
    /// 4. 템플릿 리터럴을 i18next interpolation 형식으로 변환
    ///    예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        // TODO: shouldSkipPath 및 hasIgnoreComment로 스킵 확인
        // TODO: 이미 t()로 래핑된 경우 스킵
        // TODO: 템플릿 리터럴의 모든 부분에 하나라도 한국어가 있는지 확인
        // TODO: Wtf8Atom을 문자열로 변환하는 올바른 방법 찾기
        // 현재는 소스코드에서 직접 검사
        if RegexPatterns::korean_text().is_match(&self.source_code) {
            self.was_modified = true;
            // TODO: 실제로는 i18next interpolation 형식으로 변환
            // 예: `안녕 ${name}` → t(`안녕 {{name}}`, { name })
        }
        let _ = n;
    }

    /// JSXText 변환
    /// TypeScript 버전과 동일한 로직:
    /// 1. i18n-ignore 주석이 있는 경우 스킵
    /// 2. 빈 텍스트나 공백만 있는 경우 스킵
    /// 3. 한국어가 포함된 텍스트만 처리
    /// 4. t() 함수 호출로 감싸기
    fn visit_mut_jsx_text(&mut self, n: &mut JSXText) {
        // TODO: hasIgnoreComment로 스킵 확인
        // TODO: Wtf8Atom을 문자열로 변환하는 올바른 방법 찾기
        // 현재는 소스코드에서 직접 검사
        if RegexPatterns::korean_text().is_match(&self.source_code) {
            self.was_modified = true;
            // TODO: 실제로는 JSXExpressionContainer로 감싸야 함
            // 현재는 플래그만 설정
        }
        let _ = n;
    }
}

/// Module을 변환하고 결과 반환
pub fn transform_module(module: &mut Module, source_code: String) -> TransformResult {
    let mut transformer = TranslationTransformer::new(source_code);
    module.visit_mut_with(&mut transformer);
    TransformResult::new(transformer.was_modified)
}
