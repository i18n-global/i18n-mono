# i18n-download Command Reference

Complete reference for the `i18n-download` and `i18n-download-force` commands.

## Overview

The `i18n-download` commands download translations from Google Sheets to local files. There are two modes: incremental (safe) and force (overwrite all).

## Commands

### i18n-download (Incremental Mode)

Downloads only new keys, preserving existing translations.

**Usage:**

```bash
npx i18n-download [options]
```

### i18n-download-force (Force Mode)

Downloads all translations, overwriting local files completely.

**Usage:**

```bash
npx i18n-download-force [options]
```

## Options

### `--dry-run`

Preview download without modifying local files.

**Usage:**

```bash
npx i18n-download --dry-run
npx i18n-download-force --dry-run
```

### `-s, --spreadsheet <id>`

Google Spreadsheet ID (overrides config).

**Usage:**

```bash
npx i18n-download -s "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
```

### `-c, --credentials <path>`

Path to Google service account credentials file.

**Default:** `./credentials.json` (from config)

**Usage:**

```bash
npx i18n-download -c "./config/google-credentials.json"
```

### `-h, --help`

Display help information.

**Usage:**

```bash
npx i18n-download --help
npx i18n-download-force --help
```

## Download Modes

### Incremental Mode (i18n-download)

Adds new keys without overwriting existing translations.

**Use When:**

- Daily development
- Translators added new translations
- Want to preserve local changes
- Safe updates needed

**Behavior:**

```
Local: { "key1": "local1", "key2": "local2" }
Sheet: { "key1": "sheet1", "key2": "sheet2", "key3": "sheet3" }

After download:
Local: { "key1": "local1", "key2": "local2", "key3": "sheet3" }
       ↑ preserved     ↑ preserved     ↑ new key added
```

**Example:**

```bash
# Safe incremental download
npx i18n-download
```

**Output:**

```bash
📥 Downloading translations...
  ✅ Found 3 keys in Google Sheets
  ✅ Added 1 new key
  ✅ Preserved 2 existing translations

✅ Download completed!
```

### Force Mode (i18n-download-force)

Overwrites all local translations with Google Sheets data.

**Use When:**

- Google Sheets is source of truth
- Need complete sync
- Local files are corrupted
- After collaborative translation work

**Behavior:**

```
Local: { "key1": "local1", "key2": "local2", "key3": "local3" }
Sheet: { "key1": "sheet1", "key2": "sheet2" }

After download-force:
Local: { "key1": "sheet1", "key2": "sheet2" }
       ↑ overwritten   ↑ overwritten   (key3 removed)
```

**Example:**

```bash
# Complete sync with Google Sheets
npx i18n-download-force
```

**Output:**

```bash
⚠️  Force mode: Will overwrite all local translations

📥 Downloading translations...
  ✅ Downloaded 2 keys from Google Sheets
  ✅ Overwrote locales/en.json
  ✅ Overwrote locales/ko.json

✅ Force download completed!
```

## Formula Handling

### Auto-Translated Content

When using `i18n-upload --auto-translate`, Google Sheets contains formulas:

```
| Key | Korean | English |
|-----|--------|---------|
| 안녕 | 안녕 | =GOOGLETRANSLATE(C2, "ko", "en") |
```

**Download Behavior:**

- Fetches **calculated results**, not formulas
- Downloads: `{ "안녕": "Hello" }` (not the formula)

**Wait for Calculation:**

```bash
# Upload with auto-translate
npx i18n-upload --auto-translate

# Wait for Google Sheets to calculate (few seconds)

# Download calculated results
npx i18n-download
```

## Workflow Examples

### Basic Download

```bash
# 1. Translators work in Google Sheets

# 2. Download new translations
npx i18n-download

# 3. Test in application
npm run dev

# 4. Commit changes
git add locales/
git commit -m "Updated translations"
```

### Force Download

```bash
# 1. Preview what would change
npx i18n-download-force --dry-run

# 2. Backup local files
cp -r locales locales.backup

# 3. Force download
npx i18n-download-force

# 4. Verify results
git diff locales/
```

### Auto-Translate Workflow

```bash
# 1. Upload with auto-translate
npx i18n-upload --auto-translate

# 2. Wait 5-10 seconds for calculation

# 3. Download translated results
npx i18n-download

# 4. Review auto-translations
cat locales/en.json

# 5. Refine in Google Sheets if needed
```

### Collaborative Translation

```bash
# Day 1: Upload new keys
npx i18n-extractor
npx i18n-upload

# Day 2-7: Translators work

# Day 8: Download completed work
npx i18n-download

# Incremental download preserves local edits
```

### Complete Sync

```bash
# After major translation updates
npx i18n-download-force

# Ensures 100% sync with Google Sheets
```

## Configuration

Reads from `i18nexus.config.json`:

```json
{
  "languages": ["en", "ko"],
  "localesDir": "./locales",
  "googleSheets": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

## Advanced Usage

### Custom Spreadsheet

```bash
# Download from different spreadsheet
npx i18n-download -s "different-spreadsheet-id"
```

### Custom Credentials

```bash
# Use different credentials
npx i18n-download -c "./prod-credentials.json"
```

### Preview Changes

```bash
# See what would be downloaded
npx i18n-download --dry-run

# See force changes
npx i18n-download-force --dry-run
```

## Error Handling

### Authentication Errors

```bash
❌ Failed to authenticate with Google Sheets
```

**Solutions:**

1. Check credentials file exists
2. Verify service account permissions
3. Re-download credentials

### Access Denied

```bash
❌ Access denied to spreadsheet
```

**Solutions:**

1. Share spreadsheet with service account
2. Give "Viewer" or "Editor" permissions
3. Verify spreadsheet ID

### No Data Found

```bash
⚠️  No translations found in Google Sheets
```

**Solutions:**

1. Upload data first: `npx i18n-upload`
2. Check worksheet name in config
3. Verify spreadsheet has data

### File Write Errors

```bash
❌ Failed to write: locales/en.json
Permission denied
```

**Solutions:**

1. Check directory permissions
2. Close files if open in editor
3. Check disk space

## Best Practices

### 1. Use Incremental Mode Daily

```bash
# Safe daily downloads
npx i18n-download
```

### 2. Preview Before Force

```bash
# Always check first
npx i18n-download-force --dry-run
```

### 3. Backup Before Force

```bash
# Backup local files
cp -r locales locales.backup

# Then force download
npx i18n-download-force
```

### 4. Wait for Formula Calculation

```bash
# After auto-translate upload
npx i18n-upload --auto-translate

# Wait 5-10 seconds

# Then download
npx i18n-download
```

### 5. Version Control

```bash
# Commit before download
git add .
git commit -m "Before translation update"

# Download
npx i18n-download

# Review changes
git diff locales/
```

## Comparison: Incremental vs Force

| Aspect                    | Incremental (i18n-download) | Force (i18n-download-force) |
| ------------------------- | --------------------------- | --------------------------- |
| **Safety**                | ✅ Safe                     | ⚠️ Destructive              |
| **Existing Translations** | Preserved                   | Overwritten                 |
| **New Keys**              | Added                       | Downloaded                  |
| **Removed Keys**          | Kept                        | Removed                     |
| **Use Case**              | Daily updates               | Complete sync               |
| **Risk**                  | Low                         | High                        |
| **Backup Needed**         | Optional                    | Recommended                 |

## Troubleshooting

### Issue: Translations Not Updated

**Symptoms:**

- Downloaded but files unchanged
- Google Sheets has updates but not in local files

**Solutions:**

1. Use force mode: `npx i18n-download-force`
2. Check spreadsheet ID is correct
3. Verify worksheet name matches config

### Issue: Formulas Downloaded Instead of Values

**Symptoms:**

- Seeing `=GOOGLETRANSLATE(...)` in files
- Not getting translated text

**Solutions:**

1. Wait longer for calculation
2. Manually trigger calculation in Google Sheets
3. Check formula syntax is correct

### Issue: Keys Disappeared

**Symptoms:**

- Keys removed from local files
- Used `force` mode accidentally

**Solutions:**

1. Restore from version control: `git checkout locales/`
2. Restore from backup
3. Re-extract keys: `npx i18n-extractor`

### Issue: Merge Conflicts

**Symptoms:**

- Different translations in local vs Google Sheets
- Not sure which to keep

**Solutions:**

1. Use incremental mode (keeps local)
2. Or use force mode (uses Google Sheets)
3. Manual merge if needed

## Performance

### Large Projects

```bash
# Download may take time
npx i18n-download

# Progress shown:
# Downloading... 500/1000 keys
```

### Optimization Tips

1. Use incremental mode when possible
2. Schedule regular downloads
3. Batch translation work

## Output Examples

### Incremental Download

```bash
$ npx i18n-download

📥 Connecting to Google Sheets...
  ✅ Authenticated successfully

📊 Analyzing Google Sheets data...
  - Found 205 keys in spreadsheet

📥 Downloading translations...
  - Existing local keys: 200
  - New keys from sheets: 5
  - Mode: Incremental (preserving local)

✅ locales/en.json updated (5 new keys, 200 preserved)
✅ locales/ko.json updated (5 new keys, 200 preserved)

📊 Download Summary:
  - Total keys: 205
  - New keys added: 5
  - Existing keys preserved: 200

✅ Incremental download completed successfully!
```

### Force Download

```bash
$ npx i18n-download-force

⚠️  Force mode enabled
    Will overwrite all local translations

📥 Connecting to Google Sheets...
  ✅ Authenticated successfully

📥 Downloading all translations...
  ✅ Downloaded 205 keys from spreadsheet

📝 Writing to local files...
  ✅ locales/en.json (205 keys)
  ✅ locales/ko.json (205 keys)

⚠️  Replaced all local content with Google Sheets data

✅ Force download completed successfully!
```

### Dry Run

```bash
$ npx i18n-download --dry-run

📥 DRY RUN MODE - No files will be modified

📊 Would download from Google Sheets:
  - Spreadsheet ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
  - Found 205 keys

📊 Changes that would be made:
  locales/en.json:
    + 5 new keys would be added
    = 200 existing keys would be preserved

  locales/ko.json:
    + 5 new keys would be added
    = 200 existing keys would be preserved

🔍 DRY RUN - No files were modified
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
# .github/workflows/i18n-download.yml
name: Download Translations

on:
  schedule:
    - cron: "0 0 * * *" # Daily at midnight UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  download:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Setup Google credentials
        run: |
          echo "${{ secrets.GOOGLE_CREDENTIALS }}" > credentials.json
          chmod 600 credentials.json

      - name: Download translations
        run: |
          npx i18n-download
        env:
          NODE_ENV: production

      - name: Cleanup credentials
        if: always()
        run: rm -f credentials.json

      - name: Check for changes
        id: check_changes
        run: |
          git diff --quiet locales/ || echo "changes=true" >> $GITHUB_OUTPUT

      - name: Create Pull Request
        if: steps.check_changes.outputs.changes == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "chore: update translations from Google Sheets"
          title: "🌍 Update translations from Google Sheets"
          body: |
            ## Translation Update

            This PR contains updated translations downloaded from Google Sheets.

            ### Changes
            - Updated translation files in `locales/` directory

            ### Action Required
            - Review the translation changes
            - Test the application with new translations
            - Merge when ready

            ---
            *Auto-generated by GitHub Actions*
          branch: "translations-update"
          delete-branch: true
          labels: |
            translations
            automated
```

### Setup Instructions

1. **Add Google Credentials Secret:**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GOOGLE_CREDENTIALS`
   - Value: Contents of your `credentials.json` file

2. **Enable Workflow Permissions:**
   - Go to repository Settings → Actions → General
   - Under "Workflow permissions", select:
     - ✅ Read and write permissions
     - ✅ Allow GitHub Actions to create and approve pull requests

3. **Test Manually:**
   ```bash
   # Go to Actions tab in GitHub
   # Select "Download Translations" workflow
   # Click "Run workflow" button
   ```

### Alternative: Direct Commit (No PR)

```yaml
# .github/workflows/i18n-download-direct.yml
name: Download Translations (Direct Commit)

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  download:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Setup Google credentials
        run: |
          echo "${{ secrets.GOOGLE_CREDENTIALS }}" > credentials.json
          chmod 600 credentials.json

      - name: Download translations
        run: npx i18n-download

      - name: Cleanup credentials
        if: always()
        run: rm -f credentials.json

      - name: Commit and push changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add locales/
          git diff --staged --quiet || git commit -m "chore: update translations from Google Sheets [skip ci]"
          git push
```

## See Also

- [i18n-upload](./i18n-upload.md) - Upload translations
- [i18n-extractor](./i18n-extractor.md) - Extract keys
- [Google Sheets Guide](../guides/google-sheets.md) - Setup guide
- [Configuration](../guides/configuration.md) - Config options
