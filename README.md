# syafiqhadzir.dev

[![Deploy to GitHub Pages](https://github.com/SyafiqHadzir/syafiqhadzir.github.io/actions/workflows/static.yml/badge.svg)](https://github.com/SyafiqHadzir/syafiqhadzir.github.io/actions/workflows/static.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/33b64d4a-c39a-4dba-9153-2628b45c8825/deploy-status)](https://app.netlify.com/sites/syafiqhadzir/deploys)
[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=SyafiqHadzir_syafiqhadzir.github.io)

Personal portfolio website for **Syafiq Hadzir**, a Software QA Engineer specializing in AI-assisted testing, test automation, and web application development.

🌐 **Live Site**: [syafiqhadzir.dev](https://syafiqhadzir.dev)

---

## ✨ Features

- ⚡ **AMP-Powered** — Built with Accelerated Mobile Pages for blazing-fast load times
- 📱 **PWA Ready** — Installable as a Progressive Web App with offline support
- 🌙 **Dark/Light Theme** — Auto-switches based on system preference (`prefers-color-scheme`)
- ♿ **Accessible** — WCAG-compliant with ARIA labels, skip links, and semantic HTML
- 🔍 **SEO Optimized** — Schema.org structured data, Open Graph, Twitter Cards, and sitemaps
- 🔒 **Security Hardened** — `security.txt`, `noreferrer` on external links

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Static HTML + AMP |
| **Styling** | W3.CSS + CSS Variables |
| **Icons** | Font Awesome 6 (self-hosted) |
| **Fonts** | Google Fonts (Inconsolata) |
| **Testing** | Cypress 15 E2E |
| **Language** | TypeScript 5.9 |
| **CI/CD** | GitHub Actions |
| **Hosting** | GitHub Pages / Netlify |

---

## 📁 Project Structure

```
syafiqhadzir.github.io/
├── .github/
│   ├── dependabot.yml        # Automated dependency updates
│   └── workflows/
│       └── static.yml        # CI/CD pipeline
├── .well-known/
│   └── security.txt          # Security contact info
├── cypress/
│   ├── e2e/                  # Test specifications
│   └── support/              # Custom commands
├── favicons/                 # App icons & manifest
├── Images/                   # Site images
├── 404.html                  # Custom error page
├── index.html                # Main page (AMP)
├── offline.html              # PWA offline fallback
├── sitemap.html              # Human-readable sitemap
├── sw.js                     # Service worker
├── sitemap.xml               # XML sitemap
├── robots.txt                # Crawler directives
├── browserconfig.xml         # Windows tile config
├── .editorconfig             # Editor settings
├── .nvmrc                    # Node.js version
└── tsconfig.json             # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+ (see `.nvmrc`)
- npm v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/SyafiqHadzir/syafiqhadzir.github.io.git
cd syafiqhadzir.github.io

# Install dependencies
npm install
```

### Available Scripts

```bash
npm run serve       # Start local server on port 8080
npm run test        # Run Cypress E2E tests (headless)
npm run test:open   # Open Cypress Test Runner (interactive)
npm run typecheck   # Run TypeScript type checking
```

---

## 🧪 Testing

This project uses [Cypress 15](https://www.cypress.io/) for end-to-end testing. Tests cover:

- ✅ Page title and meta tags
- ✅ Content visibility (About, Proficiencies, Interests)
- ✅ Navigation links (Blog, GitHub, GitLab)
- ✅ Favicon and manifest presence
- ✅ AMP script loading
- ✅ Font Awesome icons rendering
- ✅ Responsive design (mobile viewport)
- ✅ ARIA accessibility compliance

### Test Configuration

- **Viewport**: 1280×720
- **Retries**: 2 (CI), 0 (local)
- **Screenshots**: On failure only

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.editorconfig` | Consistent coding style across editors |
| `.nvmrc` | Node.js version for nvm users |
| `tsconfig.json` | TypeScript ES2022 configuration |
| `cypress.config.ts` | Cypress test settings |
| `.github/dependabot.yml` | Weekly dependency updates |

---

## 📄 License

This project is licensed under the [CC0 1.0 Universal](LICENSE) — public domain dedication.

You can copy, modify, distribute, and use the work, even for commercial purposes, all without asking permission.

---

## 👨‍💻 Author

**Syafiq Hadzir**

- 🌐 Website: [syafiqhadzir.dev](https://syafiqhadzir.dev)
- 📝 Blog: [blog.syafiqhadzir.dev](https://blog.syafiqhadzir.dev)
- 💼 GitHub: [@SyafiqHadzir](https://github.com/SyafiqHadzir)
- 🦊 GitLab: [@syafiqhadzir](https://gitlab.com/syafiqhadzir)

---

<p align="center">
  <sub>Built with ❤️ and ☕ in Malaysia</sub>
</p>