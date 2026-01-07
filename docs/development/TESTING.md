# 🧪 Testing Guide

Comprehensive testing documentation for unit, E2E, and performance testing.

## Overview

This project maintains **strict testing standards** across multiple layers:

| Layer       | Framework     | Purpose                          |
| ----------- | ------------- | -------------------------------- |
| Unit        | Vitest        | Isolated function/module testing |
| E2E         | Cypress       | Full browser integration testing |
| Performance | Lighthouse CI | Performance, accessibility, SEO  |
| Visual      | Cypress       | Regression testing (optional)    |

---

## 🧪 Unit Testing (Vitest)

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run with coverage
npm run test:unit:coverage

# Watch mode (development)
npm run test:unit:watch
```

### Test Location

Tests are located in `test/` directory, organized by source module:

```
test/
├── transforms/
│   ├── cssGuard.test.ts
│   └── htmlMinify.test.ts
├── filters/
│   ├── dateFormat.test.ts
│   └── readingTime.test.ts
└── lib/
    ├── imageOptimizer.test.ts
    └── lightningCss.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../src/module.js';

describe('Module Name', () => {
  describe('functionToTest()', () => {
    it('should handle expected input correctly', () => {
      const result = functionToTest('input');
      expect(result).toBe('expectedOutput');
    });

    it('should handle edge cases', () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

### Coverage Requirements

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 80%       |
| Branches   | 80%       |
| Functions  | 80%       |
| Lines      | 80%       |

---

## 🌐 E2E Testing (Cypress)

### Running Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open

# Run specific test file
npm run test:smoke
npm run test:a11y
npm run test:seo
npm run test:security
npm run test:perf
```

### Test Location

E2E tests are in `cypress/e2e/`:

```
cypress/
├── e2e/
│   ├── smoke.cy.ts        # Basic functionality
│   ├── a11y.cy.ts         # Accessibility checks
│   ├── seo.cy.ts          # SEO validation
│   ├── security-headers.cy.ts
│   └── performance.cy.ts
├── fixtures/              # Test data
├── support/               # Custom commands
└── reports/               # Generated reports
```

### Writing E2E Tests

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/page');
  });

  it('should display expected content', () => {
    cy.get('[data-cy="element"]').should('be.visible').and('contain', 'Expected Text');
  });

  it('should handle user interaction', () => {
    cy.get('[data-cy="button"]').click();
    cy.get('[data-cy="result"]').should('exist');
  });
});
```

### Custom Commands

Located in `cypress/support/commands.ts`:

```typescript
// Usage: cy.checkA11y()
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y(null, {
    runOnly: ['wcag2a', 'wcag2aa'],
  });
});
```

---

## ⚡ Performance Testing

### Lighthouse CI

```bash
# Run Lighthouse CI locally
npm run perf:ci

# View results
# Results are stored in .lighthouseci/
```

### Performance Budgets

Defined in `perf-budgets.json`:

```json
{
  "resourceSizes": [
    { "resourceType": "document", "budget": 50 },
    { "resourceType": "stylesheet", "budget": 75 },
    { "resourceType": "font", "budget": 100 }
  ],
  "resourceCounts": [{ "resourceType": "third-party", "budget": 5 }]
}
```

### Lighthouse Thresholds

Enforced via `lighthouserc.cjs`:

| Category       | Score  |
| -------------- | ------ |
| Performance    | ≥ 0.95 |
| Accessibility  | ≥ 0.99 |
| Best Practices | ≥ 0.95 |
| SEO            | ≥ 0.95 |

---

## 🔍 Accessibility Testing

### Automated Testing

```bash
# Run accessibility tests
npm run test:a11y
```

Uses **axe-core** via Cypress for WCAG 2.1 AA compliance.

### Manual Testing

1. **Keyboard Navigation:** Tab through all interactive elements
2. **Screen Reader:** Test with NVDA/VoiceOver
3. **Color Contrast:** Verify 4.5:1 ratio for text
4. **Focus Indicators:** Ensure visible focus states

---

## ✅ AMP Validation

### Running Validation

```bash
# Validate AMP compliance
npm run validate:amp

# Validate after build
npm run validate:amp:build
```

### Common AMP Issues

| Issue           | Solution                      |
| --------------- | ----------------------------- |
| CSS > 75KB      | Reduce/split stylesheets      |
| Invalid tag     | Use AMP equivalents (amp-img) |
| External script | Remove or use amp-script      |
| Inline style    | Move to `<style amp-custom>`  |

---

## 📊 Test Reporting

### Unit Test Coverage

Coverage reports are generated in `coverage/`:

```bash
npm run test:unit:coverage
# Open coverage/index.html in browser
```

### E2E Reports

Cypress generates reports in `cypress/reports/`:

- HTML report (Mochawesome)
- Screenshots on failure
- Videos of test runs

### SonarCloud Integration

Unit test coverage is uploaded to SonarCloud:

```bash
npm run sonar:prepare
npm run sonar
```

---

## 🔧 Test Configuration

### Vitest Config

Located in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

### Cypress Config

Located in `cypress.config.ts`:

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
  },
});
```

---

## 🎯 Test Best Practices

### General

1. **Descriptive names:** Test names should explain the behavior
2. **Single responsibility:** One assertion per test when possible
3. **Independence:** Tests should not depend on each other
4. **Deterministic:** Tests should produce consistent results

### Unit Tests

1. **Mock external dependencies:** Don't make real API calls
2. **Cover edge cases:** Empty inputs, nulls, limits
3. **Test error handling:** Ensure proper error messages

### E2E Tests

1. **Use data-cy attributes:** Stable selectors
2. **Wait for elements:** Use Cypress waiters
3. **Test user flows:** Focus on real user scenarios
4. **Avoid flaky tests:** Add proper assertions

---

## 🚨 CI/CD Integration

### PR Validation

Fast tests run on every PR:

- Unit tests
- Type checking
- Linting

### Nightly Quality

Full test suite runs nightly:

- E2E tests
- Accessibility audit
- Performance budget check
- Smoke tests

### Pre-Deploy

Before deployment:

- Full Lighthouse audit
- AMP validation
- Link checking

---

## 📚 Related Documentation

- [Development Guide](README.md) - Setup and configuration
- [SonarCloud](SONARCLOUD.md) - Code quality monitoring
- [API Reference](../API.md) - Module documentation

---

_Last updated: 2026-01-07_
