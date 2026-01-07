# 📝 Style Guide

Coding standards and conventions for this project.

## Overview

This project enforces **strictest coding standards** through automated linting and Git hooks.

---

## 🔷 TypeScript Standards

### Configuration

- **Strict Mode:** `strict: true` + additional flags
- **No Implicit Any:** All types must be explicit
- **Strict Null Checks:** Enabled
- **No Unchecked Index Access:** Enabled

### Naming Conventions

| Type         | Convention            | Example                  |
| ------------ | --------------------- | ------------------------ |
| Variables    | camelCase             | `const userName`         |
| Constants    | SCREAMING_SNAKE_CASE  | `const MAX_SIZE`         |
| Functions    | camelCase             | `function getUserName()` |
| Classes      | PascalCase            | `class UserService`      |
| Interfaces   | PascalCase            | `interface UserData`     |
| Type Aliases | PascalCase            | `type UserId`            |
| Enums        | PascalCase            | `enum UserRole`          |
| Enum Members | PascalCase/UPPER_CASE | `UserRole.Admin`         |
| Files        | camelCase             | `userService.ts`         |

### Code Examples

```typescript
// ✅ Good
const MAX_RETRIES = 3;
const userName = 'John';

function getUserById(id: string): User {
  // implementation
}

interface UserData {
  id: string;
  name: string;
}

// ❌ Bad
const max_retries = 3; // Wrong casing
const user_name = 'John'; // Wrong casing
function get_user() {} // Wrong casing
```

### Type Annotations

```typescript
// ✅ Good - Explicit return types
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - Explicit parameter types
const processUser = (user: User): ProcessedUser => {
  return { ...user, processed: true };
};

// ❌ Bad - Implicit any
function process(data) {
  // Missing types
  return data.value;
}
```

### Constants Usage

```typescript
// ✅ Good - Use centralized constants
import { CSS_LIMITS, IMAGE_SCALES } from '../config/constants.js';

const maxSize = CSS_LIMITS.MAX_SIZE_BYTES;
const scaleFactor = IMAGE_SCALES.RETINA;

// ❌ Bad - Magic numbers
const maxSize = 76800; // What is this?
const scaleFactor = 1.5; // Unclear meaning
```

---

## 🎨 SCSS Standards

### File Organization

```scss
// 1. Variables and imports first
@use 'abstracts/variables';
@use 'abstracts/mixins';

// 2. Base styles
// 3. Component styles
// 4. Utility classes
```

### Naming Conventions

| Type         | Convention | Example              |
| ------------ | ---------- | -------------------- |
| Classes      | kebab-case | `.user-profile`      |
| Variables    | kebab-case | `$primary-color`     |
| Mixins       | kebab-case | `@mixin flex-center` |
| Placeholders | kebab-case | `%button-base`       |

### Property Order

Properties should follow this order (enforced by Stylelint):

1. **Position** - position, top, right, bottom, left, z-index
2. **Display** - display, flex, grid, float, clear
3. **Box Model** - width, height, margin, padding
4. **Typography** - font, line-height, text-align
5. **Visual** - color, background, border, box-shadow
6. **Animation** - transition, transform, animation
7. **Misc** - cursor, pointer-events

```scss
// ✅ Good - Correct property order
.card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--bg-color);
  border-radius: 8px;
  transition: transform 0.2s;
}
```

### Nesting

- Maximum **3 levels** of nesting
- Use `&` for pseudo-classes and states

```scss
// ✅ Good - Shallow nesting
.card {
  padding: 1rem;

  &:hover {
    transform: translateY(-2px);
  }

  &__title {
    font-size: 1.5rem;
  }
}

// ❌ Bad - Deep nesting
.page {
  .container {
    .card {
      .card-body {
        .title {
          // Too deep!
        }
      }
    }
  }
}
```

### Colors

```scss
// ✅ Good - Use CSS custom properties
color: var(--text-primary);
background: var(--bg-surface);

// ✅ Good - Modern color notation
color: hsl(220 50% 50%);
background: rgb(255 255 255 / 80%);

// ❌ Bad - Named colors
color: red;
background: blue;

// ❌ Bad - Old notation
color: rgba(255, 255, 255, 0.8);
```

---

## 📐 HTML/Nunjucks Standards

### Structure

```html
<!-- ✅ Good - Semantic HTML -->
<article class="post">
  <header class="post-header">
    <h1>{{ title }}</h1>
  </header>
  <main class="post-content">{{ content | safe }}</main>
</article>

<!-- ❌ Bad - Div soup -->
<div class="post">
  <div class="header">
    <div class="title">{{ title }}</div>
  </div>
</div>
```

### AMP Compliance

```html
<!-- ✅ Good - AMP images -->
<amp-img src="/images/photo.webp" alt="Description" width="800" height="600" layout="responsive">
</amp-img>

<!-- ❌ Bad - Regular images -->
<img src="/images/photo.jpg" alt="Description" />
```

### Accessibility

```html
<!-- ✅ Good - Accessible -->
<button aria-label="Close menu" type="button">
  <span class="icon" aria-hidden="true">×</span>
</button>

<a href="/about" aria-current="page">About</a>

<!-- ❌ Bad - Inaccessible -->
<div onclick="close()">×</div>
```

---

## 📝 Documentation Standards

### JSDoc Comments

```typescript
/**
 * Calculate the reading time for content
 * @param content - HTML or text content
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 * @example
 * const time = readingTime('<p>Some content...</p>');
 * console.log(time); // 5
 */
export function readingTime(content: string, wordsPerMinute: number = 200): number {
  // implementation
}
```

### Inline Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Using 1.5x scale for retina iPad displays
const retinaScale = IMAGE_SCALES.RETINA;

// ❌ Bad - Obvious comment
// Set x to 5
const x = 5;
```

### Module Headers

```typescript
/**
 * Image Optimization Module
 * Generates optimized WebP/AVIF variants using Eleventy Image
 * @module lib/imageOptimizer
 */
```

---

## 🚫 Things to Avoid

### TypeScript

- ❌ `any` type (use `unknown` if needed)
- ❌ Non-null assertions (`!`)
- ❌ Type assertions without validation
- ❌ `console.log` in production code
- ❌ Magic numbers (use constants)

### SCSS

- ❌ `!important` declarations
- ❌ Vendor prefixes (use autoprefixer)
- ❌ Deep nesting (> 3 levels)
- ❌ Named colors (`red`, `blue`)
- ❌ ID selectors for styling

### HTML

- ❌ Inline styles
- ❌ Inline JavaScript
- ❌ Missing alt text
- ❌ Non-semantic elements for structure

---

## 🔧 Tooling

### ESLint

Configuration: `eslint.config.js`

- TypeScript strict mode
- Unicorn plugin (modern JS)
- SonarJS plugin (code quality)
- JSDoc plugin (documentation)
- Security plugin

### Stylelint

Configuration: `stylelint.config.js`

- SCSS standard config
- Property ordering
- Selector complexity limits

### Prettier

Configuration: `.prettierrc.json`

- Tab width: 4
- Single quotes
- Trailing commas: ES5
- Print width: 100

---

## ✅ Pre-commit Checklist

Before committing, ensure:

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test:unit` passes
- [ ] Commit message follows [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] New code has JSDoc comments
- [ ] No console.log statements
- [ ] No magic numbers

---

_Last updated: 2026-01-07_
