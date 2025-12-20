/**
 * CSS Guard Transform for Eleventy
 * Enforces the 75KB CSS limit for AMP pages
 *
 * @module transforms/cssGuard
 */

/** Default maximum CSS size in bytes (75KB as per AMP spec) */
const DEFAULT_MAX_SIZE = 75 * 1024;

/** Regex to extract <style amp-custom> content */
const AMP_CUSTOM_STYLE_REGEX = /<style\s+amp-custom[^>]*>([\s\S]*?)<\/style>/i;

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
 *
 * @param {string} str - String to measure
 * @returns {number} Size in bytes
 */
function getByteSize(str: string): number {
    return new TextEncoder().encode(str).length;
}

/**
 * Extract CSS from <style amp-custom> tag
 *
 * @param {string} html - HTML content
 * @returns {string | null} CSS content or null if not found
 */
export function extractAmpCustomCSS(html: string): string | null {
    const match = html.match(AMP_CUSTOM_STYLE_REGEX);
    return match ? match[1] : null;
}

/**
 * Check if CSS size is within AMP limits
 *
 * @param {string} css - CSS content
 * @param {number} maxBytes - Maximum allowed size in bytes
 * @returns {CssGuardResult} Validation result
 */
export function checkCssSize(
    css: string,
    maxBytes: number = DEFAULT_MAX_SIZE
): CssGuardResult {
    const sizeBytes = getByteSize(css);
    const sizeKB = (sizeBytes / 1024).toFixed(2);
    const valid = sizeBytes <= maxBytes;

    return {
        valid,
        sizeBytes,
        sizeKB: `${sizeKB}KB`,
        maxBytes,
        error: valid
            ? undefined
            : `CSS size (${sizeKB}KB) exceeds AMP limit of ${(maxBytes / 1024).toFixed(0)}KB`,
    };
}

/**
 * CSS Guard Transform for Eleventy
 * Fails the build if inlined CSS exceeds the specified limit
 *
 * @param {string} content - HTML content
 * @param {number} maxSizeBytes - Maximum allowed CSS size in bytes (default: 75KB)
 * @returns {string} Original content if valid
 * @throws {Error} If CSS exceeds the limit
 *
 * @example
 * // In eleventy.config.js
 * eleventyConfig.addTransform('cssGuard', (content, outputPath) => {
 *     if (outputPath?.endsWith('.html')) {
 *         return cssGuard(content, 75 * 1024);
 *     }
 *     return content;
 * });
 */
export function cssGuard(
    content: string,
    maxSizeBytes: number = DEFAULT_MAX_SIZE
): string {
    // Skip if no content
    if (!content) {
        return content;
    }

    // Extract CSS from amp-custom style tag
    const css = extractAmpCustomCSS(content);

    // If no amp-custom style found, pass through
    if (css === null) {
        return content;
    }

    // Check CSS size
    const result = checkCssSize(css, maxSizeBytes);

    // Log size for visibility
    console.log(`[CSS Guard] Size: ${result.sizeKB} / ${(maxSizeBytes / 1024).toFixed(0)}KB`);

    // Fail build if over limit
    if (!result.valid) {
        throw new Error(
            `[CSS Guard] BUILD FAILED: ${result.error}\n` +
            `Reduce your CSS to stay within the AMP limit.\n` +
            `Tips:\n` +
            `  - Remove unused styles\n` +
            `  - Use CSSO for minification\n` +
            `  - Split critical/non-critical CSS`
        );
    }

    return content;
}

/**
 * Get CSS size statistics for a page
 * Useful for build reports
 *
 * @param {string} html - HTML content
 * @param {number} maxBytes - Maximum allowed size
 * @returns {CssGuardResult & { percentage: string }} Size stats with percentage
 */
export function getCssStats(
    html: string,
    maxBytes: number = DEFAULT_MAX_SIZE
): CssGuardResult & { percentage: string } {
    const css = extractAmpCustomCSS(html) ?? '';
    const result = checkCssSize(css, maxBytes);
    const percentage = ((result.sizeBytes / maxBytes) * 100).toFixed(1);

    return {
        ...result,
        percentage: `${percentage}%`,
    };
}
