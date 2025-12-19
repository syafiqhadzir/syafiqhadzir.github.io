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
- ♿ **Accessible** — WCAG-compliant with proper ARIA labels and semantic HTML
- 🎨 **Dark Theme** — Modern, sleek dark design with smooth animations
- 🔍 **SEO Optimized** — Schema.org structured data, meta tags, and sitemaps

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Static HTML + AMP |
| **Styling** | W3.CSS + Custom CSS |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts (Inconsolata) |
| **Testing** | Cypress E2E |
| **CI/CD** | GitHub Actions |
| **Hosting** | GitHub Pages / Netlify |

---

## 📁 Project Structure

```
syafiqhadzir.github.io/
├── .github/workflows/    # GitHub Actions CI/CD
├── cypress/              # E2E test suite
│   ├── e2e/              # Test specifications
│   └── support/          # Custom commands
├── favicons/             # App icons & manifest
├── Images/               # Site images
├── assets/               # Static assets
├── index.html            # Main page
├── offline.html          # PWA offline fallback
├── sw.js                 # Service worker
├── sitemap.xml           # XML sitemap
├── robots.txt            # Crawler directives
└── browserconfig.xml     # Windows tile config
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- npm v10+

### Installation

```bash
# Clone the repository
git clone https://github.com/SyafiqHadzir/syafiqhadzir.github.io.git
cd syafiqhadzir.github.io

# Install dependencies
npm install
```

### Local Development

```bash
# Serve locally (requires npx serve or similar)
npx serve . -l 8080

# Open in browser
# http://localhost:8080
```

### Running Tests

```bash
# Run Cypress E2E tests (headless)
npx cypress run

# Open Cypress Test Runner (interactive)
npx cypress open
```

---

## 🧪 Testing

This project uses [Cypress](https://www.cypress.io/) for end-to-end testing. Tests cover:

- ✅ Page title and meta tags
- ✅ Content visibility (About, Proficiencies, Interests)
- ✅ Navigation links (Blog, GitHub, GitLab)
- ✅ Favicon and manifest presence
- ✅ AMP script loading
- ✅ Responsive design
- ✅ ARIA accessibility compliance

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