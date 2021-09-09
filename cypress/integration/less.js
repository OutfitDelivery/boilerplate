// beforeEach(function () {
//     Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production')
//   })
// no console errors
Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error');
  cy.spy(win.console, 'warn');
});

afterEach(() => {
  cy.window().then((win) => {
    expect(win.console.error).to.have.callCount(0);
    expect(win.console.warn).to.have.callCount(0);
  });
});

describe('less js needs to run', () => {
  it('this should run', () => {
    cy.visit('cypress/fixtures/less.html');
    cy.get('style[type="text/less"]').should('not.exist');
    cy.get('style[type="text/css"]').should('exist');
    cy.get('style[id^="less"]').should('exist');
    cy.get('.green').should('have.css', 'background-color', 'rgb(62, 177, 85)');
    cy.get('.container').should('have.css', 'display', 'grid');

    // cy.get('#example1 > div').invoke('attr', 'data-max-height').should('equal', '50')
    // cy.get('#example1 > div').should('not.have.class', 'overflow')
  });
});
