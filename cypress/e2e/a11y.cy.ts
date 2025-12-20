/// <reference types="cypress" />

/**
 * Dedicated Accessibility Test Suite
 * Tests all pages for WCAG 2.0/2.1/2.2 AA compliance
 */

describe('Accessibility Suite', () => {

    // Log axe-core version at start of suite
    before(() => {
        cy.visit('/');
        cy.logAxeVersion();
    });

    // ==============================================
    // HOMEPAGE A11Y
    // ==============================================

    describe('Homepage Accessibility', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('passes full page A11y audit', () => {
            cy.validateA11y();
        });

        it('navigation is accessible', () => {
            cy.validateComponentA11y('nav');
        });

        it('main content is accessible', () => {
            cy.validateComponentA11y('main');
        });

        it('footer is accessible', () => {
            cy.validateComponentA11y('footer');
        });

        it('passes A11y audit in dark mode', () => {
            cy.get('[data-cy=theme-toggle]').click();
            cy.wait(500); // Allow theme transition
            cy.validateA11y();
        });

        it('passes mobile viewport A11y audit', () => {
            cy.validateMobileA11y();
        });

        it('passes tablet viewport A11y audit', () => {
            cy.validateTabletA11y();
        });
    });

    // ==============================================
    // CONTACT PAGE A11Y
    // ==============================================

    describe('Contact Page Accessibility', () => {
        beforeEach(() => {
            cy.visit('/contact.html');
        });

        it('passes full page A11y audit', () => {
            cy.validateA11y();
        });

        it('navigation is accessible', () => {
            cy.validateComponentA11y('nav');
        });

        it('main content is accessible', () => {
            cy.validateComponentA11y('main');
        });

        it('passes mobile viewport A11y audit', () => {
            cy.validateMobileA11y();
        });

        it('passes tablet viewport A11y audit', () => {
            cy.validateTabletA11y();
        });
    });

    // ==============================================
    // SITEMAP PAGE A11Y
    // ==============================================

    describe('Sitemap Page Accessibility', () => {
        beforeEach(() => {
            cy.visit('/sitemap.html');
        });

        it('passes full page A11y audit', () => {
            cy.validateA11y();
        });

        it('sitemap links are accessible', () => {
            cy.validateComponentA11y('main');
        });

        it('passes mobile viewport A11y audit', () => {
            cy.validateMobileA11y();
        });

        it('passes tablet viewport A11y audit', () => {
            cy.validateTabletA11y();
        });
    });

    // ==============================================
    // 404 PAGE A11Y
    // ==============================================

    describe('404 Page Accessibility', () => {
        beforeEach(() => {
            cy.visit('/404.html');
        });

        it('passes full page A11y audit', () => {
            cy.validateA11y();
        });

        it('error message is accessible', () => {
            cy.validateComponentA11y('main');
        });

        it('passes mobile viewport A11y audit', () => {
            cy.validateMobileA11y();
        });

        it('passes tablet viewport A11y audit', () => {
            cy.validateTabletA11y();
        });
    });

    // ==============================================
    // OFFLINE PAGE A11Y
    // ==============================================

    describe('Offline Page Accessibility', () => {
        beforeEach(() => {
            cy.visit('/offline.html');
        });

        it('passes full page A11y audit', () => {
            cy.validateA11y();
        });

        it('offline message is accessible', () => {
            cy.validateComponentA11y('main');
        });

        it('passes mobile viewport A11y audit', () => {
            cy.validateMobileA11y();
        });

        it('passes tablet viewport A11y audit', () => {
            cy.validateTabletA11y();
        });
    });

    // ==============================================
    // CRITICAL A11Y (CI/CD GATE)
    // ==============================================

    describe('Critical A11y Gate (Strict Mode)', () => {
        const pages = ['/', '/contact.html', '/sitemap.html', '/404.html', '/offline.html'];

        pages.forEach((page) => {
            it(`${page} passes critical A11y audit`, () => {
                cy.visit(page);
                cy.validateCriticalA11y();
            });
        });
    });

});
