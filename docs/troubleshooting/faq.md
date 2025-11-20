# FAQ

Frequently asked questions about i18nexus-tools.

## 🚀 Getting Started

### Q: How do I install i18nexus-tools?

**A:** Choose your preferred installation method:

```bash
# Global installation (recommended)
npm install -g i18nexus-tools

# Local installation
npm install -D i18nexus-tools

# Using npx (no installation)
npx i18nexus-tools
```

### Q: What are the system requirements?

**A:**

- Node.js >= 18.0.0
- npm >= 9.0.0
- React >= 16.8.0 (for hooks support)
- TypeScript >= 4.0.0 (optional)

### Q: How do I initialize a new project?

**A:**

```bash
# Basic initialization
npx i18n-sheets init

# With Google Sheets
npx i18n-sheets init -s <spreadsheet-id>

# TypeScript configuration
npx i18n-sheets init --typescript
```

## 🔧 Configuration

### Q: What configuration files are supported?

**A:** The tool supports multiple formats with automatic detection:

1. `i18nexus.config.ts` (TypeScript - recommended)
2. `i18nexus.config.js` (JavaScript)
3. `i18nexus.config.json` (JSON - universal)

### Q: How do I configure for Next.js App Router?

**A:** Update your configuration:

```typescript
// i18nexus.config.ts
export const config = defineConfig({
  sourcePattern: "app/**/*.{ts,tsx}", // App Router pattern
  // ... other config
});
```

### Q: Can I use custom import sources?

**A:** Yes, configure `translationImportSource`:

```typescript
export const config = defineConfig({
  translationImportSource: "@/lib/i18n", // Custom path
  // ... other config
});
```

## 🔄 Workflow

### Q: What's the basic workflow?

**A:**

```bash
# 1. Wrap hardcoded strings
npx i18n-wrapper

# 2. Extract translation keys
npx i18n-extractor

# 3. Upload to Google Sheets (optional)
npx i18n-upload

# 4. Download translations (optional)
npx i18n-download
```

### Q: How do I handle template literals?

**A:** The wrapper automatically converts them:

```tsx
// Before
<p>{`사용자: ${count}명`}</p>

// After
<p>{t("사용자: {{count}}명", { count })}</p>
```

### Q: How do I skip wrapping certain content?

**A:** Use ignore comments:

```tsx
// i18n-ignore
const apiKey = "한글 API 키";

{
  /* i18n-ignore */
}
<p>이것은 무시됩니다</p>;
```

## 🎯 Google Sheets

### Q: How do I set up Google Sheets integration?

**A:**

1. Create Google Service Account
2. Enable Google Sheets API
3. Download credentials JSON
4. Share spreadsheet with service account
5. Initialize project with spreadsheet ID

### Q: What's the difference between upload and download?

**A:**

- **Upload**: Send local translations to Google Sheets
- **Download**: Get translations from Google Sheets to local files
- **Force modes**: Clear and re-upload/download everything

### Q: How does auto-translation work?

**A:**

```bash
npx i18n-upload --auto-translate
```

This uploads Korean text as plain text and English as Google Translate formulas:

- Korean: `"안녕하세요"` (text)
- English: `=GOOGLETRANSLATE(C2, "ko", "en")` (formula)

## 🔧 Advanced Features

### Q: How does server component detection work?

**A:** The wrapper automatically detects server components and doesn't add `useTranslation` hooks:

```tsx
// Server component - no hook added
export default async function ServerPage() {
  const { t } = await getServerTranslation();
  return <h1>{t("서버 렌더링")}</h1>;
}
```

### Q: How do I clean up unused translation keys?

**A:**

```bash
# Preview cleanup
npx i18n-clean-legacy --dry-run

# Clean unused keys
npx i18n-clean-legacy
```

### Q: What's the difference between force and normal modes?

**A:**

- **Normal mode**: Preserves existing translations, only adds new keys
- **Force mode**: Clears all data and re-uploads/downloads everything

## 🐛 Troubleshooting

### Q: Command not found error

**A:**

```bash
# Use npx
npx i18n-sheets --help

# Or install globally
npm install -g i18nexus-tools
```

### Q: Configuration file not found

**A:**

```bash
# Initialize project
npx i18n-sheets init
```

### Q: Google Sheets access denied

**A:**

1. Check credentials file exists
2. Verify service account email
3. Re-share spreadsheet with service account
4. Check API permissions

### Q: No files processed by wrapper

**A:**

1. Check source pattern in config
2. Verify files match pattern
3. Run with `--dry-run` to preview

### Q: Hydration mismatch in Next.js

**A:** Ensure same content on server and client:

```tsx
// ❌ Wrong - different content
export default function Page() {
  const [mounted, setMounted] = useState(false);
  if (!mounted) return null;
  return <div>{t("클라이언트 전용")}</div>;
}

// ✅ Correct - same content
export default function Page() {
  return <div>{t("서버와 클라이언트 동일")}</div>;
}
```

## 🎨 Best Practices

### Q: How do I organize translation keys?

**A:**

- Use descriptive keys
- Group related keys
- Use consistent naming conventions
- Regular cleanup of unused keys

### Q: How do I handle dynamic content?

**A:**

- Use template literals with interpolation
- Avoid wrapping API data
- Use ignore comments for non-translatable content

### Q: How do I manage multiple languages?

**A:**

```typescript
// Configure multiple languages
export const config = defineConfig({
  languages: ["en", "ko", "ja", "zh"] as const,
  // ... other config
});
```

### Q: How do I use multiple namespaces without variable name conflicts?

**A:** Use aliases when destructuring `useTranslation`:

```tsx
// ❌ Problem: Variable name conflict
const { t } = useTranslation("dashboard");
const { t } = useTranslation("constant");  // Error: 't' is already declared

// ✅ Solution: Use aliases
const { t: tDashboard } = useTranslation("dashboard");
const { t: tConstant } = useTranslation("constant");

return (
  <div>
    <h1>{tDashboard("title")}</h1>
    <button>{tConstant("submit")}</button>
  </div>
);
```

See [Namespace Usage Guide](../guides/namespace-usage.md) for detailed examples.

## 📚 Support

### Q: Where can I get help?

**A:**

- 📖 [Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/manNomi/i18nexus/issues)
- 💬 [Discussions](https://github.com/manNomi/i18nexus/discussions)
- 📧 Email: [support@i18nexus.com](mailto:support@i18nexus.com)

### Q: How do I contribute?

**A:**

- Fork the repository
- Create a feature branch
- Submit a pull request
- Follow the contributing guidelines

### Q: Is there a changelog?

**A:** Yes, check the [version history](../versions/) for detailed release notes.
