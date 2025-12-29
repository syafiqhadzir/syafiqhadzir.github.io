module.exports = {
    globDirectory: '_site/',
    globPatterns: ['**/*.{html,json,js,css,svg,png,jpg,woff2}'],
    globIgnores: ['sw.js', 'admin/**'],
    swDest: '_site/sw.js',
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    // Skip waiting to ensure updated SW activates immediately
    skipWaiting: true,
    clientsClaim: true,
    // Offline fallback for navigation
    // Workbox handles this via runtimeCaching or precaching navigation
    // But basic precache is good start
};
