/**
 * Eleventy Type Definitions
 * Custom type definitions for Eleventy configuration
 * @module types/eleventy
 */

/**
 * Eleventy UserConfig interface
 * Subset of Eleventy's configuration API
 */
export interface EleventyConfig {
    /**
     * Add a passthrough copy
     */
    addPassthroughCopy(path: string): void;

    /**
     * Add global data
     */
    addGlobalData(key: string, data: unknown): void;

    /**
     * Add a filter
     */
    addFilter(name: string, callback: (...arguments_: unknown[]) => unknown): void;

    /**
     * Add a shortcode
     */
    addShortcode(name: string, callback: (...arguments_: unknown[]) => string): void;

    /**
     * Add a paired shortcode
     */
    addPairedShortcode(
        name: string,
        callback: (content: string, ...arguments_: unknown[]) => string
    ): void;

    /**
     * Add a transform
     */
    addTransform(
        name: string,
        callback: (content: string, outputPath?: string) => string | Promise<string>
    ): void;

    /**
     * Add a watch target
     */
    addWatchTarget(path: string): void;

    /**
     * Ignores set
     */
    ignores: Set<string>;

    /**
     * Set server options
     */
    setServerOptions(options: ServerOptions): void;
}

/**
 * Server options for BrowserSync
 */
export interface ServerOptions {
    port?: number;
    showAllHosts?: boolean;
    watch?: boolean;
}

/**
 * Eleventy configuration return object
 */
export interface EleventyConfigReturn {
    templateFormats: string[];
    markdownTemplateEngine: string;
    htmlTemplateEngine: string;
    dir: {
        input: string;
        includes: string;
        layouts: string;
        data: string;
        output: string;
    };
    pathPrefix: string;
}
