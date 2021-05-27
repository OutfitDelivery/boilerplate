// beforeEach(function () {
//     Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production')
//   })

describe('Counting lines', () => {
    it('test large lines', async () => {
        cy.visit('cypress/fixtures/lineCount.html');
        cy.get('#example1').invoke('attr', 'data-calculated-lines-count').should('equal', '1')
        cy.get('#example2').invoke('attr', 'data-calculated-lines-count').should('equal', '2')
        cy.get('#example3').invoke('attr', 'data-calculated-lines-count').should('equal', '4')
        cy.get('#example4').invoke('attr', 'data-calculated-lines-count').should('equal', '9')
        cy.get('#example5 .column:first-of-type').invoke('attr', 'data-calculated-lines-count').should('equal', "7")
        cy.get('#example5 .column:last-of-type').invoke('attr', 'data-calculated-lines-count').should('equal', "5")
        cy.get('#example6 .cta').invoke('attr', 'data-calculated-lines-count').should('equal', "2")
    });
})