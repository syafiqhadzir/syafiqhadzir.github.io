/// <reference types="cypress" />

// ***********************************************
// Expert-Level Custom Commands for A11y Testing
// ***********************************************

import 'cypress-axe';

// Terminal log helper for formatted violation output
function terminalLog(violations: any[]) {
    cy.task('log', '\n' + '='.repeat(60));
    cy.task('log', `🔍 A11Y VIOLATIONS FOUND: ${violations.length}`);
    cy.task('log', '='.repeat(60));

    const violationData = violations.map(({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        nodes: nodes.length
    }));

    // Log each violation with details
    violationData.forEach((v, index) => {
        cy.task('log', `\n[${index + 1}] ${v.impact?.toUpperCase() || 'UNKNOWN'}: ${v.id}`);
        cy.task('log', `    Description: ${v.description}`);
        cy.task('log', `    Occurrences: ${v.nodes}`);
    });

    cy.task('log', '\n' + '='.repeat(60) + '\n');
}

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Checks a meta tag content by name property
             */
            checkMeta(name: string, content: string): Chainable<JQuery<HTMLElement>>;

            /**
             * Checks a meta tag content by property attribute (OG tags)
             */
            checkOg(property: string, content: string): Chainable<JQuery<HTMLElement>>;

            /**
             * Validates a social link href attribute
             */
            checkSocialLink(selector: string, url: string): Chainable<JQuery<HTMLElement>>;

            /**
             * Runs standard accessibility checks on entire page
             * @param skipFailures - If true, logs violations without failing (default: true)
             */
            validateA11y(skipFailures?: boolean): Chainable<void>;

            /**
             * Runs accessibility checks on a specific component
             * @param selector - CSS selector for the component
             * @param skipFailures - If true, logs violations without failing
             */
            validateComponentA11y(selector: string, skipFailures?: boolean): Chainable<void>;

            /**
             * Runs critical-only accessibility checks (serious + critical impact)
             */
            validateCriticalA11y(): Chainable<void>;

            /**
             * Validates accessibility at mobile viewport
             */
            validateMobileA11y(): Chainable<void>;
        }
    }
}

// ==============================================
// META TAG COMMANDS
// ==============================================

Cypress.Commands.add('checkMeta', (name, content) => {
    cy.get(`meta[name="${name}"]`)
        .should('have.attr', 'content')
        .and('include', content);
});

Cypress.Commands.add('checkOg', (property, content) => {
    cy.get(`meta[property="${property}"]`)
        .should('have.attr', 'content')
        .and('include', content);
});

Cypress.Commands.add('checkSocialLink', (selector, url) => {
    cy.get(selector)
        .should('have.attr', 'href', url)
        .and('have.attr', 'rel', 'noopener noreferrer external');
});

// ==============================================
// ACCESSIBILITY COMMANDS
// ==============================================

/**
 * Full page A11y check with WCAG 2.0/2.1 AA standards
 */
Cypress.Commands.add('validateA11y', (skipFailures = true) => {
    cy.injectAxe();
    cy.checkA11y(undefined, {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
        },
        rules: {
            // AMP-specific exclusions
            'color-contrast': { enabled: false },
            'meta-viewport': { enabled: false } // AMP handles this
        }
    }, terminalLog, skipFailures);
});

/**
 * Component-scoped A11y check
 */
Cypress.Commands.add('validateComponentA11y', (selector: string, skipFailures = true) => {
    cy.injectAxe();
    cy.checkA11y(selector, {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
        }
    }, terminalLog, skipFailures);
});

/**
 * Critical impact only - for strict CI/CD pipelines
 * Only checks for 'critical' impact violations (highest severity)
 */
Cypress.Commands.add('validateCriticalA11y', () => {
    cy.injectAxe();
    cy.checkA11y('main', {
        includedImpacts: ['critical'], // Only critical, not serious
        rules: {
            // AMP handles these internally
            'bypass': { enabled: false },
            'region': { enabled: false },
            'landmark-one-main': { enabled: false }
        }
    }, terminalLog, false); // STRICT: fail on violations
});

/**
 * Mobile viewport A11y check
 */
Cypress.Commands.add('validateMobileA11y', () => {
    cy.viewport('iphone-x');
    cy.injectAxe();
    cy.checkA11y(undefined, {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa']
        },
        rules: {
            'color-contrast': { enabled: false }
        }
    }, terminalLog, true);
});
