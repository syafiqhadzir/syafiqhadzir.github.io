/**
 * Stylelint Configuration - STRICTEST MODE + PROPERTY ORDER
 * Google AMP Portfolio with SCSS
 *
 * Plugins:
 * - stylelint-config-standard-scss (base)
 * - stylelint-order (property ordering)
 *
 * @see https://stylelint.io/user-guide/configure
 */

/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard-scss'],

    plugins: ['stylelint-order'],

    // Ignore patterns
    ignoreFiles: [
        '_site/**',
        'node_modules/**',
        'coverage/**',
        '**/*.min.css',
    ],

    // STRICTEST Rule Configuration
    rules: {
        // ========== SELECTOR STRICTNESS ==========
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['deep'],
            },
        ],
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
        'selector-max-id': 1, // Stricter: max 1 ID
        'selector-max-class': 3, // Stricter: max 3 classes
        'selector-max-compound-selectors': 3, // Stricter: max 3
        'selector-max-universal': 1,
        'selector-max-type': 2,
        'selector-max-attribute': 2,
        'selector-max-combinators': 3,
        'selector-max-pseudo-class': 3,
        'selector-no-qualifying-type': [true, { ignore: ['attribute', 'class'] }],
        'selector-class-pattern': [
            '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
            { message: 'Class names must be kebab-case' },
        ],

        // ========== NESTING STRICTNESS ==========
        'max-nesting-depth': [
            3, // Stricter: max 3 levels
            {
                ignore: ['pseudo-classes'],
                ignoreAtRules: ['media', 'supports', 'include'],
            },
        ],

        // ========== COLOR STRICTNESS ==========
        'color-hex-length': 'short',
        'color-named': 'never',
        'color-no-hex': null, // Allow hex colors
        'color-function-notation': 'modern',
        'alpha-value-notation': 'percentage',

        // ========== DECLARATION STRICTNESS ==========
        'declaration-block-no-redundant-longhand-properties': true,
        'declaration-no-important': true, // Stricter: no !important
        'shorthand-property-no-redundant-values': true,
        'declaration-block-single-line-max-declarations': 1,

        // ========== VALUE STRICTNESS ==========
        'number-max-precision': 4,
        'length-zero-no-unit': true,
        'value-keyword-case': 'lower',
        'function-url-quotes': 'always',

        // ========== VENDOR PREFIX STRICTNESS ==========
        'property-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'selector-no-vendor-prefix': true,
        'media-feature-name-no-vendor-prefix': true,
        'at-rule-no-vendor-prefix': true,

        // ========== SCSS STRICTNESS ==========
        'scss/at-rule-no-unknown': true,
        'scss/selector-no-redundant-nesting-selector': true,
        'scss/no-duplicate-dollar-variables': true,
        'scss/no-duplicate-mixins': true,
        'scss/dollar-variable-empty-line-before': [
            'always',
            { except: ['first-nested', 'after-dollar-variable'] },
        ],
        'scss/at-mixin-argumentless-call-parentheses': 'never',

        // ========== PATTERN RULES ==========
        'custom-property-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
        'scss/percent-placeholder-pattern': null,
        'scss/dollar-variable-pattern': null,
        'keyframes-name-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',

        // ========== FORMATTING STRICTNESS ==========
        'rule-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['after-comment'],
            },
        ],
        'comment-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['stylelint-commands'],
            },
        ],
        'at-rule-empty-line-before': [
            'always',
            {
                except: ['first-nested', 'blockless-after-blockless'],
                ignore: ['after-comment'],
                ignoreAtRules: ['else'],
            },
        ],

        // ========== FONT STRICTNESS ==========
        'font-family-name-quotes': 'always-where-recommended',
        'font-weight-notation': 'numeric',

        // ========== PROPERTY ORDER (Rational Order) ==========
        'order/order': [
            'custom-properties',
            'dollar-variables',
            'declarations',
            'rules',
            'at-rules',
        ],
        'order/properties-order': [
            // Position
            'position',
            'top',
            'right',
            'bottom',
            'left',
            'z-index',
            // Display & Box Model
            'display',
            'flex',
            'flex-direction',
            'flex-wrap',
            'flex-flow',
            'flex-grow',
            'flex-shrink',
            'flex-basis',
            'justify-content',
            'align-items',
            'align-content',
            'align-self',
            'order',
            'grid',
            'grid-template',
            'grid-template-columns',
            'grid-template-rows',
            'grid-gap',
            'gap',
            'float',
            'clear',
            'box-sizing',
            'width',
            'min-width',
            'max-width',
            'height',
            'min-height',
            'max-height',
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
            'overflow',
            'overflow-x',
            'overflow-y',
            // Typography
            'font',
            'font-family',
            'font-size',
            'font-weight',
            'font-style',
            'line-height',
            'letter-spacing',
            'text-align',
            'text-decoration',
            'text-transform',
            'white-space',
            'word-wrap',
            'word-break',
            // Visual
            'color',
            'background',
            'background-color',
            'background-image',
            'background-position',
            'background-size',
            'background-repeat',
            'border',
            'border-width',
            'border-style',
            'border-color',
            'border-radius',
            'box-shadow',
            'opacity',
            'visibility',
            // Animation
            'transition',
            'transform',
            'animation',
            // Misc
            'cursor',
            'pointer-events',
            'content',
        ],

        // ========== OVERRIDES (AMP compatibility) ==========
        'at-rule-no-unknown': null,
        'no-descending-specificity': null,
        'scss/at-import-partial-extension': null,
        'function-name-case': [
            'lower',
            {
                ignoreFunctions: ['lighten', 'darken', 'saturate', 'desaturate'],
            },
        ],
    },

    // Strict reporting
    reportDescriptionlessDisables: true,
    reportNeedlessDisables: true,
    reportInvalidScopeDisables: true,
};
