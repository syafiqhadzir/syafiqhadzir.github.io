/**
 * LightningCSS Build Module
 * Rust-based CSS optimization for extreme minification
 * @module build/lightningCss
 */

import { browserslistToTargets, transform } from 'lightningcss';

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
