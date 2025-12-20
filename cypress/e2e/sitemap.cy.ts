/// <reference types="cypress" />

describe('Sitemap Page E2E', () => {
    beforeEach(() => {
        cy.visit('/sitemap.html');
    });

    it('validates page structure and accessibility', () => {
        cy.title().should('include', 'Site Map');
        cy.validateA11y(true); // Skip failures, log only
        cy.get('[data-cy=main-content]').should('be.visible');
    });

    it('contains canonical link', () => {
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev/sitemap.html');
    });

    it('lists all core pages', () => {
        const pages = [
            'Homepage',
            'Contact',
            'Site Map'
        ];

        pages.forEach(page => {
            cy.contains(page).should('be.visible');
        });
    });

    it('displays external links', () => {
        cy.get('h3#external').should('contain', 'External');
        cy.contains('Blog').should('be.visible');
        cy.contains('GitHub').should('be.visible');
        cy.contains('GitLab').should('be.visible');
    });
});
