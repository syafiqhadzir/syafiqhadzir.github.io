import type { KnipConfig } from 'knip';

/**
 * Knip Configuration for Eleventy/Cypress Stack
 *
 * Carefully configured to avoid false positives from SSG patterns
 * where files are used implicitly by Eleventy's magic conventions.
 */
const config: KnipConfig = {
    // ========== ENTRY POINTS ==========
    // Files that are consumed without explicit imports

    entry: [
        // Eleventy configuration (main entry)
        'eleventy.config.js',

        // Cypress configuration
        'cypress.config.ts',

        // Vitest configuration
        'vitest.config.ts',

        // ESLint & Stylelint configs
        'eslint.config.js',
        'stylelint.config.js',

        // Compiled dist files (entry via eleventy.config.js)
        'dist/**/*.js',

        // Cypress tests (implicitly run by Cypress)
        'cypress/e2e/**/*.cy.ts',
        'cypress/support/**/*.ts',

        // Vitest tests
        'test/**/*.test.ts',

        // CLI scripts (run via npm scripts)
        'scripts/**/*.ts',

        // Service worker (loaded by browser)
        'sw.js',
    ],

    // ========== PROJECT FILES ==========
    // All files that should be analyzed

    project: [
        'src/**/*.ts',
        'scripts/**/*.ts',
        'test/**/*.ts',
        'cypress/**/*.ts',
        'eleventy.config.js',
        'vitest.config.ts',
        'cypress.config.ts',
        'eslint.config.js',
        'stylelint.config.js',
    ],

    // ========== IGNORE PATTERNS ==========
    // Files that should not be analyzed or reported

    ignore: [
        // Build outputs
        '_site/**',
        'dist/**',
        'coverage/**',
        'node_modules/**',

        // Eleventy data files (used magically by 11ty)
        'src/_data/**',

        // Template files (not TS/JS)
        '_includes/**',
        'src/pages/**',

        // Static assets
        'Images/**',
        'fonts/**',
        'favicons/**',

        // Type declarations
        'types/**',
    ],

    // ========== IGNORE DEPENDENCIES ==========
    // Packages that appear unused but are actually used

    ignoreDependencies: [
        // Type definitions (no runtime import)
        '@types/html-minifier-terser',
        '@types/node',

        // ESLint plugins (used via config extends)
        'eslint-config-prettier',
        'eslint-plugin-import',
        'eslint-plugin-jsdoc',
        'eslint-plugin-sonarjs',
        'eslint-plugin-unicorn',

        // Stylelint (used via config)
        'stylelint-config-standard-scss',
        'stylelint-order',

        // Semantic release plugins
        '@semantic-release/changelog',
        '@semantic-release/git',

        // Cypress plugins
        'cypress-axe',
        'axe-core',

        // Mochawesome (used by Cypress reporter)
        'mochawesome',
        'mochawesome-merge',
        'mochawesome-report-generator',

        // Vitest reporter
        'vitest-sonar-reporter',

        // LightningCSS (kept for future use, currently using CSSO)
        'lightningcss',
    ],

    // ========== IGNORE BINARIES ==========
    // CLI tools that are used via npx or npm scripts

    ignoreBinaries: [
        'amphtml-validator',
        'ts-node',
        'sonar-scanner',
        'serve',
    ],

    // ========== IGNORE WORKSPACES ==========
    // Not a monorepo

    ignoreWorkspaces: [],
};

export default config;
