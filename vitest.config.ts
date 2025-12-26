import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Test environment
        environment: 'node',

        // Include patterns
        include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],

        // Exclude patterns
        exclude: ['node_modules', 'dist', '_site', 'cypress'],

        // Global test utilities
        globals: true,

        // TypeScript support
        typecheck: {
            enabled: true,
            tsconfig: './tsconfig.json',
        },

        // Coverage configuration (essential for SonarQube)
        coverage: {
            // Use V8 for Node.js coverage (faster than Istanbul)
            provider: 'v8',

            // Enable coverage by default
            enabled: true,

            // Output reporters - LCOV is required for SonarQube
            reporter: ['text', 'text-summary', 'lcov', 'html', 'json'],

            // Coverage output directory
            reportsDirectory: './coverage',

            // Files to include in coverage
            include: ['src/**/*.ts', 'scripts/**/*.ts'],

            // Files to exclude from coverage
            exclude: [
                'node_modules/**',
                'test/**',
                'cypress/**',
                '**/*.test.ts',
                '**/*.spec.ts',
                '**/*.d.ts',
                '**/types/**',
                'src/lib/**', // Build modules - integration tested via build
                'src/transforms/extremeMinify.ts', // Tested via build integration
            ],

            // Coverage thresholds - Set to achievable levels for unit tests
            // Note: Some CLI/file-system code is tested via integration only
            thresholds: {
                statements: 85,
                branches: 75,
                functions: 85,
                lines: 85,
            },

            // Clean coverage before running
            clean: true,

            // Skip full coverage for files with no tests
            skipFull: false,

            // Generate coverage even if tests fail
            reportOnFailure: true,
        },

        // Reporter configuration
        // 'vitest-sonar-reporter' provides the Generic Test Data format required by SonarCloud
        reporters: ['default', 'verbose', 'vitest-sonar-reporter'],

        // Output file for reporters
        outputFile: 'sonar-report.xml',

        // Watch mode configuration
        watch: false,

        // Timeout for tests (ms)
        testTimeout: 10_000,

        // Retry failed tests
        retry: 0,

        // Bail on first failure (set to 0 for CI)
        bail: 0,

        // Setup files
        setupFiles: [],

        // Mock configuration
        mockReset: true,
        clearMocks: true,
        restoreMocks: true,
    },

    // Resolve configuration
    resolve: {
        alias: {
            '@': './src',
            '@filters': './src/filters',
            '@transforms': './src/transforms',
            '@shortcodes': './src/shortcodes',
        },
    },

    // Define globals
    define: {
        'import.meta.vitest': 'undefined',
    },
});
