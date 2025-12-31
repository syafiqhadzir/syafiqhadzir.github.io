/**
 * RTL Layout Shift Verification
 * Prevents CLS regressions on Arabic/Hebrew pages
 */

describe('RTL Layout Stability', () => {
    // Force RTL context for testing
    // In real app, visit specific RTL URL or use query param
    const RTL_PATH = '/?lang=ar';

    beforeEach(() => {
        // Intercept font loading to simulate network delay if needed
        cy.intercept('**/*.woff2', (req) => {
            req.on('response', (res) => {
                res.setDelay(100); // Simulate slow font load
            });
        }).as('fontLoad');

        cy.visit(RTL_PATH, {
            onBeforeLoad(win) {
                // Perform setup to track CLS
                // @ts-expect-error - Custom property for CLS tracking
                win._cls = 0;
                const observer = new win.PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        const layoutShiftEntry = entry as PerformanceEntry & {
                            hadRecentInput?: boolean;
                            value?: number;
                        };
                        if (!layoutShiftEntry.hadRecentInput) {
                            // @ts-expect-error - Custom property for CLS tracking
                            (win as Window & { _cls: number })._cls += layoutShiftEntry.value ?? 0;
                        }
                    }
                });
                observer.observe({ type: 'layout-shift', buffered: true });
            },
        });
    });

    it('should have zero layout shift after font load', () => {
        // Wait for fonts
        cy.wait('@fontLoad');

        // Wait for hydration/rendering
        cy.wait(500);

        cy.window().then((win) => {
            // @ts-expect-error - Custom property for CLS tracking
            const cls = win._cls as number;
            cy.log(`Cumulative Layout Shift: ${String(cls)}`);

            // AMP requirement is strict, ideally 0 or < 0.1
            expect(cls).to.be.lessThan(0.1, 'CLS should be within acceptable limits');
        });
    });

    it('should use correct font-display strategy', () => {
        cy.get('style[amp-custom]')
            .invoke('text')
            .then((css) => {
                // Verify font-display: swap is used for self-hosted fonts
                expect(css).to.include(
                    'font-display:swap',
                    'Fonts should use font-display: swap for FOIT prevention'
                );
            });
    });
});
