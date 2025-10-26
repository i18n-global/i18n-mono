# Contributing to i18nexus

Thank you for your interest in contributing to i18nexus! 🎉

We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, and code contributions.

[한국어 버전](./CONTRIBUTING.ko.md) | [English Version](#)

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and considerate in all interactions.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Git**: Latest version

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/i18nexus.git
   cd i18nexus
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/manNomi/i18nexus.git
   ```

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run linter
npm run lint

# Build the project
npm run build
```

### 4. Commit Your Changes

Follow our [commit convention](#commit-convention):

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

Go to GitHub and create a pull request from your branch to `main`.

---

## 📝 Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid using `any` type
- Use `interface` for object types
- Use `type` for unions and complex types

**Example:**

```typescript
// Good ✅
interface TranslationConfig {
  language: string;
  fallback?: string;
}

// Bad ❌
const config: any = { language: "en" };
```

### React Components

- Use functional components with hooks
- Use meaningful component names
- Extract reusable logic into custom hooks
- Properly type props with TypeScript

**Example:**

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Code Style

We use **Prettier** for code formatting and **ESLint** for linting.

```bash
# Format code
npm run format

# Run linter
npm run lint
```

### File Structure

```
src/
├── components/          # React components
│   ├── I18nProvider.tsx
│   └── I18NexusDevtools.tsx
├── hooks/              # Custom React hooks
│   └── useTranslation.ts
├── utils/              # Utility functions
│   ├── cookie.ts
│   ├── server.ts
│   └── types.ts
├── __tests__/          # Test files
│   ├── I18nProvider.test.tsx
│   └── cookie.test.ts
└── index.ts            # Main entry point
```

---

## 💬 Commit Convention

We follow the **Conventional Commits** specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (build, dependencies, etc.)
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
# Feature
feat: add variable interpolation support

# Bug fix
fix: resolve cookie parsing issue in Safari

# Documentation
docs: update README with Accept-Language guide

# Refactor
refactor: simplify translation loading logic

# Chore
chore: update dependencies to latest versions
```

### Scope (Optional)

```bash
feat(server): add Accept-Language detection
fix(devtools): resolve positioning issue
docs(api): add server utilities documentation
```

---

## 🔍 Pull Request Process

### Before Submitting

- [ ] Tests pass locally (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated (for significant changes)
- [ ] Commit messages follow convention

### PR Title

Use the same format as commit messages:

```
feat: add support for pluralization
fix: resolve hydration mismatch in SSR
docs: improve TypeScript configuration guide
```

### PR Description Template

```markdown
## Description
Brief description of your changes.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.
```

### Review Process

1. **Automated Checks**: CI/CD will run tests and linting
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged

---

## 🐛 Reporting Bugs

### Before Reporting

- Check if the bug has already been reported in [Issues](https://github.com/manNomi/i18nexus/issues)
- Try to reproduce the bug with the latest version
- Check if it's already fixed in the `main` branch

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## Environment
- **i18nexus version**: 2.7.0
- **Node.js version**: 18.0.0
- **npm version**: 9.0.0
- **OS**: macOS 13.0
- **Framework**: Next.js 14.0.0

## Steps to Reproduce
1. Install i18nexus
2. Create a component with...
3. Run the application
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Code Sample
```typescript
// Minimal reproduction code
import { useTranslation } from "i18nexus";

export default function Component() {
  const { t } = useTranslation();
  return <div>{t("key")}</div>;
}
```

## Error Messages
```
Full error output or console logs
```

## Additional Context
Any other information that might be helpful.
```

---

## 💡 Feature Requests

### Before Requesting

- Check if the feature has already been requested
- Consider if it fits the project's scope
- Think about backward compatibility

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature you'd like to see.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Example Usage
```typescript
// How you envision using this feature
const { t } = useTranslation();
t("key", { 
  plural: true, 
  count: 5 
});
```

## Alternatives Considered
What other solutions did you consider?

## Additional Context
Any other information or screenshots.
```

---

## 📚 Documentation

### Types of Documentation

1. **README.md** - Main project documentation
2. **API Documentation** - In `docs/api/`
3. **Guides** - In `docs/guides/`
4. **Release Notes** - In `docs/releases/`
5. **Code Comments** - JSDoc comments in code

### Writing Documentation

- Use clear, concise language
- Provide code examples
- Include both simple and advanced examples
- Keep it up to date with code changes

### Documentation Style

```markdown
# Title (H1)

Brief introduction.

## Section (H2)

### Subsection (H3)

**Example:**

```typescript
// Code example with comments
const example = "value";
```

**Output:**
```
Expected output
```
```

---

## 🧪 Testing

### Writing Tests

- Write tests for all new features
- Use descriptive test names
- Cover edge cases
- Keep tests focused and simple

**Example:**

```typescript
describe("useTranslation", () => {
  it("should return translation function", () => {
    const { t } = useTranslation();
    expect(typeof t).toBe("function");
  });

  it("should translate key correctly", () => {
    const { t } = useTranslation();
    expect(t("welcome")).toBe("Welcome");
  });

  it("should handle missing keys", () => {
    const { t } = useTranslation();
    expect(t("nonexistent")).toBe("nonexistent");
  });
});
```

### Test Coverage

- Aim for high test coverage
- Focus on critical paths
- Test both success and failure cases

```bash
# Run tests with coverage
npm test -- --coverage
```

---

## 🏷️ Release Process

Releases are automated via GitHub Actions when pushing to `main` branch.

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **Patch** (2.7.1): Bug fixes, small improvements
- **Minor** (2.8.0): New features, backward compatible
- **Major** (3.0.0): Breaking changes

### Creating a Release

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a release note in `docs/releases/`
4. Commit changes
5. Push to `main`
6. GitHub Actions will automatically publish to npm

---

## 🤝 Community

### Getting Help

- 💬 **Discussions**: [GitHub Discussions](https://github.com/manNomi/i18nexus/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/manNomi/i18nexus/issues)
- 📧 **Email**: hanmw110@naver.com

### Contributors

All contributors are recognized in:
- README.md contributors section
- Release notes
- Package.json contributors field

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the **MIT License**.

---

## 🙏 Thank You!

Thank you for contributing to i18nexus! Every contribution, no matter how small, makes a difference. 🌍✨

---

**Happy Coding!** 🚀
