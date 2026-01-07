# 📚 Documentation Hub

Welcome to the **syafiqhadzir.github.io** documentation! This is your central navigation point for
all project documentation.

## 🗂️ Documentation Structure

### Core Documentation

| Document                                 | Description                           |
| ---------------------------------------- | ------------------------------------- |
| [README](../README.md)                   | Project overview and quick start      |
| [ARCHITECTURE](../ARCHITECTURE.md)       | System design and technical decisions |
| [CONTRIBUTING](../CONTRIBUTING.md)       | Contribution guidelines               |
| [CHANGELOG](../CHANGELOG.md)             | Release history (auto-generated)      |
| [CODE_OF_CONDUCT](../CODE_OF_CONDUCT.md) | Community guidelines                  |
| [SECURITY](../SECURITY.md)               | Security policy and reporting         |

### Developer Guides

| Guide                                      | Description                          |
| ------------------------------------------ | ------------------------------------ |
| [Development Guide](development/README.md) | Setup, workflows, and best practices |
| [Testing Guide](development/TESTING.md)    | Unit, E2E, and performance testing   |
| [SonarCloud](development/SONARCLOUD.md)    | Code quality monitoring              |

### Quick References

| Reference                                             | Description                         |
| ----------------------------------------------------- | ----------------------------------- |
| [Commands](quick-reference/README.md)                 | Common npm scripts and CLI commands |
| [Troubleshooting](quick-reference/TROUBLESHOOTING.md) | Common issues and solutions         |

### Technical References

| Reference                     | Description                      |
| ----------------------------- | -------------------------------- |
| [API Reference](API.md)       | TypeScript modules and exports   |
| [Style Guide](STYLE_GUIDE.md) | Coding standards and conventions |
| [Deployment](DEPLOYMENT.md)   | Production deployment process    |

---

## 🚀 Quick Start

### For New Contributors

1. Read the [README](../README.md) for project overview
2. Follow [Development Guide](development/README.md) for setup
3. Review [CONTRIBUTING](../CONTRIBUTING.md) for guidelines
4. Check [Testing Guide](development/TESTING.md) for quality standards

### For Maintainers

1. Review [ARCHITECTURE](../ARCHITECTURE.md) for system design
2. Check [Deployment](DEPLOYMENT.md) for release process
3. Monitor [SonarCloud](development/SONARCLOUD.md) for quality metrics

---

## 📊 Project Quality Standards

This project enforces **strictest quality standards**:

| Category        | Standard                       | Enforcement         |
| --------------- | ------------------------------ | ------------------- |
| **TypeScript**  | Strict mode + additional flags | `npm run typecheck` |
| **ESLint**      | 5 plugins, strict type-checked | `npm run lint`      |
| **Stylelint**   | Standard SCSS + property order | `npm run lint:css`  |
| **Testing**     | Unit + E2E coverage            | `npm run test`      |
| **Performance** | 100 Lighthouse score           | CI/CD gates         |
| **Dead Code**   | Zero tolerance                 | Knip analysis       |

---

## 🔧 Technology Stack

### Core Technologies

- **Static Site Generator:** [Eleventy](https://www.11ty.dev/) v3
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.x (strict mode)
- **Styling:** [SCSS](https://sass-lang.com/) + [LightningCSS](https://lightningcss.dev/)
- **AMP:** [Google AMP](https://amp.dev/) compliant HTML

### Testing & Quality

- **Unit Testing:** [Vitest](https://vitest.dev/) with V8 coverage
- **E2E Testing:** [Cypress](https://www.cypress.io/) with accessibility audits
- **Performance:** [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- **Code Quality:** [SonarCloud](https://sonarcloud.io/)
- **Dead Code:** [Knip](https://knip.dev/)

### CI/CD

- **Platform:** GitHub Actions
- **Architecture:** Split + Reusable workflows
- **Deployment:** Cloudflare Pages

---

## 📝 Documentation Standards

All documentation follows these conventions:

1. **Markdown format** with proper heading hierarchy
2. **Code examples** with syntax highlighting
3. **Tables** for structured information
4. **Emoji** for visual hierarchy (sparingly)
5. **Links** to related documentation

### File Naming

- `README.md` - Directory index files
- `UPPERCASE.md` - Primary documentation
- `lowercase.md` - Supporting documentation

---

## 🆘 Getting Help

- **Issues:** [GitHub Issues](https://github.com/syafiqhadzir/syafiqhadzir.github.io/issues)
- **Discussions:**
  [GitHub Discussions](https://github.com/syafiqhadzir/syafiqhadzir.github.io/discussions)
- **Security:** See [SECURITY.md](../SECURITY.md)

---

_Last updated: 2026-01-07_
