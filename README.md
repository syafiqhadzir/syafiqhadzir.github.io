# syafiqhadzir.dev

[![CI/CD Pipeline](https://github.com/SyafiqHadzir/syafiqhadzir.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/SyafiqHadzir/syafiqhadzir.github.io/actions/workflows/ci.yml)
[![Security Scan](https://github.com/SyafiqHadzir/syafiqhadzir.github.io/actions/workflows/security.yml/badge.svg)](https://github.com/SyafiqHadzir/syafiqhadzir.github.io/actions/workflows/security.yml)
[![Cypress Cloud](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/1y2ryf/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/1y2ryf/runs)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=syafiqhadzir.github.io&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=syafiqhadzir.github.io)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=syafiqhadzir.github.io&metric=coverage)](https://sonarcloud.io/summary/new_code?id=syafiqhadzir.github.io)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)

Personal portfolio website for **Syafiq Hadzir**, an AI-assisted Software QA Engineer specializing in test automation and quality assurance.

🌐 **Live Site**: [syafiqhadzir.dev](https://syafiqhadzir.dev)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **AMP-Powered** | Built with Accelerated Mobile Pages for sub-second load times |
| 📱 **PWA Ready** | Installable with offline support via service worker |
| 🌙 **Dark/Light Mode** | Theme switcher with system preference detection |
| ♿ **Accessible** | WCAG 2.1 AA compliant with ARIA, skip links, focus states |
| 🔍 **SEO Optimized** | Schema.org, Open Graph, Twitter Cards, XML sitemap |
| 🔒 **Security Hardened** | CSP, Permissions-Policy, HSTS, security.txt |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **SSG** | [Eleventy 3.x](https://www.11ty.dev/) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Styling** | SCSS + CSS Variables |
| **Icons** | Font Awesome 6 (self-hosted subset) |
| **Unit Tests** | Vitest 4 + V8 Coverage (90% threshold) |
| **E2E Tests** | Cypress 15 + cypress-axe |
| **Performance** | Lighthouse CI |
| **Code Quality** | ESLint 9 + Stylelint 16 + SonarCloud |
| **CI/CD** | GitHub Actions (7-stage pipeline) |
| **Container** | Docker + Nginx Alpine |
| **Hosting** | GitHub Pages + Cloudflare CDN |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- npm 10+

### Installation

```bash
git clone https://github.com/SyafiqHadzir/syafiqhadzir.github.io.git
cd syafiqhadzir.github.io
npm ci
```

### Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build production site to _site/
npm run serve        # Serve built site on localhost:8080
```

### Testing

```bash
npm run test:unit           # Run Vitest unit tests
npm run test:unit:coverage  # With coverage report
npm run test:e2e            # Run Cypress E2E tests
npm run test:a11y           # Run accessibility tests
npm run lint                # ESLint + Stylelint
npm run typecheck           # TypeScript type checking
npm run validate:amp        # Validate AMP HTML
```

---

## 🐳 Docker

### Quick Start

```bash
# Build and run production container
docker compose up -d

# Or build manually
docker build -t syafiqhadzir-portfolio .
docker run -d -p 80:80 --name portfolio syafiqhadzir-portfolio
```

### Development with Docker

```bash
# Start development server with live reload
docker compose --profile dev up
```

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Run production container |
| `docker compose --profile dev up` | Run development server |
| `docker compose down` | Stop containers |
| `docker compose build --no-cache` | Rebuild image |

### Best Practices Applied

- ✅ Multi-stage build (Node.js → Nginx)
- ✅ Alpine-based images (~11MB final)
- ✅ Non-root user (nginx)
- ✅ Security hardening
- ✅ Gzip compression
- ✅ Efficient caching headers
- ✅ Health checks

---

## 🧪 Testing Pyramid

| Layer | Framework | Coverage |
|-------|-----------|----------|
| **Unit** | Vitest | 90% threshold |
| **E2E** | Cypress | All pages |
| **A11y** | cypress-axe | WCAG 2.1 AA |
| **Performance** | Lighthouse CI | Core Web Vitals |

---

## 📁 Project Structure

```
syafiqhadzir.github.io/
├── .github/
│   ├── dependabot.yml         # Automated dependency updates
│   └── workflows/
│       ├── ci.yml             # Main CI/CD pipeline
│       ├── release.yml        # Semantic versioning
│       └── security.yml       # Secrets scanning
├── src/
│   ├── pages/                 # Page templates (.njk)
│   ├── filters/               # Eleventy filters
│   ├── transforms/            # HTML transforms
│   └── styles/                # SCSS stylesheets
├── test/                      # Vitest unit tests
├── cypress/
│   ├── e2e/                   # E2E test specs
│   └── support/               # Custom commands
├── _includes/                 # Layout templates
├── eleventy.config.js         # Eleventy configuration
├── lighthouserc.cjs           # LHCI configuration
└── sonar-project.properties   # SonarCloud config
```

---

## 🔧 Configuration

| File | Purpose |
|------|---------|
| `eleventy.config.js` | SSG configuration |
| `tsconfig.json` | TypeScript strict mode |
| `vitest.config.ts` | Unit test settings + coverage |
| `cypress.config.ts` | E2E test configuration |
| `lighthouserc.cjs` | Lighthouse CI budgets |
| `sonar-project.properties` | SonarCloud analysis |
| `.releaserc.json` | Semantic release config |

---

## 🔐 Security

This project implements comprehensive security measures:

- **Content Security Policy** — Strict CSP for AMP compatibility
- **Permissions-Policy** — Disabled unused browser features
- **HSTS** — Enforced HTTPS with preload
- **Secrets Scanning** — Gitleaks in CI
- **Dependency Scanning** — npm audit + Dependabot

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

[CC0 1.0 Universal](LICENSE) — Public domain dedication.

---

## 👨‍💻 Author

**Syafiq Hadzir** — AI-assisted Software QA Engineer

- 🌐 [syafiqhadzir.dev](https://syafiqhadzir.dev)
- 📝 [blog.syafiqhadzir.dev](https://blog.syafiqhadzir.dev)
- 💼 [GitHub](https://github.com/SyafiqHadzir)
- 🦊 [GitLab](https://gitlab.com/syafiqhadzir)

---

<p align="center">
  <sub>Built with ❤️ and ☕ in Malaysia</sub>
</p>