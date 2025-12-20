/// <reference types="cypress" />

describe('404 Page E2E', () => {
    beforeEach(() => {
        cy.visit('/404.html');
    });

    it('validates page structure and accessibility', () => {
        cy.title().should('include', 'Page Not Found');
        cy.validateA11y(true); // Skip failures, log only
        cy.get('[data-cy=main-content]').should('be.visible');
    });

    it('displays 404 error message', () => {
        cy.get('[data-cy=error-code]').should('contain', '404');
        cy.get('[data-cy=error-message]').should('contain', 'Page Not Found');
    });

    it('has working return to home button', () => {
        cy.get('[data-cy=return-home-button]')
            .should('be.visible')
            .and('contain', 'Return Home')
            .and('have.attr', 'href', '/');
    });

    it('contains canonical link', () => {
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev/404.html');
    });
});
