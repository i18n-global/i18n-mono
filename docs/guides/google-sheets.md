# Google Sheets Integration

Complete guide for Google Sheets integration with i18nexus-tools.

## 🚀 Quick Setup

### 1. Create Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create Service Account credentials
5. Download JSON credentials file

### 2. Share Spreadsheet

1. Open your Google Spreadsheet
2. Click "Share" button
3. Add service account email (from credentials file)
4. Give "Editor" permissions

### 3. Initialize Project

```bash
npx i18n-sheets init -s <spreadsheet-id> -c ./credentials.json
```

## 📊 Spreadsheet Structure

### Required Format

| Key        | Korean     | English | Japanese   | Chinese |
| ---------- | ---------- | ------- | ---------- | ------- |
| 환영합니다 | 환영합니다 | Welcome | ようこそ   | 欢迎    |
| 안녕하세요 | 안녕하세요 | Hello   | こんにちは | 你好    |

### Auto-Generated Headers

The tool automatically creates headers based on your configuration:

```json
{
  "languages": ["en", "ko", "ja", "zh"]
}
```

Creates columns: `Key`, `Korean`, `English`, `Japanese`, `Chinese`

## 🔄 Workflow

### Upload Workflow

```bash
# 1. Extract translation keys
npx i18n-extractor

# 2. Upload to Google Sheets
npx i18n-upload

# 3. Translators work in Google Sheets

# 4. Download completed translations
npx i18n-download
```

### Auto-Translation Workflow

```bash
# Upload with auto-translation
npx i18n-upload --auto-translate

# Download calculated results
npx i18n-download
```

## 🎯 Commands

### Upload Commands

```bash
# Upload new keys only
npx i18n-upload

# Force upload (clear and re-upload)
npx i18n-upload --force

# Auto-translate English
npx i18n-upload --auto-translate

# Force + auto-translate
npx i18n-upload --force --auto-translate
```

### Download Commands

```bash
# Download new keys only
npx i18n-download

# Force download (overwrite all)
npx i18n-download-force
```

### Status Commands

```bash
# Check spreadsheet status
npx i18n-sheets status

# Check specific spreadsheet
npx i18n-sheets status -s <spreadsheet-id>
```

## 🔧 Configuration

### Basic Configuration

```json
{
  "googleSheets": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "credentialsPath": "./credentials.json",
    "sheetName": "Translations"
  }
}
```

### Environment Variables

```bash
# .env.local
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_CREDENTIALS_PATH=./credentials.json
```

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  googleSheets: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
    credentialsPath: process.env.GOOGLE_CREDENTIALS_PATH!,
    sheetName: "Translations",
  },
});
```

## 🎨 Advanced Features

### Auto-Translation

Upload Korean text with Google Translate formulas:

```bash
npx i18n-upload --auto-translate
```

**Result in Google Sheets:**

- Korean: `"안녕하세요"` (plain text)
- English: `=GOOGLETRANSLATE(C2, "ko", "en")` (formula)

### Custom Sheet Names

```json
{
  "googleSheets": {
    "sheetName": "App Translations"
  }
}
```

### Multiple Spreadsheets

```bash
# Upload to specific spreadsheet
npx i18n-upload -s <spreadsheet-id>

# Download from specific spreadsheet
npx i18n-download -s <spreadsheet-id>
```

## 🆘 Troubleshooting

### Common Issues

**Access Denied:**

```bash
# Check credentials
ls -la credentials.json

# Verify service account email
cat credentials.json | grep client_email

# Re-share spreadsheet with service account
```

**Spreadsheet Not Found:**

```bash
# Check spreadsheet ID
npx i18n-sheets status -s <spreadsheet-id>

# Verify spreadsheet is shared
```

**API Quota Exceeded:**

```bash
# Wait and retry
# Or use different Google account
```

### Debug Commands

```bash
# Test connection
npx i18n-sheets status

# Preview upload
npx i18n-upload --dry-run

# Preview download
npx i18n-download --dry-run
```

## 📚 Best Practices

### Spreadsheet Organization

- Use clear sheet names
- Keep headers consistent
- Use separate sheets for different features
- Regular cleanup of unused keys

### Translation Workflow

1. **Upload new keys** with auto-translation
2. **Review auto-translations** in Google Sheets
3. **Refine translations** manually
4. **Download final translations**
5. **Test in application**

### Team Collaboration

- Use comments in Google Sheets
- Set up notifications for changes
- Regular sync with development team
- Version control for translation files
