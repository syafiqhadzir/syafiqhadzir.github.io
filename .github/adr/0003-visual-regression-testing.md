# ADR-0003: Visual Regression Testing with Cypress

## Status

Accepted

## Context

As the portfolio evolved with AMP-compliant layouts and custom styling, we needed a way to detect
unintentional UI changes across deployments. Manual visual QA is error-prone and doesn't scale.

Options considered:

- Percy (Cloud-based, expensive for solo projects)
- Chromatic (Storybook-focused, not applicable)
- BackstopJS (Headless Chrome, separate tooling)
- Cypress Visual Regression Plugin (Integrates with existing E2E)

## Decision

Use `cypress-visual-regression` plugin for pixel-diffing with:

- Base snapshots stored in `cypress/snapshots/base`
- Diff images generated in `cypress/snapshots/diff`
- Desktop (1280x720) and Mobile (375x812) viewports
- 0.05 error threshold for anti-aliasing tolerance

## Consequences

### Positive

- Single test runner for E2E and visual tests
- No external service dependencies
- Fast local execution (~5s per snapshot)
- Git-tracked base snapshots for review

### Negative

- Snapshots are OS/browser-dependent (CI must match local)
- Large binary files in repository
- Threshold tuning may be needed for animations

### Neutral

- Requires `start-server-and-test` for reliable execution
