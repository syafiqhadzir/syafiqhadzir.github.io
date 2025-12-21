/**
 * Extreme HTML Minification Transform for AMP
 * Maximum aggression with AMP boilerplate protection
 * @module transforms/extremeMinify
 */

import { minify } from 'html-minifier-terser';

/**
 * AMP Boilerplate markers for protection
 * These exact strings are regex-matched by the AMP validator
 */
const AMP_BOILERPLATE_STYLE = /<style amp-boilerplate>[\s\S]*?<\/style>/gi;
const AMP_BOILERPLATE_NOSCRIPT = /<noscript>[\s\S]*?<style amp-boilerplate>[\s\S]*?<\/style>[\s\S]*?<\/noscript>/gi;

/** Placeholder tokens for boilerplate preservation */
const BOILERPLATE_PLACEHOLDER = '<!--AMP_BOILERPLATE_PLACEHOLDER-->';
const NOSCRIPT_PLACEHOLDER = '<!--AMP_NOSCRIPT_PLACEHOLDER-->';

/**
 * Extreme HTML Minifier Configuration
 * Maximum aggression while maintaining AMP validity
 */
const EXTREME_MINIFIER_OPTIONS = {
    // ========== WHITESPACE (Maximum Aggression) ==========
    collapseWhitespace: true,
    collapseInlineTagWhitespace: false, // Preserve inline element spacing
    conservativeCollapse: false, // Aggressive mode
    preserveLineBreaks: false,

    // ========== COMMENTS ==========
    removeComments: true,

    // ========== ATTRIBUTES ==========
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    collapseBooleanAttributes: true,

    // ========== ATTRIBUTE QUOTES (Safe for AMP) ==========
    // AMP validator follows HTML5 spec - unquoted safe for simple values
    removeAttributeQuotes: true,

    // ========== OPTIONAL TAGS (Disabled for AMP safety) ==========
    // Removing </body> or </html> may cause validator edge cases
    removeOptionalTags: false,

    // ========== SORTING (Critical for Brotli compression) ==========
    sortAttributes: true,
    sortClassName: true,

    // ========== CONTENT HANDLING ==========
    decodeEntities: false, // Keep entities for AMP compatibility
    minifyCSS: false, // CSS already optimized by LightningCSS
    minifyJS: false, // AMP scripts are external CDN

    // ========== AMP-SPECIFIC ==========
    // Preserve amp-bind [attribute] syntax
    customAttrAssign: [/\[.*?]/],

    // ========== SAFETY ==========
    keepClosingSlash: false,
    quoteCharacter: '"',

    // ========== DANGER ZONE (Maximum savings) ==========
    useShortDoctype: true,
    removeTagWhitespace: false, // Could break some layouts
    caseSensitive: false,
};

/**
 * Extract and protect AMP boilerplate from minification
 * @param html - HTML content
 * @returns Object with protected HTML and extracted boilerplate
 */
function protectBoilerplate(html: string): {
    html: string;
    boilerplate: string;
    noscript: string;
} {
    let boilerplate = '';
    let noscript = '';
    let protectedHtml = html;

    // Extract noscript boilerplate first (contains style amp-boilerplate)
    const noscriptMatch = AMP_BOILERPLATE_NOSCRIPT.exec(protectedHtml);
    if (noscriptMatch) {
        noscript = noscriptMatch[0];
        protectedHtml = protectedHtml.replace(noscript, NOSCRIPT_PLACEHOLDER);
    }

    // Reset regex lastIndex
    AMP_BOILERPLATE_STYLE.lastIndex = 0;

    // Extract remaining style amp-boilerplate (the main one)
    const boilerplateMatch = AMP_BOILERPLATE_STYLE.exec(protectedHtml);
    if (boilerplateMatch) {
        boilerplate = boilerplateMatch[0];
        protectedHtml = protectedHtml.replace(boilerplate, BOILERPLATE_PLACEHOLDER);
    }

    return { html: protectedHtml, boilerplate, noscript };
}

/**
 * Restore protected AMP boilerplate after minification
 * @param html - Minified HTML with placeholders
 * @param boilerplate - Original boilerplate style
 * @param noscript - Original noscript boilerplate
 * @returns HTML with restored boilerplate
 */
function restoreBoilerplate(
    html: string,
    boilerplate: string,
    noscript: string
): string {
    let restoredHtml = html;
    if (boilerplate) {
        restoredHtml = restoredHtml.replace(BOILERPLATE_PLACEHOLDER, boilerplate);
    }
    if (noscript) {
        restoredHtml = restoredHtml.replace(NOSCRIPT_PLACEHOLDER, noscript);
    }
    return restoredHtml;
}

/**
 * Extreme HTML minification with AMP protection
 * @param content - HTML content to minify
 * @returns Minified HTML preserving AMP validity
 */
export async function extremeMinifyHtml(content: string): Promise<string> {
    if (content === '' || typeof content !== 'string') {
        return content;
    }

    try {
        // Step 1: Protect AMP boilerplate
        const { html, boilerplate, noscript } = protectBoilerplate(content);

        // Step 2: Apply extreme minification
        const minified = await minify(html, EXTREME_MINIFIER_OPTIONS);

        // Step 3: Restore protected boilerplate
        const result = restoreBoilerplate(minified, boilerplate, noscript);

        return result;
    } catch {
        // Minification failed, return original
        return content;
    }
}

/**
 * Eleventy transform for extreme HTML minification
 * Only minifies in production mode
 * @param content - HTML content
 * @param outputPath - Output file path
 * @returns Processed content
 */
export async function extremeMinifyTransform(
    content: string,
    outputPath: string | undefined
): Promise<string> {
    // Only minify HTML files
    if (!outputPath?.endsWith('.html')) {
        return content;
    }

    // Only minify in production
    if (process.env.NODE_ENV !== 'production') {
        return content;
    }

    return extremeMinifyHtml(content);
}

/**
 * Get minification statistics
 * @param original - Original HTML
 * @param minified - Minified HTML
 * @returns Statistics object
 */
export function getExtremeMinifyStats(original: string, minified: string): {
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
