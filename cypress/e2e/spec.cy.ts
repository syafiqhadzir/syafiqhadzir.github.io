/// <reference types="cypress" />

describe('Syafiq Hadzir Homepage E2E', () => {

    // Always start from the homepage before each test
    beforeEach(() => {
        cy.visit('/');
    });


    it('displays the correct page title and meta tags', () => {
        // Page title should match
        cy.title().should('eq', 'Syafiq Hadzir');
        // Meta description should be present and correct
        cy.get('meta[name="description"]').should('have.attr', 'content').and('include', 'Software QA Engineer');
        // Meta keywords should be present and correct
        cy.get('meta[name="keywords"]').should('have.attr', 'content').and('include', 'Syafiq Hadzir');
        // Canonical link should point to the correct domain
        cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev');
    });


    it('shows the author name and role', () => {
        // Author name should be visible
        cy.get('#author-name').should('contain', 'Syafiq Hadzir');
        // Role subtitle should be visible
        cy.contains('Software QA Engineer').should('be.visible');
    });


    it('shows the About section with profile image and company link', () => {
        // About section header should be present
        cy.get('#about-me').should('contain', 'About');
        // Profile image should have correct alt and src
        cy.get('amp-img.profile-picture')
            .should('have.attr', 'alt', 'Syafiq Hadzir')
            .and('have.attr', 'src').and('include', 'headshot.webp');
        // Cloud Connect company link should be correct
        cy.contains('Cloud Connect')
            .should('have.attr', 'href', 'https://www.cloud-connect.asia/');
    });


    it('shows the Blog button with correct link', () => {
        // Blog button should link to the blog
        cy.get('a').contains('Blog')
            .should('have.attr', 'href', 'https://blog.syafiqhadzir.dev/');
    });


    it('shows the Proficiencies section and key skills', () => {
        // Proficiencies section header should be present
        cy.get('#proficiencies').should('contain', 'Proficiencies');
        // Each key skill should be visible
        const skills: string[] = [
            'Designing and executing comprehensive test plans',
            'Identifying critical defects',
            'ensuring the delivery of high-quality software products'
        ];
        skills.forEach((skill: string) => cy.contains(skill).should('be.visible'));
    });


    it('shows GitHub and GitLab links', () => {
        // Social links should be present and correct
        cy.get('a').contains('GitHub')
            .should('have.attr', 'href', 'https://github.com/SyafiqHadzir');
        cy.get('a').contains('GitLab')
            .should('have.attr', 'href', 'https://gitlab.com/syafiqhadzir');
    });


    it('shows the Interests section and all interest items', () => {
        // Interests section header should be present
        cy.get('#interest').should('contain', 'Interests');
        // All interest items should be visible
        const interests: string[] = [
            'AI Exploration',
            'CI/CD Integration',
            'Code Assessment',
            'Test Automation',
            'Web Application'
        ];
        interests.forEach((interest: string) => cy.contains(interest).should('be.visible'));
    });


    it('shows the footer with copyright and last update', () => {
        // Footer should contain copyright, powered by, and last update
        cy.get('footer').should('contain', '© 2017-2025 Syafiq Hadzir');
        cy.get('footer').should('contain', 'Powered by');
        cy.get('footer').should('contain', 'Last Update:');
    });


    it('has all favicon and manifest links', () => {
        // Favicon and manifest links should exist
        cy.get('link[rel="apple-touch-icon"]').should('exist');
        cy.get('link[rel="icon"][sizes="32x32"]').should('exist');
        cy.get('link[rel="icon"][sizes="16x16"]').should('exist');
        cy.get('link[rel="mask-icon"]').should('exist');
        cy.get('meta[name="theme-color"]').should('have.attr', 'content');
    });


    it('has AMP and FontAwesome scripts/styles', () => {
        // AMP script should be present and async
        cy.get('script[src*="cdn.ampproject.org/v0.js"]').should('have.attr', 'async');
        // Google Fonts stylesheet should be present
        cy.get('link[href*="fonts.googleapis.com"]').should('exist');
        // FontAwesome icons should be rendered (self-hosted via @font-face)
        cy.get('i.fa-solid').should('exist');
        cy.get('i.fa-brands').should('exist');
    });


    it('is responsive for mobile widths', () => {
        // Simulate mobile viewport and check main elements remain visible
        cy.viewport(375, 667); // iPhone 6/7/8
        cy.get('.container').should('be.visible');
        cy.get('#author-name').should('be.visible');
    });


    // ============================================
    // ARIA Accessibility Tests
    // ============================================

    describe('ARIA Accessibility', () => {

        it('has skip-to-content link that targets main content', () => {
            // Skip link should exist and point to main content
            cy.get('.skip-link').should('exist');
            cy.get('.skip-link').should('have.attr', 'href', '#main-content');
            // Main content target should exist
            cy.get('#main-content').should('exist');
        });


        it('has proper landmark roles', () => {
            // Main landmark should exist
            cy.get('main[role="main"]').should('exist');
            // Footer with contentinfo role should exist
            cy.get('footer[role="contentinfo"]').should('exist');
        });


        it('decorative icons have aria-hidden attribute', () => {
            // All Font Awesome icons should be hidden from screen readers
            cy.get('i.fa-solid').each(($icon: JQuery<HTMLElement>) => {
                cy.wrap($icon).should('have.attr', 'aria-hidden', 'true');
            });
            cy.get('i.fa-brands').each(($icon: JQuery<HTMLElement>) => {
                cy.wrap($icon).should('have.attr', 'aria-hidden', 'true');
            });
        });


        it('interactive button links have descriptive aria-labels', () => {
            // All w3-button links should have aria-label for screen readers
            cy.get('a.w3-button').each(($link: JQuery<HTMLElement>) => {
                cy.wrap($link).should('have.attr', 'aria-label');
            });
        });


        it('main content area has descriptive aria-label', () => {
            // Main landmark should have aria-label
            cy.get('main[role="main"]')
                .should('have.attr', 'aria-label')
                .and('include', 'Portfolio');
        });


        it('footer has descriptive aria-label', () => {
            // Footer should have aria-label
            cy.get('footer[role="contentinfo"]')
                .should('have.attr', 'aria-label')
                .and('include', 'footer');
        });

    });

});
