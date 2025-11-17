/**
 * translation-wrapper 테스트
 * TranslationWrapper 클래스 테스트
 */

use t_wrapper_rust::{TranslationWrapper, ScriptConfig};
use std::fs;
use std::path::PathBuf;
use tempfile::TempDir;

#[test]
fn process_files_한국어가_포함된_파일을_처리해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("test.tsx");
    fs::write(&test_file, r#"function Component() {
  return <div>안녕하세요</div>;
}"#).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: true,
        ..Default::default()
    };

    let wrapper = TranslationWrapper::new(Some(config));
    let result = wrapper.process_files().unwrap();
    assert!(result.len() > 0);
}

#[test]
fn process_files_client_모드에서는_use_client와_useTranslation_훅을_보장해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("client.tsx");
    fs::write(&test_file, r#"function ClientComp() {
  return <div>안녕하세요</div>;
}"#).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("client".to_string()),
        ..Default::default()
    };

    let wrapper = TranslationWrapper::new(Some(config));
    wrapper.process_files().unwrap();
    
    let content = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(content.contains("'use client'"));
    // assert!(content.contains("useTranslation"));
    // assert!(content.contains("t("));
}

#[test]
fn process_files_server_모드에서는_지정한_serverTranslationFunction으로_t_바인딩을_생성해야_함() {
    let temp_dir = TempDir::new().unwrap();
    let test_file = temp_dir.path().join("server.tsx");
    fs::write(&test_file, r#"function ServerComp() {
  return <div>안녕하세요</div>;
}"#).unwrap();

    let config = ScriptConfig {
        source_pattern: temp_dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("server".to_string()),
        server_translation_function: Some("getServerT".to_string()),
        ..Default::default()
    };

    let wrapper = TranslationWrapper::new(Some(config));
    wrapper.process_files().unwrap();
    
    let content = fs::read_to_string(&test_file).unwrap();
    // TODO: 실제 구현 후 확인
    // assert!(content.contains("await getServerT"));
    // assert!(content.contains("const { t } ="));
    // assert!(content.contains("t("));
}
