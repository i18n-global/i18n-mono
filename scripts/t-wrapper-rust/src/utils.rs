/// 유틸리티 함수 모듈

/// 한국어 텍스트가 포함되어 있는지 확인
pub fn contains_korean(text: &str) -> bool {
    text.chars().any(|c| ('\u{AC00}'..='\u{D7A3}').contains(&c))
}

/// React 컴포넌트 이름인지 확인
pub fn is_react_component(name: &str) -> bool {
    name.starts_with(char::is_uppercase) || name.starts_with("use")
}

/// 서버 컴포넌트인지 확인
pub fn is_server_component(_code: &str) -> bool {
    // TODO: getServerTranslation 호출 확인
    false
}

