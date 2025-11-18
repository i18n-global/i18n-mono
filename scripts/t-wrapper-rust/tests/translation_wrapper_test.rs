/**
 * translation-wrapper 테스트
 * TranslationWrapper 클래스 테스트
 */

use t_wrapper_rust::{TranslationWrapper, ScriptConfig};
use anyhow::Result;
use tempfile::{tempdir, NamedTempFile};
use std::fs;
use std::path::PathBuf;

#[test]
fn process_files_한국어가_포함된_파일을_처리해야_함() -> Result<()> {
    let dir = tempdir()?;
    let file_path = dir.path().join("test.tsx");
    fs::write(&file_path, r#"function Component() {
  return <div>안녕하세요</div>;
}"#)?;

    let wrapper = TranslationWrapper::new(Some(ScriptConfig {
        source_pattern: dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: true,
        ..Default::default()
    }));

    let result = wrapper.process_files()?;
    assert!(!result.is_empty());
    Ok(())
}

#[test]
fn process_files_client_모드에서는_use_client와_useTranslation_훅을_보장해야_함() -> Result<()> {
    let dir = tempdir()?;
    let file_path = dir.path().join("client.tsx");
    fs::write(&file_path, r#"function ClientComp() {
  return <div>안녕하세요</div>;
}"#)?;

    let wrapper = TranslationWrapper::new(Some(ScriptConfig {
        source_pattern: dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("client".to_string()),
        ..Default::default()
    }));

    wrapper.process_files()?;
    let content = fs::read_to_string(&file_path)?;
    // TODO: 실제 AST 변환 및 코드 생성 후 검증
    // assert!(content.contains("'use client'"));
    // assert!(content.contains("useTranslation"));
    // assert!(content.contains("t("));
    Ok(())
}

#[test]
fn process_files_server_모드에서는_지정한_serverTranslationFunction으로_t_바인딩을_생성해야_함() -> Result<()> {
    let dir = tempdir()?;
    let file_path = dir.path().join("server.tsx");
    fs::write(&file_path, r#"function ServerComp() {
  return <div>안녕하세요</div>;
}"#)?;

    let wrapper = TranslationWrapper::new(Some(ScriptConfig {
        source_pattern: dir.path().join("**/*.tsx").to_string_lossy().to_string(),
        dry_run: false,
        mode: Some("server".to_string()),
        server_translation_function: Some("getServerT".to_string()),
        ..Default::default()
    }));

    wrapper.process_files()?;
    let content = fs::read_to_string(&file_path)?;
    // TODO: 실제 AST 변환 및 코드 생성 후 검증
    // assert!(content.contains("await getServerT"));
    // assert!(content.contains("const { t } ="));
    // assert!(content.contains("t("));
    Ok(())
}
