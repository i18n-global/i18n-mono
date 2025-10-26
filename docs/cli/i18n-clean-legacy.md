# i18n-clean-legacy Command Reference

Complete reference for the `i18n-clean-legacy` command.

## Overview

The `i18n-clean-legacy` command analyzes your codebase to find actively used translation keys and removes unused or invalid keys from your locale files.

## Basic Usage

```bash
npx i18n-clean-legacy [options]
```

## Options

### `-p, --pattern <pattern>`

Specifies the glob pattern for source files to analyze.

**Default:** From `i18nexus.config.json`

**Examples:**

```bash
# App Router
npx i18n-clean-legacy -p "app/**/*.{ts,tsx}"

# Multiple directories
npx i18n-clean-legacy -p "{src,app}/**/*.{ts,tsx}"

# Specific features
npx i18n-clean-legacy -p "src/features/**/*.tsx"
```

### `-l, --languages <langs>`

Comma-separated list of languages to clean.

**Default:** From `i18nexus.config.json`

**Examples:**

```bash
# Specific languages
npx i18n-clean-legacy -l "en,ko"

# All languages
npx i18n-clean-legacy -l "en,ko,ja,zh"
```

### `--no-backup`

Skip automatic backup file creation.

**Default:** Creates backup files

**Usage:**

```bash
# With backup (default)
npx i18n-clean-legacy

# Without backup
npx i18n-clean-legacy --no-backup
```

**Backup Format:**

```
locales/en.json.backup.20250126-143022
locales/ko.json.backup.20250126-143022
```

### `--dry-run`

Preview what would be cleaned without modifying files.

**Usage:**

```bash
npx i18n-clean-legacy --dry-run
```

**Output:**

- Shows keys that would be removed
- Displays invalid keys
- Shows missing keys
- Doesn't modify any files

### `-h, --help`

Display help information.

**Usage:**

```bash
npx i18n-clean-legacy --help
```

## What Gets Removed

### 1. Unused Keys

Keys that exist in locale files but are NOT used in code.

**Example:**

```json
// locales/en.json
{
  "used_key": "Used Key",
  "unused_key": "Unused Key"
}
```

```tsx
// Source code only uses "used_key"
function Component() {
  return <h1>{t("used_key")}</h1>;
}
```

**After cleanup:**

```json
// locales/en.json
{
  "used_key": "Used Key"
  // "unused_key" removed
}
```

### 2. Invalid Values

Keys with invalid or placeholder values.

**Removed Values:**

- `"_N/A"`
- `"N/A"`
- `""` (empty string)
- `null`
- `undefined`

**Example:**

```json
// Before
{
  "valid_key": "Hello",
  "invalid_key": "_N/A",
  "empty_key": "",
  "null_key": null
}

// After
{
  "valid_key": "Hello"
}
```

### 3. Orphaned Keys

Keys left behind after refactoring.

**Example:**

```json
// Old code used these keys
{
  "old_feature_title": "Old Feature",
  "old_feature_desc": "Description"
}

// After feature removal, keys are orphaned
```

## What Gets Reported

### Missing Keys

Keys used in code but not found in locale files.

**Report:**

```bash
⚠️ Missing Keys (used in code but not in locale files):
  - new_feature_title (found in: src/features/new/page.tsx:15)
  - new_feature_desc (found in: src/features/new/page.tsx:18)
```

**Action:** Add these keys to locale files.

### Statistics

```bash
📊 Cleanup Summary:
  - Keys analyzed: 250
  - Keys removed: 45
    * Unused: 38
    * Invalid values: 7
  - Keys preserved: 205
  - Missing keys: 3
```

## Cleanup Process

### 1. Analysis Phase

Scans codebase using extractor logic:

```bash
🔍 Scanning source files...
📝 Found 205 active translation keys
```

### 2. Comparison Phase

Compares with locale files:

```bash
📊 Analyzing locale files...
  - locales/en.json: 250 keys
  - locales/ko.json: 250 keys
```

### 3. Identification Phase

Identifies keys to remove:

```bash
🗑️ Keys to remove:
  - unused_old_key (unused)
  - invalid_key (value: "_N/A")
  - empty_key (value: "")
```

### 4. Backup Phase

Creates timestamped backups:

```bash
💾 Creating backups...
  ✅ locales/en.json.backup.20250126-143022
  ✅ locales/ko.json.backup.20250126-143022
```

### 5. Cleanup Phase

Removes identified keys:

```bash
🧹 Cleaning locale files...
  ✅ locales/en.json (45 keys removed)
  ✅ locales/ko.json (45 keys removed)
```

## Workflow Examples

### Basic Cleanup

```bash
# 1. Preview cleanup
npx i18n-clean-legacy --dry-run

# 2. Review what would be removed

# 3. Run cleanup with backup
npx i18n-clean-legacy

# 4. Verify results
git diff locales/
```

### Before Release

```bash
# Clean unused keys before deployment
npx i18n-clean-legacy --dry-run
npx i18n-clean-legacy

# Extract fresh keys
npx i18n-extractor

# Verify no missing keys
npm run test
```

### After Refactoring

```bash
# After removing old features
npx i18n-clean-legacy --dry-run

# Shows removed feature keys
# "old_feature_*" keys marked for removal

# Clean up
npx i18n-clean-legacy
```

### Regular Maintenance

```bash
# Weekly/monthly cleanup
npx i18n-clean-legacy

# Keep translations lean
```

## Configuration

Reads from `i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "localesDir": "./locales",
  "sourcePattern": "src/**/*.{ts,tsx}"
}
```

## Advanced Usage

### Custom Patterns

```bash
# Clean specific feature
npx i18n-clean-legacy -p "src/features/auth/**/*.tsx"

# Multiple patterns
npx i18n-clean-legacy -p "{app,components}/**/*.{ts,tsx}"
```

### Selective Language Cleanup

```bash
# Clean only English
npx i18n-clean-legacy -l "en"

# Clean English and Japanese
npx i18n-clean-legacy -l "en,ja"
```

### No Backup Mode

```bash
# For CI/CD pipelines or when you're confident
npx i18n-clean-legacy --no-backup
```

## Backup Management

### Backup File Format

```
locales/en.json.backup.YYYYMMDD-HHMMSS
locales/ko.json.backup.YYYYMMDD-HHMMSS
```

**Example:**

```
locales/en.json.backup.20250126-143022
locales/ko.json.backup.20250126-143542
```

### Restore from Backup

```bash
# Find backup files
ls -la locales/*.backup.*

# Restore specific backup
cp locales/en.json.backup.20250126-143022 locales/en.json
```

### Cleanup Old Backups

```bash
# Remove backups older than 30 days
find locales -name "*.backup.*" -mtime +30 -delete
```

## Best Practices

### 1. Always Preview First

```bash
npx i18n-clean-legacy --dry-run
```

### 2. Use Version Control

```bash
git add .
git commit -m "Before cleanup"
npx i18n-clean-legacy
git diff  # Review changes
```

### 3. Keep Backups

```bash
# Default behavior creates backups
npx i18n-clean-legacy
```

### 4. Regular Maintenance

```bash
# Schedule regular cleanups
# Weekly or after major refactoring
```

### 5. Verify After Cleanup

```bash
# Test application
npm run dev

# Run tests
npm test

# Check for missing keys
npx i18n-extractor --dry-run
```

## Integration with Workflow

### Development Workflow

```bash
# 1. Develop features
# 2. Wrap strings
npx i18n-wrapper

# 3. Extract keys
npx i18n-extractor

# 4. Clean unused keys (weekly)
npx i18n-clean-legacy
```

### Release Workflow

```bash
# Before release
npx i18n-clean-legacy --dry-run
npx i18n-clean-legacy

# Upload to Google Sheets
npx i18n-upload

# Final verification
npm run build
```

### CI/CD Integration

```bash
# .github/workflows/i18n-check.yml
- name: Check for unused keys
  run: npx i18n-clean-legacy --dry-run --no-backup

# Fail if too many unused keys found
```

## Error Handling

### No Unused Keys

```bash
✅ No unused keys found
All translations are in use!
```

### Backup Failed

```bash
❌ Failed to create backup: locales/en.json.backup
Permission denied
```

**Solution:** Check write permissions.

### File Parse Error

```bash
❌ Failed to parse: locales/en.json
Invalid JSON format
```

**Solution:** Fix JSON syntax errors.

## Troubleshooting

### Issue: Too Many Keys Removed

**Symptoms:**

- Many keys marked as unused
- Application breaks after cleanup

**Solutions:**

1. Check source pattern matches all files
2. Verify `t()` function calls are detected
3. Restore from backup
4. Review dry-run output carefully

```bash
# Restore from backup
cp locales/en.json.backup.* locales/en.json
```

### Issue: Keys Not Detected as Unused

**Symptoms:**

- Known unused keys not removed
- Old feature keys remain

**Solutions:**

1. Verify keys are actually unused
2. Check for dynamic key construction
3. Manual removal if needed

```bash
# Debug with dry-run
npx i18n-clean-legacy --dry-run -p "src/**/*.tsx"
```

### Issue: Missing Keys Reported

**Symptoms:**

- Keys used in code not in locale files
- Build warnings

**Solutions:**

```bash
# Extract missing keys
npx i18n-extractor

# Or add manually to locale files
```

## Performance

### Large Projects

```bash
# Process incrementally
npx i18n-clean-legacy -p "src/features/completed/**/*.tsx"

# Then full project
npx i18n-clean-legacy
```

### Optimization Tips

1. Use specific patterns
2. Regular incremental cleanup
3. Combine with extract workflow

## Output Examples

### Dry Run Output

```bash
$ npx i18n-clean-legacy --dry-run

🔍 Scanning source files: src/**/*.{ts,tsx}
📝 Found 205 active translation keys

📊 Analyzing locale files:
  - locales/en.json: 250 keys
  - locales/ko.json: 250 keys

🗑️ Keys to remove (45):
  Unused keys (38):
    - old_feature_title
    - old_feature_description
    - removed_button_text
    ...

  Invalid values (7):
    - placeholder_key (value: "_N/A")
    - empty_key (value: "")
    - null_key (value: null)
    ...

⚠️ Missing keys (3):
  - new_feature_title (used in: src/features/new/page.tsx:15)
  - new_feature_desc (used in: src/features/new/page.tsx:18)
  - new_button (used in: src/components/NewButton.tsx:10)

🔍 DRY RUN - No files were modified
```

### Actual Cleanup Output

```bash
$ npx i18n-clean-legacy

🔍 Scanning source files: src/**/*.{ts,tsx}
📝 Found 205 active translation keys

💾 Creating backups:
  ✅ locales/en.json.backup.20250126-143022
  ✅ locales/ko.json.backup.20250126-143022

🧹 Cleaning locale files:
  ✅ locales/en.json (45 keys removed, 205 keys preserved)
  ✅ locales/ko.json (45 keys removed, 205 keys preserved)

📊 Cleanup Summary:
  - Total keys before: 250
  - Keys removed: 45
    * Unused: 38
    * Invalid values: 7
  - Keys preserved: 205
  - Keys remaining: 205

⚠️ Missing keys: 3
  Run 'npx i18n-extractor' to add missing keys

✅ Cleanup completed successfully!
```

## See Also

- [i18n-extractor](./i18n-extractor.md) - Extract translation keys
- [i18n-wrapper](./i18n-wrapper.md) - Wrap strings
- [Getting Started](../guides/getting-started.md) - Complete workflow
- [FAQ](../troubleshooting/faq.md) - Common questions
