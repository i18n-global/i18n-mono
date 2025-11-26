use t_wrapper_rust::is_react_component;
use t_wrapper_rust::is_server_component;

#[test]
fn test_is_server_component_integration() {
    let code = "const { t } = await getServerTranslation();";
    assert!(is_server_component(code));
    
    let code = "const { t } = useTranslation();";
    assert!(!is_server_component(code));
}

#[test]
fn test_is_react_component_integration() {
    assert!(is_react_component("Button"));
    assert!(is_react_component("MyComponent"));
    assert!(is_react_component("Header"));
    
    assert!(is_react_component("useState"));
    assert!(is_react_component("useTranslation"));
    assert!(is_react_component("useEffect"));
    
    assert!(!is_react_component("button"));
    assert!(!is_react_component("myFunction"));
    assert!(!is_react_component("handleClick"));
}

