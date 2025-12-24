# ADR-001: Eleventy as Static Site Generator

## Status

Accepted

## Date

2025-12-21

## Context

Need a static site generator that supports:

- AMP HTML output
- Custom transforms and filters
- TypeScript compilation
- Fast builds

## Decision

Use Eleventy 3.0+ as the static site generator.

## Consequences

### Positive

- Native support for Nunjucks templating
- Extensible transform pipeline
- Fast incremental builds
- Active community and ecosystem

### Negative

- Requires custom TypeScript compilation step
- Less opinionated than Next.js (more configuration needed)

---

# ADR-002: Sass 7-1 Architecture

## Status

Accepted

## Date

2025-12-24

## Context

Need a scalable CSS architecture that:

- Supports design tokens
- Enables component-based styling
- Works with AMP's inline CSS requirement
- Maintains small bundle size (<75KB)

## Decision

Implement the 7-1 Sass pattern with:

- `abstracts/`: Functions, mixins, tokens
- `base/`: Reset, typography, print
- `components/`: UI components
- `utilities/`: Helper classes

Use CSS custom properties for runtime theming.

## Consequences

### Positive

- Clear separation of concerns
- Easy to maintain and extend
- Works with any tooling
- Supports dark mode via CSS variables

### Negative

- More files to manage
- Requires understanding of Sass modules

---

# ADR-003: Vitest for Unit Testing

## Status

Accepted

## Date

2025-12-21

## Context

Need a testing framework that:

- Supports TypeScript natively
- Integrates with SonarCloud
- Has fast execution

## Decision

Use Vitest with V8 coverage provider.

## Consequences

### Positive

- Native ESM support
- Fast parallel test execution
- Compatible with Jest API
- Built-in TypeScript support

### Negative

- Newer ecosystem than Jest

---

# ADR-004: GitHub Actions for CI/CD

## Status

Accepted

## Date

2025-12-21

## Context

Need CI/CD that:

- Integrates with GitHub
- Supports matrix builds
- Enables automated releases

## Decision

Use GitHub Actions with:

- PR validation workflow
- Nightly quality workflow
- Semantic release workflow

## Consequences

### Positive

- Native GitHub integration
- Free for public repositories
- Extensive marketplace

### Negative

- Vendor lock-in to GitHub
