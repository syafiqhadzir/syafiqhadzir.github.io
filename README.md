# Syafiq Hadzir - Software QA Engineer

[![Nightly Quality](https://github.com/syafiqhadzir/syafiqhadzir.github.io/actions/workflows/nightly-quality.yml/badge.svg)](https://github.com/syafiqhadzir/syafiqhadzir.github.io/actions/workflows/nightly-quality.yml)
[![PR Validation](https://github.com/syafiqhadzir/syafiqhadzir.github.io/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/syafiqhadzir/syafiqhadzir.github.io/actions/workflows/pr-validation.yml)
[![Deploy Production](https://github.com/syafiqhadzir/syafiqhadzir.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/syafiqhadzir/syafiqhadzir.github.io/actions/workflows/deploy.yml)
[![Accessibility: WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-blue)](https://syafiqhadzir.dev)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=syafiqhadzir.github.io&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=syafiqhadzir.github.io)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0%201.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

High-performance portfolio website engineered with **Google AMP**, **Eleventy**, and **TypeScript**.
Designed for speed, accessibility, and zero-defect quality.

## 🚀 Features

- **Google AMP Compliant:** Valid AMP HTML for instant loading and SEO dominance.
- **Static Site Generation:** Built with Eleventy (v3) for optimal build-time rendering.
- **Progressive Web App:** Offline-first capability with Service Workers and obscure auditing.
- **Type-Safe:** 100% strict TypeScript codebase.
- **Advanced Minification:** Custom pipeline using `html-minifier-terser` and `lightningcss`.
- **Dark Mode:** System-preference aware with toggle switch.

## 🛠️ Tech Stack

- **Core:** [Eleventy](https://www.11ty.dev/) (SSG), [TypeScript](https://www.typescriptlang.org/)
- **Styles:** [SCSS](https://sass-lang.com/), [LightningCSS](https://lightningcss.dev/)
- **Testing:** [Vitest](https://vitest.dev/) (Unit), [Cypress](https://www.cypress.io/) (E2E)
- **Quality:** ESLint (Strict), Stylelint, SonarQube, Knip (Dead Code)
- **CI/CD:** GitHub Actions (Split + Reusable Architecture)
- **Performance:** Lighthouse CI (100/100 Enforcement)

## 🏁 Getting Started

### Prerequisites

- Node.js 24.x
- npm 10.x

### Installation

```bash
# Clone the repository
git clone https://github.com/syafiqhadzir/syafiqhadzir.github.io.git

# Install dependencies
npm ci

# Prepare Git hooks
npm run prepare
```

### Development Server

```bash
# Start local development server with hot reload
npm run dev
```

Visit `http://localhost:8080`.

## ✅ Testing & Quality

Strict quality gates are enforced via Husky hooks and CI pipelines.

```bash
# Unit Tests (Vitest)
npm run test:unit

# E2E Tests (Cypress)
npm run test:e2e

# Type Check
npm run typecheck

# Linting (ESLint + Stylelint)
npm run lint

# AMP Compliance Validation
npm run validate:amp
```

### Performance

We enforce a strict 100/100 Lighthouse score.

```bash
# Run local Lighthouse audit (requires Chrome)
npm run perf:local
```

## 🏗️ Architecture

### CI/CD Pipeline

Refactored into a modular "Split + Reusable" architecture:

- **PR Validation:** Fast feedback (Lint, Unit, Type Check).
- **Nightly Quality:** Deep audit (E2E, Sonar, A11y, Smoke).
- **Deployment:** Production release on `v*` tags with Lighthouse Gates.
- **Bootstrap:** Shared Composite Action (`.github/actions/bootstrap-env`) for consistent caching.

### Directory Structure

```
├── .github/            # CI/CD Workflows & Actions
├── src/
│   ├── _data/          # Global Data
│   ├── filters/        # Nunjucks Filters (TS)
│   ├── lib/            # Build Utilities
│   ├── transforms/     # Output Transforms (Minification)
│   └── ...
├── test/               # Unit Tests
├── cypress/            # End-to-End Tests
├── scripts/            # CLI utilities (Housekeeping, Validation)
└── docs/               # Documentation
```

## 📚 Documentation

Comprehensive guides for developers and contributors:

- **[📖 Documentation Hub](docs/README.md)** - Central navigation for all docs
- **[🔧 Development Guide](docs/development/README.md)** - Setup, workflows, and best practices
- **[🧪 Testing Guide](docs/development/TESTING.md)** - Unit, E2E, and performance testing
- **[🔍 SonarCloud Observability](docs/development/SONARCLOUD.md)** - Quality monitoring and
  debugging
- **[⚡ Quick References](docs/quick-reference/README.md)** - Command cheat sheets

See **[`/docs`](docs/)** for complete documentation.

## 🤝 Contributing

We welcome contributions! Please read our guides:

- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute
- **[Development Guide](docs/development/README.md)** - Development workflow and setup
- **[Testing Guide](docs/development/TESTING.md)** - Testing requirements and standards

**Quick steps:**

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Follow our [Testing Guide](docs/development/TESTING.md) - ensure all tests pass
4. Commit your Changes (follow [Conventional Commits](https://www.conventionalcommits.org/))
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📄 License

Distributed under the CC0-1.0 License. See `LICENSE` for more information.
