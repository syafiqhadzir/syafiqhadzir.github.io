/**
 * HTML Minification Transform for Eleventy
 * Uses html-minifier-terser for aggressive minification
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
 * @param content - HTML content to minify
 * @returns Minified HTML
 */
export async function minifyHtml(content: string): Promise<string> {
    if (content === '' || typeof content !== 'string') {
        return content;
    }

    try {
        const minified = await minify(content, MINIFIER_OPTIONS);
        return minified;
    } catch {
        // Minification failed, return original content
        return content;
    }
}

/**
 * Eleventy transform for HTML minification
 * Only minifies in production mode
 * @param content - HTML content
 * @param outputPath - Output file path
 * @returns Processed content
 */
export async function htmlMinifyTransform(
    content: string,
    outputPath: string | undefined
): Promise<string> {
    if (!outputPath?.endsWith('.html')) {
        return content;
    }

    // Only minify in production
    if (process.env.NODE_ENV !== 'production') {
        return content;
    }

    const minified = await minifyHtml(content);

    return minified;
}

/**
 * Get minification statistics
 * @param original - Original HTML
 * @param minified - Minified HTML
 * @returns Statistics object
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
