describe('Visual Regression Testing', () => {
    beforeEach(() => {
        // Reset viewport to consistent state
        cy.viewport(1280, 720);
    });

    it('Home Page - Desktop', () => {
        cy.visit('/');
        cy.wait(1000); // Wait for animations/rendering
        cy.compareSnapshot('home-desktop', {
            capture: 'fullPage',
            errorThreshold: 0.05,
        });
    });

    it('Home Page - Mobile', () => {
        cy.viewport(375, 812);
        cy.visit('/');
        cy.wait(1000);
        cy.compareSnapshot('home-mobile', {
            capture: 'fullPage',
            errorThreshold: 0.05,
        });
    });

    it('Offline Page - Desktop', () => {
        cy.visit('/offline/');
        cy.compareSnapshot('offline-desktop', {
            capture: 'viewport',
            errorThreshold: 0.05,
        });
    });

    it('404 Page - Desktop', () => {
        cy.visit('/404.html');
        cy.compareSnapshot('404-desktop', {
            capture: 'viewport',
            errorThreshold: 0.05,
        });
    });
});
