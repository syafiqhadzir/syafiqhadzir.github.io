/**
 * SEO Validation Tests
 * Validates meta tags, structured data, and social cards
 */

interface JsonLdSchema {
    '@context': string;
    '@type': string;
    '@graph'?: { '@type': string }[];
}

/**
 * Validates a single JSON-LD schema item
 */
function validateSchemaItem(item: JsonLdSchema): void {
    expect(item).to.have.property('@context');
    expect(item).to.have.property('@type');
}

/**
 * Checks if a schema contains a Person type
 */
function checkPersonInSchema(schema: JsonLdSchema | JsonLdSchema[]): boolean {
    if (Array.isArray(schema)) {
        return schema.some((item) => item['@type'] === 'Person');
    }
    if (schema['@graph']) {
        return schema['@graph'].some((item) => item['@type'] === 'Person');
    }
    return schema['@type'] === 'Person';
}

describe('SEO Validation', () => {
    const pages = ['/', '/contact', '/sitemap', '/404'];

    for (const page of pages) {
        describe(`Page: ${page}`, () => {
            beforeEach(() => {
                cy.visit(page, { failOnStatusCode: false });
            });

            it('should have a valid title tag', () => {
                cy.title().should('not.be.empty');
                cy.title().should('have.length.lessThan', 70);
            });

            it('should have a meta description', () => {
                cy.get('meta[name="description"]')
                    .should('exist')
                    .invoke('attr', 'content')
                    .should('not.be.empty')
                    .should('have.length.lessThan', 160);
            });

            it('should have canonical URL', () => {
                cy.get('link[rel="canonical"]')
                    .should('exist')
                    .invoke('attr', 'href')
                    .should('match', /^https?:\/\//);
            });

            it('should have Open Graph tags', () => {
                cy.get('meta[property="og:title"]').should('exist');
                cy.get('meta[property="og:description"]').should('exist');
                cy.get('meta[property="og:type"]').should('exist');
                cy.get('meta[property="og:url"]').should('exist');
            });

            it('should have Twitter Card tags', () => {
                cy.get('meta[name="twitter:card"]').should('exist');
                cy.get('meta[name="twitter:title"]').should('exist');
            });

            it('should have proper heading hierarchy', () => {
                // Should have exactly one H1
                cy.get('h1').should('have.length', 1);

                // H1 should not be empty
                cy.get('h1').invoke('text').should('not.be.empty');
            });

            it('should have lang attribute on html', () => {
                cy.get('html')
                    .invoke('attr', 'lang')
                    .should('match', /^[a-z]{2}(-[A-Z]{2})?$/);
            });

            it('should have valid viewport meta', () => {
                cy.get('meta[name="viewport"]')
                    .should('exist')
                    .invoke('attr', 'content')
                    .should('include', 'width=device-width');
            });
        });
    }

    describe('Structured Data (JSON-LD)', () => {
        beforeEach(() => {
            cy.visit('/');
        });

        it('should have valid JSON-LD schema', () => {
            cy.get('script[type="application/ld+json"]').each(($el) => {
                const jsonText = $el.text();
                const schema = JSON.parse(jsonText) as JsonLdSchema | JsonLdSchema[];

                if (Array.isArray(schema)) {
                    schema.forEach((item) => {
                        validateSchemaItem(item);
                    });
                } else {
                    validateSchemaItem(schema);
                }
            });
        });

        it('should have Person schema on homepage', () => {
            let foundPerson = false;
            cy.get('script[type="application/ld+json"]')
                .each(($el) => {
                    const jsonText = $el.text();
                    const schema = JSON.parse(jsonText) as JsonLdSchema | JsonLdSchema[];
                    if (checkPersonInSchema(schema)) {
                        foundPerson = true;
                    }
                })
                .then(() => {
                    expect(foundPerson).to.equal(true);
                });
        });
    });

    describe('Robots & Sitemap', () => {
        it('should have robots.txt', () => {
            cy.request('/robots.txt').then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.include('User-agent');
                expect(response.body).to.include('Sitemap');
            });
        });

        it('should have sitemap.xml', () => {
            cy.request('/sitemap.xml').then((response) => {
                expect(response.status).to.eq(200);
                expect(response.headers['content-type']).to.include('xml');
            });
        });
    });
});
