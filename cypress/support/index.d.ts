// Type definitions for Cypress fixtures
// This provides type safety when using cy.fixture()

export interface SiteContent {
    author: string;
    role: string;
    email: string;
    description: string;
    links: {
        blog: string;
        company: string;
        github: string;
        gitlab: string;
    };
    sections: {
        proficiencies: string[];
        interests: string[];
    };
    footer: {
        copyright: string;
    };
}

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Load typed fixture data
             */
            fixture(path: 'site-content'): Chainable<SiteContent>;
        }
    }
}


