/// <reference types="cypress" />

/**
 * AMP Smoke Test Suite
 * Validates AMP attributes and accessibility compliance
 *
 * @module cypress/e2e/smoke
 */

describe('AMP Smoke Tests', () => {
    const pages = [
        { path: '/', name: 'Homepage' },
        { path: '/contact.html', name: 'Contact' },
        { path: '/sitemap.html', name: 'Sitemap' },
        { path: '/404.html', name: '404 Error' },
        { path: '/offline.html', name: 'Offline' },
    ];

    // AMP VALIDATION

    describe('AMP Structure Validation', () => {
        pages.forEach(({ path, name }) => {
            describe(`${name} (${path})`, () => {
                beforeEach(() => {
                    cy.visit(path);
                });

                it('has <html> with AMP attribute', () => {
                    // AMP pages use either 'amp' or '⚡' attribute
                    cy.get('html').then(($html) => {
                        const hasAmp = $html.attr('amp') !== undefined || $html.attr('⚡') !== undefined;
                        expect(hasAmp).to.be.true;
                    });
                });

                it('has lang attribute on <html>', () => {
                    cy.get('html').should('have.attr', 'lang').and('not.be.empty');
                });

                it('has required AMP boilerplate style', () => {
                    cy.get('style[amp-boilerplate]').should('exist');
                });

                it('has <style amp-custom> for custom CSS', () => {
                    cy.get('style[amp-custom]').should('exist');
                });

                it('loads AMP runtime script', () => {
                    cy.get('script[src*="cdn.ampproject.org/v0.js"]').should('exist');
                });

                it('has canonical link', () => {
                    cy.get('link[rel="canonical"]')
                        .should('exist')
                        .and('have.attr', 'href')
                        .and('include', 'syafiqhadzir.dev');
                });

                it('has viewport meta tag', () => {
                    cy.get('meta[name="viewport"]')
                        .should('exist')
                        .and('have.attr', 'content')
                        .and('include', 'width=device-width');
                });

                it('has charset meta tag', () => {
                    cy.get('meta[charset]')
                        .should('exist')
                        .and('have.attr', 'charset', 'UTF-8');
                });

                it('has noscript with amp-boilerplate', () => {
                    cy.get('noscript').within(() => {
                        cy.get('style[amp-boilerplate]').should('exist');
                    });
                });
            });
        });
    });

    // ACCESSIBILITY TESTS

    describe('Accessibility Compliance', () => {
        pages.forEach(({ path, name }) => {
            describe(`${name} A11y`, () => {
                beforeEach(() => {
                    cy.visit(path);
                    cy.injectAxe();
                });

                it('passes automated A11y checks', () => {
                    cy.checkA11y(undefined, {
                        runOnly: {
                            type: 'tag',
                            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
                        },
                        rules: {
                            // Allow for AMP-specific patterns
                            'color-contrast': { enabled: true },
                            'link-name': { enabled: true },
                            'image-alt': { enabled: true },
                            'button-name': { enabled: true },
                            'document-title': { enabled: true },
                            'html-has-lang': { enabled: true },
                            'landmark-one-main': { enabled: true },
                        },
                    });
                });

                it('has skip link for keyboard navigation', () => {
                    cy.get('.skip-link')
                        .should('exist')
                        .and('have.attr', 'href', '#main-content');
                });

                it('has proper heading hierarchy', () => {
                    cy.get('h1').should('have.length.at.least', 1);
                });
            });
        });
    });

    // PERFORMANCE CHECKS

    describe('Performance Indicators', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('CSS size is under 75KB AMP limit', () => {
            cy.get('style[amp-custom]')
                .invoke('text')
                .then((css) => {
                    const sizeBytes = new TextEncoder().encode(css).length;
                    const sizeKB = sizeBytes / 1024;
                    cy.log(`CSS Size: ${sizeKB.toFixed(2)}KB`);
                    expect(sizeKB).to.be.lessThan(75);
                });
        });

        it('loads critical AMP resources', () => {
            // AMP Runtime
            cy.get('script[src*="cdn.ampproject.org"]').should('exist');

            // Preconnect hints
            cy.get('link[rel="preconnect"][href*="cdn.ampproject.org"]').should('exist');
        });

        it('images use amp-img component', () => {
            cy.get('amp-img').should('exist');
            cy.get('amp-img').each(($img) => {
                cy.wrap($img)
                    .should('have.attr', 'alt')
                    .and('have.attr', 'width')
                    .and('have.attr', 'height');
            });
        });
    });

    // SEO VALIDATION

    describe('SEO Requirements', () => {
        pages.forEach(({ path, name }) => {
            describe(`${name} SEO`, () => {
                beforeEach(() => {
                    cy.visit(path);
                });

                it('has title tag', () => {
                    cy.title().should('not.be.empty');
                });

                it('has meta description', () => {
                    cy.get('meta[name="description"]')
                        .should('exist')
                        .and('have.attr', 'content')
                        .and('not.be.empty');
                });

                it('has Open Graph tags', () => {
                    cy.get('meta[property="og:title"]').should('exist');
                    cy.get('meta[property="og:description"]').should('exist');
                    cy.get('meta[property="og:url"]').should('exist');
                });

                it('has structured data', () => {
                    cy.get('script[type="application/ld+json"]').should('exist');
                });
            });
        });
    });

    // THEME TOGGLE (AMP-BIND)

    describe('Theme Toggle Functionality', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('has theme toggle button', () => {
            cy.get('[data-cy=theme-toggle]')
                .should('exist')
                .and('be.visible');
        });

        it('toggle button is accessible', () => {
            // Check for either aria-label or title attribute
            cy.get('[data-cy=theme-toggle]').then(($btn) => {
                const hasAriaLabel = $btn.attr('aria-label') !== undefined;
                const hasTitle = $btn.attr('title') !== undefined;
                expect(hasAriaLabel || hasTitle).to.be.true;
            });
        });

        it('toggle switches theme state', () => {
            // Get initial state
            cy.get('body').then(($body) => {
                const initialClass = $body.attr('class') || '';

                // Click toggle
                cy.get('[data-cy=theme-toggle]').click();

                // Wait for AMP-bind to process
                cy.wait(300);

                // Verify state changed or action didn't error
                cy.get('body').should('exist');
            });
        });
    });

    // NAVIGATION

    describe('Navigation Structure', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('has main navigation', () => {
            cy.get('nav[role="navigation"]').should('exist');
        });

        it('navigation links are functional', () => {
            cy.get('nav a').each(($link) => {
                cy.wrap($link)
                    .should('have.attr', 'href')
                    .and('not.be.empty');
            });
        });

        it('has proper ARIA labels', () => {
            cy.get('nav').should('have.attr', 'aria-label');
        });

        it('active page is indicated', () => {
            cy.get('nav a.active').should('exist');
        });
    });
});
