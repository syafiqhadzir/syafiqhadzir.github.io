/// <reference types="cypress" />

describe('Contact Page E2E', () => {
    beforeEach(() => {
        cy.visit('/contact.html');
        cy.fixture('site-content').as('content');
    });

    it('validates page structure and accessibility', function () {
        cy.title().should('include', 'Contact');
        cy.validateA11y(true); // Skip failures, log only
        cy.get('[data-cy=main-content]').should('be.visible');
    });

    it('displays correct email contact info', function () {
        cy.get('[data-cy=email-link]')
            .should('contain', this.content.email)
            .and('have.attr', 'href', `mailto:${this.content.email}`);
    });

    it('validates referrer policy', () => {
        cy.checkMeta('referrer', 'strict-origin-when-cross-origin');
    });

    it('verifies social links', function () {
        const links = this.content.links;
        cy.get('[data-cy=social-github]').should('have.attr', 'href', links.github).and('be.visible');
        cy.get('[data-cy=social-gitlab]').should('have.attr', 'href', links.gitlab).and('be.visible');
        cy.get('[data-cy=blog-link]').should('have.attr', 'href', links.blog).and('be.visible');
    });
});
