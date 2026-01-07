# 📖 API Reference

TypeScript module documentation and exports.

## Overview

All source modules are written in TypeScript and compiled to ES modules for Eleventy consumption.

---

## 🔧 Config Modules

### `src/config/constants.ts`

Centralized application constants.

#### Exports

```typescript
export const IMAGE_SCALES: {
  BASE: 1;
  RETINA: 1.5;
  RETINA_2X: 2;
};

export const CSS_LIMITS: {
  MAX_SIZE_BYTES: 76800; // 75 * 1024
  MAX_SIZE_KB: 75;
};

export const COMMON: {
  PERCENTAGE_MAX: 100;
  ARRAY_FIRST: 0;
  ARRAY_SECOND: 1;
  DECIMAL_PRECISION: 2;
  PERCENTAGE_PRECISION: 1;
  BYTES_PER_KB: 1024;
};

export const TIME: {
  SECONDS_PER_MINUTE: 60;
  MINUTES_PER_HOUR: 60;
  HOURS_PER_DAY: 24;
  DAYS_PER_YEAR: 365;
  WORDS_PER_MINUTE: 200;
};

export const BROWSER_TARGETS: {
  /* ... */
};
export const COMPLEXITY_LIMITS: {
  /* ... */
};
export const CSS_CONSTRAINTS: {
  /* ... */
};
```

#### Usage

```typescript
import { CSS_LIMITS, IMAGE_SCALES } from '../config/constants.js';

const maxSize = CSS_LIMITS.MAX_SIZE_BYTES;
const retinaScale = IMAGE_SCALES.RETINA;
```

---

### `src/config/browserTargets.ts`

Browser compatibility targets for CSS/JS compilation.

#### Exports

```typescript
export const BROWSER_TARGETS: string[];
```

---

### `src/config/projectPaths.ts`

Project directory paths.

#### Exports

```typescript
export const SRC_DIR: string;
export const OUTPUT_DIR: string;
export const DIST_DIR: string;
```

---

## 📦 Library Modules

### `src/lib/imageOptimizer.ts`

Image optimization using Eleventy Image.

#### Types

```typescript
export interface ImageOptimizationResult {
  src: string;
  srcset: string;
  width: number;
  height: number;
  fallbackSrc?: string;
}
```

#### Functions

```typescript
/**
 * Optimize an image using 11ty-img
 * @param src - Source path (relative to project root or absolute)
 * @param width - Target width
 * @param formats - Output formats (default: ['webp', 'jpeg'])
 * @returns Optimization result including src, srcset, width, height
 */
export async function optimizeImage(
  src: string,
  width: number,
  formats?: ('webp' | 'jpeg' | 'png' | 'avif')[]
): Promise<ImageOptimizationResult>;
```

#### Usage

```typescript
import { optimizeImage } from '../lib/imageOptimizer.js';

const result = await optimizeImage('/images/photo.jpg', 800);
// result.src → '/images/optimized/photo-800w.webp'
// result.srcset → '/images/optimized/photo-800w.webp 800w, ...'
```

---

### `src/lib/lightningCss.ts`

CSS optimization using LightningCSS.

#### Types

```typescript
interface LightningCssOptions {
  code: string;
  filename?: string;
  unusedSymbols?: string[];
  maxSize?: number;
}

interface LightningCssResult {
  css: string;
  sizeBytes: number;
  sizeKB: string;
  valid: boolean;
}
```

#### Functions

```typescript
/**
 * Process CSS with LightningCSS for extreme minification
 * @param options - Processing options
 * @returns Optimized CSS result
 */
export function processWithLightningCss(options: LightningCssOptions): LightningCssResult;
```

#### Usage

```typescript
import { processWithLightningCss } from '../lib/lightningCss.js';

const result = processWithLightningCss({
  code: '.class { color: red; }',
  filename: 'styles.css',
});
// result.css → '.class{color:red}'
// result.sizeKB → '0.02KB'
// result.valid → true
```

---

## 🔄 Transform Modules

### `src/transforms/cssGuard.ts`

CSS size validation and AMP compliance.

#### Types

```typescript
interface CssGuardResult {
  valid: boolean;
  sizeBytes: number;
  sizeKB: string;
  maxBytes: number;
  error?: string;
}
```

#### Functions

```typescript
/**
 * Extract CSS from <style amp-custom> tag
 */
export function extractAmpCustomCSS(html: string): string | null;

/**
 * Check if CSS size is within AMP limits
 */
export function checkCssSize(css: string, maxBytes?: number): CssGuardResult;

/**
 * CSS Guard Transform for Eleventy
 * Fails build if CSS exceeds limit
 */
export function cssGuard(content: string, maxSizeBytes?: number): string;

/**
 * Get CSS size statistics for a page
 */
export function getCssStats(
  html: string,
  maxBytes?: number
): CssGuardResult & { percentage: string };
```

#### Usage

```typescript
import { cssGuard, getCssStats } from '../transforms/cssGuard.js';

// In Eleventy config
eleventyConfig.addTransform('cssGuard', cssGuard);

// Check stats
const stats = getCssStats(htmlContent);
console.log(`CSS: ${stats.sizeKB} (${stats.percentage})`);
```

---

### `src/transforms/htmlMinify.ts`

HTML minification.

#### Functions

```typescript
/**
 * Minify HTML content
 */
export function minifyHtml(content: string): Promise<string>;

/**
 * Eleventy transform function
 */
export function htmlMinify(content: string, outputPath: string): Promise<string>;
```

#### Usage

```typescript
import { htmlMinify } from '../transforms/htmlMinify.js';

// In Eleventy config
eleventyConfig.addTransform('htmlMinify', htmlMinify);
```

---

## 🏷️ Filter Modules

### `src/filters/dateFormat.ts`

Date formatting filters.

#### Functions

```typescript
/**
 * Format date for display
 */
export function formatDate(date: Date, format?: string): string;

/**
 * Get relative time (e.g., "2 days ago")
 */
export function relativeDate(date: Date): string;
```

---

### `src/filters/readingTime.ts`

Reading time estimation.

#### Functions

```typescript
/**
 * Calculate reading time for text content
 * @param content - HTML or text content
 * @returns Reading time in minutes
 */
export function readingTime(content: string): number;
```

#### Usage

```typescript
import { readingTime } from '../filters/readingTime.js';

const minutes = readingTime(articleContent);
// minutes → 5
```

---

## 🖼️ Shortcode Modules

### `src/shortcodes/ampImg.ts`

AMP-compliant image shortcode.

#### Types

```typescript
type AmpLayout =
  | 'responsive'
  | 'intrinsic'
  | 'fixed'
  | 'fixed-height'
  | 'fill'
  | 'container'
  | 'flex-item'
  | 'nodisplay';

interface AmpImgShortcodeOptions {
  src: string;
  alt: string;
  width: number;
  height: number;
  layout?: AmpLayout;
  className?: string;
  hero?: boolean;
  dataCy?: string;
}
```

#### Functions

```typescript
/**
 * Generate an AMP-compliant image element
 */
export async function ampImg(options: AmpImgShortcodeOptions): Promise<string>;

/**
 * Generate amp-img with srcset
 */
export function ampImgResponsive(options: AmpImgOptions): string;

/**
 * Generate amp-img with WebP fallback
 */
export function ampImgWithFallback(options: AmpImgFallbackOptions): string;
```

#### Usage (Nunjucks)

```nunjucks
{% ampImg {
    src: "/images/hero.jpg",
    alt: "Hero image",
    width: 1200,
    height: 600,
    layout: "responsive",
    hero: true
} %}
```

---

### `src/shortcodes/chessBoard.ts`

Chess board diagram shortcode.

#### Functions

```typescript
/**
 * Generate chess board HTML
 */
export function chessBoard(fen: string): string;
```

---

## 📁 Module Organization

```
src/
├── config/              # Configuration
│   ├── constants.ts     # Centralized constants
│   ├── browserTargets.ts
│   ├── projectPaths.ts
│   └── index.ts
├── filters/             # Nunjucks filters
│   ├── dateFormat.ts
│   └── readingTime.ts
├── lib/                 # Core libraries
│   ├── imageOptimizer.ts
│   └── lightningCss.ts
├── shortcodes/          # Nunjucks shortcodes
│   ├── ampImg.ts
│   └── chessBoard.ts
├── transforms/          # Output transforms
│   ├── cssGuard.ts
│   └── htmlMinify.ts
└── types/               # Type definitions
    └── eleventyImg.d.ts
```

---

## 🔗 Import Patterns

### From Eleventy Config

```javascript
// eleventy.config.js
import { ampImg } from './dist/shortcodes/ampImg.js';
import { htmlMinify } from './dist/transforms/htmlMinify.js';
import { readingTime } from './dist/filters/readingTime.js';
```

### From Other Modules

```typescript
// src/shortcodes/ampImg.ts
import { optimizeImage } from '../lib/imageOptimizer.js';
import { CSS_LIMITS } from '../config/constants.js';
```

---

_Last updated: 2026-01-07_
