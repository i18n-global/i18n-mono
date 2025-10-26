# Contributing to i18nexus

Thank you for your interest in contributing to i18nexus! 🎉

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/i18nexus.git
   cd i18nexus
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Start Development**
   ```bash
   # Run demo app
   cd react-i18n-auto
   npm install
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier is configured)
- Write meaningful commit messages
- Add tests for new features

### Project Structure

```
i18nexus/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # React hooks
│   ├── utils/         # Utility functions
│   ├── scripts/       # CLI tools
│   └── bin/          # CLI executables
├── react-i18n-auto/  # Demo application
├── __tests__/        # Test files
└── docs/            # Documentation
```

### Adding New Features

1. **Create an Issue** - Discuss your idea first
2. **Create a Branch** - Use descriptive branch names
3. **Write Code** - Follow existing patterns
4. **Add Tests** - Ensure good test coverage
5. **Update Docs** - Update README and JSDoc comments
6. **Submit PR** - Include detailed description

### CLI Tools Development

When working on CLI tools (`src/bin/`, `src/scripts/`):

- Test with both dry-run and actual execution
- Handle edge cases gracefully
- Provide helpful error messages
- Update help text and documentation

### Testing

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test CLI tools end-to-end
- **Demo Tests**: Ensure demo app works correctly

Run specific test suites:
```bash
npm test                    # All tests
npm test -- --watch        # Watch mode
npm test -- src/utils/     # Specific directory
```

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: OS, Node.js version, npm version
- **Steps to Reproduce**: Clear, step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Code Sample**: Minimal reproduction case
- **Error Messages**: Full error output

## 💡 Feature Requests

For new features:

- **Use Case**: Describe the problem you're solving
- **Proposed Solution**: How should it work?
- **Alternatives**: What other options did you consider?
- **Breaking Changes**: Will this affect existing users?

## 🔄 Pull Request Process

1. **Update Documentation** - README, JSDoc, etc.
2. **Add Tests** - Ensure good coverage
3. **Update Changelog** - Add entry for your changes
4. **Rebase on Main** - Keep history clean
5. **Request Review** - Tag maintainers

### PR Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] No breaking changes (or clearly documented)
- [ ] CLI tools work correctly
- [ ] Demo app works correctly

## 🏷️ Release Process

Releases follow semantic versioning:

- **Patch** (1.0.1): Bug fixes, small improvements
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

## 📞 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and features
- **Discord**: Join our community server (coming soon)

## 🙏 Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Package.json contributors field

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to i18nexus! 🌍✨
