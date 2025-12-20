import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * ESLint Flat Configuration
 * Google AMP Portfolio with TypeScript
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-new
 */
export default tseslint.config(
    // Global ignores
    {
        ignores: [
            '_site/**',
            'node_modules/**',
            'dist/**',
            'coverage/**',
            '*.min.js',
            'cypress/reports/**',
        ],
    },

    // Base ESLint recommended
    eslint.configs.recommended,

    // TypeScript ESLint recommended
    ...tseslint.configs.recommended,
    ...tseslint.configs.stylistic,

    // Prettier compatibility (must be last)
    eslintConfigPrettier,

    // Global settings
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2022,
            },
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },

    // Source files
    {
        files: ['src/**/*.ts'],
        rules: {
            // Cognitive Complexity (aligned with SonarQube)
            'complexity': ['warn', 15],
            'max-depth': ['warn', 4],
            'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],

            // TypeScript specific
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',

            // Code quality
            'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
        },
    },

    // Test files (relaxed rules)
    {
        files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'max-lines-per-function': 'off',
            'no-console': 'off',
        },
    },

    // Cypress test files
    {
        files: ['cypress/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.browser,
                cy: 'readonly',
                Cypress: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                beforeEach: 'readonly',
                after: 'readonly',
                afterEach: 'readonly',
                expect: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-namespace': 'off',
            'max-lines-per-function': 'off',
        },
    },

    // Config files
    {
        files: ['*.config.ts', '*.config.js', 'eleventy.config.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    }
);
