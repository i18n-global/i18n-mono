#[derive(Debug, Clone)]
pub struct ScriptConfig {
    pub source_pattern: String,
    pub translation_import_source: String,
    pub mode: Option<String>,
    pub framework: Option<String>,
    pub server_translation_function: Option<String>,
}

impl Default for ScriptConfig {
    fn default() -> Self {
        Self {
            source_pattern: "src/**/*.{js,jsx,ts,tsx}".to_string(),
            translation_import_source: "i18nexus".to_string(),
            mode: None,
            framework: None,
            server_translation_function: Some("getTranslations".to_string()),
        }
    }
}

