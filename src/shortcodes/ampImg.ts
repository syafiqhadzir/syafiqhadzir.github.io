/**
 * AMP Image Shortcode for Eleventy
 * Generates proper <amp-img> elements with responsive layouts
 *
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
}

/**
 * Escape HTML attribute values
 *
 * @param {string} value - Attribute value
 * @returns {string} Escaped value
 */
function escapeAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Validate required parameters
 *
 * @param {AmpImgOptions} options - Image options
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

/**
 * Generate an AMP-compliant image element
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @param {AmpLayout} layout - AMP layout type
 * @param {string} className - Additional CSS classes
 * @returns {string} HTML string for amp-img element
 *
 * @example
 * {% ampImg "./images/hero.webp", "Hero image", 1200, 600 %}
 * {% ampImg "./images/avatar.webp", "Profile photo", 120, 120, "fixed", "profile-picture" %}
 */
export function ampImg(
    src: string,
    alt: string,
    width: number,
    height: number,
    layout: AmpLayout = 'responsive',
    className: string = ''
): string {
    // Validate inputs
    validateOptions({ src, alt, width, height });

    // Build attributes
    const attributes: string[] = [
        `src="${escapeAttr(src)}"`,
        `alt="${escapeAttr(alt)}"`,
        `width="${width}"`,
        `height="${height}"`,
        `layout="${layout}"`,
    ];

    // Add optional class
    if (className) {
        attributes.push(`class="${escapeAttr(className)}"`);
    }

    // Add loading strategy for responsive/intrinsic layouts
    if (layout === 'responsive' || layout === 'intrinsic') {
        attributes.push('loading="lazy"');
    }

    return `<amp-img ${attributes.join(' ')}></amp-img>`;
}

/**
 * Generate amp-img with srcset for multiple resolutions
 *
 * @param {AmpImgOptions} options - Full image options
 * @returns {string} HTML string for amp-img element with srcset
 */
export function ampImgResponsive(options: AmpImgOptions): string {
    validateOptions(options);

    const {
        src,
        alt,
        width,
        height,
        layout = 'responsive',
        className = '',
        srcset,
        sizes,
    } = options;

    const attributes: string[] = [
        `src="${escapeAttr(src)}"`,
        `alt="${escapeAttr(alt)}"`,
        `width="${width}"`,
        `height="${height}"`,
        `layout="${layout}"`,
    ];

    if (className) {
        attributes.push(`class="${escapeAttr(className)}"`);
    }

    if (srcset) {
        attributes.push(`srcset="${escapeAttr(srcset)}"`);
    }

    if (sizes) {
        attributes.push(`sizes="${escapeAttr(sizes)}"`);
    }

    if (layout === 'responsive' || layout === 'intrinsic') {
        attributes.push('loading="lazy"');
    }

    return `<amp-img ${attributes.join(' ')}></amp-img>`;
}

/**
 * Generate amp-img with WebP fallback
 *
 * @param {string} webpSrc - WebP image source
 * @param {string} fallbackSrc - Fallback image source (JPEG/PNG)
 * @param {string} alt - Alt text
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {AmpLayout} layout - Layout type
 * @returns {string} HTML with amp-img and fallback
 */
export function ampImgWithFallback(
    webpSrc: string,
    fallbackSrc: string,
    alt: string,
    width: number,
    height: number,
    layout: AmpLayout = 'responsive'
): string {
    validateOptions({ src: webpSrc, alt, width, height });

    return `<amp-img
    src="${escapeAttr(webpSrc)}"
    alt="${escapeAttr(alt)}"
    width="${width}"
    height="${height}"
    layout="${layout}"
    loading="lazy"
>
    <amp-img
        fallback
        src="${escapeAttr(fallbackSrc)}"
        alt="${escapeAttr(alt)}"
        width="${width}"
        height="${height}"
        layout="${layout}"
    ></amp-img>
</amp-img>`;
}
