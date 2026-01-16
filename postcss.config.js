/**
 * PostCSS Configuration
 * Expert-level PostCSS + Tailwind CSS v4 integration
 * Optimized for AMP constraints (75KB inline CSS limit)
 */

export default {
    plugins: {
        // Tailwind CSS v4 - New @tailwindcss/postcss plugin
        '@tailwindcss/postcss': {},

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
    },
};
