# Tailwind CSS + Sass Architecture Guide

## Overview

This project implements an **expert-level Tailwind CSS and Sass integration** optimized for Google
AMP's strict inline CSS constraints (75KB limit). The architecture combines the utility-first
approach of Tailwind with the power of Sass preprocessor features.

## Architecture Pattern

### Hybrid Approach: Tailwind-First with Sass Enhancement

```
┌─────────────────────────────────────────────────┐
│  Design System Foundation (CSS Custom Props)    │
│  src/scss/abstracts/_tokens.scss                │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Tailwind CSS (Utility Generation)              │
│  @tailwind base, components, utilities          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Sass Enhancement Layer                         │
│  - Component @apply patterns                    │
│  - Dynamic utility generation                   │
│  - Complex mixins & functions                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Build Pipeline                                 │
│  Sass → PostCSS (Tailwind) → LightningCSS      │
└─────────────────────────────────────────────────┘
```

## Build Pipeline

### Processing Order

1. **Dart Sass Compilation**
   - Processes `.scss` files
   - Resolves `@use`, `@forward`, `@import`
   - Evaluates Sass functions and mixins

2. **PostCSS + Tailwind**
   - Processes `@tailwind` directives
   - Generates utility classes
   - Applies autoprefixer

3. **LightningCSS Minification**
   - Extreme minification for AMP
   - Modern CSS optimization
   - Browser targeting

### Configuration Files

- **tailwind.config.js** - Tailwind configuration using CSS custom properties
- **postcss.config.js** - PostCSS plugins (Tailwind, Autoprefixer)
- **eleventy.config.js** - Build orchestration

## File Structure

```
src/scss/
├── main.scss                    # Entry point with @tailwind directives
├── abstracts/
│   ├── _tokens.scss            # CSS custom properties (design tokens)
│   ├── _mixins.scss            # Sass mixins (breakpoints, a11y)
│   ├── _functions.scss         # Sass functions
│   └── _index.scss             # Module exports
├── base/
│   ├── _reset.scss             # Modern CSS reset
│   ├── _typography.scss        # Base typography (@layer base)
│   ├── _print.scss             # Print styles
│   └── _index.scss             # Module exports
├── components/
│   ├── _components.scss        # Components using @apply
│   └── _index.scss             # Module exports
├── utilities/
│   ├── _utilities.scss         # Custom utilities (@layer utilities)
│   └── _index.scss             # Module exports
└── _icons.scss                  # Font Awesome icons
```

## Key Concepts

### 1. Layered CSS Architecture

Using Tailwind's `@layer` directive for proper cascade control:

```scss
@layer base {
  // Base styles (resets, typography defaults)
  h1 {
    font-size: var(--font-size-h1);
  }
}

@layer components {
  // Semantic component classes using @apply
  .navbar {
    @apply flex justify-between items-center;
  }
}

@layer utilities {
  // Custom utilities complementing Tailwind
  .text-fluid-lg {
    font-size: clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
  }
}
```

### 2. Design Token Strategy

**CSS Custom Properties** serve as the single source of truth:

```scss
:root {
  --color-accent: #d32f2f;
  --space-md: 16px;
  --font-size-h1: clamp(1.75rem, 1.5rem + 1.5vw, 3rem);
}
```

**Tailwind Config** references these tokens:

```javascript
theme: {
    extend: {
        colors: {
            accent: {
                DEFAULT: 'var(--color-accent)',
            }
        }
    }
}
```

### 3. Component Pattern with @apply

Semantic class names composed from Tailwind utilities:

```scss
@layer components {
  .navbar {
    @apply flex flex-wrap justify-between items-center;
    @apply py-[var(--navbar-padding)];

    a {
      @apply no-underline;
    }
  }
}
```

**Benefits:**

- ✅ Readable HTML with semantic class names
- ✅ Leverages Tailwind's design system
- ✅ Easy to override with utility classes
- ✅ Maintainable and DRY

### 4. Sass-Powered Dynamic Utilities

Use Sass loops and mixins for complex utilities:

```scss
@layer utilities {
  // Generate responsive gap utilities
  @each $name, $value in ('xs': var(--space-xs), 'md': var(--space-md), 'lg': var(--space-lg)) {
    @include media-up('md') {
      .md\:gap-#{$name} {
        gap: $value;
      }
    }
  }
}
```

### 5. Accessibility-First Utilities

Enhanced beyond Tailwind's defaults:

```scss
@layer utilities {
  // Screen reader only
  .sr-only {
    @apply absolute w-px h-px -m-px p-0 overflow-hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
  }

  // High contrast mode
  @media (prefers-contrast: high) {
    .contrast-more\:underline {
      text-decoration: underline;
    }
  }

  // Reduced motion
  @media (prefers-reduced-motion: reduce) {
    .motion-safe\:animate-none {
      animation: none !important;
    }
  }
}
```

## Best Practices

### DO ✅

1. **Use Tailwind utilities in HTML** for one-off styles

   ```html
   <div class="flex justify-center p-4 bg-accent text-white rounded-lg"></div>
   ```

2. **Use @apply in components** for repeated patterns

   ```scss
   .card {
     @apply p-lg rounded-lg shadow-md bg-bg-primary;
   }
   ```

3. **Use Sass mixins** for complex responsive logic

   ```scss
   @include media-up('md') {
     .navbar {
       @apply flex-row;
     }
   }
   ```

4. **Use CSS custom properties** for theme values
   ```scss
   color: var(--color-accent);
   padding: var(--space-lg);
   ```

### DON'T ❌

1. ❌ Don't recreate Tailwind utilities in Sass

   ```scss
   // Bad - Tailwind already provides this
   .flex {
     display: flex;
   }
   ```

2. ❌ Don't overuse @apply (diminishes Tailwind's benefits)

   ```scss
   // Bad - Just use utilities in HTML
   .simple-box {
     @apply p-4 bg-white rounded;
   }
   ```

3. ❌ Don't hardcode values (use design tokens)

   ```scss
   // Bad
   padding: 16px;

   // Good
   padding: var(--space-md);
   ```

## Performance Optimization

### AMP CSS Budget: 75KB Limit

**Strategies:**

1. **Aggressive PurgeCSS via Tailwind**

   ```javascript
   // tailwind.config.js
   content: ['./_site/**/*.html', './src/**/*.{njk,html,js,ts}'];
   ```

2. **Disable Tailwind Preflight** (custom reset instead)

   ```javascript
   corePlugins: {
     preflight: false;
   }
   ```

3. **LightningCSS Minification**
   - CSS minification
   - Property shortening
   - Dead code elimination

4. **Selective Utility Generation**
   - Only generate used utilities
   - Use `@apply` to reduce duplication

### Size Monitoring

Build pipeline includes CSS size guard:

```javascript
if (sizeBytes > MAX_CSS_SIZE_BYTES) {
  throw new Error(`CSS exceeds AMP 75KB limit`);
}
```

## Responsive Design

### Tailwind Responsive Utilities

```html
<!-- Mobile-first responsive design -->
<div class="text-sm md:text-base lg:text-lg">Responsive text</div>
```

### Sass Breakpoint Mixins

For complex responsive logic:

```scss
@include media-up('md') {
  .complex-component {
    @apply grid grid-cols-2 gap-lg;
  }
}
```

### Breakpoint Scale

```scss
$breakpoints: (
  'xs': 320px,
  'sm': 480px,
  'md': 600px,
  'lg': 768px,
  'xl': 1024px,
  'xxl': 1280px,
);
```

## Dark Mode

### AMP-Compatible Dark Mode

Using body class instead of Tailwind's `dark:` variant:

```scss
body.dark {
  .dark\:bg-dark {
    background-color: var(--color-bg-dark);
  }
}
```

**Why?** AMP uses `amp-bind` for theme switching with body class.

## Migration from Pure Sass

### What Changed

1. **Added Tailwind Directives**

   ```scss
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

2. **Refactored Components with @apply**

   ```scss
   // Before
   .navbar {
     display: flex;
     justify-content: space-between;
   }

   // After
   .navbar {
     @apply flex justify-between;
   }
   ```

3. **Removed Duplicate Utilities**
   - Removed utilities already in Tailwind (flex, grid, spacing, etc.)
   - Kept domain-specific utilities

4. **Enhanced Build Pipeline**
   - Added PostCSS + Tailwind step
   - Maintained LightningCSS minification

## Testing

### Build Commands

```bash
# Development build
npm run dev

# Production build (with minification)
npm run build:prod

# CSS size report
npm run build:size-report
```

### Validation

```bash
# Lint Sass files
npm run lint:css

# Validate AMP compliance
npm run validate:amp
```

## Troubleshooting

### Common Issues

1. **@apply not working**
   - Ensure Tailwind is loaded in PostCSS config
   - Check that utilities exist in Tailwind

2. **CSS exceeds 75KB**
   - Review content paths in tailwind.config.js
   - Remove unused utilities
   - Consider splitting components

3. **Custom properties not working**
   - Verify tokens.scss is loaded before Tailwind
   - Check :root selector is present

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sass Documentation](https://sass-lang.com/documentation)
- [AMP CSS Requirements](https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/)
- [LightningCSS](https://lightningcss.dev/)

## Conclusion

This architecture provides:

- **Utility-first development** with Tailwind
- **Powerful preprocessing** with Sass
- **Design system consistency** with CSS custom properties
- **Extreme optimization** for AMP constraints
- **Developer experience** with semantic class names

The best of both worlds: Tailwind's speed + Sass's power.
