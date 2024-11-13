/// utils 모듈 통합 테스트

use t_wrapper_rust::contains_korean;
use t_wrapper_rust::is_react_component;

#[test]
fn test_contains_korean_integration() {
    assert!(contains_korean("안녕하세요"));
    assert!(contains_korean("Hello 안녕"));
    assert!(contains_korean("한글"));
    assert!(!contains_korean("Hello"));
    assert!(!contains_korean("123"));
    assert!(!contains_korean(""));
}

#[test]
fn test_is_react_component_integration() {
    // 대문자로 시작하는 컴포넌트
    assert!(is_react_component("Button"));
    assert!(is_react_component("MyComponent"));
    assert!(is_react_component("Header"));
    
    // use로 시작하는 훅
    assert!(is_react_component("useState"));
    assert!(is_react_component("useTranslation"));
    assert!(is_react_component("useEffect"));
    
    // 컴포넌트가 아닌 경우
    assert!(!is_react_component("button"));
    assert!(!is_react_component("myFunction"));
    assert!(!is_react_component("handleClick"));
}

