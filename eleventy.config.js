/**
 * Eleventy Configuration
 * Google AMP Portfolio with Extreme Minification Pipeline
 *
 * Pipeline: Sass → PostCSS → LightningCSS → Inline → Extreme HTML Minify
 * @see https://www.11ty.dev/docs/config/
 */

import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import { transform, browserslistToTargets } from 'lightningcss';
import { existsSync } from 'node:fs';

// Import shared configuration
import { BROWSERSLIST_QUERY, SCSS_ENTRY, MAX_CSS_SIZE_BYTES } from './dist/config/index.js';

// Import custom filters (compiled from TypeScript)
import { dateFormat, isoDate, relativeDate } from './dist/filters/dateFormat.js';
import { readingTime, wordCount } from './dist/filters/readingTime.js';

// Import custom shortcodes
import { ampImg } from './dist/shortcodes/ampImg.js';

// Import transforms
import { cssGuard } from './dist/transforms/cssGuard.js';

/** Browser targets for LightningCSS (derived from shared config) */
const BROWSER_TARGETS = browserslistToTargets([...BROWSERSLIST_QUERY]);

/**
 * Compile SCSS with LightningCSS for AMP-compatible optimization
 * Pipeline: Dart Sass → PostCSS (autoprefixer) → LightningCSS (minify)
 * @returns Minified CSS string
 */
async function compileSCSS() {
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

        // Step 2: Process with PostCSS (autoprefixer for modern browsers)
        const postcssResult = await postcss([
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

        // Step 3: Minify with LightningCSS
        const { code: minifiedBuffer } = transform({
            filename: 'styles.css',
            code: Buffer.from(postcssResult.css),
            minify: true,
            targets: BROWSER_TARGETS,
            drafts: { customMedia: true },
            errorRecovery: true,
        });

        const minifiedCss = minifiedBuffer.toString();

        // Step 4: Validate size
        const sizeBytes = Buffer.byteLength(minifiedCss, 'utf8');
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
    eleventyConfig.addPassthroughCopy('Images');
    eleventyConfig.addPassthroughCopy('CNAME');
    eleventyConfig.addPassthroughCopy('humans.txt');
    eleventyConfig.addPassthroughCopy('browserconfig.xml');
    eleventyConfig.addPassthroughCopy('sw.js');
    eleventyConfig.addPassthroughCopy({ 'src/install-sw.html': 'install-sw.html' });
    eleventyConfig.addPassthroughCopy('.well-known');
    eleventyConfig.addPassthroughCopy('_headers'); // Security headers
    eleventyConfig.addPassthroughCopy('_redirects'); // Netlify rules

    // GLOBAL DATA

    // Add compiled CSS as global data
    eleventyConfig.addGlobalData('compiledCSS', async () => {
        return await compileSCSS();
    });

    // Note: Site metadata is loaded automatically from src/_data/site.json

    // FILTERS

    // Date formatting filters
    eleventyConfig.addFilter('dateFormat', dateFormat);
    eleventyConfig.addFilter('isoDate', isoDate);
    eleventyConfig.addFilter('relativeDate', relativeDate);

    // Reading time filters
    eleventyConfig.addFilter('readingTime', readingTime);
    eleventyConfig.addFilter('wordCount', wordCount);

    // SHORTCODES
    // AMP Image shortcode: {% ampImg src, alt, width, height, layout %}
    eleventyConfig.addShortcode('ampImg', ampImg);

    // TRANSFORMS
    // CSS Size Guard Transform (75KB limit for AMP)
    eleventyConfig.addTransform('cssGuard', (content, outputPath) => {
        if (outputPath?.endsWith('.html')) {
            return cssGuard(content, MAX_CSS_SIZE_BYTES);
        }
        return content;
    });

    // HTML Minification Transform (production only)
    // Note: Implemented in src/transforms/htmlMinify.ts
    // Uncomment below and add import when ready for production minification:
    // import { htmlMinifyTransform } from './dist/transforms/htmlMinify.js';
    // eleventyConfig.addTransform('htmlMinify', htmlMinifyTransform);

    // WATCH TARGETS
    eleventyConfig.addWatchTarget('./src/scss/');
    eleventyConfig.addWatchTarget('./src/filters/');
    eleventyConfig.addWatchTarget('./src/shortcodes/');
    eleventyConfig.addWatchTarget('./src/pages/');

    // IGNORES (don't process these as templates)
    eleventyConfig.ignores.add('node_modules');
    eleventyConfig.ignores.add('dist');
    eleventyConfig.ignores.add('coverage');
    eleventyConfig.ignores.add('cypress');
    eleventyConfig.ignores.add('test');
    eleventyConfig.ignores.add('src/filters');
    eleventyConfig.ignores.add('src/shortcodes');
    eleventyConfig.ignores.add('src/transforms');
    eleventyConfig.ignores.add('src/scss');
    eleventyConfig.ignores.add('src/_data');

    // Ignore existing static HTML files (replaced by Nunjucks templates)
    eleventyConfig.ignores.add('index.html');
    eleventyConfig.ignores.add('contact.html');
    eleventyConfig.ignores.add('sitemap.html');
    eleventyConfig.ignores.add('404.html');
    eleventyConfig.ignores.add('offline.html');
    eleventyConfig.ignores.add('sw.html');
    eleventyConfig.ignores.add('README.md');
    eleventyConfig.ignores.add('CHANGELOG.md');
    eleventyConfig.ignores.add('CODE_OF_CONDUCT.md');
    eleventyConfig.ignores.add('CONTRIBUTING.md');
    eleventyConfig.ignores.add('SECURITY.md');
    eleventyConfig.ignores.add('.github');
    eleventyConfig.ignores.add('docs');
    eleventyConfig.ignores.add('scripts');

    // PLUGINS
    // No external plugins - keeping it minimal for AMP
    // BROWSER SYNC (Development)
    eleventyConfig.setServerOptions({
        port: 8080,
        showAllHosts: true,
        watch: true,
    });

    // CONFIGURATION RETURN
    return {
        // Template formats to process
        templateFormats: ['njk', 'md', 'html'],

        // Default template engine
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',

        // Directory configuration
        dir: {
            input: '.',
            includes: '_includes',
            layouts: '_includes/layouts',
            data: 'src/_data',
            output: '_site',
        },

        // Pathprefix for deployment
        pathPrefix: '/',
    };
}
