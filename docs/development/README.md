# Development Guide

> **Complete guide for local development, testing, and contributing to this project**

[🏠 Home](../../README.md) / [📚 Docs](../README.md) / Development

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Build System](#build-system)
- [Quality Gates](#quality-gates)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure you have the following installed:

- **Node.js:** v24.0.0 or higher
- **npm:** v10.0.0 or higher
- **Git:** Latest stable version
- **Chrome:** For Lighthouse and E2E testing (Cypress)

### Verify Installation

```bash
node --version  # Should be v24.x or higher
npm --version   # Should be v10.x or higher
git --version
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/syafiqhadzir/syafiqhadzir.github.io.git
cd syafiqhadzir.github.io
```

### 2. Install Dependencies

```bash
# Clean install (recommended for consistency)
npm ci

# Or regular install
npm install
```

### 3. Setup Git Hooks

```bash
# Install Husky pre-commit hooks
npm run prepare
```

This configures:

- **Pre-commit:** Runs linting on staged files via `lint-staged`
- **Commit-msg:** Validates commit message format (Conventional Commits)

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

- Starts Eleventy with hot-reload
- Compiles TypeScript files
- Watches for changes in `src/`, `_includes/`
- Available at `http://localhost:8080`

### Making Changes

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** to source files

3. **Test locally:**

   ```bash
   npm run lint        # Check code style
   npm run typecheck   # Verify TypeScript
   npm run test:unit   # Run unit tests
   ```

4. **Commit using Conventional Commits:**

   ```bash
   git commit -m "feat: add dark mode toggle"
   # Or: fix:, docs:, chore:, test:, refactor:
   ```

5. **Push and open PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Project Structure

```
syafiqhadzir.github.io/
├── .github/
│   ├── actions/
│   │   └── bootstrap-env/     # Reusable composite action
│   └── workflows/             # CI/CD pipelines
│       ├── pr-validation.yml  # Fast PR checks
│       ├── nightly-quality.yml # Deep quality audit
│       └── deploy.yml         # Production deployment
│
├── src/
│   ├── filters/               # Nunjucks filters (TS)
│   │   ├── dateFormat.ts
│   │   └── readingTime.ts
│   ├── lib/                   # Build utilities
│   │   ├── lightningCss.ts
│   │   └── svgoOptimize.ts
│   ├── shortcodes/            # Nunjucks shortcodes
│   │   └── ampImg.ts
│   └── transforms/            # Output transforms
│       ├── cssGuard.ts        # AMP CSS validator
│       ├── extremeMinify.ts   # Production minifier
│       └── htmlMinify.ts      # HTML compression
│
├── test/                      # Unit tests (Vitest)
├── cypress/                   # E2E tests
├── scripts/                   # CLI utilities
│   ├── housekeeping.ts        # Maintenance scripts
│   ├── validate-amp.ts        # AMP validation
│   └── parse-sonar-log.sh     # SonarCloud diagnostics
│
├── _includes/                 # Nunjucks templates
├── docs/                      # Documentation
└── _site/                     # Build output (gitignored)
```

---

## Build System

### Development Build

```bash
npm run dev
```

Runs incremental builds with hot-reload.

### Production Build

```bash
npm run build:prod
```

Performs:

1. TypeScript compilation
2. Eleventy static site generation
3. Extreme minification (HTML, CSS, JS)
4. Size budget reporting

### Build Configuration

- **Eleventy Config:** `eleventy.config.js`
- **TypeScript:** `tsconfig.json`
- **Vitest:** `vitest.config.ts`
- **Cypress:** `cypress.config.ts`

---

## Quality Gates

All code must pass strict quality checks before merging.

### Linting

```bash
# JavaScript/TypeScript
npm run lint:js

# CSS/SCSS
npm run lint:css

# Both
npm run lint
```

**Standards:**

- ESLint with strict rules (SonarJS, Unicorn, Import)
- Stylelint with SCSS standard config
- Prettier for formatting

### Type Checking

```bash
npm run typecheck
```

**Requirements:**

- Strict mode enabled
- No `any` types allowed
- All exports strongly typed

### Testing

See the **[Testing Guide](TESTING.md)** for comprehensive testing documentation.

```bash
# Unit tests (Vitest)
npm run test:unit

# E2E tests (Cypress)
npm run test:e2e

# Coverage report
npm run test:unit:coverage
```

**Coverage Requirements:**

- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

### AMP Validation

```bash
npm run validate:amp
```

Verifies all HTML pages are valid Google AMP.

### Performance

```bash
npm run perf:local
```

Runs Lighthouse CI with strict budget:

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## CI/CD Pipeline

### PR Validation (`pr-validation.yml`)

**Triggers:** Pull requests to `main`

**Steps:**

1. Lint check (ESLint, Stylelint, Prettier)
2. Type check
3. Unit tests
4. Build dry-run (fast mode)

**SLA:** ~3 minutes

### Nightly Quality (`nightly-quality.yml`)

**Triggers:**

- Daily at midnight UTC
- Manual workflow dispatch

**Steps:**

1. Full build
2. E2E tests (Cypress smoke + a11y)
3. SonarCloud scan with verbose diagnostics
4. Artifact upload

**See:** [SonarCloud Observability Guide](SONARCLOUD.md)

### Deployment (`deploy.yml`)

**Triggers:** Version tags (`v*`)

**Steps:**

1. Full production build
2. Lighthouse CI audit
3. Deploy to GitHub Pages
4. Semantic release (CHANGELOG generation)

---

## Troubleshooting

### Build Failures

**Issue:** TypeScript compilation errors

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm ci
npm run compile:ts
```

**Issue:** Eleventy build fails

```bash
# Check for syntax errors in templates
npm run dev  # More verbose than build
```

### Test Failures

**Issue:** Unit tests fail locally

```bash
# Clear test cache
npm run test:clean
npm run test:unit
```

**Issue:** Cypress can't connect

```bash
# Ensure server is running
npm run serve &
npm run test:e2e
```

### Git Hooks Blocking Commits

**Issue:** Pre-commit hook fails

```bash
# Fix linting issues
npm run lint

# Or bypass (not recommended)
git commit --no-verify
```

---

## Related Documentation

- **[Testing Guide](TESTING.md)** - Comprehensive testing documentation
- **[SonarCloud Observability](SONARCLOUD.md)** - Quality monitoring and debugging
- **[Scripts README](../../scripts/README.md)** - CLI utility documentation
- **[CONTRIBUTING.md](../../CONTRIBUTING.md)** - Contribution guidelines

---

## External Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Google AMP Developer Guide](https://amp.dev/documentation/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

[↑ Back to Top](#development-guide)
