describe('Player Mode Selection', () => {
  beforeEach(() => {
    // Visit the Player Mode Selection page
    cy.visit('http://localhost:5173/');
  });

  it('should display the correct heading', () => {
    cy.contains('Welcome to ShellTactics').should('be.visible');
  });

  it('should display a quote fetched from the API', () => {
    cy.get('.text-yellow-200').should('be.visible');
  });

  it('should navigate to the Rules page when clicking on the Rules button', () => {
    cy.contains('Rules').click();
    cy.url().should('include', '/rules');
  });

  it('should navigate to the Single Player mode when selecting Single Player', () => {
    cy.contains('Single Player').click();
    cy.url().should('include', '/one-player');
  });

  it('should navigate to the Two Players mode when selecting Two Players', () => {
    cy.contains('Two Players').click();
    cy.url().should('include', '/two-players');
  });
});

