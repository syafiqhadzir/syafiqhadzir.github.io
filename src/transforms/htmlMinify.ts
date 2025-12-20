/**
 * HTML Minification Transform for Eleventy
 * Uses html-minifier-terser for aggressive minification
 *
 * @module transforms/htmlMinify
 */

import { minify } from 'html-minifier-terser';

/**
 * HTML Minifier configuration optimized for AMP
 * Preserves AMP-required attributes while aggressively stripping whitespace
 */
const MINIFIER_OPTIONS = {
    // Whitespace handling
    collapseWhitespace: true,
    collapseInlineTagWhitespace: false,
    conservativeCollapse: true,
    preserveLineBreaks: false,

    // Tag handling
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,

    // Attribute handling
    collapseBooleanAttributes: true,
    decodeEntities: false, // Keep entities for AMP compatibility
    sortAttributes: true,
    sortClassName: true,

    // Content handling
    minifyCSS: false, // CSS already minified by CSSO
    minifyJS: false, // AMP scripts are external

    // AMP-specific: Keep custom amp-bind [attribute] syntax
    customAttrAssign: [/\[.*?\]/],

    // Safety
    keepClosingSlash: false,
    quoteCharacter: '"',
};

/**
 * Minify HTML content
 *
 * @param {string} content - HTML content to minify
 * @returns {Promise<string>} Minified HTML
 */
export async function minifyHtml(content: string): Promise<string> {
    if (!content || typeof content !== 'string') {
        return content;
    }

    try {
        const minified = await minify(content, MINIFIER_OPTIONS);
        return minified;
    } catch (error) {
        console.warn('[HTML Minify] Failed to minify, returning original:', error);
        return content;
    }
}

/**
 * Eleventy transform for HTML minification
 * Only minifies in production mode
 *
 * @param {string} content - HTML content
 * @param {string} outputPath - Output file path
 * @returns {Promise<string>} Processed content
 */
export async function htmlMinifyTransform(
    content: string,
    outputPath: string | undefined
): Promise<string> {
    // Only minify HTML files
    if (!outputPath || !outputPath.endsWith('.html')) {
        return content;
    }

    // Only minify in production
    if (process.env.NODE_ENV !== 'production') {
        return content;
    }

    const originalSize = Buffer.byteLength(content, 'utf8');
    const minified = await minifyHtml(content);
    const minifiedSize = Buffer.byteLength(minified, 'utf8');

    const savings = originalSize - minifiedSize;
    const percent = ((savings / originalSize) * 100).toFixed(1);

    console.log(`[HTML Minify] ${outputPath}: ${(originalSize / 1024).toFixed(2)}KB → ${(minifiedSize / 1024).toFixed(2)}KB (-${percent}%)`);

    return minified;
}

/**
 * Get minification statistics
 *
 * @param {string} original - Original HTML
 * @param {string} minified - Minified HTML
 * @returns {object} Statistics object
 */
export function getMinifyStats(original: string, minified: string): {
    originalSize: number;
    minifiedSize: number;
    savings: number;
    percent: number;
} {
    const originalSize = Buffer.byteLength(original, 'utf8');
    const minifiedSize = Buffer.byteLength(minified, 'utf8');
    const savings = originalSize - minifiedSize;
    const percent = (savings / originalSize) * 100;

    return {
        originalSize,
        minifiedSize,
        savings,
        percent,
    };
}
