module.exports = {
  // i18nexus project configuration
  projectId: "demo-project",

  // Translation files configuration
  translations: {
    // Source directory for translation files
    sourceDir: "./lib/translations",

    // Supported languages
    languages: ["en", "ko"],

    // Default language
    defaultLanguage: "ko",

    // File format
    format: "json",
  },

  // CLI commands configuration
  commands: {
    // Extract translation keys from source code
    extract: {
      // Source files to scan
      source: ["app/**/*.{ts,tsx,js,jsx}", "lib/**/*.{ts,tsx,js,jsx}"],

      // Output directory for extracted keys
      output: "./lib/translations",

      // File patterns to ignore
      ignore: ["node_modules/**", ".next/**", "dist/**"],
    },

    // Pull translations from i18nexus service
    pull: {
      // Output directory for downloaded translations
      output: "./lib/translations",

      // File naming pattern
      filename: "{language}.json",
    },
  },
};
