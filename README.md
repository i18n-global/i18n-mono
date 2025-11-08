# i18nexus-tools

Simple and powerful internationalization CLI tools for React applications

> 한국어 문서를 찾으시나요? [README.ko.md](./README.ko.md)

## 🚀 Quick Start

```bash
# Install globally (recommended)
npm install -g i18nexus-tools

# Or use npx (no installation required)
npx i18nexus-tools

# Initialize your project
npx i18n-sheets init
```

## 📦 Features

- **🔄 Automatic String Wrapping** - Convert hardcoded strings to `t()` functions
- **📤 Translation Extraction** - Extract translation keys to JSON files
- **🧹 Legacy Key Cleanup** - Remove unused translation keys
- **☁️ Google Sheets Integration** - Sync translations with Google Sheets
- **🎯 Smart Detection** - Context-aware wrapping (ignores API data, props, etc.)
- **📝 Template Literal Support** - Converts to i18next interpolation format
- **⚡ Next.js App Router Support** - Auto-detects server components
- **🌍 Multi-language Support** - Easy management of multiple languages

## 📚 Documentation

Complete documentation is available in the [docs](./docs) folder:

- **[Getting Started](./docs/guides/getting-started.md)** - Quick start guide
- **[Installation](./docs/guides/installation.md)** - Installation methods
- **[Configuration](./docs/guides/configuration.md)** - Configuration reference
- **[Next.js App Router](./docs/guides/nextjs-app-router.md)** - Next.js 13+ guide
- **[Google Sheets](./docs/guides/google-sheets.md)** - Google Sheets integration
- **[CLI Reference](./docs/cli/i18n-sheets.md)** - Command-line reference
- **[FAQ](./docs/troubleshooting/faq.md)** - Frequently asked questions
- **[Contributing](./docs/community/contributing.md)** - How to contribute

### 🚀 Performance & Migration (Advanced)

> For developers interested in performance optimization:

- **[Migration Guides](./docs/migration/README.md)** - Babel→swc, Rust optimization guides
- **[Performance Monitoring](./docs/guides/performance-monitoring.md)** - Sentry integration

## 🔧 Core Tools

### 1. i18n-wrapper - Automatic String Wrapping

Automatically wraps hardcoded strings with `t()` function and adds `useTranslation` hook.

```bash
# Basic usage
npx i18n-wrapper

# Preview changes without applying
npx i18n-wrapper --dry-run

# Custom pattern
npx i18n-wrapper -p "app/**/*.tsx"
```

**Features:**

- Detects Korean/English strings
- Template literal support with i18next interpolation
- Auto-adds `useTranslation()` hook
- Server component auto-detection
- Smart constant-based wrapping (excludes API data)
- `// i18n-ignore` comment support

### 2. i18n-extractor - Translation Key Extraction

Extracts translation keys from `t()` calls to generate/update translation files.

```bash
# Safe mode - only adds new keys (preserves existing translations)
npx i18n-extractor

# Force mode - overwrites all translations
npx i18n-extractor --force

# Export as CSV for Google Sheets
npx i18n-extractor --csv
```

### 3. i18n-clean-legacy - Unused Key Cleanup

Removes unused translation keys from your locale files.

```bash
# Preview cleanup
npx i18n-clean-legacy --dry-run

# Clean unused keys
npx i18n-clean-legacy
```

### 4. Google Sheets Integration

Sync translations with Google Sheets for easy collaboration.

```bash
# Upload to Google Sheets
npx i18n-upload

# Upload with auto-translation
npx i18n-upload --auto-translate

# Download from Google Sheets
npx i18n-download

# Force download (overwrite all)
npx i18n-download-force
```

## 📖 Basic Workflow

```bash
# 1. Initialize project
npx i18n-sheets init

# 2. Write code in Korean naturally
# Example: <h1>안녕하세요</h1>

# 3. Wrap hardcoded strings
npx i18n-wrapper

# 4. Extract translation keys
npx i18n-extractor

# 5. Add English translations
# Edit locales/en.json

# 6. Deploy multilingual app! 🎉
```

## 🎯 Smart Features

### Template Literal Conversion

```tsx
// Before
<p>{`사용자: ${count}명`}</p>

// After (automatic conversion)
<p>{t("사용자: {{count}}명", { count })}</p>
```

### Context-Based Data Source Tracking

```tsx
// ✅ Auto-wrapped (static constant)
const NAV_ITEMS = [{ path: "/home", label: "홈" }];

// ❌ Auto-excluded (API data)
const [users, setUsers] = useState([]);
```

### Server Component Detection

```tsx
// Server component - no useTranslation hook added
export default async function ServerPage() {
  const { t } = await getServerTranslation();
  return <h1>{t("서버 렌더링")}</h1>;
}
```

### Ignore Comments

```tsx
// i18n-ignore
const apiKey = "한글 API 키";

{
  /* i18n-ignore */
}
<p>이것은 무시됩니다</p>;
```

## 🏗️ Next.js App Router Setup

For Next.js 13+ App Router users:

```tsx
// app/layout.tsx
import { I18nProvider } from "i18nexus";
import { cookies } from "next/headers";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const language = cookieStore.get("i18n-language")?.value || "ko";

  return (
    <html lang={language}>
      <body>
        <I18nProvider
          initialLanguage={language}
          languageManagerOptions={{
            defaultLanguage: "ko",
            availableLanguages: [
              { code: "ko", name: "한국어", flag: "🇰🇷" },
              { code: "en", name: "English", flag: "🇺🇸" },
            ],
          }}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
```

**Configuration:**

```json
{
  "sourcePattern": "app/**/*.{ts,tsx}",
  "localesDir": "./locales",
  "languages": ["en", "ko"]
}
```

See [Next.js App Router Guide](./docs/guides/nextjs-app-router.md) for more details.

## 📊 Performance Monitoring

Track performance and send metrics to Sentry:

```bash
# Enable performance monitoring
I18N_PERF_MONITOR=true npx i18n-wrapper

# Verbose output with detailed metrics
I18N_PERF_VERBOSE=true npx i18n-wrapper

# Send to Sentry
SENTRY_DSN="https://your-dsn@sentry.io/project" npx i18n-wrapper
```

See [Performance Monitoring Guide](./docs/guides/performance-monitoring.md) for details.

## 📋 CLI Options

### i18n-wrapper

| Option          | Description              | Default                      |
| --------------- | ------------------------ | ---------------------------- |
| `-p, --pattern` | Source file pattern      | `"src/**/*.{js,jsx,ts,tsx}"` |
| `--dry-run`     | Preview without applying | -                            |
| `--verbose`     | Verbose output           | -                            |

### i18n-extractor

| Option               | Description                | Default                      |
| -------------------- | -------------------------- | ---------------------------- |
| `-p, --pattern`      | Source file pattern        | `"src/**/*.{js,jsx,ts,tsx}"` |
| `-o, --output <dir>` | Output directory           | `"./locales"`                |
| `-l, --languages`    | Languages                  | `"en,ko"`                    |
| `--force`            | Overwrite all translations | `false`                      |
| `--dry-run`          | Preview without applying   | -                            |
| `--csv`              | Export as CSV              | `false`                      |

### i18n-clean-legacy

| Option            | Description              | Default     |
| ----------------- | ------------------------ | ----------- |
| `-p, --pattern`   | Source file pattern      | From config |
| `-l, --languages` | Languages                | From config |
| `--no-backup`     | Skip backup creation     | `false`     |
| `--dry-run`       | Preview without applying | -           |

## 🔄 Google Sheets Workflow

```bash
# 1. Initialize with spreadsheet ID
npx i18n-sheets init -s <spreadsheet-id>

# 2. Develop and wrap strings
npx i18n-wrapper
npx i18n-extractor

# 3. Upload with auto-translation
npx i18n-upload --auto-translate

# 4. Translators work in Google Sheets

# 5. Download completed translations
npx i18n-download

# 6. Deploy! 🚀
```

**Auto-translation Mode:**

- Korean: Uploaded as plain text
- English: Uploaded as `=GOOGLETRANSLATE(C2, "ko", "en")` formula
- Google Sheets calculates translations automatically
- Download fetches calculated results

See [Google Sheets Guide](./docs/guides/google-sheets.md) for setup instructions.

## 📊 Project Structure

After initialization:

```
your-project/
├── i18nexus.config.json    # Configuration
├── locales/
│   ├── en.json            # English translations
│   ├── ko.json            # Korean translations
│   └── index.ts           # TypeScript exports
├── src/                   # Your source code
└── package.json
```

## 🔧 Configuration

`i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "defaultLanguage": "ko",
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{js,jsx,ts,tsx}",
  "googleSheets": {
    "spreadsheetId": "",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

See [Configuration Guide](./docs/guides/configuration.md) for all options.

## 📚 Version History

- **[v1.5.7](./docs/versions/v1.5.7.md)** - Intelligent context-based wrapping
- **[v1.5.6](./docs/versions/v1.5.6.md)** - Bug fixes
- **[v1.5.5](./docs/versions/v1.5.5.md)** - Force mode
- **[v1.5.4](./docs/versions/v1.5.4.md)** - Clean legacy & ignore comments
- **[v1.5.2](./docs/versions/v1.5.2.md)** - Auto-translation
- **[v1.5.1](./docs/versions/v1.5.1.md)** - TypeScript support
- **[v1.5.0](./docs/versions/v1.5.0.md)** - Enhanced translation management
- **[v1.4.0](./docs/versions/v1.4.0.md)** - Initial release

## 🆘 Troubleshooting

**Command not found:**

```bash
npx i18n-sheets --help
```

**Config not found:**

```bash
npx i18n-sheets init
```

**Google Sheets access denied:**

- Check credentials file
- Verify service account email
- Re-share spreadsheet with service account

See [FAQ](./docs/troubleshooting/faq.md) for more help.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/community/contributing.md) for details.

## 📄 License

MIT

## 🔗 Related Packages

- `i18nexus-core` - React components and hooks
- `i18nexus` - Complete toolkit with Google Sheets integration

## 📞 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/manNomi/i18nexus/issues)
- 💬 [Discussions](https://github.com/manNomi/i18nexus/discussions)
- 📧 Email: [support@i18nexus.com](mailto:support@i18nexus.com)

---

Made with ❤️ by the i18nexus team
