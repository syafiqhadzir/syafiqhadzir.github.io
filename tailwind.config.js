/**
 * Tailwind CSS Configuration
 * Expert-level Tailwind config aligned with existing design system
 * Optimized for AMP inline CSS constraints (75KB limit)
 */

export default {
    content: ['./_site/**/*.html', './src/**/*.{njk,html,js,ts}', './_includes/**/*.{njk,html}'],

    // Disable preflight to avoid conflicts with custom reset
    corePlugins: {
        preflight: false,
    },

    theme: {
        // Extend (not replace) Tailwind's defaults to preserve utility flexibility
        extend: {
            // Colors mapped from CSS custom properties
            colors: {
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    hover: 'var(--color-accent-hover)',
                    light: 'var(--color-accent-light)',
                    'light-hover': 'var(--color-accent-light-hover)',
                },
                bg: {
                    primary: 'var(--color-bg-primary)',
                    secondary: 'var(--color-bg-secondary)',
                    tertiary: 'var(--color-bg-tertiary)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                    heading: 'var(--color-text-heading)',
                    inverse: 'var(--color-text-inverse)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                    light: 'var(--color-border-light)',
                },
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
                error: 'var(--color-error)',
                info: 'var(--color-info)',
            },

            // Font families
            fontFamily: {
                sans: 'var(--font-family-base)',
                mono: 'var(--font-family-mono)',
            },

            // Font sizes (fluid typography)
            fontSize: {
                xs: 'var(--font-size-xs)',
                sm: 'var(--font-size-sm)',
                base: 'var(--font-size-base)',
                lg: 'var(--font-size-lg)',
                xl: 'var(--font-size-xl)',
                h1: 'var(--font-size-h1)',
                h2: 'var(--font-size-h2)',
                h3: 'var(--font-size-h3)',
                h4: 'var(--font-size-h4)',
                h5: 'var(--font-size-h5)',
                h6: 'var(--font-size-h6)',
            },

            // Font weights
            fontWeight: {
                normal: 'var(--font-weight-normal)',
                medium: 'var(--font-weight-medium)',
                semibold: 'var(--font-weight-semibold)',
                bold: 'var(--font-weight-bold)',
            },

            // Line heights
            lineHeight: {
                tight: 'var(--line-height-tight)',
                base: 'var(--line-height-base)',
                relaxed: 'var(--line-height-relaxed)',
            },

            // Letter spacing
            letterSpacing: {
                tight: 'var(--letter-spacing-tight)',
                normal: 'var(--letter-spacing-normal)',
                wide: 'var(--letter-spacing-wide)',
            },

            // Spacing scale (using 8px base)
            spacing: {
                '3xs': 'var(--space-3xs)', // 2px
                '2xs': 'var(--space-2xs)', // 4px
                xs: 'var(--space-xs)', // 8px
                sm: 'var(--space-sm)', // 12px
                md: 'var(--space-md)', // 16px
                lg: 'var(--space-lg)', // 24px
                xl: 'var(--space-xl)', // 32px
                '2xl': 'var(--space-2xl)', // 40px
                '3xl': 'var(--space-3xl)', // 48px
            },

            // Max widths
            maxWidth: {
                container: 'var(--container-max-width)',
            },

            // Border radius
            borderRadius: {
                sm: 'var(--border-radius-sm)',
                DEFAULT: 'var(--border-radius-md)',
                md: 'var(--border-radius-md)',
                lg: 'var(--border-radius-lg)',
                xl: 'var(--border-radius-xl)',
                full: 'var(--border-radius-full)',
            },

            // Box shadows
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-md)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
            },

            // Transitions
            transitionDuration: {
                fast: 'var(--transition-fast)',
                DEFAULT: 'var(--transition-base)',
                slow: 'var(--transition-slow)',
                slower: 'var(--transition-slower)',
            },

            transitionTimingFunction: {
                'in-out': 'var(--ease-in-out)',
                out: 'var(--ease-out)',
                in: 'var(--ease-in)',
            },

            // Z-index scale
            zIndex: {
                dropdown: 'var(--z-dropdown)',
                sticky: 'var(--z-sticky)',
                fixed: 'var(--z-fixed)',
                'modal-backdrop': 'var(--z-modal-backdrop)',
                modal: 'var(--z-modal)',
                popover: 'var(--z-popover)',
                tooltip: 'var(--z-tooltip)',
                toast: 'var(--z-toast)',
            },

            // Outline styles
            outlineWidth: {
                focus: 'var(--focus-ring-width)',
            },

            outlineOffset: {
                focus: 'var(--focus-ring-offset)',
            },

            // Minimum touch target
            minWidth: {
                touch: 'var(--touch-target-min)',
            },
            minHeight: {
                touch: 'var(--touch-target-min)',
            },
        },
    },

    plugins: [
        // Typography plugin for prose classes (optional, adds ~10KB)
        // Remove if not needed to save space
        // require('@tailwindcss/typography'),
    ],
};
