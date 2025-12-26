# ADR-0002: Eleventy as Static Site Generator

## Status

Accepted

## Context

After deciding on AMP, we needed a static site generator that could:

1. Generate valid AMP HTML
2. Support templating (Nunjucks)
3. Allow custom transforms (HTML minification, CSS injection)
4. Be fast and lightweight

Options considered:

- Jekyll (Ruby-based, familiar but slow)
- Hugo (Go-based, fast but less flexible)
- Eleventy (Node.js, flexible and fast)
- Astro (Modern, but opinionated about islands)

## Decision

Use Eleventy (11ty) as the static site generator with:

- Nunjucks templating
- Custom filters (dateFormat, readingTime)
- Custom transforms (cssGuard, htmlMinify)
- LightningCSS for SCSS compilation

## Consequences

### Positive

- Full control over HTML output (essential for AMP)
- JavaScript ecosystem (shared tooling with tests)
- Fast builds (~1 second for 27 pages)
- Easy custom transforms integration

### Negative

- Less batteries-included than Astro
- Requires manual TypeScript compilation for filters
- Configuration is JavaScript (not type-safe)

### Neutral

- Learning curve similar to other SSGs
