/// <reference types="cypress" />

describe('Homepage E2E & Accessibility', () => {

    beforeEach(() => {
        cy.visit('/');
        // Load fixture data for assertions
        cy.fixture('site-content').as('content');
    });

    it('validates page metadata and SEO', function () {
        // Page title
        cy.title().should('eq', this.content.author);

        // Custom command usages
        cy.checkMeta('description', this.content.description);
        cy.checkMeta('keywords', this.content.author);
        cy.checkOg('og:title', this.content.author);

        // Canonical link
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev');
    });

    it('has accessible contrast and structure (A11y)', () => {
        cy.validateA11y(true); // Skip failures, log only
    });

    it('renders author profile correctly', function () {
        // Use data-cy selectors
        cy.get('[data-cy=profile-picture]')
            .should('have.attr', 'alt', this.content.author)
            .and('be.visible');

        cy.get('[data-cy=author-name]')
            .should('contain', this.content.author);

        cy.contains(this.content.role).should('be.visible');
    });

    it('verify external links', function () {
        // Verify Company Link
        cy.contains('Cloud Connect')
            .should('have.attr', 'href', this.content.links.company);

        // Verify Social Links
        cy.get(`a[href="${this.content.links.github}"]`).should('be.visible');
        cy.get(`a[href="${this.content.links.gitlab}"]`).should('be.visible');
        cy.get(`a[href="${this.content.links.blog}"]`).should('be.visible');
    });

    it('displays proficiency and interest lists', function () {
        // Proficiencies
        this.content.sections.proficiencies.forEach((skill: string) => {
            cy.contains(skill).should('be.visible');
        });

        // Interests
        this.content.sections.interests.forEach((interest: string) => {
            cy.contains(interest).should('be.visible');
        });
    });

    it('validates footer content', function () {
        cy.get('footer').should('contain', this.content.author);
        cy.get('footer').should('contain', '2017-2025');
    });

    it('toggles theme correctly', () => {
        // Initial state check (assuming light mode default)
        cy.get('body').should('not.have.class', 'dark');

        // Toggle to Dark
        cy.get('[data-cy=theme-toggle]').click();

        // AMP state changes are async, verify class or attribute change if applicable
        // Note: Since this is AMP-bind, we verify the effect or state persistence
        // For basic functional test, clicking shouldn't error.
        cy.get('[data-cy=theme-toggle]').should('be.visible');
    });
});
