/**
 * AMP Image Shortcode for Eleventy
 * Generates proper <amp-img> elements with responsive layouts
 * @module shortcodes/ampImg
 */

/** Valid AMP layout types */
type AmpLayout =
    | 'responsive'
    | 'intrinsic'
    | 'fixed'
    | 'fixed-height'
    | 'fill'
    | 'container'
    | 'flex-item'
    | 'nodisplay';

/** Configuration for amp-img shortcode */
interface AmpImgOptions {
    /** Image source URL */
    src: string;
    /** Alt text (required for accessibility) */
    alt: string;
    /** Image width in pixels */
    width: number;
    /** Image height in pixels */
    height: number;
    /** AMP layout type (default: responsive) */
    layout?: AmpLayout;
    /** Additional CSS classes */
    className?: string;
    /** Lazy loading (default: true) */
    lazy?: boolean;
    /** Placeholder attribute */
    placeholder?: boolean;
    /** Srcset for responsive images */
    srcset?: string;
    /** Sizes attribute */
    sizes?: string;
    /** Is this a hero image? (LCP optimization) */
    hero?: boolean;
    /** Cypress test selector (outputs as data-cy attribute) */
    dataCy?: string;
}

/**
 * Escape HTML attribute values
 * @param value - Attribute value
 * @returns Escaped value
 */
function escapeAttribute(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

/**
 * Validate required parameters
 * @param options - Image options
 * @throws {Error} If required parameters are missing
 */
function validateOptions(options: Partial<AmpImgOptions>): void {
    if (!options.src) {
        throw new Error('[ampImg] src is required');
    }
    if (!options.alt && options.alt !== '') {
        throw new Error('[ampImg] alt is required for accessibility');
    }
    if (!options.width || options.width <= 0) {
        throw new Error('[ampImg] width must be a positive number');
    }
    if (!options.height || options.height <= 0) {
        throw new Error('[ampImg] height must be a positive number');
    }
}

/** Options for basic ampImg shortcode */
interface AmpImgShortcodeOptions {
    src: string;
    alt: string;
    width: number;
    height: number;
    layout?: AmpLayout;
    className?: string;
    hero?: boolean;
    /** Cypress test selector (outputs as data-cy attribute) */
    dataCy?: string;
}

/**
 * Generate an AMP-compliant image element
 * @param options - Image options
 * @returns HTML string for amp-img element
 * @example
 * {% ampImg { src: "./images/hero.webp", alt: "Hero image", width: 1200, height: 600 } %}
 */
/**
 * Build AMP attributes array
 * @param options - Image options
 * @returns Array of attribute strings
 */
function buildAmpAttributes(options: AmpImgOptions): string[] {
    const {
        src,
        alt,
        width,
        height,
        layout = 'responsive',
        className = '',
        hero = false,
        srcset,
        sizes,
    } = options;

    const attributes: string[] = [
        `src="${escapeAttribute(src)}"`,
        `alt="${escapeAttribute(alt)}"`,
        `width="${width}"`,
        `height="${height}"`,
        `layout="${layout}"`,
    ];

    if (srcset) {
        attributes.push(`srcset="${escapeAttribute(srcset)}"`);
    }
    if (sizes) {
        attributes.push(`sizes="${escapeAttribute(sizes)}"`);
    }
    if (className) {
        attributes.push(`class="${escapeAttribute(className)}"`);
    }

    // Add LCP optimizations for hero images
    if (hero) {
        attributes.push('data-hero');
    }

    // Data attributes for testing
    if (options.dataCy) {
        attributes.push(`data-cy="${escapeAttribute(options.dataCy)}"`);
    }

    return attributes;
}

import { optimizeImage } from '../lib/imageOptimizer.js';

/**
 * Generate an AMP-compliant image element
 * @param options - Image options
 * @returns HTML string for amp-img element
 */
export async function ampImg(options: AmpImgShortcodeOptions): Promise<string> {
    const { src, alt, width, height } = options;

    // Validate inputs
    validateOptions({ src, alt, width, height });

    // Optimize image (generate WebP/AVIF variants)
    // Note: optimization is async and requires file system access
    let optimized;
    try {
        optimized = await optimizeImage(src, width);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`[ampImg] Failed to optimize ${src}, falling back to original`, error);
        // Fallback to original if optimization fails (e.g. during dry run or missing file)
        optimized = { src, srcset: '', width, height };
    }

    const attributes = buildAmpAttributes({
        ...options,
        src: optimized.src,
        srcset: optimized.srcset,
        width: optimized.width,
        height: optimized.height,
    });

    return `<amp-img ${attributes.join(' ')}></amp-img>`;
}

/**
 * Generate amp-img with srcset for multiple resolutions
 * @param options - Full image options
 * @returns HTML string for amp-img element with srcset
 */
export function ampImgResponsive(options: AmpImgOptions): string {
    validateOptions(options);
    const attributes = buildAmpAttributes(options);
    return `<amp-img ${attributes.join(' ')}></amp-img>`;
}

/** Options for ampImgWithFallback shortcode */
interface AmpImgFallbackOptions {
    webpSrc: string;
    fallbackSrc: string;
    alt: string;
    width: number;
    height: number;
    layout?: AmpLayout;
}

/**
 * Generate amp-img with WebP fallback
 * @param options - Image options with fallback
 * @returns HTML with amp-img and fallback
 */
export function ampImgWithFallback(options: AmpImgFallbackOptions): string {
    const { webpSrc, fallbackSrc, alt, width, height, layout = 'responsive' } = options;

    validateOptions({ src: webpSrc, alt, width, height });

    return `<amp-img
    src="${escapeAttribute(webpSrc)}"
    alt="${escapeAttribute(alt)}"
    width="${width}"
    height="${height}"
    layout="${layout}"
>
    <amp-img
        fallback
        src="${escapeAttribute(fallbackSrc)}"
        alt="${escapeAttribute(alt)}"
        width="${width}"
        height="${height}"
        layout="${layout}"
    ></amp-img>
</amp-img>`;
}
