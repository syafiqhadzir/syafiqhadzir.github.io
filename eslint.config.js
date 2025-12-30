import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import jsdoc from 'eslint-plugin-jsdoc';
import security from 'eslint-plugin-security';

/**
 * ESLint Flat Configuration - STRICTEST MODE + ADVANCED PLUGINS
 * Google AMP Portfolio with TypeScript
 *
 * Plugins:
 * - typescript-eslint (strictTypeChecked)
 * - eslint-plugin-unicorn (modern JS patterns)
 * - eslint-plugin-sonarjs (code quality)
 * - eslint-plugin-jsdoc (documentation)
 * - eslint-plugin-security (security best practices)
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
            '**/*.worker.js', // Web Workers have different context
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

    // Security - Security best practices
    security.configs.recommended,

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
        // Enable ESLint caching for performance
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
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
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                    allowBoolean: true,
                },
            ],

            // ========== TYPESCRIPT NAMING CONVENTION ==========
            '@typescript-eslint/naming-convention': [
                'error',
                { selector: 'default', format: ['camelCase'] },
                { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
                {
                    selector: 'variable',
                    modifiers: ['const', 'exported'],
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                    trailingUnderscore: 'allow',
                },
                { selector: 'typeLike', format: ['PascalCase'] },
                { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
                {
                    selector: 'property',
                    format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
                }, // Flexible for objects
                // Allow JSON-LD @-prefixed properties (Schema.org)
                {
                    selector: 'property',
                    filter: { regex: '^@', match: true },
                    format: [],
                },
            ],

            // ========== TYPESCRIPT MEMBER ORDERING ==========
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: [
                        'public-static-field',
                        'protected-static-field',
                        'private-static-field',
                        'public-instance-field',
                        'protected-instance-field',
                        'private-instance-field',
                        'constructor',
                        'public-static-method',
                        'protected-static-method',
                        'private-static-method',
                        'public-instance-method',
                        'protected-instance-method',
                        'private-instance-method',
                    ],
                },
            ],

            // ========== NO MAGIC NUMBERS ==========
            'no-magic-numbers': 'off',
            '@typescript-eslint/no-magic-numbers': [
                'warn',
                {
                    // Common values: indices, percentages, time, sizes (KB, screen widths)
                    ignore: [-1, 0, 1, 2, 7, 10, 24, 30, 60, 75, 100, 365, 640, 1000, 1024, 1920],
                    ignoreArrayIndexes: true,
                    ignoreDefaultValues: true,
                    ignoreEnums: true,
                    ignoreNumericLiteralTypes: true,
                    ignoreReadonlyClassProperties: true,
                    ignoreTypeIndexes: true,
                },
            ],

            // ========== REGEX SAFETY ==========
            'require-unicode-regexp': 'error',

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
            'sonarjs/cognitive-complexity': ['error', 12],
            'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
            'sonarjs/no-identical-functions': 'error',
            'sonarjs/slow-regex': 'off', // False positives on simple patterns
            'sonarjs/use-type-alias': 'off', // Interfaces preferred in TS
            'sonarjs/no-clear-text-protocols': 'warn', // Schema.org uses http

            // ========== SECURITY ==========
            'security/detect-object-injection': 'warn',
            'security/detect-non-literal-regexp': 'warn',
            'security/detect-unsafe-regex': 'error',
            'security/detect-buffer-noassert': 'error',
            'security/detect-eval-with-expression': 'error',
            'security/detect-no-csrf-before-method-override': 'error',
            'security/detect-possible-timing-attacks': 'warn',

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

    // Scripts (CLI/build tools) - Strict rules with minimal CLI-only exceptions
    {
        files: ['scripts/**/*.ts'],
        rules: {
            // CLI-only exceptions (essential for build scripts)
            'no-console': 'off', // CLI scripts need console output
            'unicorn/no-process-exit': 'off', // CLI scripts need exit codes
            'unicorn/filename-case': ['error', { case: 'kebabCase' }], // CLI convention
            'unicorn/import-style': 'off', // Named imports for node modules
            '@typescript-eslint/no-unnecessary-type-conversion': 'off', // Defensive coding
            '@typescript-eslint/no-unsafe-assignment': 'off', // External module types
            'sonarjs/os-command': 'off', // Intentional shell commands (grep, knip)
            'sonarjs/no-os-command-from-path': 'off', // CLI tools use PATH

            // Slightly relaxed for CLI complexity
            'max-lines-per-function': [
                'error',
                { max: 60, skipBlankLines: true, skipComments: true },
            ],
            'max-statements': ['error', 20],
            'sonarjs/cognitive-complexity': ['error', 15], // Slightly higher for CLI

            // Keep strict but handle CLI patterns
            'jsdoc/require-jsdoc': 'warn', // Encourage but don't block
            'jsdoc/require-param': 'off', // Types are sufficient
            'jsdoc/require-returns': 'off', // Types are sufficient
            'jsdoc/tag-lines': 'off', // Style preference

            // Security exceptions for CLI tools (false positives)
            'security/detect-non-literal-fs-filename': 'off', // CLI tools work with dynamic paths
            'security/detect-non-literal-regexp': 'off', // CLI tools use dynamic patterns
            'security/detect-object-injection': 'off', // Safe in build context

            // Regex unicode flag not critical for CLI tools
            'require-unicode-regexp': 'off',

            // Magic numbers more common in CLI scripts
            '@typescript-eslint/no-magic-numbers': 'off',
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
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/prefer-optional-chain': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            'max-lines-per-function': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-array-for-each': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/check-param-names': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
        },
    },

    // Config files
    {
        files: ['*.config.ts', '*.config.js', '*.cjs', 'eleventy.config.js'],
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
            '@typescript-eslint/no-unnecessary-condition': 'off',
        },
    }
);
