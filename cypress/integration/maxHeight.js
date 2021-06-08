// beforeEach(function () {
//     Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production')
//   })

describe('Max height checks ', () => {
    it('test html file loads as expected', async () => {
        cy.visit('cypress/fixtures/maxHeight.html');
        cy.get('#example1 > div').invoke('attr', 'data-calculated-scroll-height').should('equal', '50')
        cy.get('#example1 > div').invoke('attr', 'data-max-height').should('equal', '50')
        cy.get('#example1 > div').should('not.have.class', 'overflow')

        cy.get('#example2 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50')
        cy.get('#example2 p').invoke('attr', 'data-max-height').should('equal', '50')
        cy.get('#example2 p').should('not.have.class', 'overflow')

        // check rounding is correct
        cy.get('#example3 p').invoke('attr', 'data-max-height').should('equal', '50.1875')
        cy.get('#example3 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50')
        cy.get('#example3 p').should('not.have.class', 'overflow')

        cy.get('#example4 p').invoke('attr', 'data-max-height').should('equal', '50.6875')
        cy.get('#example4 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '51')
        cy.get('#example4 p').should('not.have.class', 'overflow')

        cy.get('#example5 p').invoke('attr', 'data-max-height').should('equal', '50.2969')
        cy.get('#example5 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50')
        cy.get('#example5 p').should('not.have.class', 'overflow')

        // check q and p casue a scroll overflow
        cy.get('#example6 > div').invoke('attr', 'data-max-height').should('equal', '43')
        cy.get('#example6  > div').invoke('attr', 'data-calculated-scroll-height').should('equal', '50')
        cy.get('#example6  > div').should('have.class', 'overflow')

        // check q and p casue a scroll overflow but margin stops it 
        cy.get('#example7  > div').invoke('attr', 'data-max-height').should('equal', '53')
        cy.get('#example7  > div').invoke('attr', 'data-calculated-scroll-height').should('equal', '50')
        cy.get('#example7  > div').should('not.have.class', 'overflow')
        
        // this should overflow
        cy.get('#example8 > div').should('have.class', 'overflow')
        
    });
})