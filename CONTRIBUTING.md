# 🤝 Contributing to Syafiq Hadzir's Portfolio

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to this project. These are mostly guidelines,
not rules. Use your best judgment, and feel free to propose changes to this document in a pull
request.

## 📄 Documentation

Before contributing, please read:

1.  **[Architecture Guide](ARCHITECTURE.md)** - Understand the system design.
2.  **[Technnical Documentation](docs/README.md)** - Core documentation hub.
3.  **[Style Guide](docs/STYLE_GUIDE.md)** - Coding conventions.
4.  **[Testing Guide](docs/development/TESTING.md)** - How to test your changes.

## 🛠️ Development Workflow

1.  **Fork the repository** on GitHub.
2.  **Clone** your fork locally.
3.  **Install dependencies**: `npm ci`
4.  **Create a branch** for your feature: `git checkout -b feat/amazing-feature`
5.  **Develop** your changes.
6.  **Verify** your changes:
    - `npm run lint` (Must pass)
    - `npm run typecheck` (Must pass)
    - `npm run test:unit` (Must pass)
7.  **Commit** your changes using [Conventional Commits](https://www.conventionalcommits.org/).
8.  **Push** to your fork.
9.  **Submit a Pull Request**.

## 🧪 Testing Requirements

We have a **strict zero-regression policy**.

- **New Features:** Must include unit tests (`test/`) and E2E tests (`cypress/`) if applicable.
- **Bug Fixes:** Must include a regression test that fails without the fix and passes with it.
- **Coverage:** Unit test coverage must remain above 80%.

## 📝 Commit Messages

We use **Commitlint** to enforce the [Conventional Commits](https://www.conventionalcommits.org/)
specification.

**Structure:**

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

**Example:**

```
feat(search): add amp-autocomplete support for search bar

- Implements amp-autocomplete with custom source
- Adds debouncing for performance
- Updates tests

Closes #123
```

## 🐛 Reporting Bugs

1.  **Search** existing issues to prevent duplicates.
2.  **Create** a new issue using the "Bug Report" template.
3.  **Provide** clear reproduction steps, expected behavior, and screenshots if possible.

## 💡 Feature Requests

1.  **Search** existing issues.
2.  **Create** a new issue using the "Feature Request" template.
3.  **Explain** the "Why" and "What" clearly.

---

Thanks for helping make this project better! 🚀
