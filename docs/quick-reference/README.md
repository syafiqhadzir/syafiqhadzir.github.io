# ⚡ Quick Reference

Command cheat sheets and quick references for common tasks.

## 🚀 Most Used Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Serve built site
npm run serve
```

### Quality Checks

```bash
# Run all checks (lint + typecheck + test)
npm run check

# Lint only
npm run lint

# Type check only
npm run typecheck

# Unit tests only
npm run test:unit
```

### Testing

```bash
# All tests
npm run test

# Unit tests with coverage
npm run test:unit:coverage

# E2E tests (headless)
npm run test:e2e

# E2E tests (UI mode)
npm run test:e2e:open

# Specific test suites
npm run test:smoke
npm run test:a11y
npm run test:seo
```

---

## 📋 Full Command Reference

### Build Commands

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run build`      | Build site (includes prebuild)      |
| `npm run build:prod` | Production build with optimizations |
| `npm run build:sw`   | Build service worker                |
| `npm run compile:ts` | Compile TypeScript only             |
| `npm run clean`      | Clean generated files               |

### Development Commands

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Development server with hot reload |
| `npm run serve` | Serve built site                   |

### Lint Commands

| Command             | Description           |
| ------------------- | --------------------- |
| `npm run lint`      | ESLint + Stylelint    |
| `npm run lint:js`   | ESLint only           |
| `npm run lint:css`  | Stylelint only        |
| `npm run lint:deps` | Dependency cruiser    |
| `npm run typecheck` | TypeScript type check |

### Test Commands

| Command                      | Description            |
| ---------------------------- | ---------------------- |
| `npm run test`               | All tests (unit + e2e) |
| `npm run test:unit`          | Vitest unit tests      |
| `npm run test:unit:coverage` | With coverage          |
| `npm run test:unit:watch`    | Watch mode             |
| `npm run test:e2e`           | Cypress E2E            |
| `npm run test:e2e:open`      | Cypress UI             |

### Validation Commands

| Command                   | Description     |
| ------------------------- | --------------- |
| `npm run validate`        | All validations |
| `npm run validate:amp`    | AMP compliance  |
| `npm run validate:schema` | Structured data |
| `npm run check:html`      | HTML validation |
| `npm run check:links`     | Link checker    |

### Housekeeping Commands

| Command                     | Description    |
| --------------------------- | -------------- |
| `npm run housekeeping`      | Full audit     |
| `npm run housekeeping:knip` | Dead code only |

### Docker Commands

| Command                | Description   |
| ---------------------- | ------------- |
| `npm run docker:build` | Build image   |
| `npm run docker:run`   | Run container |
| `npm run docker:test`  | Smoke test    |

### Performance Commands

| Command           | Description   |
| ----------------- | ------------- |
| `npm run perf:ci` | Lighthouse CI |

---

## 🔧 Git Workflow

### Daily Workflow

```bash
# Start new feature
git checkout -b feature/name

# Make changes, then commit
git add .
git commit -m "feat: description"

# Push for PR
git push origin feature/name
```

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance

---

## 📁 Key File Locations

### Configuration

| File                  | Purpose                  |
| --------------------- | ------------------------ |
| `package.json`        | Dependencies and scripts |
| `tsconfig.json`       | TypeScript config        |
| `eslint.config.js`    | ESLint config            |
| `stylelint.config.js` | Stylelint config         |
| `eleventy.config.js`  | Eleventy config          |

### Source Code

| Directory         | Content               |
| ----------------- | --------------------- |
| `src/config/`     | Configuration modules |
| `src/filters/`    | Eleventy filters      |
| `src/lib/`        | Core libraries        |
| `src/shortcodes/` | Eleventy shortcodes   |
| `src/transforms/` | Output transforms     |
| `src/scss/`       | Stylesheets           |
| `src/pages/`      | Page templates        |

### Testing

| Directory  | Content    |
| ---------- | ---------- |
| `test/`    | Unit tests |
| `cypress/` | E2E tests  |

---

## 🆘 Troubleshooting Quick Fixes

### Build Fails

```bash
npm run clean
npm ci
npm run build
```

### Tests Fail

```bash
# Unit tests
npm run test:unit -- --reporter=verbose

# E2E tests
npm run test:e2e:open
```

### Lint Errors

```bash
# Auto-fix
npm run lint

# See details
npm run lint:js -- --no-fix
```

---

## 🔗 Related Documentation

- [Development Guide](../development/README.md)
- [Testing Guide](../development/TESTING.md)
- [Troubleshooting](TROUBLESHOOTING.md)

---

_Last updated: 2026-01-07_
