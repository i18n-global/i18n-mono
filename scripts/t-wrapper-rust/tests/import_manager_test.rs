use t_wrapper_rust::{create_use_translation_hook, add_import_if_needed};

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


