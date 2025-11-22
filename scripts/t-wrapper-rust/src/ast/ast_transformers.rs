/// AST 변환 로직
/// 문자열 리터럴, 템플릿 리터럴, JSX 텍스트를 t() 함수로 변환

use crate::utils::constants::{StringConstants, RegexPatterns};
use crate::ast::ast_helpers::{has_ignore_comment, should_skip_path};
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
    /// 변환된 함수 목록 (함수 이름)
    pub modified_functions: Vec<String>,
}

impl TranslationTransformer {
    pub fn new(source_code: String) -> Self {
        Self {
            was_modified: false,
            source_code,
            modified_functions: Vec::new(),
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
    /// FunctionDeclaration 변환
    /// TypeScript 버전과 동일한 로직:
    /// 1. React 컴포넌트인지 확인
    /// 2. 함수 body를 변환
    /// 3. 변환된 경우 함수 이름 저장
    fn visit_mut_fn_decl(&mut self, func: &mut FnDecl) {
        // React 컴포넌트인지 확인
        let name = func.ident.sym.to_string();
        if crate::ast_helpers::is_react_component(&name) {
            // 함수 body 변환 (자식 노드 방문으로 자동 처리됨)
            let before_modified = self.was_modified;
            func.visit_mut_children_with(self);
            // 변환되었으면 함수 이름 저장
            if self.was_modified && !before_modified {
                self.modified_functions.push(name);
            }
            return;
        }
        // React 컴포넌트가 아니면 자식 노드만 방문
        func.visit_mut_children_with(self);
    }

    /// ArrowFunctionExpression 변환
    /// TypeScript 버전과 동일한 로직:
    /// 1. 변수 선언의 일부인지 확인
    /// 2. React 컴포넌트인지 확인
    /// 3. 함수 body를 변환
    /// 4. 변환된 경우 함수 이름 저장
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // ArrowFunctionExpression 처리
        if let Expr::Arrow(arrow) = expr {
            // TODO: 부모 노드 확인하여 변수 선언인지 확인
            // 현재는 일단 모든 ArrowFunction을 처리
            let before_modified = self.was_modified;
            arrow.visit_mut_children_with(self);
            // 변환되었으면 기록 (이름은 나중에 부모에서 확인)
            if self.was_modified && !before_modified {
                // TODO: 변수 이름 추출
            }
            return;
        }

        // Expression 변환 (StringLiteral을 t() 호출로 교체)
        // TypeScript 버전과 동일한 로직:
        // 1. StringLiteral 감지
        // 2. 한국어 텍스트가 포함된 문자열만 처리
        // 3. t() 함수 호출로 변환
        if let Expr::Lit(Lit::Str(str_lit)) = expr {
            // Wtf8Atom을 &str로 변환하여 한국어 체크
            // 방법: to_string_lossy() 직접 사용 (최신 SWC API)
            let str_value: &str = &str_lit.value.to_string_lossy();
            
            // 한국어가 포함되어 있는지 확인
            if RegexPatterns::korean_text().is_match(str_value) {
                self.was_modified = true;
                
                // t() 함수 호출 생성
                let t_call = Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Expr(Box::new(Expr::Ident(Ident {
                        span: DUMMY_SP,
                        sym: StringConstants::TRANSLATION_FUNCTION.into(),
                        optional: false,
                        ctxt: Default::default(),
                    }))),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Lit(Lit::Str(Str {
                            span: str_lit.span,
                            value: str_lit.value.clone(),
                            raw: None,
                        }))),
                    }],
                    type_args: None,
                    ctxt: Default::default(),
                });
                
                // 현재 Expression을 t() 호출로 교체
                *expr = t_call;
                // 변환 후에는 자식 노드를 방문하지 않음 (무한 재귀 방지)
                return;
            }
        }
        
        // 재귀적으로 자식 노드 방문
        expr.visit_mut_children_with(self);
    }
    
    /// StringLiteral 변환 (하위 호환성을 위해 유지)
    fn visit_mut_str(&mut self, n: &mut Str) {
        // visit_mut_expr에서 처리하므로 여기서는 아무것도 하지 않음
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
pub fn transform_module(module: &mut Module, source_code: String) -> (TransformResult, Vec<String>) {
    let mut transformer = TranslationTransformer::new(source_code);
    module.visit_mut_with(&mut transformer);
    (
        TransformResult::new(transformer.was_modified),
        transformer.modified_functions,
    )
}
