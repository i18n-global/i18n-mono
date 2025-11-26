# Contributing Guide

Thank you for your interest in contributing to i18nexus-tools! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes or new features
- **Documentation**: Improve or translate documentation
- **Testing**: Help test new features and report issues

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
3. **Create a feature branch**
4. **Make your changes**
5. **Test your changes**
6. **Submit a pull request**

## 🚀 Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setup Steps

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/i18nexus.git
cd i18nexus/packages/i18nexus-tools

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Development Commands

```bash
# Watch mode for development
npm run dev

# Build TypeScript
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## 📝 Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Code Formatting

We use Prettier for code formatting:

```bash
# Format all code
npm run format

# Check formatting
npm run format:check
```

### Linting

We use ESLint for code linting:

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Use descriptive test names

### Test Structure

```typescript
describe("Feature Name", () => {
  it("should do something specific", () => {
    // Test implementation
  });
});
```

## 📚 Documentation

### Documentation Standards

- Write clear, concise documentation
- Include code examples
- Update documentation for new features
- Follow existing documentation style

### Documentation Types

- **README**: Project overview and quick start
- **API Documentation**: Function and class documentation
- **Guides**: Step-by-step tutorials
- **Examples**: Code examples and use cases

## 🔄 Pull Request Process

### Before Submitting

1. **Check existing issues** - Make sure your issue isn't already reported
2. **Create an issue** - For significant changes, create an issue first
3. **Fork and branch** - Create a feature branch from main
4. **Make changes** - Implement your changes
5. **Test thoroughly** - Ensure all tests pass
6. **Update documentation** - Update relevant documentation

### Pull Request Guidelines

- **Clear title** - Describe what the PR does
- **Detailed description** - Explain the changes and why
- **Link issues** - Reference related issues
- **Small changes** - Keep PRs focused and manageable
- **Test coverage** - Include tests for new features

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass
- [ ] Manual testing completed
- [ ] New tests added

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Bug Reports

### Before Reporting

1. **Check existing issues** - Search for similar issues
2. **Update to latest version** - Ensure you're using the latest version
3. **Reproduce the issue** - Create a minimal reproduction

### Bug Report Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Step one
2. Step two
3. Step three

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Environment

- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.0.0]
- i18nexus-tools version: [e.g., 1.5.7]

## Additional Context

Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing issues** - Search for similar requests
2. **Consider alternatives** - Are there existing solutions?
3. **Provide use case** - Explain why this feature is needed

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature

## Use Case

Why is this feature needed?

## Proposed Solution

How should this feature work?

## Alternatives Considered

What other solutions have you considered?

## Additional Context

Any other relevant information
```

## 🏗️ Architecture

### Project Structure

```
i18nexus-tools/
├── bin/                 # CLI entry points
├── scripts/            # Core functionality
├── docs/              # Documentation
├── locales/           # Translation files
├── src/               # Source files
├── dist/              # Built files
└── package.json       # Package configuration
```

### Key Components

- **CLI Tools**: Command-line interfaces
- **Core Scripts**: Main functionality
- **Configuration**: Project configuration
- **Documentation**: User guides and API docs

## 🔧 Development Tools

### Recommended Tools

- **VS Code** - Code editor
- **TypeScript** - Type checking
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Jest** - Testing framework

### VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

## 📋 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes written
- [ ] Package published

## 🤔 Questions?

### Getting Help

- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Email** - [support@i18nexus.com](mailto:support@i18nexus.com)

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Follow the code of conduct
- Provide constructive feedback

## 📄 License

By contributing to i18nexus-tools, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Recognition

Contributors will be recognized in:

- **README** - Contributor list
- **Changelog** - Release notes
- **GitHub** - Contributor statistics

Thank you for contributing to i18nexus-tools! 🎉
