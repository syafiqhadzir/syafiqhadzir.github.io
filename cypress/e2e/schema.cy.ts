/**
 * Schema.org JSON-LD Contract Tests
 * Validates structured data on all pages
 */

describe('Schema.org Structured Data', () => {
    describe('Home Page', () => {
        beforeEach(() => {
            cy.visit('/');
            cy.get('script[type="application/ld+json"]').first().invoke('text').as('schemaJson');
        });

        it('has valid JSON-LD script tag', () => {
            cy.get('script[type="application/ld+json"]')
                .should('exist')
                .should('have.length.at.least', 1);
        });

        it('JSON-LD is parseable', function () {
            expect(() => JSON.parse(this.schemaJson)).to.not.throw();
        });

        it('has required @context and @type', function () {
            const schema = JSON.parse(this.schemaJson);
            expect(schema).to.have.property('@context');
            expect(schema['@context']).to.include('schema.org');
            expect(schema).to.have.property('@type');
        });

        it('has Person or WebSite type', function () {
            const schema = JSON.parse(this.schemaJson);
            const validTypes = ['Person', 'WebSite', 'WebPage', 'ProfilePage'];
            expect(validTypes).to.include(schema['@type']);
        });

        it('has name property', function () {
            const schema = JSON.parse(this.schemaJson);
            expect(schema).to.have.property('name');
        });
    });

    describe('Contact Page', () => {
        beforeEach(() => {
            cy.visit('/contact/');
        });

        it('has valid JSON-LD script tag', () => {
            cy.get('script[type="application/ld+json"]')
                .should('exist')
                .should('have.length.at.least', 1);
        });
    });

    describe('Sitemap Page', () => {
        beforeEach(() => {
            cy.visit('/sitemap/');
        });

        it('has valid JSON-LD script tag', () => {
            cy.get('script[type="application/ld+json"]')
                .should('exist')
                .should('have.length.at.least', 1);
        });
    });
});
