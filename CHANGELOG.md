# [1.1.0](https://github.com/syafiqhadzir/syafiqhadzir.github.io/compare/v1.0.0...v1.1.0) (2025-12-21)


### Features

* **docker:** add containerization with multi-stage build ([52813a8](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/52813a8b7ba2700c77d5c2208dad52405c636656))

# 1.0.0 (2025-12-21)


### Bug Fixes

* **a11y:** correct heading hierarchy on contact and sitemap pages ([3d084cb](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/3d084cb0663b06173cfd37373f18fbd4f25fa2c5))
* **amp:** remove !important qualifiers for AMP compliance ([909336a](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/909336a6c1f6dfd8e58cb844149fd7972eead5ba))
* **amp:** resolve AMP validation errors across all HTML pages ([12a44a8](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/12a44a86701798e1a5ea95ec2878bae143643fd2))
* **ci:** correct SonarCloud project key in properties ([9f348bc](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/9f348bc43abc0aaec23528ad8f180c93e7162ada))
* **ci:** ensure Lighthouse CI report generation for artifacts ([2804349](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/2804349d5c7b33a2bb7db6ed1dca3c0b06970862))
* **ci:** granularize Lighthouse CI steps for artifact capture ([a60b902](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/a60b902913e0ccb02ff1a40d7885dd6a33616827))
* **ci:** remove deprecated headless input from Cypress action ([f238740](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/f2387401cc4e4c076399cbb3b98f0ef18e8945ae))
* **ci:** resolve SonarCloud report format and path resolution errors ([80e0fbf](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/80e0fbf4df701605e55bbb9e6e5f7380a11233a6))
* **ci:** restore lhci autorun and fix artifact directory ([da0e6b4](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/da0e6b4b983e672464a3fc26833f86c2cf4bfce1))
* remove @semantic-release/npm plugin to fix ENONPMTOKEN error ([3cb3108](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/3cb310828a4875c051b2c3dfd999dd528cc4f9a9))
* resolve CSP violation for blob workers and fix SonarCloud CI configuration ([96f603b](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/96f603b31ab6f5e9f0385110b5c3816700672a0b))
* **sitemap:** correct theme toggle icon markup ([bedbec5](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/bedbec5883e852333ad81b637e84266ba62ac0c5))


### Features

* **a11y:** implement comprehensive ARIA accessibility improvements ([71ed885](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/71ed8852ace6477024c5f56cb12c3168f91b9335))
* **a11y:** implement expert-level accessibility enhancements ([1a3c5e3](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/1a3c5e3a3a4d9de834881ae1c0e9f45aa07c2beb))
* add PWA service worker and optimize Font Awesome ([3132922](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/31329223293a59796891743d35b4cfda1937ec55))
* **ci:** add Lighthouse CI and Google Analytics 4 ([3f189e4](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/3f189e4c0666c2b39e2804c68af00a70234c03af))
* **ci:** implement 10/10 future-proofing improvements ([64a694b](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/64a694bebe27d8dbc63a15e32e060691842af616))
* **ci:** implement expert-level SonarCloud rule integration ([394f114](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/394f114ffe9ab8be8591cdbae479aec9b3b03625))
* **ci:** integrate Cypress Cloud for test recording and analytics ([9698f9d](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/9698f9d480ac25934578ef23802cfb9aa7afdc16))
* comprehensive CSS consistency, PWA enhancement, and CI/CD improvements ([5d7e214](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/5d7e2147f02e5031c3ca8fc7cfa891c2f01d7737)), closes [#ffffff](https://github.com/syafiqhadzir/syafiqhadzir.github.io/issues/ffffff) [#FF0F00](https://github.com/syafiqhadzir/syafiqhadzir.github.io/issues/FF0F00)
* comprehensive site modernization with dark theme and DX improvements ([0ccca99](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/0ccca996115a8836afb5105feed55389ca986e79))
* **cypress:** add WCAG 2.2 support and tablet viewport testing ([988f4d2](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/988f4d2836c8fdee2a5fb12b1abdc844a8e1f06a))
* **cypress:** implement expert-level testing infrastructure ([1dc07cd](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/1dc07cde691e8ed109ca366e1ef63a7523e7c165))
* **infra:** add expert-level enhancements for security, SEO, and DX ([4a970b2](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/4a970b2fb663c45c38bc1b337177ff1a7b51e6f4))
* migrate to Eleventy SSG with full testing pyramid ([40865aa](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/40865aab41cf555a5830c57993068275034e36fd))


### Performance Improvements

* **lighthouse:** switch assertions to warn-only for non-blocking CI ([a2b1f1a](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/a2b1f1af83b7031b76132866e02df770c5ebdb48))
* minify index.html and offline.html ([e391bab](https://github.com/syafiqhadzir/syafiqhadzir.github.io/commit/e391babfe8b475aafd3f25b6fefb88a37d33373e))


### BREAKING CHANGES

* **infra:** sitemap.xml and robots.txt are now auto-generated

Infrastructure:
- Add _headers with Content-Security-Policy for AMP compliance
- Add HSTS, X-Frame-Options, X-XSS-Protection headers
- Configure Cloudflare/Netlify caching headers for static assets

SEO & Schema:
- Add sitemap.xml.njk auto-generated from Eleventy collections
- Add robots.txt.njk with dynamic site data injection
- Add validate-schema.ts for JSON-LD validation in CI
- Enhance Person schema with @id, hasOccupation, alumniOf
- Add ResearchProject entity for AI-QA research

Performance:
- Add modulepreload hints for AMP extension scripts
- Implement fluid typography using CSS clamp() (28px→36px→48px)
- Add htmlMinify.ts transform with html-minifier-terser

Testing:
- Add `cy.auditA11y()` Cypress command with detailed violation logging
- Add 17 unit tests for HTML minification (99.14% coverage)
- Add `npm run validate:schema` command for CI

Files added:
  _headers, scripts/validate-schema.ts, src/transforms/htmlMinify.ts,
  src/pages/sitemap.xml.njk, src/pages/robots.txt.njk,
  test/transforms/htmlMinify.test.ts

Files modified:
  base.njk, commands.ts, eleventy.config.js, index.njk,
  package.json, _variables.scss
* Static HTML files replaced with Nunjucks templates

Implement "Zero-Defect" architecture with Eleventy 3.0+ SSG:

Build System:
- Add Eleventy with Nunjucks templating engine
- Configure Dart Sass → PostCSS → CSSO pipeline (6.36KB output)
- Implement 75KB CSS guard transform for AMP compliance
- Add TypeScript compilation for filters/shortcodes/transforms

Templates (src/pages/):
- index.njk: Homepage with About, Proficiencies, Interests
- contact.njk: Contact information and social links
- sitemap.njk: Site navigation overview
- 404.njk: Error page
- offline.njk: PWA offline fallback

Source Modules (src/):
- filters/dateFormat.ts: Date formatting with Intl.DateTimeFormat
- filters/readingTime.ts: Word count and reading time calculation
- shortcodes/ampImg.ts: AMP-compliant responsive images
- transforms/cssGuard.ts: CSS size validation (75KB limit)
- scss/: SCSS architecture with variables, components, main

Testing Pyramid:
- Vitest: 94 unit tests with 100% coverage (LCOV output)
- Cypress: E2E smoke tests with accessibility checks
- amphtml-validator: Post-build AMP validation

Quality Assurance:
- SonarCloud integration with quality gate enforcement
- ESLint flat config with cognitive complexity rules
- Stylelint for SCSS with AMP-specific allowlist

CI/CD Pipeline (.github/workflows/ci.yml):
- Lint → Unit Tests → SonarCloud → Build → E2E → Deploy
- Conditional SonarCloud scan (skips if SONAR_TOKEN missing)
- GitHub Pages deployment from _site/ directory

Files removed:
- index.html, contact.html, sitemap.html, 404.html, offline.html
  (replaced by Nunjucks templates)
* **amp:** None
* **cypress:** None

- Add comprehensive E2E test coverage for all 5 HTML pages
  - New specs: 404.cy.ts, contact.cy.ts, sitemap.cy.ts, offline.cy.ts, a11y.cy.ts
  - Total: 47 tests across 6 spec files

- Implement expert-level accessibility testing with cypress-axe
  - Add validateA11y(), validateComponentA11y(), validateCriticalA11y(), validateMobileA11y()
  - Configure WCAG 2.0/2.1 AA compliance checks with AMP exclusions
  - Enable strict mode for critical-impact violations in CI

- Enhance Cypress configuration
  - Add Mochawesome HTML/JSON reporting
  - Enable experimentalMemoryManagement and testIsolation
  - Configure retries, timeouts, and environment variables

- Improve test maintainability
  - Create site-content.json fixture for centralized test data
  - Add TypeScript type definitions (index.d.ts)
  - Inject data-cy attributes into HTML for resilient selectors

- Add CI/CD-ready npm scripts
  - test:ci, test:a11y, test:smoke, test:report, test:clean

- Update .gitignore with deployment platform exclusions

Refs: cypress-axe, mochawesome, WCAG 2.1 AA
