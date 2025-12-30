/**
 * Lighthouse CI Configuration
 * Core Web Vitals monitoring for AMP portfolio
 *
 * @see https://github.com/GoogleChrome/lighthouse-ci
 */

module.exports = {
    ci: {
        collect: {
            // Start server with a fixed port for predictable URLs
            startServerCommand: 'npx serve _site -l 8080',
            // Ensure the server is fully ready before starting audits
            startServerReadyPattern: 'Accepting connections at',

            url: [
                'http://localhost:8080/index.html',
                'http://localhost:8080/contact.html',
                'http://localhost:8080/sitemap.html',
                'http://localhost:8080/404.html',
            ],

            // Number of runs per URL for statistical accuracy
            numberOfRuns: 3,

            // Chrome settings optimized for CI
            settings: {
                // Hardcode mobile factors for consistent AMP auditing
                emulatedFormFactor: 'mobile',
                // Headless flags for CI environment
                chromeFlags: [
                    '--headless',
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                ],
                // AMP pages should be tested with throttling disabled
                throttlingMethod: 'provided',
                disableNetworkThrottling: true,
            },
        },

        assert: {
            // Performance budgets aligned with AMP best practices
            assertions: {
                // Core Web Vitals
                'categories:performance': ['warn', { minScore: 0.95 }],
                'categories:accessibility': ['warn', { minScore: 1.0 }],
                'categories:best-practices': ['warn', { minScore: 0.95 }],
                'categories:seo': ['warn', { minScore: 1.0 }],

                // Performance Budgets (Resource Summary)
                // Expert practice: fail if JS/CSS exceeds size budgets
                'resource-summary:script:size': ['warn', { maxNumericValue: 150000 }], // 150kB JS (Expert AMP baseline)
                'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 50000 }], // 50kB CSS
                'resource-summary:image:size': ['warn', { maxNumericValue: 500000 }], // 500kB Images
                'resource-summary:total:size': ['warn', { maxNumericValue: 1000000 }], // 1MB Total

                // Specific metrics
                'first-contentful-paint': ['warn', { maxNumericValue: 1500 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
                'total-blocking-time': ['warn', { maxNumericValue: 200 }],
                'speed-index': ['warn', { maxNumericValue: 2500 }],

                // AMP-specific: Interactive should be fast
                interactive: ['warn', { maxNumericValue: 3000 }],

                // Resource hints
                'uses-rel-preconnect': 'off', // Already implemented
                'uses-rel-preload': 'off', // Already implemented

                // Lighthouse may incorrectly flag AMP pages
                'render-blocking-resources': 'off', // AMP boilerplate is required
                'unused-css-rules': 'off', // AMP CSS is already minimal
                'unused-javascript': 'off', // AMP runtime is required
                'is-on-https': 'off', // Localhost is HTTP
            },
        },

        upload: {
            // Target for Lighthouse CI server (temporary for now)
            target: 'temporary-public-storage',
        },
    },
};
