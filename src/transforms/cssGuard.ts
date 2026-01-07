/**
 * CSS Guard Transform for Eleventy
 * Enforces the 75KB CSS limit for AMP pages
 * @module transforms/cssGuard
 */

import { COMMON, CSS_LIMITS } from '../config/constants.js';

/** Regex to extract <style amp-custom> content */
const AMP_CUSTOM_STYLE_REGEX = /<style\s+amp-custom[^>]*>([\s\S]*?)<\/style>/iu;

/**
 * Result of CSS guard check
 */
interface CssGuardResult {
    /** Whether the CSS is within limits */
    valid: boolean;
    /** CSS size in bytes */
    sizeBytes: number;
    /** CSS size in KB (formatted) */
    sizeKB: string;
    /** Maximum allowed size in bytes */
    maxBytes: number;
    /** Error message if invalid */
    error?: string;
}

/**
 * Calculate the byte size of a string (UTF-8)
 * @param string_ - String to measure
 * @returns Size in bytes
 */
function getByteSize(string_: string): number {
    return new TextEncoder().encode(string_).length;
}

/**
 * Extract CSS from <style amp-custom> tag
 * @param html - HTML content
 * @returns CSS content or null if not found
 */
export function extractAmpCustomCSS(html: string): string | null {
    const match = AMP_CUSTOM_STYLE_REGEX.exec(html);
    return match?.[1] ?? null;
}

/**
 * Check if CSS size is within AMP limits
 * @param css - CSS content
 * @param maxBytes - Maximum allowed size in bytes
 * @returns Validation result
 */
export function checkCssSize(
    css: string,
    maxBytes: number = CSS_LIMITS.MAX_SIZE_BYTES
): CssGuardResult {
    const sizeBytes = getByteSize(css);
    const sizeKB = (sizeBytes / COMMON.BYTES_PER_KB).toFixed(COMMON.DECIMAL_PRECISION);
    const valid = sizeBytes <= maxBytes;

    return {
        valid,
        sizeBytes,
        sizeKB: `${sizeKB}KB`,
        maxBytes,
        error: valid
            ? undefined
            : `CSS size (${sizeKB}KB) exceeds AMP limit of ${CSS_LIMITS.MAX_SIZE_KB}KB`,
    };
}

import { processWithLightningCss } from '../lib/lightningCss.js';

/**
 * CSS Guard Transform for Eleventy
 * Fails the build if inlined CSS exceeds the specified limit
 * Uses LightningCSS for AST-based verification and minification
 * @param content - HTML content
 * @param maxSizeBytes - Maximum allowed CSS size in bytes (default: 75KB)
 * @returns Original content if valid
 * @throws {Error} If CSS exceeds the limit
 */
export function cssGuard(
    content: string,
    maxSizeBytes: number = CSS_LIMITS.MAX_SIZE_BYTES
): string {
    if (content === '') {
        return content;
    }

    // Extract CSS from amp-custom style tag
    const css = extractAmpCustomCSS(content);

    // If no amp-custom style found, pass through
    if (css === null) {
        return content;
    }

    // Process with LightningCSS (Minify + Check Size)
    const result = processWithLightningCss({
        code: css,
        maxSize: maxSizeBytes,
        filename: 'inline-amp.css',
    });

    // Fail build if over limit
    if (!result.valid) {
        throw new Error(
            `[CSS Guard] BUILD FAILED: CSS size (${result.sizeKB}) exceeds AMP limit of ${CSS_LIMITS.MAX_SIZE_KB}KB\n` +
                `Reduce your CSS to stay within the AMP limit.\n` +
                `Tips:\n` +
                `  - Remove unused styles\n` +
                `  - Split critical/non-critical CSS`
        );
    }

    // Replace the original CSS with the minified version (Optimization)
    // We use a safe replacement that only touches the extracted CSS
    // However, since we extracted via regex match[1], we need to be careful.
    // simpler to just replace the first occurrence of the css block content if we are sure.
    // Or better, re-construct the tag.

    const match = AMP_CUSTOM_STYLE_REGEX.exec(content);
    if (match) {
        const fullTag = match[0];
        const newTag = `<style amp-custom>${result.css}</style>`;
        return content.replace(fullTag, newTag);
    }

    return content;
}

/**
 * Get CSS size statistics for a page
 * Useful for build reports
 * @param html - HTML content
 * @param maxBytes - Maximum allowed size
 * @returns Size stats with percentage
 */
export function getCssStats(
    html: string,
    maxBytes: number = CSS_LIMITS.MAX_SIZE_BYTES
): CssGuardResult & { percentage: string } {
    const css = extractAmpCustomCSS(html) ?? '';
    const result = checkCssSize(css, maxBytes);
    const percentage = ((result.sizeBytes / maxBytes) * COMMON.PERCENTAGE_MAX).toFixed(
        COMMON.PERCENTAGE_PRECISION
    );

    return {
        ...result,
        percentage: `${percentage}%`,
    };
}
