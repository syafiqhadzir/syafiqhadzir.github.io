/**
 * Path Constants
 * Centralized file path definitions for the project
 * @module config/projectPaths
 */

/** SCSS entry point */
export const SCSS_ENTRY = './src/scss/main.scss';

/** Maximum allowed CSS size in bytes (75KB for AMP) */
export const MAX_CSS_SIZE_BYTES = 75 * 1024;

/** Asset directories */
export const ASSET_DIRS = ['images', 'fonts', 'favicons'] as const;

/** Paths to search for asset references */
export const ASSET_SEARCH_PATHS = ['src', '_includes', 'eleventy.config.js'] as const;

/** Build output directory */
export const OUTPUT_DIR = '_site';

/** Distribution directory for compiled TypeScript */
export const DIST_DIR = 'dist';

/** Coverage directory */
export const COVERAGE_DIR = 'coverage';
