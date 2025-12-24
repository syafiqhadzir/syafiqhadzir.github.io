# Style Guide

Design tokens, patterns, and styling conventions for the portfolio.

## Color Tokens

### Brand Colors

| Token                  | Light   | Dark    | Usage                  |
| ---------------------- | ------- | ------- | ---------------------- |
| `--color-accent`       | #d32f2f | #ff6b6b | Primary actions, links |
| `--color-accent-hover` | #b71c1c | #ff8787 | Hover states           |

### Background Colors

| Token                  | Light   | Dark    | Usage              |
| ---------------------- | ------- | ------- | ------------------ |
| `--color-bg-primary`   | #fff    | #121212 | Page background    |
| `--color-bg-secondary` | #f4f4f4 | #1e1e1e | Cards, sections    |
| `--color-bg-tertiary`  | #e8e8e8 | #2a2a2a | Subtle backgrounds |

### Text Colors

| Token                    | Light   | Dark    | Usage             |
| ------------------------ | ------- | ------- | ----------------- |
| `--color-text-primary`   | #333    | #e0e0e0 | Body text         |
| `--color-text-secondary` | #595959 | #b3b3b3 | Secondary text    |
| `--color-text-muted`     | #595959 | #9a9a9a | Muted/helper text |
| `--color-text-heading`   | #111    | #fff    | Headings          |

---

## Typography

### Font Stack

```css
--font-family-base: 'Inconsolata', monospace;
--font-family-mono: 'Inconsolata', 'Fira Code', 'Consolas', monospace;
```

### Fluid Typography Scale

All font sizes use `clamp()` for responsive scaling:

| Token              | Min  | Preferred       | Max  |
| ------------------ | ---- | --------------- | ---- |
| `--font-size-xs`   | 10px | -               | 12px |
| `--font-size-sm`   | 12px | -               | 16px |
| `--font-size-base` | 14px | -               | 18px |
| `--font-size-lg`   | 16px | -               | 20px |
| `--font-size-h1`   | 28px | 1.5rem + 1.5vw  | 48px |
| `--font-size-h2`   | 24px | 1.3rem + 1vw    | 36px |
| `--font-size-h3`   | 20px | 1.1rem + 0.75vw | 28px |

---

## Spacing System

Based on 8px unit (`--space-unit: 8px`):

| Token         | Value | Usage           |
| ------------- | ----- | --------------- |
| `--space-2xs` | 4px   | Tight gaps      |
| `--space-xs`  | 8px   | Small gaps      |
| `--space-sm`  | 12px  | Medium-small    |
| `--space-md`  | 16px  | Default spacing |
| `--space-lg`  | 24px  | Section padding |
| `--space-xl`  | 32px  | Large gaps      |
| `--space-2xl` | 40px  | Extra large     |

---

## Border Radius

| Token                  | Value | Usage             |
| ---------------------- | ----- | ----------------- |
| `--border-radius-sm`   | 2px   | Subtle rounding   |
| `--border-radius-md`   | 4px   | Buttons, inputs   |
| `--border-radius-lg`   | 8px   | Cards             |
| `--border-radius-full` | 50%   | Circular elements |

---

## Shadows

| Token         | Usage            |
| ------------- | ---------------- |
| `--shadow-sm` | Subtle elevation |
| `--shadow-md` | Cards, dropdowns |
| `--shadow-lg` | Modals, popovers |

---

## Transitions

| Token               | Duration | Usage              |
| ------------------- | -------- | ------------------ |
| `--transition-fast` | 150ms    | Hover states       |
| `--transition-base` | 200ms    | Default animations |
| `--transition-slow` | 300ms    | Page transitions   |

---

## Utility Classes

### Display

- `.d-none`, `.d-block`, `.d-flex`, `.d-grid`

### Flexbox

- `.flex-row`, `.flex-column`
- `.justify-center`, `.justify-between`
- `.align-center`, `.align-start`

### Text

- `.text-left`, `.text-center`, `.text-right`
- `.text-primary`, `.text-secondary`, `.text-muted`
- `.font-bold`, `.font-semibold`

### Spacing

- `.m-0`, `.mx-auto`, `.my-auto`
- `.p-0`
- `.gap-xs` through `.gap-xl`

### Accessibility

- `.sr-only` - Screen reader only
- `.skip-link` - Keyboard navigation skip link

---

## Dark Mode

Toggle with `data-theme` attribute:

```html
<html data-theme="dark"></html>
```

Or use class on body:

```html
<body class="dark"></body>
```

System preference is respected automatically via:

```css
@media (prefers-color-scheme: dark) { ... }
```

---

## Accessibility

- Minimum touch target: 44×44px (`--touch-target-min`)
- Focus ring: 3px solid (`--focus-ring-width`)
- Color contrast: WCAG AA compliant (4.5:1 minimum)
- Reduced motion: Respects `prefers-reduced-motion`
