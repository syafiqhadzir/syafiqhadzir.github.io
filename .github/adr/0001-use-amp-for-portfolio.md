# ADR-0001: Use AMP for Portfolio Site

## Status

Accepted

## Context

When building the portfolio site, we needed to choose between:

1. Traditional HTML/CSS/JS with custom optimizations
2. A JavaScript framework (Next.js, Astro, etc.)
3. Google AMP (Accelerated Mobile Pages)

Key requirements:

- Maximum performance (Lighthouse 100/100)
- Minimal JavaScript
- SEO optimization
- Fast time-to-interactive

## Decision

Use Google AMP as the foundation for the portfolio site, built with Eleventy as the static site
generator.

## Consequences

### Positive

- Guaranteed performance (AMP enforces best practices)
- Pre-cached on Google's CDN
- Excellent Core Web Vitals scores
- Forced simplicity (no heavy JS frameworks)
- SEO benefits from AMP validation

### Negative

- Limited JavaScript capabilities (amp-script constraints)
- Requires AMP-specific components for interactivity
- Some CSS limitations (inline styles only)
- Learning curve for AMP-specific syntax

### Neutral

- Theme toggle requires amp-bind instead of vanilla JS
- Analytics requires amp-analytics instead of gtag.js
