/**
 * PostCSS Configuration
 * Centralized PostCSS plugin configuration
 */

export default {
    plugins: {
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
