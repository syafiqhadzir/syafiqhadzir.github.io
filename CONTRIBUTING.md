# Contributing to syafiqhadzir.github.io

Thank you for your interest in contributing! This project is a personal portfolio, but suggestions
and improvements are welcome.

## Ways to Contribute

### 🐛 Bug Reports

If you find a bug, please
[open an issue](https://github.com/syafiqhadzir/syafiqhadzir.github.io/issues/new) with:

- A clear, descriptive title
- Steps to reproduce the behavior
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

### 💡 Feature Suggestions

Feature requests are welcome! Please check existing issues first to avoid duplicates.

### 🔧 Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `npm run lint && npm run test:unit`
5. Commit with conventional format: `feat: add new feature`
6. Push and open a PR

## Development Setup

```bash
# Clone the repository
git clone https://github.com/syafiqhadzir/syafiqhadzir.github.io.git
cd syafiqhadzir.github.io

# Install dependencies
npm ci

# Start development server
npm run dev

# Run tests
npm run test
```

## Code Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint + Stylelint (run `npm run lint`)
- **Testing**:
  - Unit: `npm run test:unit` (Vitest)
  - E2E: `npm run test:e2e` (Cypress)
- **Commits**: Follow [Conventional Commits](https://conventionalcommits.org/)
- **Workflows**:
  - `pr-validation`: Fast feedback (Lint, Unit, Build Dry Run).
  - `nightly-quality`: Deep audit (Cypress, SonarQube).
  - `deploy`: Production release (Lighthouse CI, GitHub Pages).

## AMP Compliance

This is a Google AMP site. All HTML must pass AMP validation:

```bash
npm run validate:amp
```

## License

By contributing, you agree that your contributions will be licensed under the
[CC0-1.0 License](LICENSE).
