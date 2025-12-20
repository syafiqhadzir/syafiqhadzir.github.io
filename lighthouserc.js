/**
 * Lighthouse CI Configuration
 * Core Web Vitals monitoring for AMP portfolio
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
    ci: {
        collect: {
            // Use static server to serve built site
            staticDistDir: './_site',

            // URLs to test (all pages)
            url: [
                'http://localhost/index.html',
                'http://localhost/contact.html',
                'http://localhost/sitemap.html',
                'http://localhost/404.html',
            ],

            // Number of runs per URL for statistical accuracy
            numberOfRuns: 3,

            // Chrome settings optimized for CI
            settings: {
                preset: 'desktop',
                // AMP pages should be tested with throttling disabled
                // since AMP runtime handles performance
                throttlingMethod: 'provided',
                // Skip network throttling for AMP (CDN handles this)
                disableNetworkThrottling: true,
                // Form factor
                formFactor: 'desktop',
                screenEmulation: {
                    mobile: false,
                    width: 1350,
                    height: 940,
                    deviceScaleFactor: 1,
                    disabled: false,
                },
            },
        },

        assert: {
            // Performance budgets aligned with AMP best practices
            assertions: {
                // Core Web Vitals
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }],

                // Specific metrics
                'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
                'total-blocking-time': ['warn', { maxNumericValue: 300 }],
                'speed-index': ['warn', { maxNumericValue: 3000 }],

                // AMP-specific: Interactive should be fast
                interactive: ['warn', { maxNumericValue: 3500 }],

                // Resource hints
                'uses-rel-preconnect': 'off', // Already implemented
                'uses-rel-preload': 'off', // Already implemented

                // Lighthouse may incorrectly flag AMP pages
                'render-blocking-resources': 'off', // AMP boilerplate is required
                'unused-css-rules': 'off', // AMP CSS is already minimal
                'unused-javascript': 'off', // AMP runtime is required
            },
        },

        upload: {
            // Target for Lighthouse CI server (temporary for now)
            target: 'temporary-public-storage',
        },
    },
};
