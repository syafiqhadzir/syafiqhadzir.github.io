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
}

/**
 * Generate an AMP-compliant image element
 * @param options - Image options
 * @returns HTML string for amp-img element
 * @example
 * {% ampImg { src: "./images/hero.webp", alt: "Hero image", width: 1200, height: 600 } %}
 */
export function ampImg(options: AmpImgShortcodeOptions): string {
    const { src, alt, width, height, layout = 'responsive', className = '' } = options;

    // Validate inputs
    validateOptions({ src, alt, width, height });

    // Auto-generate srcset for raster images (jpg, png, webp) if responsive
    let srcset = '';
    const isRaster = /\.(jpe?g|png|webp)$/iu.test(src);

    if (layout === 'responsive' && isRaster) {
        // Assume optimized images exist at standard breakpoints
        // e.g. "image.jpg" -> "image-640w.jpg 640w, image-1024w.jpg 1024w"
        const breakpoints = [640, 1024, 1920];
        const extension = src.slice(src.lastIndexOf('.'));
        const basePath = src.slice(0, src.lastIndexOf('.'));

        srcset = breakpoints.map((w) => `${basePath}-${w}w${extension} ${w}w`).join(', ');

        // Add original as fallback/max
        srcset += `, ${src} ${width}w`;
    }

    // Auto-generate sizes
    let sizes = '';
    if (layout === 'responsive') {
        sizes = `(max-width: ${width}px) 100vw, ${width}px`;
    }

    // Build attributes
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

    // Add optional class
    if (className) {
        attributes.push(`class="${escapeAttribute(className)}"`);
    }

    // Add loading strategy for responsive/intrinsic layouts
    if (layout === 'responsive' || layout === 'intrinsic') {
        attributes.push('loading="lazy"');
    }

    return `<amp-img ${attributes.join(' ')}></amp-img>`;
}

/**
 * Generate amp-img with srcset for multiple resolutions
 * @param options - Full image options
 * @returns HTML string for amp-img element with srcset
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
        `src="${escapeAttribute(src)}"`,
        `alt="${escapeAttribute(alt)}"`,
        `width="${width}"`,
        `height="${height}"`,
        `layout="${layout}"`,
    ];

    if (className) {
        attributes.push(`class="${escapeAttribute(className)}"`);
    }

    if (srcset) {
        attributes.push(`srcset="${escapeAttribute(srcset)}"`);
    }

    if (sizes) {
        attributes.push(`sizes="${escapeAttribute(sizes)}"`);
    }

    if (layout === 'responsive' || layout === 'intrinsic') {
        attributes.push('loading="lazy"');
    }

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
    loading="lazy"
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
