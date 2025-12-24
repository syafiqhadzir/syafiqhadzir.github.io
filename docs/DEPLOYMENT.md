# Deployment Guide

Step-by-step instructions for deploying the portfolio site.

## Prerequisites

- Node.js >= 24.0.0
- npm >= 10.0.0
- Git

## Deployment Options

### 1. GitHub Pages (Recommended)

The site automatically deploys to GitHub Pages on every push to `main`.

**Setup:**

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to `main` branch

**Workflow:** `.github/workflows/deploy.yml`

---

### 2. Cloudflare Pages

**Setup:**

1. Connect repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build:prod`
   - Output directory: `_site`
   - Node.js version: `24`

**Custom Domain:**

- Add CNAME record pointing to `*.pages.dev`
- Configure in Cloudflare dashboard

---

### 3. Netlify

**Setup:**

1. Connect repository to Netlify
2. Build settings are auto-detected from `netlify.toml` (create if needed)

**`netlify.toml`:**

```toml
[build]
  command = "npm run build:prod"
  publish = "_site"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

### 4. Docker

**Build image:**

```bash
docker compose build
```

**Run container:**

```bash
docker compose up -d
```

**Access:** http://localhost:8080

---

## Manual Deployment

**Build:**

```bash
npm ci
npm run build:prod
```

**Output:** `_site/` directory contains all static files.

**Deploy:** Upload `_site/` contents to any static hosting service.

---

## Environment Variables

| Variable             | Description                          | Required |
| -------------------- | ------------------------------------ | -------- |
| `NODE_ENV`           | Set to `production` for minification | No       |
| `SONAR_TOKEN`        | SonarCloud authentication            | CI only  |
| `CYPRESS_RECORD_KEY` | Cypress Cloud recording              | CI only  |

---

## Post-Deployment Verification

1. **AMP Validation:**

   ```bash
   npm run validate:amp:build
   ```

2. **Lighthouse Audit:**

   ```bash
   npm run perf:local
   ```

3. **Schema Validation:**
   ```bash
   npm run validate:schema
   ```

---

## Rollback

If issues occur after deployment:

1. **GitHub Pages:** Revert commit and push
2. **Cloudflare/Netlify:** Use platform rollback feature
3. **Docker:** Pull previous image tag

---

## Monitoring

After deployment, verify:

- [ ] All pages load correctly
- [ ] Dark mode toggle works
- [ ] AMP validation passes (add `#development=1` to URL)
- [ ] Core Web Vitals are green
- [ ] Schema.org structured data is valid
