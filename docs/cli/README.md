# CLI Commands Overview

Complete reference for all i18nexus-tools CLI commands.

## Quick Reference

| Command             | Description                   | Documentation                       |
| ------------------- | ----------------------------- | ----------------------------------- |
| `i18n-wrapper`      | Wrap strings with t()         | [→ Details](./i18n-wrapper.md)      |
| `i18n-extractor`    | Extract translation keys      | [→ Details](./i18n-extractor.md)    |
| `i18n-clean-legacy` | Remove unused keys            | [→ Details](./i18n-clean-legacy.md) |
| `i18n-upload`       | Upload to Google Sheets       | [→ Details](./i18n-upload.md)       |
| `i18n-download`     | Download from Google Sheets   | [→ Details](./i18n-download.md)     |
| `i18n-sheets`       | Legacy Google Sheets commands | [→ Details](./i18n-sheets.md)       |

## Command Categories

### 🔄 Core Workflow

Commands for basic i18n workflow:

#### 1. i18n-wrapper

Automatically wraps hardcoded strings with `t()` translation functions.

```bash
npx i18n-wrapper [options]
```

**Key Features:**

- Korean/English string detection
- Template literal support
- Server component detection
- Smart constant-based wrapping
- Ignore comment support

[→ Full Documentation](./i18n-wrapper.md)

#### 2. i18n-extractor

Extracts translation keys from `t()` calls to generate translation files.

```bash
npx i18n-extractor [options]
```

**Key Features:**

- Safe mode (preserves existing translations)
- Force mode (complete regeneration)
- Multi-language support
- CSV export option

[→ Full Documentation](./i18n-extractor.md)

#### 3. i18n-clean-legacy

Removes unused and invalid translation keys.

```bash
npx i18n-clean-legacy [options]
```

**Key Features:**

- Automatic backup creation
- Dry-run mode
- Invalid value detection
- Missing key reporting

[→ Full Documentation](./i18n-clean-legacy.md)

### ☁️ Google Sheets Integration

Commands for collaborative translation:

#### 4. i18n-upload

Uploads local translations to Google Sheets.

```bash
npx i18n-upload [options]
```

**Key Features:**

- Incremental mode (safe)
- Force mode (complete sync)
- Auto-translation mode
- Dry-run support

[→ Full Documentation](./i18n-upload.md)

#### 5. i18n-download

Downloads translations from Google Sheets.

```bash
npx i18n-download [options]
npx i18n-download-force [options]
```

**Key Features:**

- Incremental download (i18n-download)
- Force download (i18n-download-force)
- Formula result fetching
- Dry-run support

[→ Full Documentation](./i18n-download.md)

#### 6. i18n-sheets (Legacy)

Legacy combined commands for Google Sheets.

```bash
npx i18n-sheets <command> [options]
```

**Commands:**

- `init` - Initialize project
- `upload` - Upload translations
- `download` - Download translations
- `sync` - Bidirectional sync
- `status` - Show status

[→ Full Documentation](./i18n-sheets.md)

## Typical Workflows

### Basic Development Workflow

```bash
# 1. Wrap strings
npx i18n-wrapper

# 2. Extract keys
npx i18n-extractor

# 3. Add translations
# Edit locales/en.json

# 4. Deploy
```

### Google Sheets Workflow

```bash
# 1. Initialize
npx i18n-sheets init

# 2. Wrap & extract
npx i18n-wrapper
npx i18n-extractor

# 3. Upload
npx i18n-upload

# 4. Translators work in Google Sheets

# 5. Download
npx i18n-download

# 6. Deploy
```

### Maintenance Workflow

```bash
# 1. Clean unused keys
npx i18n-clean-legacy

# 2. Re-extract keys
npx i18n-extractor

# 3. Upload to Google Sheets
npx i18n-upload --force

# 4. Download translations
npx i18n-download
```

### Auto-Translate Workflow

```bash
# 1. Extract Korean keys
npx i18n-extractor

# 2. Upload with auto-translate
npx i18n-upload --auto-translate

# 3. Wait for Google Sheets calculation

# 4. Download translated results
npx i18n-download

# 5. Review and refine
```

## Common Options

### Dry-Run Mode

Available in all commands:

```bash
npx i18n-wrapper --dry-run
npx i18n-extractor --dry-run
npx i18n-clean-legacy --dry-run
npx i18n-upload --dry-run
npx i18n-download --dry-run
```

**Benefits:**

- Preview changes without applying
- Safe testing of commands
- Review before execution

### File Patterns

Customize source file patterns:

```bash
# App Router
-p "app/**/*.{ts,tsx}"

# Pages Router
-p "pages/**/*.{ts,tsx}"

# Specific directory
-p "src/features/**/*.tsx"

# Multiple patterns
-p "{app,components}/**/*.{ts,tsx}"
```

### Language Options

Specify languages:

```bash
# Two languages
-l "en,ko"

# Multiple languages
-l "en,ko,ja,zh,es,fr"
```

### Help

All commands support help:

```bash
npx i18n-wrapper --help
npx i18n-extractor --help
npx i18n-clean-legacy --help
npx i18n-upload --help
npx i18n-download --help
```

## Command Comparison

### Wrapper vs Extractor

| Aspect      | i18n-wrapper      | i18n-extractor    |
| ----------- | ----------------- | ----------------- |
| **Purpose** | Wrap strings      | Extract keys      |
| **Input**   | Source files      | Wrapped code      |
| **Output**  | Modified files    | Translation files |
| **When**    | Before extraction | After wrapping    |

### Upload vs Download

| Aspect             | i18n-upload    | i18n-download  |
| ------------------ | -------------- | -------------- |
| **Direction**      | Local → Sheets | Sheets → Local |
| **Safe Mode**      | Incremental    | Incremental    |
| **Force Mode**     | --force        | -force command |
| **Auto-Translate** | Yes            | No             |

### Incremental vs Force

| Aspect            | Incremental | Force          |
| ----------------- | ----------- | -------------- |
| **Safety**        | ✅ Safe     | ⚠️ Destructive |
| **Existing Data** | Preserved   | Overwritten    |
| **Use Case**      | Daily work  | Complete sync  |
| **Backup**        | Optional    | Recommended    |

## Best Practices

### 1. Always Start with Dry-Run

```bash
# Preview first
npx i18n-wrapper --dry-run
npx i18n-extractor --dry-run
```

### 2. Use Version Control

```bash
# Commit before major operations
git add .
git commit -m "Before i18n operations"
```

### 3. Regular Cleanup

```bash
# Weekly or monthly
npx i18n-clean-legacy
```

### 4. Incremental by Default

```bash
# Safe daily operations
npx i18n-extractor      # not --force
npx i18n-upload         # not --force
npx i18n-download       # not -force
```

### 5. Coordinate Team Work

- Notify team before force operations
- Use incremental mode during active translation
- Schedule force syncs during off-hours

## Troubleshooting

### Command Not Found

```bash
# Use npx
npx i18n-wrapper --help

# Or install globally
npm install -g i18nexus-tools
```

### Config Not Found

```bash
# Initialize project
npx i18n-sheets init
```

### Permission Errors

```bash
# Check file permissions
ls -la locales/

# Fix permissions if needed
chmod 644 locales/*.json
```

### Network Errors

```bash
# Check internet connection
# Verify credentials
# Retry operation
```

## Getting Help

### Command Help

```bash
# General help
npx i18n-wrapper --help
npx i18n-extractor --help
npx i18n-clean-legacy --help
npx i18n-upload --help
npx i18n-download --help
```

### Documentation

- [i18n-wrapper](./i18n-wrapper.md) - String wrapping
- [i18n-extractor](./i18n-extractor.md) - Key extraction
- [i18n-clean-legacy](./i18n-clean-legacy.md) - Key cleanup
- [i18n-upload](./i18n-upload.md) - Google Sheets upload
- [i18n-download](./i18n-download.md) - Google Sheets download
- [i18n-sheets](./i18n-sheets.md) - Legacy commands

### Guides

- [Getting Started](../guides/getting-started.md) - Quick start
- [Configuration](../guides/configuration.md) - Configuration options
- [Google Sheets](../guides/google-sheets.md) - Google Sheets setup
- [FAQ](../troubleshooting/faq.md) - Common questions

## See Also

- [Getting Started Guide](../guides/getting-started.md)
- [Configuration Guide](../guides/configuration.md)
- [Google Sheets Integration](../guides/google-sheets.md)
- [Troubleshooting](../troubleshooting/faq.md)
