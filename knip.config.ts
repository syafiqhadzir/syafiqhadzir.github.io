import type { KnipConfig } from 'knip';

/**
 * Knip Configuration for Eleventy/Cypress Stack
 *
 * Expert-level configuration with minimal explicit entries.
 * Knip auto-detects most patterns via built-in plugins for:
 * - ESLint, Stylelint, Vitest, Cypress, semantic-release, commitlint
 *
 * We only configure what Knip cannot auto-detect.
 */
const config: KnipConfig = {
    // ========== ENTRY POINTS ==========
    // Only non-standard entry points that Knip can't auto-detect

    entry: [
        // Compiled dist files (consumed by eleventy.config.js)
        'dist/**/*.js',

        // Source config files (compiled to dist/)
        'src/config/**/*.ts',

        // CLI scripts (run via npm scripts)
        'scripts/**/*.ts',

        // PWA Entry Points
        'src/install-sw.html',
        'workbox-config.cjs',
    ],

    // ========== PROJECT FILES ==========
    // Source files to analyze (Knip auto-includes test files)

    project: ['src/**/*.ts', 'scripts/**/*.ts', 'test/**/*.ts', 'cypress/**/*.ts'],

    // ========== IGNORE PATTERNS ==========
    // Files that should not be analyzed or reported

    ignore: [
        // Build outputs
        '_site/**',
        'dist/**',
        'coverage/**',
        'node_modules/**',

        // Eleventy template files (not TS/JS)
        '_includes/**',
        'src/pages/**',

        // Static assets
        'images/**',
        'fonts/**',
        'favicons/**',

        // Type declarations
        'types/**',
    ],

    ignoreDependencies: [],

    // ========== IGNORE BINARIES ==========
    // Only binaries not auto-detected

    ignoreBinaries: [
        'serve', // Used via npx in npm scripts
    ],

    // ========== IGNORE WORKSPACES ==========
    // Not a monorepo

    ignoreWorkspaces: [],
};

export default config;
