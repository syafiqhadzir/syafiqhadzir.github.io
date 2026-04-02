/**
 * Theme Persistence Script for AMP
 * Handles saving and loading theme preference from localStorage
 */

// Initialize theme from localStorage on page load
/**
 *
 */
function initTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            // Send message to parent window to update AMP state
            window.parent.postMessage({
                type: 'amp-setState',
                data: {
                    theme: { mode: savedTheme }
                }
            }, '*');
        }
    } catch (error) {
        console.error('Failed to load theme:', error);
    }
}

// Listen for theme changes from parent window
window.addEventListener('message', function (event) {
    if (event.data?.type === 'theme-changed') {
        try {
            const theme = event.data.theme;
            if (theme === 'dark' || theme === 'light') {
                localStorage.setItem('theme', theme);
            }
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }
});

// Initialize on load
initTheme();
