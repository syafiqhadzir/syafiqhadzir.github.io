declare module '@11ty/eleventy-img' {
    interface ImageOptions {
        widths?: (number | 'auto')[];
        formats?: string[];
        outputDir?: string;
        urlPath?: string;
        filenameFormat?: (id: string, src: string, width: number, format: string) => string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    }

    interface ImageMetadata {
        format: string;
        width: number;
        height: number;
        url: string;
        sourceType: string;
        srcset: string;
        filename: string;
        outputPath: string;
        size: number;
    }

    type ImageStats = Record<string, ImageMetadata[]>;

    function eleventyImage(src: string, options?: ImageOptions): Promise<ImageStats>;

    namespace eleventyImage {
        export const statsSync: (src: string, options?: ImageOptions) => ImageStats;
    }

    export default eleventyImage;
}
