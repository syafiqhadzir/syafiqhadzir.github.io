# 🔧 Development Guide

Complete guide for setting up and developing on this project.

## Prerequisites

### Required Software

| Software | Version | Purpose             |
| -------- | ------- | ------------------- |
| Node.js  | 24.x    | Runtime environment |
| npm      | 10.x    | Package manager     |
| Git      | Latest  | Version control     |

### Recommended Tools

| Tool    | Purpose                                 |
| ------- | --------------------------------------- |
| VS Code | Recommended IDE with project settings   |
| Docker  | Container-based development and testing |

---

## 🚀 Quick Setup

### 1. Clone Repository

```bash
git clone https://github.com/syafiqhadzir/syafiqhadzir.github.io.git
cd syafiqhadzir.github.io
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Prepare Git Hooks

```bash
npm run prepare
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:8080`

---

## 📁 Project Structure

```
syafiqhadzir.github.io/
├── .github/                 # CI/CD workflows and actions
│   ├── actions/            # Reusable composite actions
│   └── workflows/          # GitHub Actions workflows
├── src/                    # Source code
│   ├── config/             # Configuration modules
│   │   ├── constants.ts    # Centralized constants
│   │   ├── browserTargets.ts
│   │   ├── projectPaths.ts
│   │   └── index.ts
│   ├── filters/            # Eleventy filters
│   │   ├── dateFormat.ts
│   │   └── readingTime.ts
│   ├── lib/                # Core libraries
│   │   ├── imageOptimizer.ts
│   │   └── lightningCss.ts
│   ├── shortcodes/         # Eleventy shortcodes
│   │   ├── ampImg.ts
│   │   └── chessBoard.ts
│   ├── transforms/         # Output transforms
│   │   ├── cssGuard.ts
│   │   └── htmlMinify.ts
│   ├── types/              # TypeScript definitions
│   ├── pages/              # Page templates (Nunjucks)
│   └── scss/               # Stylesheets
├── test/                   # Unit tests (Vitest)
├── cypress/                # E2E tests (Cypress)
├── scripts/                # CLI utilities
├── docs/                   # Documentation
├── _includes/              # Template partials
├── _site/                  # Built output (generated)
└── dist/                   # Compiled TypeScript (generated)
```

---

## 🛠️ Development Workflow

### Daily Development

```bash
# Start dev server with hot reload
npm run dev

# Run all quality checks
npm run check

# Build for production
npm run build
```

### Before Committing

```bash
# Run full quality check
npm run check

# Format code (auto-fixed by lint)
npm run lint

# Verify types
npm run typecheck
```

### Git Hooks (Automatic)

The project uses **Husky** for Git hooks:

| Hook         | Action                               |
| ------------ | ------------------------------------ |
| `pre-commit` | Lint staged files (lint-staged)      |
| `commit-msg` | Validate commit message (commitlint) |
| `pre-push`   | Run full test suite                  |

---

## 📜 Available Scripts

### Core Commands

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run serve` | Serve built site         |
| `npm run clean` | Clean generated files    |

### Quality Assurance

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run lint`      | Run ESLint + Stylelint   |
| `npm run typecheck` | TypeScript type checking |
| `npm run test`      | Run all tests            |
| `npm run test:unit` | Unit tests (Vitest)      |
| `npm run test:e2e`  | E2E tests (Cypress)      |
| `npm run check`     | Full quality gate        |

### Validation

| Command                   | Description              |
| ------------------------- | ------------------------ |
| `npm run validate:amp`    | Validate AMP compliance  |
| `npm run validate:schema` | Validate structured data |
| `npm run check:html`      | Validate HTML            |
| `npm run check:links`     | Check for broken links   |

### Housekeeping

| Command                     | Description                   |
| --------------------------- | ----------------------------- |
| `npm run housekeeping`      | Full dead code analysis       |
| `npm run housekeeping:knip` | Knip analysis only            |
| `npm run lint:deps`         | Dependency architecture check |

### Docker

| Command                | Description          |
| ---------------------- | -------------------- |
| `npm run docker:build` | Build Docker image   |
| `npm run docker:run`   | Run container        |
| `npm run docker:test`  | Smoke test container |

---

## 🏗️ Build Pipeline

### TypeScript Compilation

```bash
npm run compile:ts
```

This compiles source TypeScript to `dist/` for Eleventy consumption.

### Eleventy Build

```bash
npm run build
```

This runs prebuild (compile:ts) then Eleventy to generate `_site/`.

### Production Build

```bash
npm run build:prod
```

Full production build with optimizations and size reporting.

---

## ⚙️ Configuration Files

### TypeScript

| File                   | Purpose                              |
| ---------------------- | ------------------------------------ |
| `tsconfig.json`        | Main TypeScript config (strict mode) |
| `tsconfig.eslint.json` | ESLint parser config                 |

### Linting

| File                  | Purpose                             |
| --------------------- | ----------------------------------- |
| `eslint.config.js`    | ESLint flat config (strictest mode) |
| `stylelint.config.js` | Stylelint config (SCSS + order)     |
| `.prettierrc.json`    | Prettier formatting rules           |
| `.markdownlint.json`  | Markdown linting rules              |

### Build

| File                 | Purpose                   |
| -------------------- | ------------------------- |
| `eleventy.config.js` | Eleventy configuration    |
| `postcss.config.js`  | PostCSS plugins           |
| `workbox-config.cjs` | Service Worker generation |

### Quality

| File                       | Purpose                 |
| -------------------------- | ----------------------- |
| `knip.config.ts`           | Dead code analysis      |
| `.dependency-cruiser.cjs`  | Architecture validation |
| `lighthouserc.cjs`         | Lighthouse CI config    |
| `sonar-project.properties` | SonarCloud config       |

---

## 🧱 Constants Module

All magic numbers and shared values are centralized in `src/config/constants.ts`:

```typescript
import { CSS_LIMITS, IMAGE_SCALES, COMMON } from './config/constants.js';

// Example usage
const maxCssSize = CSS_LIMITS.MAX_SIZE_BYTES; // 75 * 1024
const retinaScale = IMAGE_SCALES.RETINA; // 1.5
const bytesPerKb = COMMON.BYTES_PER_KB; // 1024
```

### Available Constant Groups

| Group               | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `IMAGE_SCALES`      | Image resolution multipliers (1x, 1.5x, 2x) |
| `CSS_LIMITS`        | AMP CSS size limits (75KB)                  |
| `COMMON`            | Reusable numeric values                     |
| `TIME`              | Time-related constants                      |
| `BROWSER_TARGETS`   | Compilation browser targets                 |
| `COMPLEXITY_LIMITS` | Linting thresholds                          |
| `CSS_CONSTRAINTS`   | Stylelint rule values                       |

---

## 🔍 Debugging

### VS Code Launch Configs

The project includes VS Code launch configurations in `.vscode/launch.json`.

### Browser DevTools

1. Start dev server: `npm run dev`
2. Open browser DevTools (F12)
3. Check Console for errors
4. Use Network tab for performance analysis

### TypeScript Errors

```bash
# Check for type errors
npm run typecheck

# With verbose output
npx tsc --noEmit --pretty
```

---

## 📚 Related Documentation

- [Testing Guide](TESTING.md) - Comprehensive testing documentation
- [SonarCloud](SONARCLOUD.md) - Code quality monitoring
- [Style Guide](../STYLE_GUIDE.md) - Coding conventions
- [API Reference](../API.md) - Module documentation

---

_Last updated: 2026-01-07_
