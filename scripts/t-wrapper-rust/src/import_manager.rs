/// Import 관리 유틸리티

use crate::constants::StringConstants;

/// useTranslation 훅을 생성하는 AST 노드 생성
pub fn create_use_translation_hook() -> String {
    // TODO: SWC AST 노드 생성으로 구현
    format!(
        "const {{ {} }} = {}();",
        StringConstants::TRANSLATION_FUNCTION,
        StringConstants::USE_TRANSLATION
    )
}

/// AST에 useTranslation import가 필요한지 확인하고 추가
pub fn add_import_if_needed(_ast: (), translation_import_source: &str) -> bool {
    // TODO: SWC AST로 구현
    // 1. 기존 import 확인
    // 2. useTranslation이 없으면 추가
    // 3. import가 아예 없으면 새로 생성
    
    // 임시로 항상 true 반환 (추가되었다고 가정)
    let _ = translation_import_source;
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_use_translation_hook() {
        let hook = create_use_translation_hook();
        assert!(hook.contains("const"));
        assert!(hook.contains("t"));
        assert!(hook.contains("useTranslation"));
    }

    #[test]
    fn test_add_import_if_needed() {
        // TODO: 실제 AST로 테스트
        let result = add_import_if_needed((), "i18nexus");
        assert!(result);
    }
}

