# Installation Guide

This guide covers all installation methods and requirements for i18nexus-tools.

## 📋 Requirements

### System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Operating System**: Windows, macOS, Linux

### Project Requirements

- **React**: >= 16.8.0 (for hooks support)
- **TypeScript**: >= 4.0.0 (optional, for TypeScript projects)

## 🚀 Installation Methods

### Method 1: Global Installation (Recommended)

Install globally for use across multiple projects:

```bash
npm install -g i18nexus-tools
```

**Pros:**

- Available system-wide
- No need to install in each project
- Consistent version across projects

**Cons:**

- Global dependency
- Version conflicts possible

**Usage:**

```bash
i18n-sheets init
i18n-wrapper
i18n-extractor
```

### Method 2: Local Installation

Install as a dev dependency in your project:

```bash
npm install -D i18nexus-tools
```

**Pros:**

- Project-specific version
- No global dependencies
- Version control friendly

**Cons:**

- Must install in each project
- Requires npx or npm scripts

**Usage:**

```bash
npx i18n-sheets init
npx i18n-wrapper
npx i18n-extractor
```

### Method 3: NPX (No Installation)

Use without installing:

```bash
npx i18nexus-tools
```

**Pros:**

- No installation required
- Always latest version
- Good for testing

**Cons:**

- Slower execution
- Requires internet connection
- No offline usage

**Usage:**

```bash
npx i18n-sheets init
npx i18n-wrapper
npx i18n-extractor
```

## 📦 Package Contents

After installation, you'll have access to these commands:

| Command               | Description                 | Binary Path                       |
| --------------------- | --------------------------- | --------------------------------- |
| `i18n-sheets`         | Google Sheets integration   | `dist/bin/i18n-sheets.js`         |
| `i18n-wrapper`        | String wrapping tool        | `dist/bin/i18n-wrapper.js`        |
| `i18n-extractor`      | Key extraction tool         | `dist/bin/i18n-extractor.js`      |
| `i18n-upload`         | Upload to Google Sheets     | `dist/bin/i18n-upload.js`         |
| `i18n-download`       | Download from Google Sheets | `dist/bin/i18n-download.js`       |
| `i18n-download-force` | Force download              | `dist/bin/i18n-download-force.js` |
| `i18n-clean-legacy`   | Clean unused keys           | `dist/bin/i18n-clean-legacy.js`   |

## 🔧 Verification

### Check Installation

Verify the installation:

```bash
# Check version
i18n-sheets --version

# Check available commands
i18n-sheets --help

# Test wrapper
i18n-wrapper --help

# Test extractor
i18n-extractor --help
```

### Expected Output

```bash
$ i18n-sheets --version
1.5.7

$ i18n-sheets --help
Usage: i18n-sheets [options] [command]

Google Sheets integration for i18n translations

Commands:
  init      Initialize i18nexus project with config and translation files
  upload    Upload local translation files to Google Sheets
  download  Download translations from Google Sheets to local files
  sync      Bidirectional sync between local files and Google Sheets
  status    Show Google Sheets status and statistics
  ...
```

## 🏗️ Build from Source

### Prerequisites

```bash
# Clone repository
git clone https://github.com/manNomi/i18nexus.git
cd i18nexus/packages/i18nexus-tools

# Install dependencies
npm install
```

### Build Process

```bash
# Build TypeScript
npm run build

# Test build
npm test

# Install globally from source
npm install -g .
```

### Development Setup

```bash
# Watch mode for development
npm run dev

# Run specific command
npm run dev -- i18n-wrapper --help
```

## 🔄 Updates

### Update Global Installation

```bash
npm update -g i18nexus-tools
```

### Update Local Installation

```bash
npm update i18nexus-tools
```

### Check for Updates

```bash
npm outdated -g i18nexus-tools
```

## 🐛 Troubleshooting

### Common Installation Issues

#### Permission Errors (macOS/Linux)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use a Node version manager
nvm install node
nvm use node
```

#### Windows Issues

```bash
# Run as Administrator
# Or use PowerShell with execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Network Issues

```bash
# Use different registry
npm install -g i18nexus-tools --registry https://registry.npmjs.org/

# Or use yarn
yarn global add i18nexus-tools
```

### Verification Issues

#### Command Not Found

```bash
# Check PATH
echo $PATH

# Add npm global bin to PATH
export PATH=$PATH:$(npm config get prefix)/bin

# Or use npx
npx i18n-sheets --version
```

#### Version Mismatch

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm uninstall -g i18nexus-tools
npm install -g i18nexus-tools
```

## 📚 Next Steps

After successful installation:

1. **Initialize your project:**

   ```bash
   i18n-sheets init
   ```

2. **Read the [Getting Started Guide](./getting-started.md)**

3. **Configure for your framework:**
   - [Next.js App Router](./nextjs-app-router.md)
   - [Next.js Pages Router](./nextjs-pages-router.md)

4. **Set up Google Sheets integration:**
   - [Google Sheets Guide](./google-sheets.md)

## 🆘 Support

If you encounter issues:

- 📖 Check the [FAQ](./faq.md)
- 🐛 [Report Issues](https://github.com/manNomi/i18nexus/issues)
- 💬 [Join Discussions](https://github.com/manNomi/i18nexus/discussions)
- 📧 Contact: [support@i18nexus.com](mailto:support@i18nexus.com)
