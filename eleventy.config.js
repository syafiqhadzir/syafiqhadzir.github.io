/**
 * Eleventy Configuration
 * Google AMP Portfolio with Extreme Minification Pipeline
 *
 * Pipeline: Sass → PostCSS → LightningCSS → Inline → Extreme HTML Minify
 * @see https://www.11ty.dev/docs/config/
 */

import * as sass from 'sass';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { processWithLightningCss } from './dist/lib/lightningCss.js';
import { existsSync } from 'node:fs';

// Import shared configuration
import { SCSS_ENTRY, MAX_CSS_SIZE_BYTES } from './dist/config/index.js';

// Import custom filters (compiled from TypeScript)
import { dateFormat, isoDate, relativeDate } from './dist/filters/dateFormat.js';
import { readingTime, wordCount } from './dist/filters/readingTime.js';

// Import custom shortcodes
import { ampImg } from './dist/shortcodes/ampImg.js';

// Import transforms
import { cssGuard } from './dist/transforms/cssGuard.js';

/**
 * Compile SCSS with Tailwind CSS and LightningCSS for AMP-compatible optimization
 * Pipeline: Dart Sass → PostCSS (Tailwind + Autoprefixer) → LightningCSS (minify)
 * @returns Minified CSS string
 */
async function compileSCSS() {
    /* eslint-disable security/detect-non-literal-fs-filename, @typescript-eslint/restrict-template-expressions */
    // Check if SCSS file exists
    if (!existsSync(SCSS_ENTRY)) {
        console.warn(`[11ty] SCSS entry not found: ${SCSS_ENTRY}`);
        return '';
    }

    try {
        // Step 1: Compile SCSS with Dart Sass
        const sassResult = sass.compile(SCSS_ENTRY, {
            style: 'expanded',
            sourceMap: false,
            loadPaths: ['./src/scss', './node_modules'],
        });

        // Step 2: Process with PostCSS (Tailwind CSS v3 + Autoprefixer)
        const postcssResult = await postcss([
            tailwindcss(),
            autoprefixer({
                overrideBrowserslist: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'last 2 Safari versions',
                    'last 2 Edge versions',
                    'iOS >= 14',
                    'Android >= 10',
                ],
            }),
        ]).process(sassResult.css, { from: undefined });

        // Step 3: Minify with LightningCSS and strip AMP-incompatible features
        const { css: minifiedCss, sizeBytes } = processWithLightningCss({
            code: postcssResult.css,
            filename: 'styles.css',
            maxSize: MAX_CSS_SIZE_BYTES,
        });

        // Step 4: Validate size
        if (sizeBytes > MAX_CSS_SIZE_BYTES) {
            throw new Error(
                `[LightningCSS] CSS size (${(sizeBytes / 1024).toFixed(2)}KB) exceeds AMP limit of 75KB`
            );
        }

        return minifiedCss;
    } catch (error) {
        console.error('[11ty] CSS compilation failed:', error.message);
        throw error;
    }
}

/**
 * Eleventy Configuration Export
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig - The Eleventy configuration object
 * @returns {object} Eleventy configuration object
 */
export default function configureEleventy(eleventyConfig) {
    // PASSTHROUGH COPY

    // Static assets
    eleventyConfig.addPassthroughCopy('favicons');
    eleventyConfig.addPassthroughCopy('fonts');
    eleventyConfig.addPassthroughCopy('images');
    eleventyConfig.addPassthroughCopy('CNAME');
    eleventyConfig.addPassthroughCopy('humans.txt');
    eleventyConfig.addPassthroughCopy('browserconfig.xml');
    eleventyConfig.addPassthroughCopy('sw.js');
    // install-sw.html is generated from .njk template
    eleventyConfig.addPassthroughCopy('.well-known');
    eleventyConfig.addPassthroughCopy('_headers');
    eleventyConfig.addPassthroughCopy('_redirects');

    // GLOBAL DATA
    // Add compiled CSS as global data

    // @ts-expect-error - Eleventy 3.x API mismatch
    eleventyConfig.addGlobalData('compiledCSS', async () => {
        return await compileSCSS();
    });

    // FILTERS
    eleventyConfig.addFilter('dateFormat', dateFormat);
    eleventyConfig.addFilter('isoDate', isoDate);
    eleventyConfig.addFilter('relativeDate', relativeDate);
    eleventyConfig.addFilter('readingTime', readingTime);
    eleventyConfig.addFilter('wordCount', wordCount);

    // SHORTCODES

    // @ts-expect-error - Eleventy 3.x API mismatch
    eleventyConfig.addAsyncShortcode('ampImg', ampImg);

    // TRANSFORMS

    // @ts-expect-error - Eleventy 3.x API mismatch
    eleventyConfig.addTransform('cssGuard', (content, outputPath) => {
        if (outputPath?.endsWith('.html')) {
            return cssGuard(content, MAX_CSS_SIZE_BYTES);
        }
        return content;
    });

    // WATCH TARGETS
    eleventyConfig.addWatchTarget('./src/scss/');
    eleventyConfig.addWatchTarget('./src/filters/');
    eleventyConfig.addWatchTarget('./src/shortcodes/');
    eleventyConfig.addWatchTarget('./src/pages/');

    // IGNORES
    eleventyConfig.ignores.add('node_modules');
    eleventyConfig.ignores.add('dist');
    eleventyConfig.ignores.add('coverage');
    eleventyConfig.ignores.add('cypress');
    eleventyConfig.ignores.add('test');
    eleventyConfig.ignores.add('README.md');
    eleventyConfig.ignores.add('.github');
    eleventyConfig.ignores.add('docs');
    eleventyConfig.ignores.add('scripts');

    // BROWSER SYNC
    eleventyConfig.setServerOptions({
        port: 8080,
        showAllHosts: true,
        watch: true,
    });

    // CONFIGURATION RETURN
    return {
        templateFormats: ['njk', 'md', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: '.',
            includes: '_includes',
            layouts: '_includes/layouts',
            data: 'src/_data',
            output: '_site',
        },
        pathPrefix: '/',
    };
}
