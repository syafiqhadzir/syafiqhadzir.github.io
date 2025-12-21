/**
 * SVGO Optimization Module
 * Aggressive SVG optimization for inline SVGs
 * @module build/svgoOptimize
 */

import { Config, optimize } from 'svgo';

/**
 * SVGO configuration for extreme optimization
 * Aggressive settings for maximum byte savings
 */
const SVGO_CONFIG: Config = {
    multipass: true, // Multiple optimization passes

    plugins: [
        // ========== CLEANUP ==========
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeEditorsNSData',
        'removeTitle',
        'removeDesc',
        'removeUselessDefs',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'removeEmptyText',
        'removeHiddenElems',

        // ========== ATTRIBUTE OPTIMIZATION ==========
        'removeUnknownsAndDefaults',
        'removeUselessStrokeAndFill',
        'removeUnusedNS',
        'cleanupAttrs',
        'cleanupIds',
        'cleanupNumericValues',

        // ========== STRUCTURE OPTIMIZATION ==========
        'collapseGroups',
        'mergePaths',
        'convertShapeToPath',
        'sortAttrs',
        'sortDefsChildren',

        // ========== PATH OPTIMIZATION ==========
        'convertPathData',
        'convertTransform',

        // ========== PRECISION ==========
        {
            name: 'cleanupNumericValues',
            params: {
                floatPrecision: 2,
            },
        },

        // ========== SVG ATTRIBUTES ==========
        {
            name: 'removeAttrs',
            params: {
                attrs: ['data-*', 'class', 'style'],
            },
        },

        // ========== EXPLICIT REMOVALS ==========
        {
            name: 'removeAttributesBySelector',
            params: {
                selector: 'svg',
                attributes: ['xml:space', 'xmlns:xlink'],
            },
        },
    ],
};

/**
 * Result of SVG optimization
 */
interface SvgoResult {
    /** Optimized SVG string */
    svg: string;
    /** Original size in bytes */
    originalSize: number;
    /** Optimized size in bytes */
    optimizedSize: number;
    /** Bytes saved */
    savings: number;
    /** Percentage saved */
    savingsPercent: number;
}

/**
 * Optimize SVG content with SVGO
 * @param svg - SVG content to optimize
 * @returns Optimization result
 */
export function optimizeSvg(svg: string): SvgoResult {
    const originalSize = Buffer.byteLength(svg, 'utf8');

    const result = optimize(svg, SVGO_CONFIG);
    const optimizedSvg = result.data;
    const optimizedSize = Buffer.byteLength(optimizedSvg, 'utf8');

    const savings = originalSize - optimizedSize;
    const savingsPercent = originalSize > 0 ? (savings / originalSize) * 100 : 0;

    return {
        svg: optimizedSvg,
        originalSize,
        optimizedSize,
        savings,
        savingsPercent,
    };
}

/**
 * Extract and optimize all inline SVGs from HTML
 * @param html - HTML content with inline SVGs
 * @returns HTML with optimized SVGs
 */
export function optimizeInlineSvgs(html: string): {
    html: string;
    stats: {
        count: number;
        totalSavings: number;
        totalSavingsPercent: number;
    };
} {
    const svgRegex = /<svg[\s\S]*?<\/svg>/gi;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let count = 0;

    const optimizedHtml = html.replaceAll(svgRegex, (match) => {
        count++;
        const result = optimizeSvg(match);
        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;
        return result.svg;
    });

    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const totalSavingsPercent =
        totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0;

    return {
        html: optimizedHtml,
        stats: {
            count,
            totalSavings,
            totalSavingsPercent,
        },
    };
}

/**
 * Get SVGO configuration for external use
 * @returns SVGO config object
 */
export function getSvgoConfig(): Config {
    return SVGO_CONFIG;
}
