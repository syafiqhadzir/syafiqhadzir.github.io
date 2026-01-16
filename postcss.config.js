/**
 * PostCSS Configuration
 * Expert-level PostCSS + Tailwind CSS v3 integration
 * Optimized for AMP constraints (75KB inline CSS limit)
 */

export default {
    plugins: {
        // Tailwind CSS v3
        tailwindcss: {},

        // Autoprefixer for browser compatibility
        autoprefixer: {
            overrideBrowserslist: [
                'last 2 Chrome versions',
                'last 2 Firefox versions',
                'last 2 Safari versions',
                'last 2 Edge versions',
                'iOS >= 14',
                'Android >= 10',
            ],
        },

        // Optimize and deduplicate CSS
        'postcss-discard-duplicates': {},
        'postcss-sort-media-queries': {
            sort: 'mobile-first',
        },
    },
};
