/**
 * Browser Targets Configuration
 * Shared browser targets for CSS processing and build tools
 * @module config/browserTargets
 */

/**
 * Browserslist query for target browsers
 * Used by PostCSS autoprefixer and LightningCSS
 */
export const BROWSERSLIST_QUERY = [
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 Edge versions',
    'iOS >= 14',
    'Android >= 10',
] as const;

/**
 * Browser targets type
 */
export type BrowserTargets = typeof BROWSERSLIST_QUERY;
