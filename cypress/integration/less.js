// beforeEach(function () {
//     Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production')
//   })

describe('less js needs to run', () => {
    it('this should run', () => {
        cy.visit('cypress/fixtures/less.html');
        cy.get('style[type="text/less"]').should('not.exist')
        cy.get('style[type="text/css"]').should('exist')
        cy.get('[id="less:css-styles"]').should('exist')
        cy.get('.green').should('have.css', 'background-color', 'rgb(62, 177, 85)')
        cy.get('.container').should('have.css', 'display', 'grid')
        
        // cy.get('#example1 > div').invoke('attr', 'data-max-height').should('equal', '50')
        // cy.get('#example1 > div').should('not.have.class', 'overflow')
        
    });
})