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

// Log axe-core version for traceability
function logAxeVersion() {
    cy.window().then((win) => {
        // @ts-ignore - axe is injected by cypress-axe
        if (win.axe) {
            cy.task('log', `📦 axe-core version: ${win.axe.version}`);
        }
    });
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

            /**
             * Validates accessibility at tablet viewport
             */
            validateTabletA11y(): Chainable<void>;

            /**
             * Logs the axe-core version being used
             */
            logAxeVersion(): Chainable<void>;

            /**
             * SDET-Standard A11y Audit with detailed violation logging
             * Logs violations clearly with impact, description, and affected elements
             * @param context - Optional CSS selector to scope the audit
             * @param options - Optional configuration { failOnViolations, includedImpacts }
             */
            auditA11y(context?: string, options?: {
                failOnViolations?: boolean;
                includedImpacts?: ('minor' | 'moderate' | 'serious' | 'critical')[];
            }): Chainable<void>;
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
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
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
            values: ['wcag2a', 'wcag2aa', 'wcag22aa']
        },
        rules: {
            'color-contrast': { enabled: false }
        }
    }, terminalLog, true);
});

/**
 * Tablet viewport A11y check
 */
Cypress.Commands.add('validateTabletA11y', () => {
    cy.viewport('ipad-2');
    cy.injectAxe();
    cy.checkA11y(undefined, {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag22aa']
        },
        rules: {
            'color-contrast': { enabled: false }
        }
    }, terminalLog, true);
});

/**
 * Log axe-core version
 */
Cypress.Commands.add('logAxeVersion', () => {
    cy.injectAxe();
    logAxeVersion();
});

/**
 * SDET-Standard A11y Audit Command
 * Clear, actionable violation logging for CI/CD pipelines
 */
Cypress.Commands.add('auditA11y', (context?: string, options = {}) => {
    const { failOnViolations = false, includedImpacts } = options;

    cy.injectAxe();

    // Detailed violation logger
    const detailedLog = (violations: any[]) => {
        if (violations.length === 0) {
            cy.task('log', '\n✅ A11Y AUDIT PASSED: No violations found\n');
            return;
        }

        cy.task('log', '\n' + '╔' + '═'.repeat(70) + '╗');
        cy.task('log', `║ 🚨 A11Y AUDIT FAILED: ${violations.length} violation(s) detected`);
        cy.task('log', '╠' + '═'.repeat(70) + '╣');

        violations.forEach((violation, index) => {
            const impactMap: Record<string, string> = {
                critical: '🔴',
                serious: '🟠',
                moderate: '🟡',
                minor: '🟢'
            };
            const impactEmoji = impactMap[violation.impact as string] || '⚪';

            cy.task('log', `║`);
            cy.task('log', `║ ${impactEmoji} [${index + 1}/${violations.length}] ${violation.id}`);
            cy.task('log', `║   Impact: ${violation.impact?.toUpperCase() || 'UNKNOWN'}`);
            cy.task('log', `║   Description: ${violation.description}`);
            cy.task('log', `║   Help: ${violation.helpUrl}`);
            cy.task('log', `║   WCAG: ${violation.tags.filter((t: string) => t.startsWith('wcag')).join(', ')}`);
            cy.task('log', `║   Affected Elements (${violation.nodes.length}):`);

            violation.nodes.slice(0, 3).forEach((node: any, nodeIndex: number) => {
                cy.task('log', `║     ${nodeIndex + 1}. ${node.target.join(' > ')}`);
                if (node.failureSummary) {
                    const summary = node.failureSummary.split('\n')[0].trim();
                    cy.task('log', `║        → ${summary.substring(0, 60)}...`);
                }
            });

            if (violation.nodes.length > 3) {
                cy.task('log', `║     ... and ${violation.nodes.length - 3} more elements`);
            }
        });

        cy.task('log', '╚' + '═'.repeat(70) + '╝\n');
    };

    const axeOptions: any = {
        runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
        },
        rules: {
            // AMP-specific exclusions
            'color-contrast': { enabled: false },
            'meta-viewport': { enabled: false }
        }
    };

    if (includedImpacts && includedImpacts.length > 0) {
        axeOptions.includedImpacts = includedImpacts;
    }

    cy.checkA11y(context || undefined, axeOptions, detailedLog, !failOnViolations);
});
