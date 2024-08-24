describe('RulesPage Component', () => {
  beforeEach(() => {
    // Visit the Rules page
    cy.visit('/rules', {
      state: { from: '/' }, // Simulate the previous path
    });
  });

  it('displays the ShellTactics rules content', () => {
    cy.get('h1').should('contain.text', 'ShellTactics Rules');

    cy.get('p').should('contain.text', 'Objective');
    cy.get('p').should('contain.text', 'Game Setup');
    cy.get('p').should('contain.text', 'How to Play');
    cy.get('p').should('contain.text', 'Game End');
    cy.get('p').should('contain.text', 'Player Turns');
    cy.get('p').should('contain.text', 'Notes');
  });

  it('toggles the tips section when clicking "Show Tips" and "Hide Tips" buttons', () => {
    // Initially, tips section should not be visible
    cy.get('div').should('not.contain.text', 'Tips for Winning:');

    // Click on the "Show Tips" button
    cy.contains('button', 'Show Tips').click();

    // Tips section should now be visible
    cy.get('div').should('contain.text', 'Tips for Winning:');
    cy.get('li').should('contain.text', 'Plan your moves ahead to maximize your captures.');

    // Click on the "Hide Tips" button
    cy.contains('button', 'Hide Tips').click();

    // Tips section should be hidden again
    cy.get('div').should('not.contain.text', 'Tips for Winning:');
  });

  it('navigates back to the previous page when clicking the "Back" button', () => {
    // Simulate the Back button click
    cy.contains('a', 'Back').click();

    // Verify that it navigates to the previous page
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
