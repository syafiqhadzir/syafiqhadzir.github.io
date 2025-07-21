describe('Syafiq Hadzir Homepage E2E', () => {

  // Visit the homepage before each test
  beforeEach(() => {
    cy.visit('/')
  });


  it('displays the correct page title and meta', () => {
    // Check the page title
    cy.title().should('eq', 'Syafiq Hadzir™');
    // Check meta description
    cy.get('meta[name="description"]').should('have.attr', 'content').and('include', 'Just another guy who codes and writes');
    // Check meta keywords
    cy.get('meta[name="keywords"]').should('have.attr', 'content').and('include', 'Syafiq Hadzir');
    // Check canonical link
    cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', 'syafiqhadzir.dev');
  });


  it('shows the author name and role', () => {
    // Check for author name
    cy.get('#author-name').should('contain', 'Syafiq Hadzir');
    // Check for role subtitle
    cy.contains('Software QA Engineer').should('be.visible');
  });


  it('shows the About section with profile image', () => {
    // Check About section header
    cy.get('#about').should('contain', 'About');
    // Check profile image alt text
    cy.get('amp-img.profile-picture').should('have.attr', 'alt', 'Syafiq Hadzir');
    // Check profile image src
    cy.get('amp-img.profile-picture').should('have.attr', 'src').and('include', 'headshot.webp');
    // Check Cloud Connect link
    cy.contains('Cloud Connect').should('have.attr', 'href', 'https://www.cloud-connect.asia/');
  });


  it('shows the Blog button and navigates correctly', () => {
    // Check Blog button/link
    cy.get('a').contains('Blog').should('have.attr', 'href', 'https://blog.syafiqhadzir.dev/');
  });


  it('shows the Proficiencies section and lists key skills', () => {
    // Check Proficiencies section header
    cy.get('#proficiencies').should('contain', 'Proficiencies');
    // Check for key skills
    cy.contains('Designing and executing comprehensive test plans').should('be.visible');
    cy.contains('Identifying critical defects').should('be.visible');
    cy.contains('ensuring the delivery of high-quality software products').should('be.visible');
  });


  it('shows GitHub and GitLab links', () => {
    // Check GitHub link
    cy.get('a').contains('GitHub').should('have.attr', 'href', 'https://github.com/SyafiqHadzir');
    // Check GitLab link
    cy.get('a').contains('GitLab').should('have.attr', 'href', 'https://gitlab.com/syafiqhadzir');
  });


  it('shows the Interests section and all interest items', () => {
    // Check Interests section header
    cy.get('#interest').should('contain', 'Interests');
    // Check for each interest item
    cy.contains('AI Exploration').should('be.visible');
    cy.contains('CI/CD Intergration').should('be.visible');
    cy.contains('Code Assessment').should('be.visible');
    cy.contains('Test Automation').should('be.visible');
    cy.contains('Web Application').should('be.visible');
  });


  it('shows the footer with copyright and last update', () => {
    // Check copyright
    cy.get('footer').should('contain', '© 2017-2025 Syafiq Hadzir');
    // Check powered by text
    cy.get('footer').should('contain', 'Powered by');
    // Check last update text
    cy.get('footer').should('contain', 'Last Update:');
  });


  it('has all favicon and manifest links', () => {
    // Check apple touch icon
    cy.get('link[rel="apple-touch-icon"]').should('exist');
    // Check 32x32 favicon
    cy.get('link[rel="icon"][sizes="32x32"]').should('exist');
    // Check 16x16 favicon
    cy.get('link[rel="icon"][sizes="16x16"]').should('exist');
    // Check mask icon
    cy.get('link[rel="mask-icon"]').should('exist');
    // Check theme color meta
    cy.get('meta[name="theme-color"]').should('have.attr', 'content');
  });


  it('has AMP and FontAwesome scripts/styles', () => {
    // Check AMP script
    cy.get('script[src*="cdn.ampproject.org/v0.js"]').should('have.attr', 'async');
    // Check Google Fonts stylesheet
    cy.get('link[href*="fonts.googleapis.com"]').should('exist');
    // Check FontAwesome stylesheet
    cy.get('link[href*="fontawesome"]').should('exist');
  });


  it('is responsive for mobile widths', () => {
    // Set viewport to mobile size and check main elements
    cy.viewport(375, 667); // iPhone 6/7/8
    cy.get('.container').should('be.visible');
    cy.get('#author-name').should('be.visible');
  });
});