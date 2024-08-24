describe('ShellTactics Game App', () => {
  beforeEach(() => {
    cy.visit('/one-player'); // Replace with the actual URL where the SungkaBoard component is rendered
  });

  it('should navigate to the home page when the Home button is clicked', () => {
    // Click the Home button
    cy.get('a[href="/"]').click(); // Use the link's href attribute for selection

    // Verify that the URL has changed to the home page
    cy.url().should('eq', 'http://localhost:5173/'); // Replace with your actual home URL

    // Optionally, verify that some content from the home page is present
    cy.contains('Welcome to ShellTactics'); // Replace with actual content or text on the home page
  });

  it('should render the initial game state correctly', () => {
    // Check initial board state
    cy.get('.grid').eq(0).children(); // Two rows for each player
    cy.get('.text-yellow-400').contains('Current Turn: Player A');
  });

  it('should allow Player A to make a move and switch to Player B', () => {
    // Simulate Player A clicking on a valid pit (Bahay 1)
    cy.get('.grid .col-span-7 .cursor-pointer').eq(7).click(); // Click on Bahay 1
  
    // Wait for animation to complete
    cy.wait(1500); // Increased wait time to accommodate for animation
  
    // Check if Bahay 1 is empty (i.e., no stones)
    cy.get('.grid .col-span-7 .cursor-pointer').eq(7).find('.h-3.5').should('have.length', 0); 
  
    // Check if the turn switched to Player B
    cy.get('.text-yellow-400').should('contain', 'Current Turn: Player B');
  });
  
});
