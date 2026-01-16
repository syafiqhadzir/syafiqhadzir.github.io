/**
 * LightningCSS Build Module
 * Rust-based CSS optimization for extreme minification
 * @module build/lightningCss
 */

import { browserslistToTargets, transform } from 'lightningcss';
import { COMMON, CSS_LIMITS } from '../config/constants.js';

/**
 * Browser targets for AMP compatibility
 * Using older browser versions to disable CSS nesting support
 * AMP doesn't support CSS nesting, so we target browsers before nesting was supported
 */
const BROWSER_TARGETS = browserslistToTargets([
    'Chrome 100', // Before CSS nesting support (Chrome 112+)
    'Firefox 100', // Before CSS nesting support (Firefox 117+)
    'Safari 15', // Before CSS nesting support (Safari 16.5+)
    'Edge 100', // Before CSS nesting support (Edge 112+)
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
 * Strip AMP-incompatible CSS features
 * NOTE: Tailwind v3 doesn't generate \@layer/\@property/\@page, so this is mostly preventive
 * @param css - Input CSS string
 * @returns CSS with AMP-incompatible features removed
 */
function stripAmpIncompatibleFeatures(css: string): string {
    // Tailwind v3 generates AMP-compatible CSS, no stripping needed
    // This function is kept for future compatibility
    return css;
}

/**
 * Process CSS with LightningCSS for extreme minification
 * @param options - Processing options
 * @returns Optimized CSS result
 */
export function processWithLightningCss(options: LightningCssOptions): LightningCssResult {
    const { code, filename = 'styles.css', maxSize = CSS_LIMITS.MAX_SIZE_BYTES } = options;

    // Strip AMP-incompatible features BEFORE LightningCSS processing
    const ampCompatibleCss = stripAmpIncompatibleFeatures(code);

    const { code: minifiedBuffer } = transform({
        filename,
        code: Buffer.from(ampCompatibleCss),
        minify: true,
        targets: BROWSER_TARGETS,
        drafts: {
            customMedia: true,
        },
        errorRecovery: true,
    });

    // Strip AGAIN after LightningCSS - it may add back nested selectors
    let css = minifiedBuffer.toString();
    css = stripAmpIncompatibleFeatures(css);

    const sizeBytes = Buffer.byteLength(css, 'utf8');
    const sizeKB = (sizeBytes / COMMON.BYTES_PER_KB).toFixed(COMMON.DECIMAL_PRECISION);
    const valid = sizeBytes <= maxSize;

    return {
        css,
        sizeBytes,
        sizeKB: `${sizeKB}KB`,
        valid,
    };
}
