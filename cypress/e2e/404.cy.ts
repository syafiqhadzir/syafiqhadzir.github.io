/// <reference types="cypress" />

describe('404 Page E2E', () => {
    beforeEach(() => {
        cy.visit('/404.html');
    });

    it('validates page structure and accessibility', () => {
        cy.title().should('include', '404');
        cy.validateA11y(true); // Skip failures, log only
        cy.get('[data-cy=main-content]').should('be.visible');
    });

    it('displays 404 error message', () => {
        cy.get('[data-cy=404-heading]').should('contain', '404 - Page Not Found');
    });

    it('has working return to home button', () => {
        cy.contains('Go Home')
            .should('be.visible')
            .and('have.attr', 'href', './');
    });

    it('contains canonical link', () => {
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev/404.html');
    });
});
