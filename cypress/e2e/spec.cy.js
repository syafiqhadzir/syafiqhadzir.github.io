describe('Syafiq Hadzir Homepage E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  it('displays the correct page title and meta', () => {
    cy.title().should('eq', 'Syafiq Hadzir™');
    cy.get('meta[name="description"]').should('have.attr', 'content').and('include', 'Just another guy who codes and writes');
    cy.get('meta[name="keywords"]').should('have.attr', 'content').and('include', 'Syafiq Hadzir');
    cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev');
  });

  it('shows the author name and role', () => {
    cy.get('#author-name').should('contain', 'Syafiq Hadzir');
    cy.contains('Software QA Engineer').should('be.visible');
  });

  it('shows the About section with profile image', () => {
    cy.get('#about').should('contain', 'About');
    cy.get('amp-img.profile-picture').should('have.attr', 'alt', 'Syafiq Hadzir');
    cy.get('amp-img.profile-picture').should('have.attr', 'src').and('include', 'headshot.webp');
    cy.contains('Cloud Connect').should('have.attr', 'href', 'https://www.cloud-connect.asia/');
  });

  it('shows the Blog button and navigates correctly', () => {
    cy.get('a').contains('Blog').should('have.attr', 'href', 'https://blog.syafiqhadzir.dev/');
  });

  it('shows the Proficiencies section and lists key skills', () => {
    cy.get('#proficiencies').should('contain', 'Proficiencies');
    cy.contains('Designing and executing comprehensive test plans').should('be.visible');
    cy.contains('Identifying critical defects').should('be.visible');
    cy.contains('ensuring the delivery of high-quality software products').should('be.visible');
  });

  it('shows GitHub and GitLab links', () => {
    cy.get('a').contains('GitHub').should('have.attr', 'href', 'https://github.com/SyafiqHadzir');
    cy.get('a').contains('GitLab').should('have.attr', 'href', 'https://gitlab.com/syafiqhadzir');
  });

  it('shows the Interests section and all interest items', () => {
    cy.get('#interest').should('contain', 'Interests');
    cy.contains('AI Exploration').should('be.visible');
    cy.contains('CI/CD Intergration').should('be.visible');
    cy.contains('Code Assessment').should('be.visible');
    cy.contains('Test Automation').should('be.visible');
    cy.contains('Web Application').should('be.visible');
  });

  it('shows the footer with copyright and last update', () => {
    cy.get('footer').should('contain', '© 2017-2025 Syafiq Hadzir');
    cy.get('footer').should('contain', 'Powered by');
    cy.get('footer').should('contain', 'Last Update:');
  });

  it('has all favicon and manifest links', () => {
    cy.get('link[rel="apple-touch-icon"]').should('exist');
    cy.get('link[rel="icon"][sizes="32x32"]').should('exist');
    cy.get('link[rel="icon"][sizes="16x16"]').should('exist');
    cy.get('link[rel="mask-icon"]').should('exist');
    cy.get('meta[name="theme-color"]').should('have.attr', 'content');
  });

  it('has AMP and FontAwesome scripts/styles', () => {
    cy.get('script[src*="cdn.ampproject.org/v0.js"]').should('have.attr', 'async');
    cy.get('link[href*="fonts.googleapis.com"]').should('exist');
    cy.get('link[href*="fontawesome"]').should('exist');
  });

  it('is responsive for mobile widths', () => {
    cy.viewport(375, 667); // iPhone 6/7/8
    cy.get('.container').should('be.visible');
    cy.get('#author-name').should('be.visible');
  });
});