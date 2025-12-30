import eleventyImage from '@11ty/eleventy-img';
import path from 'node:path';

export interface ImageOptimizationResult {
    src: string;
    srcset: string;
    width: number;
    height: number;
    fallbackSrc?: string;
}

const SCALE_RETINA = 1.5;
const SCALE_DOUBLE = 2;

/**
 * Optimize an image using 11ty-img
 * @param src - Source path (relative to project root or absolute)
 * @param width - Target width (or 'auto')
 * @param formats - Output formats
 * @returns Optimization result including src, srcset, width, height
 */
export async function optimizeImage(
    src: string,
    width: number,
    formats: ('webp' | 'jpeg' | 'png' | 'avif')[] = ['webp', 'jpeg']
): Promise<ImageOptimizationResult> {
    // Resolve path relative to project root if it starts with /
    const sourcePath = src.startsWith('/') ? `.${src}` : src;

    const options = {
        widths: [width, width * SCALE_RETINA, width * SCALE_DOUBLE], // 1x, 1.5x, 2x for retina
        formats,
        outputDir: './_site/images/optimized/',
        urlPath: '/images/optimized/',
        filenameFormat(id: string, srcPath: string, w: number, format: string): string {
            const extension = path.extname(srcPath);
            const name = path.basename(srcPath, extension);
            return `${name}-${w}w.${format}`;
        },
    };

    // Generate images (on disk)
    const metadata = await eleventyImage(sourcePath, options);

    // Extract data for AMP
    // We prioritize WebP for the main src/srcset if available
    const webpData = metadata.webp ? metadata.webp[0] : undefined;

    let fallbackData;
    if (metadata.jpeg) {
        fallbackData = metadata.jpeg[0];
    } else if (metadata.png) {
        fallbackData = metadata.png[0];
    }

    // Fallback to whatever we have if specific formats missing
    const mainFormat = webpData ?? fallbackData;
    if (!mainFormat) {
        throw new Error(`No image generated for ${src}`);
    }

    // Generate srcset for the main format (WebP)
    // eleventy-img metadata[format] is an array of sizes
    const mainVariant = metadata[mainFormat.format];
    const srcset = mainVariant?.map((entry) => entry.srcset).join(', ') ?? '';

    return {
        src: mainFormat.url,
        srcset,
        width: mainFormat.width,
        height: mainFormat.height,
        fallbackSrc: fallbackData?.url, // For <amp-img fallback>
    };
}
