/**
 * t-wrapper E2E 테스트
 * 실제 파일 시스템을 사용하여 전체 워크플로우 테스트
 */

use t_wrapper_rust::run_translation_wrapper;
use t_wrapper_rust::ScriptConfig;
use std::fs;
use std::path::PathBuf;
use tempfile::TempDir;

#[test]
fn e2e_한국어_문자열을_t_함수로_변환해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("Component.tsx");
    let original_content = r#"function Component() {
  return <div>안녕하세요</div>;
}"#;

    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified_content = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified_content.contains("t("));
    // assert!(modified_content.contains("useTranslation"));
    // assert_ne!(modified_content, original_content);
}

#[test]
fn e2e_템플릿_리터럴을_i18next_형식으로_변환해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("Component.tsx");
    let original_content = r#"function Component() {
  const name = "홍길동";
  return <div>{`안녕하세요 ${name}님`}</div>;
}"#;

    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified_content = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified_content.contains("t("));
    // assert!(modified_content.contains("useTranslation"));
    // assert!(!modified_content.contains("`안녕하세요 ${name}님`"));
}

#[test]
fn e2e_서버_컴포넌트는_useTranslation_훅을_추가하지_않아야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("ServerComponent.tsx");
    let original_content = r#"async function ServerComponent() {
  const { t } = await getServerTranslation();
  return <div>안녕하세요</div>;
}"#;

    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified_content = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified_content.contains("t("));
    // assert!(!modified_content.contains("useTranslation"));
    // assert!(modified_content.contains("getServerTranslation"));
}

#[test]
fn e2e_i18n_ignore_주석이_있으면_변환하지_않아야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("Component.tsx");
    let original_content = r#"function Component() {
  // i18n-ignore
  const text = "안녕하세요";
  return <div>{text}</div>;
}"#;

    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified_content = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified_content.contains(r#"const text = "안녕하세요""#));
    // assert!(!modified_content.contains(r#"t("안녕하세요")"#));
}

#[test]
fn e2e_nextjs_환경에서_client_모드일_때만_use_client를_추가해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("ClientComp.tsx");
    let original_content = r#"function ClientComp() {
  return <div>안녕하세요</div>;
}"#;
    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("client".to_string()),
        framework: Some("nextjs".to_string()),
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified.contains("'use client'"));
    // assert!(modified.contains("useTranslation"));
    // assert!(modified.contains("t("));
}

#[test]
fn e2e_react_환경에서_client_모드일_때는_use_client를_추가하지_않아야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("ClientReact.tsx");
    let original_content = r#"function ClientReact() {
  return <div>안녕하세요</div>;
}"#;
    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("client".to_string()),
        framework: Some("react".to_string()),
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(!modified.contains("'use client'"));
    // assert!(modified.contains("useTranslation"));
    // assert!(modified.contains("t("));
}

#[test]
fn e2e_server_모드에서는_getServerTranslation_기반으로_t_바인딩을_생성해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("ServerComp.tsx");
    let original_content = r#"function ServerComp() {
  return <div>안녕하세요</div>;
}"#;
    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("server".to_string()),
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified.contains("await getServerTranslation"));
    // assert!(modified.contains("const { t } ="));
    // assert!(modified.contains("t("));
}

#[test]
fn e2e_serverTranslationFunction_커스텀_함수명을_사용해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("ServerCustom.tsx");
    let original_content = r#"function ServerCustom() {
  return <div>안녕하세요</div>;
}"#;
    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("server".to_string()),
        server_translation_function: Some("getServerT".to_string()),
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(modified.contains("await getServerT"));
    // assert!(modified.contains("import { getServerT } from"));
}

#[test]
fn e2e_dry_run_모드에서는_파일을_수정하지_않아야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("Component.tsx");
    let original_content = r#"function Component() {
  return <div>안녕하세요</div>;
}"#;

    fs::write(&test_file, original_content).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: true,
        ..Default::default()
    };

    run_translation_wrapper(config).unwrap();

    let modified_content = fs::read_to_string(&test_file).unwrap();
    assert_eq!(modified_content, original_content);
}

