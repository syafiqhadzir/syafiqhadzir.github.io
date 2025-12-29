# Testing Guide

> **Comprehensive guide to testing strategies, tools, and requirements**

[🏠 Home](../../README.md) / [📚 Docs](../README.md) / [Development](README.md) / Testing

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Unit Testing (Vitest)](#unit-testing-vitest)
- [E2E Testing (Cypress)](#e2e-testing-cypress)
- [Performance Testing (Lighthouse)](#performance-testing-lighthouse)
- [Coverage Requirements](#coverage-requirements)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

This project enforces strict quality gates with comprehensive test coverage:

- **Zero-defect mindset** - All code must be tested before merge
- **Fast feedback** - Unit tests run in < 10 seconds
- **Real-world validation** - E2E tests verify user workflows
- **Performance accountability** - Lighthouse enforces 100/100 scores

---

## Test Types

### Unit Tests

- **Tool:** Vitest
- **Coverage:** 80% minimum (statements, branches, functions, lines)
- **Speed:** < 10 seconds for full suite
- **Purpose:** Test individual functions, modules, and transforms

### End-to-End (E2E) Tests

- **Tool:** Cypress
- **Browser:** Chrome (headless in CI)
- **Purpose:** Test complete user workflows and accessibility

### Performance Tests

- **Tool:** Lighthouse CI
- **Threshold:** 100/100 for all metrics
- **Purpose:** Enforce performance budgets and best practices

### Integration Tests

- **Approach:** Build validation
- **Purpose:** Ensure AMP compliance and output correctness

### Visual Regression Tests

- **Tool:** Cypress Image Snapshot
- **Approach:** Pixel-by-pixel comparison
- **Purpose:** Prevent UI regressions and layout shifts
- **Commands:** `npm run test:visual` (Base), `npm run test:visual:verify` (Regression)

---

---

## Visual Regression Testing

We use pixel-diffing to catch unintentional UI changes.

### Workflow

1.  **Generate Base Snapshots:** Run this when UI changes are intentional and approved.

    ```bash
    npm run test:visual
    ```

    _Snapshots are saved to `cypress/snapshots/base`._

2.  **Verify Against Base:** Run this in CI or locally to check for regressions.

    ```bash
    npm run test:visual:verify
    ```

    _Failures generate diff images in `cypress/snapshots/diff`._

### Best Practices

- **Stable Environment:** Tests run against a local server (`npm run serve`) to ensure consistent
  data/fonts.
- **Viewport Specific:** Snapshots are generated for both Desktop (1280x720) and Mobile (375x667).
- **Threshold:** A small threshold (0.1) is allowed for anti-aliasing differences.

---

## Unit Testing (Vitest)

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit:coverage

# Watch mode (interactive)
npm run test:unit:watch
```

### Test Structure

```typescript
// test/filters/dateFormat.test.ts
import { describe, it, expect } from 'vitest';
import { dateFormat } from '../../src/filters/dateFormat';

describe('dateFormat filter', () => {
  it('formats dates in YYYY-MM-DD format', () => {
    const date = new Date('2025-12-23');
    expect(dateFormat(date)).toBe('2025-12-23');
  });

  it('handles invalid dates gracefully', () => {
    expect(dateFormat(new Date('invalid'))).toBe('Invalid Date');
  });
});
```

### What to Test

✅ **Test:**

- Pure functions with clear inputs/outputs
- Edge cases (null, undefined, empty strings)
- Error handling
- Public API surfaces

❌ **Don't Test:**

- Third-party library internals
- Simple getters/setters
- Trivial utility wrappers

### Coverage Configuration

Located in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov', 'html'],
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

### Excluded from Coverage

- Test files (`.test.ts`, `.spec.ts`)
- Configuration files (`vitest.config.ts`, `eleventy.config.js`)
- Type definitions (`.d.ts`)
- Build integration modules (`src/lib/`)

---

## E2E Testing (Cypress)

### Running E2E Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run specific test suite
npm run test:smoke    # Smoke tests only
npm run test:a11y     # Accessibility tests only

# Interactive mode (Cypress UI)
npm run test:e2e:open
```

### E2E Test Structure

```typescript
// cypress/e2e/smoke.cy.ts
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads successfully', () => {
    cy.get('h1').should('be.visible');
  });

  it('has valid AMP HTML', () => {
    cy.get('html').should('have.attr', 'amp');
  });
});
```

### Accessibility Testing

Using `cypress-axe` for automated a11y checks:

```typescript
// cypress/e2e/a11y.cy.ts
import 'cypress-axe';

describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('has no detectable a11y violations (WCAG AA)', () => {
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa'],
      },
    });
  });
});
```

### E2E Best Practices

✅ **Do:**

- Use `data-testid` attributes for selectors
- Test user workflows, not implementation
- Keep tests independent (no shared state)
- Use realistic test data

❌ **Don't:**

- Test third-party components
- Rely on brittle CSS selectors
- Create dependencies between tests
- Mock API calls (test real integration)

---

## Performance Testing (Lighthouse)

### Running Lighthouse

```bash
# Local audit (requires Chrome)
npm run perf:local

# CI audit (uses LHCI server)
npm run perf:ci
```

### Lighthouse Configuration

Located in `lighthouserc.cjs`:

```javascript
module.exports = {
  ci: {
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 1 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
  },
};
```

### Performance Budget

Defined in `perf-budgets.json`:

```json
{
  "budgets": [
    {
      "path": "/*",
      "resourceSizes": [
        { "resourceType": "document", "budget": 50 },
        { "resourceType": "stylesheet", "budget": 75 },
        { "resourceType": "script", "budget": 100 },
        { "resourceType": "image", "budget": 200 },
        { "resourceType": "total", "budget": 500 }
      ]
    }
  ],
  "thresholds": {
    "performance": 90,
    "accessibility": 95
  }
}
```

---

## Coverage Requirements

### Minimum Thresholds

| Metric            | Threshold | Enforced By |
| ----------------- | --------- | ----------- |
| Statements        | 80%       | Vitest      |
| Branches          | 80%       | Vitest      |
| Functions         | 80%       | Vitest      |
| Lines             | 80%       | Vitest      |
| New Code Coverage | 80%       | SonarCloud  |

### Viewing Coverage Reports

```bash
# Generate coverage report
npm run test:unit:coverage

# Open HTML report in browser
open coverage/index.html        # macOS
start coverage/index.html       # Windows
xdg-open coverage/index.html    # Linux
```

### LCOV Report

Coverage data is exported to `coverage/lcov.info` for SonarCloud ingestion.

See [SonarCloud Observability Guide](SONARCLOUD.md) for debugging coverage gaps.

---

## Running Tests

### Quick Test Commands

```bash
# Run everything (unit + E2E)
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Specific E2E suite
npm run test:smoke
npm run test:a11y

# With coverage
npm run test:unit:coverage

# Clean test artifacts
npm run test:clean
```

### CI Contexts

The CI pipeline runs different test suites depending on context:

**PR Validation:**

- ✅ Unit tests
- ❌ E2E tests (skipped for speed)

**Nightly Quality:**

- ✅ Unit tests
- ✅ E2E tests (smoke + a11y)
- ✅ SonarCloud scan

**Deployment:**

- ✅ Full build
- ✅ Lighthouse CI
- ❌ Unit/E2E (validated in previous steps)

---

## Writing Tests

### File Naming Conventions

```text
test/
├── filters/
│   └── dateFormat.test.ts     # Unit tests for src/filters/dateFormat.ts
├── transforms/
│   └── cssGuard.test.ts       # Unit tests for src/transforms/cssGuard.ts
└── scripts/
    └── housekeeping.test.ts   # Unit tests for scripts/housekeeping.ts

cypress/
└── e2e/
    ├── smoke.cy.ts            # Smoke tests
    ├── a11y.cy.ts             # Accessibility tests
    └── darkmode.cy.ts         # Feature-specific tests
```

### Test Patterns

#### Arrange-Act-Assert (AAA)

```typescript
it('should format date correctly', () => {
  // Arrange
  const input = new Date('2025-12-23');

  // Act
  const result = dateFormat(input);

  // Assert
  expect(result).toBe('2025-12-23');
});
```

#### Given-When-Then (BDD)

```typescript
describe('Date Formatter', () => {
  describe('given a valid date', () => {
    it('should return formatted string when called', () => {
      const date = new Date('2025-12-23');
      expect(dateFormat(date)).toBe('2025-12-23');
    });
  });

  describe('given an invalid date', () => {
    it('should return error message when called', () => {
      expect(dateFormat(new Date('invalid'))).toBe('Invalid Date');
    });
  });
});
```

### Mocking

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call console.log', () => {
    const logSpy = vi.spyOn(console, 'log');
    logger.info('test message');
    expect(logSpy).toHaveBeenCalledWith('test message');
  });
});
```

---

## CI/CD Integration

### Workflow Triggers

**`pr-validation.yml`**

- Runs on: Pull requests to `main`
- Tests: Unit tests only
- Duration: ~3 minutes

**`nightly-quality.yml`**

- Runs on: Daily at midnight UTC, manual dispatch
- Tests: Unit + E2E (smoke, a11y) + SonarCloud
- Duration: ~10 minutes

**`deploy.yml`**

- Runs on: Version tags (`v*`)
- Tests: Lighthouse CI
- Duration: ~5 minutes

### Debugging Test Failures in CI

1. **Check workflow logs:**
   - Go to Actions tab
   - Click failed run
   - Expand failed step

2. **Download test artifacts:**
   - Scroll to bottom of run page
   - Download `cypress-screenshots` (if E2E failed)
   - Download `sonarcloud-diagnostics` (if Sonar failed)

3. **Reproduce locally:**

   ```bash
   # Run exact same command from CI
   npm run test:e2e:ci
   ```

---

## Troubleshooting

### Unit Test Failures

**Issue:** Tests pass locally but fail in CI

```bash
# Ensure clean install
rm -rf node_modules package-lock.json
npm ci
npm run test:unit
```

**Issue:** Coverage threshold not met

```bash
# Generate coverage report
npm run test:unit:coverage

# Open HTML report to see uncovered lines
open coverage/index.html
```

### E2E Test Failures

**Issue:** Cypress can't connect to server

```bash
# Ensure build succeeded
npm run build

# Start server in separate terminal
npm run serve

# Run E2E tests
npm run test:e2e
```

**Issue:** Accessibility violations

View Cypress console output for specific violations:

- Selector of failing element
- WCAG guideline violated
- Severity level

### Performance Test Failures

**Issue:** Lighthouse score < 100

```bash
# Run local audit for detailed report
npm run perf:local

# Check specific audit failures
# Common issues: unused CSS, large images, blocking scripts
```

---

## Related Documentation

- **[Development Guide](README.md)** - Development setup and workflows
- **[SonarCloud Observability](SONARCLOUD.md)** - Coverage debugging and quality gates
- **[Scripts README](../../scripts/README.md)** - CLI test utilities

---

## External Resources

- [Vitest Documentation](https://vitest.dev/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Lighthouse Performance Budgets](https://web.dev/performance-budgets-101/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated:** 2025-12-23

[↑ Back to Top](#testing-guide)
