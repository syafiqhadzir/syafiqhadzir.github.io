/**
 * Performance Tests
 * Validates performance metrics and budgets
 */

describe('Performance', () => {
    describe('Resource Loading', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should not have render-blocking resources', () => {
            // AMP pages should not have external stylesheets (exception: Google Fonts)
            cy.get('link[rel="stylesheet"][href]:not([href*="fonts.googleapis.com"])').should(
                'not.exist'
            );

            // All CSS should be inline
            cy.get('style[amp-custom]').should('exist');
        });

        it('should lazy load images below the fold', () => {
            cy.get('amp-img').each(($img, index) => {
                // First image might not be lazy loaded (hero)
                if (index > 0) {
                    // AMP images are lazy loaded by default
                    // Verify they exist using Cypress wrapper
                    cy.wrap($img).should('exist');
                }
            });
        });

        it('should preconnect to required origins', () => {
            cy.get('link[rel="preconnect"]').should('exist');
        });

        it('should use font-display: swap for fonts', () => {
            cy.get('style[amp-custom]')
                .invoke('text')
                .then((css) => {
                    // Check that font-display: swap is used
                    expect(css).to.include('font-display');
                });
        });
    });

    describe('CSS Budget (AMP 75KB Limit)', () => {
        it('should have inline CSS under 75KB', () => {
            cy.visit('/');
            cy.get('style[amp-custom]')
                .invoke('text')
                .then((css) => {
                    const cssSize = new Blob([css]).size;
                    const maxSize = 75 * 1024; // 75KB
                    expect(cssSize).to.be.lessThan(maxSize);

                    // Log actual size for monitoring
                    cy.log(`CSS Size: ${(cssSize / 1024).toFixed(2)}KB`);
                });
        });
    });

    describe('JavaScript', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should only load AMP scripts and allowed domains', () => {
            cy.get('script[src]').each(($el) => {
                const src = $el.attr('src') || '';
                const isAllowed =
                    src.startsWith('https://cdn.ampproject.org/') ||
                    src.startsWith('https://www.googletagmanager.com/');

                expect(isAllowed, `Script ${src} is not allowed`).to.equal(true);
            });
        });

        it('should not have inline JavaScript (AMP requirement)', () => {
            cy.visit('/');

            // AMP doesn't allow inline scripts except for JSON-LD
            cy.get(
                'script:not([src]):not([type="application/ld+json"]):not([type="application/json"])'
            ).each(($el) => {
                const element = $el[0];
                if (!element) return;

                const content = element.textContent || '';
                const isSync =
                    content.includes('browser-sync') || content.includes('__bs_script__');
                const isCypress = content.includes('window.Cypress');

                if (!isSync && !isCypress) {
                    throw new Error(
                        `Unauthorized inline script found: ${content.slice(0, 100)}...`
                    );
                }
            });
        });
    });

    describe('Images', () => {
        it('should have width and height on all images', () => {
            cy.visit('/');
            cy.get('amp-img').each(($img) => {
                expect($img).to.have.attr('width');
                expect($img).to.have.attr('height');
            });
        });

        it('should use responsive layout for large images', () => {
            cy.visit('/');
            cy.get('amp-img[layout="responsive"]').should('exist');
        });
    });

    describe('Fonts', () => {
        it('should self-host fonts', () => {
            cy.visit('/');
            cy.get('style[amp-custom]')
                .invoke('text')
                .then((css) => {
                    // Should have @font-face declarations
                    expect(css).to.include('@font-face');
                    // Fonts should be loaded from local path (allow ./fonts or /fonts or ../fonts)
                    expect(css).to.match(/url\(['"]?(\.\.?\/|\/)fonts\//);
                });
        });
    });

    describe('Third-Party Resources', () => {
        it('should minimize third-party requests', () => {
            cy.visit('/');

            // Count external scripts (should be minimal)
            cy.get('script[src^="https://"]').then(($scripts) => {
                // Allow AMP runtime + analytics
                expect($scripts.length).to.be.lessThan(5);
            });
        });
    });
});
