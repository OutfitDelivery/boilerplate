
describe('Textfit', () => {
    it('test html file loads as expected', async () => {
        cy.visit('cypress/fixtures/textfit.html');
        
        cy.get('#example1 p').should('have.css', 'font-size', '20px')
        cy.get('#example2 p').should('have.css', 'font-size', '75.98px')
        cy.get('#example3 h4').should('have.css', 'font-size', '75.8px')
        cy.get('#example4 h4').should('have.css', 'font-size', '75.4px')
    
    });
})