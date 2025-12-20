/**
 * Stylelint Configuration
 * Google AMP Portfolio with SCSS
 *
 * @see https://stylelint.io/user-guide/configure
 */

/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss'],

    // Ignore patterns
    ignoreFiles: [
        '_site/**',
        'node_modules/**',
        'coverage/**',
        '**/*.min.css',
    ],

    // Rule customizations
    rules: {
        // Allow pseudo-selectors for AMP patterns
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['deep'],
            },
        ],

        // AMP allows data-* and amp-* custom elements
        'selector-type-no-unknown': [
            true,
            {
                ignoreTypes: [
                    'amp-img',
                    'amp-state',
                    'amp-bind-macro',
                    'amp-install-serviceworker',
                    'amp-analytics',
                    'amp-pixel',
                    'amp-ad',
                ],
            },
        ],

        // Allow CSS custom properties
        'custom-property-pattern': null,

        // Allow SCSS placeholder selectors
        'scss/percent-placeholder-pattern': null,

        // Allow SCSS variables with any pattern
        'scss/dollar-variable-pattern': null,

        // Function naming
        'function-name-case': [
            'lower',
            {
                ignoreFunctions: ['lighten', 'darken', 'saturate', 'desaturate'],
            },
        ],

        // Declaration order (optional, enhances readability)
        'order/properties-alphabetical-order': null,

        // Max nesting depth (aligned with SonarQube)
        'max-nesting-depth': [
            4,
            {
                ignore: ['pseudo-classes'],
            },
        ],

        // Selector specificity
        'selector-max-id': 2,
        'selector-max-class': 4,
        'selector-max-compound-selectors': 4,

        // Color format
        'color-hex-length': 'short',
        'color-named': 'never',

        // Vendor prefixes (handled by autoprefixer)
        'property-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,

        // Empty lines
        'rule-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['after-comment'],
            },
        ],

        // Comments
        'comment-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['stylelint-commands'],
            },
        ],

        // Import order
        'scss/at-import-partial-extension': null,

        // SCSS specific
        'scss/at-rule-no-unknown': true,
        'scss/selector-no-redundant-nesting-selector': true,

        // Allow @forward and @use
        'at-rule-no-unknown': null,

        // Disable rules that conflict with AMP patterns
        'no-descending-specificity': null,

        // Font family names
        'font-family-name-quotes': 'always-where-recommended',
    },

    // Report formatting
    reportDescriptionlessDisables: true,
    reportNeedlessDisables: true,
    reportInvalidScopeDisables: true,
};
