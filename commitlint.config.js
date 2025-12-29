/**
 * Commitlint Configuration
 * Enforces Conventional Commits format
 * @see https://commitlint.js.org/
 */

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Type must be one of these values
        'type-enum': [
            2,
            'always',
            [
                'build', // Build system or external dependencies
                'chore', // Maintenance tasks
                'ci', // CI/CD changes
                'docs', // Documentation only
                'feat', // New feature
                'fix', // Bug fix
                'perf', // Performance improvement
                'refactor', // Code refactoring
                'revert', // Revert previous commit
                'style', // Formatting, missing semicolons, etc.
                'test', // Adding or updating tests
            ],
        ],

        // Type must be lowercase
        'type-case': [2, 'always', 'lower-case'],

        // Type cannot be empty
        'type-empty': [2, 'never'],

        // Subject cannot be empty
        'subject-empty': [2, 'never'],

        // Subject must be lowercase
        'subject-case': [2, 'always', 'lower-case'],

        // No period at the end of subject
        'subject-full-stop': [2, 'never', '.'],

        // Subject max length
        'subject-max-length': [2, 'always', 72],

        // Header max length
        'header-max-length': [2, 'always', 100],

        // Body max line length
        'body-max-line-length': [2, 'always', 100],

        // Footer max line length
        'footer-max-line-length': [2, 'always', 100],

        // Scope is optional but if present, must be lowercase
        'scope-case': [2, 'always', 'lower-case'],

        // Common scopes for this project
        'scope-enum': [
            1, // Warning only
            'always',
            [
                'a11y', // Accessibility
                'amp', // AMP-specific
                'build', // Build system
                'ci', // CI/CD
                'css', // Stylesheets
                'cypress', // E2E tests
                'deps', // Dependencies
                'docker', // Containerization
                'docs', // Documentation
                'dx', // Developer experience
                'eleventy', // Eleventy config
                'eslint', // ESLint config
                'infra', // Infrastructure
                'lighthouse', // Performance
                'perf', // Performance
                'pwa', // Progressive Web App
                'release', // Release tasks
                'sass', // Sass/SCSS
                'security', // Security
                'seo', // Search engine optimization
                'sonar', // SonarCloud
                'test', // Testing
                'ts', // TypeScript
                'ui', // User interface
                'vitest', // Unit tests
            ],
        ],
    },
};
