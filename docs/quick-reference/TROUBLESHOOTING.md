# 🔧 Troubleshooting Guide

Solutions for common issues and problems.

## Build Issues

### TypeScript Compilation Fails

**Symptoms:**

- `npm run build` fails with TypeScript errors
- `Cannot find module` errors

**Solutions:**

```bash
# Clean and reinstall
npm run clean
rm -rf node_modules
npm ci

# Rebuild
npm run compile:ts
npm run build
```

### CSS Size Exceeds AMP Limit

**Symptoms:**

- Build fails with "CSS size exceeds AMP limit of 75KB"

**Solutions:**

1. Check CSS size:

   ```bash
   npm run build
   # Check output for CSS size report
   ```

2. Reduce CSS:
   - Remove unused styles
   - Split critical/non-critical CSS
   - Use `npm run housekeeping` to find unused SCSS

3. Optimize with LightningCSS (automatic):
   - Minification is automatic
   - Check `src/lib/lightningCss.ts` for config

---

## Development Server Issues

### Port Already in Use

**Symptoms:**

- "EADDRINUSE: address already in use :8080"

**Solutions:**

```bash
# Find process using port (Windows)
netstat -ano | findstr :8080
taskkill /PID <pid> /F

# Or use different port
npm run dev -- --port=3000
```

### Hot Reload Not Working

**Symptoms:**

- Changes not reflecting in browser

**Solutions:**

1. Clear browser cache (Ctrl+Shift+R)
2. Restart dev server
3. Check for syntax errors in templates

---

## Test Issues

### Unit Tests Fail

**Symptoms:**

- Vitest tests failing unexpectedly

**Solutions:**

```bash
# Run with verbose output
npm run test:unit -- --reporter=verbose

# Clear test cache
npm run test:unit -- --clearCache

# Run specific test
npm run test:unit -- test/path/to/test.ts
```

### E2E Tests Fail

**Symptoms:**

- Cypress tests timing out or failing

**Solutions:**

1. Ensure dev server is running:

   ```bash
   npm run serve &
   npm run test:e2e
   ```

2. Clear Cypress cache:

   ```bash
   npx cypress cache clear
   ```

3. Run in open mode for debugging:
   ```bash
   npm run test:e2e:open
   ```

### Cypress Can't Find Server

**Symptoms:**

- "Cypress could not verify that this server is running"

**Solutions:**

```bash
# Start server first
npm run build
npm run serve &

# Wait for server, then test
sleep 3
npm run test:e2e
```

---

## Linting Issues

### ESLint Errors

**Symptoms:**

- ESLint reporting errors on commit

**Solutions:**

```bash
# Auto-fix what's possible
npm run lint:js

# See all errors without fix
npm run lint:js -- --no-fix

# Check specific file
npx eslint src/path/to/file.ts
```

### Stylelint Errors

**Symptoms:**

- Stylelint reporting SCSS errors

**Solutions:**

```bash
# Auto-fix
npm run lint:css

# See all errors
npm run lint:css -- --no-fix
```

### Type Errors

**Symptoms:**

- TypeScript type checking fails

**Solutions:**

```bash
# Check types with details
npm run typecheck

# Check specific file
npx tsc --noEmit src/path/to/file.ts
```

---

## AMP Validation Issues

### AMP Validation Fails

**Symptoms:**

- `npm run validate:amp` reports errors

**Common Issues:**

| Error                | Solution                  |
| -------------------- | ------------------------- |
| Custom JavaScript    | Remove or use amp-script  |
| External stylesheets | Inline all CSS            |
| CSS > 75KB           | Reduce stylesheet size    |
| Invalid amp-img      | Add width, height, layout |
| Missing boilerplate  | Check base template       |

**Debugging:**

```bash
# Validate specific file
npx amphtml-validator _site/index.html

# Get detailed errors
npm run validate:amp -- --verbose
```

---

## Service Worker Issues

### SW Not Updating

**Symptoms:**

- Old content being served despite updates

**Solutions:**

1. Clear service worker cache:

   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
   caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
   ```

2. Hard refresh: Ctrl+Shift+R

3. Rebuild service worker:
   ```bash
   npm run build:sw
   ```

---

## Git Hook Issues

### Pre-commit Hook Fails

**Symptoms:**

- Commit blocked by Husky

**Solutions:**

```bash
# See what's failing
npm run lint

# Skip hook temporarily (not recommended)
git commit --no-verify -m "message"
```

### Commit Message Rejected

**Symptoms:**

- Commitlint rejecting message

**Solutions:**

Use conventional commit format:

```bash
# Correct format
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
```

---

## Dependency Issues

### npm install Fails

**Symptoms:**

- Dependencies won't install

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Remove and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use clean install
npm ci
```

### Peer Dependency Warnings

**Symptoms:**

- Warnings about peer dependencies

**Solutions:**

Most are harmless. If causing issues:

```bash
# Force resolution
npm install --legacy-peer-deps
```

---

## Docker Issues

### Docker Build Fails

**Symptoms:**

- `npm run docker:build` fails

**Solutions:**

```bash
# Clean Docker cache
docker system prune -f

# Rebuild without cache
docker build --no-cache -t syafiqhadzir-portfolio .
```

### Container Won't Start

**Symptoms:**

- `npm run docker:run` fails

**Solutions:**

```bash
# Check logs
docker logs <container-id>

# Check if port is free
netstat -ano | findstr :8080
```

---

## IDE Issues

### VS Code TypeScript Errors

**Symptoms:**

- VS Code showing errors that ESLint doesn't catch

**Solutions:**

1. Reload TypeScript:
   - Cmd/Ctrl+Shift+P → "TypeScript: Restart TS Server"

2. Reload window:
   - Cmd/Ctrl+Shift+P → "Developer: Reload Window"

3. Check tsconfig is correct:
   ```bash
   npm run typecheck
   ```

---

## Performance Issues

### Slow Build

**Symptoms:**

- Build taking too long

**Solutions:**

1. Use incremental builds during development
2. Check for large files in source
3. Review image optimization settings

### Slow Tests

**Symptoms:**

- Tests taking too long

**Solutions:**

```bash
# Run specific tests
npm run test:unit -- --filter="pattern"

# Parallel test execution (Cypress)
npm run test:e2e -- --parallel
```

---

## Getting More Help

If none of these solutions work:

1. Check [GitHub Issues](https://github.com/syafiqhadzir/syafiqhadzir.github.io/issues)
2. Search existing discussions
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment info (Node version, OS)

---

_Last updated: 2026-01-07_
