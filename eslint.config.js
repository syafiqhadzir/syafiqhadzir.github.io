import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import jsdoc from 'eslint-plugin-jsdoc';

/**
 * ESLint Flat Configuration - STRICTEST MODE + ADVANCED PLUGINS
 * Google AMP Portfolio with TypeScript
 *
 * Plugins:
 * - typescript-eslint (strictTypeChecked)
 * - eslint-plugin-unicorn (modern JS patterns)
 * - eslint-plugin-sonarjs (code quality)
 * - eslint-plugin-jsdoc (documentation)
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

    // Base ESLint - ALL rules
    eslint.configs.recommended,

    // TypeScript ESLint - STRICT TYPE-CHECKED
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    // Unicorn - Modern JS patterns
    unicorn.configs.recommended,

    // SonarJS - Code quality
    sonarjs.configs.recommended,

    // JSDoc - Documentation standards
    jsdoc.configs['flat/recommended-typescript'],

    // Prettier compatibility (must be last)
    eslintConfigPrettier,

    // Global settings
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2024,
            },
            parserOptions: {
                project: './tsconfig.eslint.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },

    // Source files - STRICTEST RULES
    {
        files: ['src/**/*.ts', 'scripts/**/*.ts'],
        rules: {
            // ========== COGNITIVE COMPLEXITY (SonarQube aligned) ==========
            complexity: ['error', 12],
            'max-depth': ['error', 4],
            'max-lines-per-function': [
                'error',
                { max: 75, skipBlankLines: true, skipComments: true },
            ],
            'max-statements': ['error', 25],
            'max-params': ['error', 5],
            'max-nested-callbacks': ['error', 3],

            // ========== TYPESCRIPT STRICT ==========
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-return': 'error',
            '@typescript-eslint/strict-boolean-expressions': [
                'error',
                {
                    allowString: true,
                    allowNumber: true,
                    allowNullableObject: true,
                    allowNullableString: true,
                    allowNullableNumber: true,
                    allowNullableBoolean: true,
                },
            ],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                    allowBoolean: true,
                },
            ],

            // ========== UNICORN (Modern JS) ==========
            'unicorn/filename-case': ['error', { case: 'camelCase' }],
            'unicorn/no-null': 'off', // Allow null for DOM APIs
            'unicorn/prevent-abbreviations': [
                'error',
                {
                    allowList: {
                        props: true,
                        env: true,
                        args: true,
                        err: true,
                        doc: true,
                        docs: true,
                        src: true,
                        dest: true,
                        fn: true,
                        el: true,
                        i: true,
                        j: true,
                    },
                },
            ],
            'unicorn/prefer-module': 'error',
            'unicorn/prefer-node-protocol': 'error',
            'unicorn/prefer-top-level-await': 'off', // Not always applicable
            'unicorn/no-array-reduce': 'off', // Reduce is useful
            'unicorn/no-array-for-each': 'warn', // Prefer for-of

            // ========== SONARJS (Code Quality) ==========
            'sonarjs/cognitive-complexity': ['error', 15],
            'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
            'sonarjs/no-identical-functions': 'error',
            'sonarjs/slow-regex': 'off', // False positives on simple patterns
            'sonarjs/use-type-alias': 'off', // Interfaces preferred in TS
            'sonarjs/no-clear-text-protocols': 'warn', // Schema.org uses http

            // ========== JSDOC (Documentation) ==========
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                    },
                    publicOnly: true,
                },
            ],
            'jsdoc/require-description': 'warn',
            'jsdoc/require-param-description': 'off', // Types are sufficient
            'jsdoc/require-returns-description': 'off',
            'jsdoc/check-tag-names': ['error', { definedTags: ['module'] }],

            // ========== CODE QUALITY ==========
            'no-console': 'error',
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            curly: ['error', 'all'],
            'no-else-return': 'error',
            'no-lonely-if': 'error',
            'no-unneeded-ternary': 'error',
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-destructuring': ['error', { array: false, object: true }],
            'prefer-template': 'error',
            'no-param-reassign': 'error',
            'no-nested-ternary': 'error',

            // ========== IMPORT HYGIENE ==========
            'no-duplicate-imports': 'error',
            'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
        },
    },

    // Scripts (CLI/build tools) - Relaxed
    {
        files: ['scripts/**/*.ts'],
        rules: {
            'no-console': 'off',
            'max-lines-per-function': [
                'error',
                { max: 80, skipBlankLines: true, skipComments: true },
            ],
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            'unicorn/no-process-exit': 'off',
            'unicorn/filename-case': 'off', // CLI script naming
            'unicorn/prevent-abbreviations': 'off', // dir, fn, etc. common in scripts
            'unicorn/import-style': 'off',
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/tag-lines': 'off',
            'sonarjs/no-clear-text-protocols': 'off', // Schema.org uses http://
        },
    },

    // Test files (relaxed rules)
    {
        files: ['test/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            'max-lines-per-function': 'off',
            'max-statements': 'off',
            'no-console': 'off',
            'unicorn/no-null': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/filename-case': 'off', // camelCase is convention for tests
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-clear-text-protocols': 'off', // Schema.org uses http://
            'jsdoc/require-jsdoc': 'off',
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
            'unicorn/prevent-abbreviations': 'off',
            'jsdoc/require-jsdoc': 'off',
        },
    },

    // Config files
    {
        files: ['*.config.ts', '*.config.js', 'eleventy.config.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
            'jsdoc/require-jsdoc': 'off',
            'unicorn/prefer-module': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'jsdoc/no-types': 'off',
            'sonarjs/deprecation': 'off',
            '@typescript-eslint/no-deprecated': 'off',
        },
    }
);
