# 🚀 Deployment Guide

Production deployment process and configurations.

## Overview

This project deploys to **Cloudflare Pages** with the following flow:

1. Push to `main` branch or create version tag
2. GitHub Actions triggers deployment workflow
3. Site is built and validated
4. Deployed to Cloudflare Pages
5. Post-deployment checks run

---

## 🔄 Deployment Workflow

### Automatic Deployments

| Trigger            | Action                |
| ------------------ | --------------------- |
| Push to `main`     | Preview deployment    |
| Version tag (`v*`) | Production deployment |
| Pull Request       | Preview environment   |

### Manual Deployment

```bash
# Build locally
npm run build:prod

# Deploy via Wrangler
npx wrangler pages deploy _site
```

---

## 🏗️ Build Process

### Production Build

```bash
npm run build:prod
```

This runs:

1. **TypeScript Compilation:** `npm run compile:ts`
2. **Eleventy Build:** `npm run build`
3. **Service Worker Generation:** `npm run build:sw`
4. **Size Report:** `npm run build:size-report`

### Build Output

```
_site/
├── index.html          # Homepage
├── about/index.html    # About page
├── blog/               # Blog posts
├── images/
│   └── optimized/      # Optimized images
├── sw.js               # Service Worker
├── site.webmanifest    # PWA manifest
└── ...
```

---

## ⚙️ Configuration

### Cloudflare Pages

Settings in `wrangler.toml`:

```toml
name = "syafiqhadzir-portfolio"
pages_build_output_dir = "_site"
```

### Custom Domain

DNS configured for `syafiqhadzir.dev`:

- CNAME record pointing to Cloudflare Pages
- SSL/TLS enabled (Full strict)

### Headers

Custom headers in `_headers`:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Redirects

Custom redirects in `_redirects`:

```
/old-path  /new-path  301
```

---

## ✅ Pre-Deployment Checks

### Automated (CI/CD)

| Check           | Command                | Requirement     |
| --------------- | ---------------------- | --------------- |
| Linting         | `npm run lint`         | Zero errors     |
| Type Check      | `npm run typecheck`    | Zero errors     |
| Unit Tests      | `npm run test:unit`    | All passing     |
| AMP Validation  | `npm run validate:amp` | All valid       |
| HTML Validation | `npm run check:html`   | Zero errors     |
| Link Check      | `npm run check:links`  | No broken links |

### Lighthouse Audit

Performance gates enforced:

| Category       | Minimum Score |
| -------------- | ------------- |
| Performance    | 95            |
| Accessibility  | 99            |
| Best Practices | 95            |
| SEO            | 95            |

---

## 🔐 Environment Variables

### Required Secrets (GitHub)

| Secret                  | Purpose               |
| ----------------------- | --------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare deployment |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account    |
| `SONAR_TOKEN`           | SonarCloud analysis   |

### Setting Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add required secrets

---

## 📊 Post-Deployment

### Verification

After deployment, verify:

1. **Homepage loads:** https://syafiqhadzir.dev
2. **AMP validation:** Use AMP validator extension
3. **Performance:** Run Lighthouse audit
4. **SSL certificate:** Check HTTPS works
5. **Service Worker:** Check offline functionality

### Monitoring

- **Cloudflare Analytics:** Traffic and performance
- **SonarCloud:** Code quality metrics
- **GitHub Actions:** Build status

---

## 🔄 Rollback

### Via Cloudflare Dashboard

1. Go to Cloudflare Pages dashboard
2. Select deployment to rollback to
3. Click "Rollback"

### Via Git

```bash
# Revert to previous version
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-sha>
git push origin main --force
```

---

## 🐳 Docker Deployment

For self-hosted deployments:

### Build Image

```bash
npm run docker:build
# or
docker build -t syafiqhadzir-portfolio .
```

### Run Container

```bash
npm run docker:run
# or
docker run -p 8080:80 syafiqhadzir-portfolio
```

### Docker Compose

```bash
docker-compose up -d
```

---

## 📋 Deployment Checklist

### Before Deployment

- [ ] All tests passing locally
- [ ] `npm run check` passes
- [ ] No lint errors
- [ ] Version tag created (if production)
- [ ] CHANGELOG updated (automatic via semantic-release)

### After Deployment

- [ ] Site accessible
- [ ] No console errors
- [ ] Performance satisfactory
- [ ] All pages loading correctly
- [ ] Forms/features working

---

## 🆘 Troubleshooting

### Build Fails in CI

1. Check GitHub Actions logs
2. Run same commands locally
3. Verify all secrets are set
4. Check for dependency issues

### Deployment Fails

1. Check Cloudflare Pages logs
2. Verify API token is valid
3. Check account ID is correct
4. Review wrangler.toml config

### Site Not Updating

1. Clear Cloudflare cache
2. Check deployment succeeded
3. Wait for propagation (few minutes)
4. Hard refresh browser

---

## 🔗 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

_Last updated: 2026-01-07_
