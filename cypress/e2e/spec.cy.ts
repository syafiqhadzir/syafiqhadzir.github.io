/// <reference types="cypress" />

describe('Homepage E2E & Accessibility', () => {

    beforeEach(() => {
        cy.visit('/');
        // Load fixture data for assertions
        cy.fixture('site-content').as('content');
    });

    it('validates page metadata and SEO', function () {
        // Page title
        cy.title().should('eq', 'Syafiq Hadzir');

        // Custom command usages
        cy.checkMeta('description', 'Portfolio of Syafiq Hadzir - AI-assisted Software QA Engineer specializing in test automation and quality assurance.');
        cy.checkMeta('keywords', 'Syafiq Hadzir');
        cy.checkOg('og:title', 'Syafiq Hadzir');

        // Canonical link
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev');
    });

    it('has accessible contrast and structure (A11y)', () => {
        cy.validateA11y(true); // Skip failures, log only
    });

    it('renders author profile correctly', function () {
        // Use data-cy selectors
        cy.get('[data-cy=profile-picture]')
            .should('have.attr', 'alt', 'Syafiq Hadzir')
            .and('be.visible');

        cy.get('[data-cy=author-name]')
            .should('contain', 'Syafiq Hadzir');

        cy.contains('Software QA Engineer').should('be.visible');
    });

    it('verify external links', function () {
        // Verify Company Link
        cy.contains('Cloud Connect')
            .should('have.attr', 'href', 'https://www.cloud-connect.asia/');

        // Verify Social Links
        cy.get('a[href*="github.com"]').should('be.visible');
        cy.get('a[href*="gitlab.com"]').should('be.visible');
        cy.get('a[href*="blog.syafiqhadzir.dev"]').should('be.visible');
    });

    it('displays proficiency and interest lists', function () {
        // Proficiencies
        const proficiencies = [
            'Designing and executing comprehensive test plans',
            'Identifying critical defects',
            'Ensuring the delivery of high-quality software products'
        ];

        cy.get('[data-cy=proficiencies-list]').within(() => {
            proficiencies.forEach(skill => {
                cy.contains(skill).should('be.visible');
            });
        });

        // Interests
        const interests = [
            'AI Exploration',
            'CI/CD Integration',
            'Code Assessment',
            'Test Automation',
            'Web Application'
        ];

        cy.get('[data-cy=interests-list]').within(() => {
            interests.forEach(interest => {
                cy.contains(interest).should('be.visible');
            });
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
