/// <reference types="cypress" />

describe('Offline Page E2E', () => {
    beforeEach(() => {
        cy.visit('/offline.html');
    });

    it('validates page structure and accessibility', () => {
        cy.title().should('include', 'Offline');
        cy.validateA11y(true); // Skip failures, log only
        cy.get('[data-cy=main-content]').should('be.visible');
    });

    it('displays offline status message', () => {
        cy.get('[data-cy=offline-heading]').should('contain', "You're Offline");
    });

    it('has retry button', () => {
        cy.get('[data-cy=retry-button]').should('be.visible');
    });

    it('contains canonical link', () => {
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev/offline.html');
    });
});
