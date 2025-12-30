import { defineConfig } from 'cypress';

export default defineConfig({
    // Cypress Cloud Configuration
    projectId: '1y2ryf',

    e2e: {
        baseUrl: 'http://localhost:8080',
        viewportWidth: 1280,
        viewportHeight: 720,

        // Performance & Stability
        defaultCommandTimeout: 10_000,
        pageLoadTimeout: 30_000,
        requestTimeout: 10_000,
        responseTimeout: 30_000,

        // Memory Management (Cypress 12+)
        experimentalMemoryManagement: true,
        numTestsKeptInMemory: 5,

        // Test Isolation (Cypress 12+)
        testIsolation: true,
        chromeWebSecurity: false,

        // Environment Variables
        env: {
            // A11y thresholds (can be overridden via CLI)
            a11yThreshold: 0,
            enableA11yLogs: true,
        },

        // Retries
        retries: {
            runMode: 2,
            openMode: 0,
        },

        // Screenshots & Videos
        video: false,
        screenshotOnRunFailure: true,
        screenshotsFolder: 'cypress/screenshots',

        // Reporter Configuration (cypress-mochawesome-reporter)
        reporter: 'cypress-mochawesome-reporter',
        reporterOptions: {
            reportDir: 'cypress/reports',
            charts: true,
            reportPageTitle: 'E2E Test Report',
            embeddedScreenshots: true,
            inlineAssets: true,
            saveAllAttempts: false,
        },

        // Spec Pattern
        specPattern: 'cypress/e2e/**/*.cy.ts',

        setupNodeEvents(on, config) {
            // cypress-mochawesome-reporter plugin
            require('cypress-mochawesome-reporter/plugin')(on);

            // Graceful error handling for uncaught exceptions
            on('task', {
                log(message) {
                    console.log(message);
                },
            });

            return config;
        },
    },
});
