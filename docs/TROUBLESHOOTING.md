# Troubleshooting Guide

Common issues and solutions when working with the portfolio site.

## Build Issues

### SCSS Compilation Fails

**Symptom:** `Error: Can't find stylesheet to import.`

**Solution:**

1. Check that all `@use` paths are correct
2. Ensure file names start with underscore (`_file.scss`)
3. Verify the file exists in the expected location

```bash
# Verify SCSS structure
ls -la src/scss/
ls -la src/scss/abstracts/
```

---

### CSS Exceeds 75KB Limit

**Symptom:** `[CSSO] CSS size exceeds AMP limit of 75KB`

**Solution:**

1. Run PurgeCSS to remove unused styles
2. Check for duplicate styles
3. Use CSSO's aggressive restructuring

```bash
npm run build:prod
# Check _site output for CSS size
```

---

### TypeScript Compilation Errors

**Symptom:** `Cannot find module` or type errors

**Solution:**

```bash
# Rebuild TypeScript
npm run compile:ts

# Check for type errors
npm run typecheck
```

---

## Development Server

### Port Already in Use

**Symptom:** `EADDRINUSE: address already in use :::8080`

**Solution:**

```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8080
kill -9 <PID>
```

---

### Changes Not Reflecting

**Symptom:** Browser shows old content after edits

**Solution:**

1. Clear browser cache (Ctrl+Shift+R)
2. Restart dev server: `npm run dev`
3. Check that file is being watched:
   ```js
   // eleventy.config.js
   eleventyConfig.addWatchTarget('./src/scss/');
   ```

---

## Testing Issues

### Cypress Tests Failing Locally

**Symptom:** Tests pass in CI but fail locally

**Solution:**

1. Ensure dev server is running: `npm run serve`
2. Clear Cypress cache:
   ```bash
   npx cypress cache clear
   npx cypress install
   ```
3. Run with correct browser:
   ```bash
   npm run test:e2e -- --browser chrome
   ```

---

### Coverage Not Generating

**Symptom:** No `coverage/lcov.info` file

**Solution:**

```bash
# Run with coverage explicitly
npm run test:unit:coverage

# Check Vitest config
cat vitest.config.ts | grep coverage
```

---

## Linting Issues

### ESLint Configuration Error

**Symptom:** `ESLint couldn't find the config`

**Solution:**

1. Ensure flat config is being used (ESLint 9+)
2. Check `eslint.config.js` exists
3. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm ci
   ```

---

### Stylelint Property Order Errors

**Symptom:** Many `order/properties-order` errors

**Solution:**

```bash
# Auto-fix ordering
npm run lint:css -- --fix
```

---

## Deployment Issues

### GitHub Pages 404

**Symptom:** Site shows 404 after deployment

**Solution:**

1. Check `_site/` contains `index.html`
2. Verify CNAME file exists
3. Ensure GitHub Pages source is "GitHub Actions"

---

### Docker Container Fails

**Symptom:** Container exits immediately

**Solution:**

```bash
# Check logs
docker compose logs

# Common fixes:
# 1. Rebuild image
docker compose build --no-cache

# 2. Check nginx config syntax
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx nginx -t
```

---

## AMP Validation

### AMP Validation Errors

**Symptom:** `<style amp-custom>` errors

**Solution:**

1. Check CSS size: must be < 75KB
2. Remove `!important` declarations
3. Use AMP-allowed units only
4. Validate locally:
   ```bash
   npm run validate:amp:build
   ```

---

### Missing AMP Boilerplate

**Symptom:** AMP validation fails on boilerplate

**Solution:** Ensure base template includes:

```html
<style amp-boilerplate>
  body {
    -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
    -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
    -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
    animation: -amp-start 8s steps(1, end) 0s 1 normal both;
  }
  @-webkit-keyframes -amp-start {
    from {
      visibility: hidden;
    }
    to {
      visibility: visible;
    }
  }
  @-moz-keyframes -amp-start {
    from {
      visibility: hidden;
    }
    to {
      visibility: visible;
    }
  }
  @-ms-keyframes -amp-start {
    from {
      visibility: hidden;
    }
    to {
      visibility: visible;
    }
  }
  @-o-keyframes -amp-start {
    from {
      visibility: hidden;
    }
    to {
      visibility: visible;
    }
  }
  @keyframes -amp-start {
    from {
      visibility: hidden;
    }
    to {
      visibility: visible;
    }
  }
</style>
<noscript
  ><style amp-boilerplate>
    body {
      -webkit-animation: none;
      -moz-animation: none;
      -ms-animation: none;
      animation: none;
    }
  </style></noscript
>
```

---

## Still Need Help?

1. Check existing [GitHub Issues](https://github.com/syafiqhadzir/syafiqhadzir.github.io/issues)
2. Review
   [SonarCloud Dashboard](https://sonarcloud.io/dashboard?id=syafiqhadzir_syafiqhadzir.github.io)
   for code quality insights
3. Open a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version)
