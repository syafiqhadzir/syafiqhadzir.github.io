/**
 * LightningCSS Build Module
 * Rust-based CSS optimization for extreme minification
 * @module build/lightningCss
 */

import { browserslistToTargets, transform } from 'lightningcss';
import { readFileSync } from 'node:fs';

/** Default maximum CSS size in bytes (75KB as per AMP spec) */
const MAX_CSS_SIZE = 75 * 1024;

/**
 * Browser targets for AMP compatibility
 * Modern browsers only to minimize vendor prefixes
 */
const BROWSER_TARGETS = browserslistToTargets([
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 Edge versions',
    'iOS >= 14',
    'Android >= 10',
]);

/**
 * LightningCSS configuration for extreme minification
 */
interface LightningCssOptions {
    /** Input CSS content */
    code: string;
    /** Filename for source maps and error reporting */
    filename?: string;
    /** Enable dead code elimination */
    unusedSymbols?: string[];
    /** Maximum output size in bytes */
    maxSize?: number;
}

/**
 * Result of LightningCSS processing
 */
interface LightningCssResult {
    /** Minified CSS string */
    css: string;
    /** Size in bytes */
    sizeBytes: number;
    /** Size in KB (formatted) */
    sizeKB: string;
    /** Whether size is within AMP limit */
    valid: boolean;
}

/**
 * Process CSS with LightningCSS for extreme minification
 * @param options - Processing options
 * @returns Optimized CSS result
 */
export function processWithLightningCss(options: LightningCssOptions): LightningCssResult {
    const { code, filename = 'styles.css', maxSize = MAX_CSS_SIZE } = options;

    const { code: minifiedBuffer } = transform({
        filename,
        code: Buffer.from(code),
        minify: true,
        targets: BROWSER_TARGETS,
        drafts: {
            customMedia: true,
        },
        errorRecovery: true,
    });

    const css = minifiedBuffer.toString();
    const sizeBytes = Buffer.byteLength(css, 'utf8');
    const sizeKB = (sizeBytes / 1024).toFixed(2);
    const valid = sizeBytes <= maxSize;

    return {
        css,
        sizeBytes,
        sizeKB: `${sizeKB}KB`,
        valid,
    };
}

/**
 * Process CSS file with LightningCSS
 * @param filePath - Path to CSS file
 * @param maxSize - Maximum allowed size
 * @returns Optimized CSS result
 */
export function processCssFile(filePath: string, maxSize = MAX_CSS_SIZE): LightningCssResult {
    const code = readFileSync(filePath, 'utf8');
    return processWithLightningCss({
        code,
        filename: filePath,
        maxSize,
    });
}

/**
 * Validate CSS size against AMP limit
 * @param css - CSS content
 * @param maxSize - Maximum size in bytes
 * @throws {Error} If CSS exceeds limit
 */
export function validateCssSize(css: string, maxSize = MAX_CSS_SIZE): void {
    const sizeBytes = Buffer.byteLength(css, 'utf8');
    if (sizeBytes > maxSize) {
        const sizeKB = (sizeBytes / 1024).toFixed(2);
        const maxKB = (maxSize / 1024).toFixed(0);
        throw new Error(
            `[LightningCSS] CSS size (${sizeKB}KB) exceeds AMP limit of ${maxKB}KB\n` +
                `Reduce your CSS to stay within the limit.`
        );
    }
}

/**
 * Get CSS optimization statistics
 * @param originalCss - Original CSS
 * @param optimizedCss - Optimized CSS
 * @returns Statistics object
 */
export function getCssOptimizationStats(
    originalCss: string,
    optimizedCss: string
): {
    originalSize: number;
    optimizedSize: number;
    savings: number;
    savingsPercent: number;
    withinAmpLimit: boolean;
} {
    const originalSize = Buffer.byteLength(originalCss, 'utf8');
    const optimizedSize = Buffer.byteLength(optimizedCss, 'utf8');
    const savings = originalSize - optimizedSize;
    const savingsPercent = originalSize > 0 ? (savings / originalSize) * 100 : 0;

    return {
        originalSize,
        optimizedSize,
        savings,
        savingsPercent,
        withinAmpLimit: optimizedSize <= MAX_CSS_SIZE,
    };
}
