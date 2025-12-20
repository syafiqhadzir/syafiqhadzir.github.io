import { defineConfig } from 'cypress';

export default defineConfig({
    // Cypress Cloud Configuration
    projectId: '1y2ryf',

    e2e: {
        baseUrl: 'http://localhost:8080',
        viewportWidth: 1280,
        viewportHeight: 720,

        // Performance & Stability
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 30000,
        requestTimeout: 10000,
        responseTimeout: 30000,

        // Memory Management (Cypress 12+)
        experimentalMemoryManagement: true,
        numTestsKeptInMemory: 5,

        // Test Isolation (Cypress 12+)
        testIsolation: true,

        // Environment Variables
        env: {
            // A11y thresholds (can be overridden via CLI)
            a11yThreshold: 0,
            enableA11yLogs: true
        },

        // Retries
        retries: {
            runMode: 2,
            openMode: 0
        },

        // Screenshots & Videos
        video: false,
        screenshotOnRunFailure: true,
        screenshotsFolder: 'cypress/screenshots',

        // Reporter Configuration (Mochawesome)
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: 'cypress/reports',
            overwrite: false,
            html: true,
            json: true,
            timestamp: 'mmddyyyy_HHMMss'
        },

        // Spec Pattern
        specPattern: 'cypress/e2e/**/*.cy.ts',

        setupNodeEvents(on, config) {
            // Graceful error handling for uncaught exceptions
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                }
            });

            return config;
        },
    },
});
