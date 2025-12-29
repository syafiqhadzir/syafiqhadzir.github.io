# Architecture

This document describes the architecture and build pipeline of the syafiqhadzir.github.io portfolio.

## Overview

```
┌─────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Nunjucks  │ -> │   Eleventy  │ -> │  HTML Output │ -> │  _site/     │
│  Templates  │    │     SSG     │    │  + Inline    │    │  Deploy     │
└─────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────┐
         │        CSS Pipeline (compiledCSS)      │
         │                                        │
         │  SCSS -> PostCSS -> LightningCSS ->   │
         │  Inline <style amp-custom>            │
         └────────────────────────────────────────┘
```

## Build Pipeline

### 1. CSS Compilation

```
src/scss/main.scss
       │
       ▼ Dart Sass (sass.compile)
       │
    CSS String
       │
       ▼ PostCSS + Autoprefixer
       │
    Prefixed CSS
       │
       ▼ LightningCSS (minify + targets)
       │
    Minified CSS (< 75KB for AMP)
       │
       ▼ cssGuard Transform
       │
    Inline in HTML <style amp-custom>
```

### 2. HTML Processing

```
_includes/layouts/base.njk
       │
       ▼ Eleventy (Nunjucks)
       │
    HTML with {{ compiledCSS }}
       │
       ▼ cssGuard Transform (size validation)
       │
       ▼ htmlMinify Transform (production)
       │
    Final AMP HTML
```

### 3. Service Worker

```
workbox-config.cjs
       │
       ▼ Workbox generateSW
       │
    sw.js (precaching + runtime)
```

## Directory Structure

```
.
├── _includes/          # Nunjucks templates
│   ├── layouts/        # Base layouts (base.njk)
│   └── partials/       # Reusable components
├── src/
│   ├── config/         # Shared configuration
│   ├── filters/        # Eleventy filters (dateFormat, readingTime)
│   ├── pages/          # Page templates (.njk)
│   ├── scss/           # Stylesheets (7-1 architecture)
│   ├── shortcodes/     # Eleventy shortcodes (ampImg)
│   └── transforms/     # HTML transforms (cssGuard, htmlMinify)
├── scripts/            # Build & maintenance scripts
├── test/               # Unit tests (Vitest)
└── cypress/            # E2E tests
```

## Key Design Decisions

See [ADR directory](.github/adr/) for architectural decisions:

- [ADR-0001](/.github/adr/0001-use-amp-for-portfolio.md): Use AMP for performance
- [ADR-0002](/.github/adr/0002-eleventy-as-ssg.md): Eleventy as SSG
- [ADR-0003](/.github/adr/0003-visual-regression-testing.md): Visual regression with Cypress

## Performance Constraints

| Constraint             | Limit  | Enforced By        |
| ---------------------- | ------ | ------------------ |
| CSS Size               | 75 KB  | cssGuard transform |
| Total Bundle           | 150 KB | perf-budgets.json  |
| First Contentful Paint | < 1.5s | Lighthouse CI      |

## CI/CD Pipeline

```
Push to main
     │
     ▼
┌─────────────────────────────────────────┐
│  ci.yml                                 │
│  ├─ lint (ESLint + Stylelint)          │
│  ├─ security (npm audit)               │
│  ├─ housekeeping (Knip)                │
│  ├─ test-unit (Vitest + coverage)      │
│  ├─ build (Eleventy + AMP validate)    │
│  └─ test-e2e (Cypress)                 │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  release.yml (semantic-release)        │
│  ├─ Analyze commits                    │
│  ├─ Generate changelog                 │
│  ├─ Create GitHub release              │
│  └─ Trigger deploy                     │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  deploy.yml (GitHub Pages)             │
└─────────────────────────────────────────┘
```
