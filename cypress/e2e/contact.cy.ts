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
        cy.contains(this.content.email)
            .should('have.attr', 'href', `mailto:${this.content.email}`);
    });

    it('validates referrer policy', () => {
        cy.checkMeta('referrer', 'strict-origin-when-cross-origin');
    });

    it('verifies social links', function () {
        const links = this.content.links;
        cy.checkSocialLink('a[href*="github"]', links.github);
        cy.checkSocialLink('a[href*="gitlab"]', links.gitlab);
        cy.checkSocialLink('a[href*="blog"]', links.blog);
    });
});
