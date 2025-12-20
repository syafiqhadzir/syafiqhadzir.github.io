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
            include: ['src/**/*.ts'],

            // Files to exclude from coverage
            exclude: [
                'node_modules/**',
                'test/**',
                'cypress/**',
                '**/*.test.ts',
                '**/*.spec.ts',
                '**/*.d.ts',
                '**/types/**',
            ],

            // Coverage thresholds (strict for filters)
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },

            // Clean coverage before running
            clean: true,

            // Skip full coverage for files with no tests
            skipFull: false,

            // Generate coverage even if tests fail
            reportOnFailure: true,
        },

        // Reporter configuration
        reporters: ['default', 'verbose'],

        // Watch mode configuration
        watch: false,

        // Timeout for tests (ms)
        testTimeout: 10000,

        // Pool configuration for parallel execution
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
                maxThreads: 4,
                minThreads: 1,
            },
        },

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
