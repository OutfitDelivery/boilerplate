// beforeEach(function () {
//     Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production')
//   })
// no console errors
Cypress.on("window:before:load", (win) => {
  cy.spy(win.console, "error");
  cy.spy(win.console, "warn");
});

afterEach(() => {
  cy.window().then((win) => {
    expect(win.console.error).to.have.callCount(0);
    expect(win.console.warn).to.have.callCount(0);
  });
});
describe('Counting lines', () => {
    it('test large lines', () => {
        cy.visit('cypress/fixtures/lineCount.html');
        cy.get('#example1').invoke('attr', 'data-calculated-lines-count').should('equal', '1')
        cy.get('#example2').invoke('attr', 'data-calculated-lines-count').should('equal', '2')
        cy.get('#example3').invoke('attr', 'data-calculated-lines-count').should('equal', '4')
        cy.get('#example4').invoke('attr', 'data-calculated-lines-count').should('equal', '9')
        cy.get('#example5 .column:first-of-type').invoke('attr', 'data-calculated-lines-count').should('equal', "7")
        cy.get('#example5 .column:last-of-type').invoke('attr', 'data-calculated-lines-count').should('equal', "5")
        cy.get('#example6 .cta').invoke('attr', 'data-calculated-lines-count').should('equal', "2")

        cy.get('#example7 .target').invoke('attr', 'data-calculated-lines-count').should('equal', "2")
        cy.get('#example7 .target').should('have.class', 'overflow')

        cy.get('#example8 .targets.first').invoke('attr', 'data-calculated-lines-count').should('equal', "2")
        cy.get('#example8 .targets.second').invoke('attr', 'data-calculated-lines-count').should('equal', "1")
        cy.get('#example8 .targets.first').should('have.class', 'overflow')
        cy.get('#example8 .targets.second').should('not.have.class', 'overflow')

        cy.get('#example9 .targets.first').invoke('attr', 'data-calculated-lines-count').should('equal', "2")
        cy.get('#example9 .targets.second').invoke('attr', 'data-calculated-lines-count').should('equal', "1")
        cy.get('#example9 .targets.first').should('have.class', 'overflow')
        cy.get('#example9 .targets.second').should('not.have.class', 'overflow')
    });
})