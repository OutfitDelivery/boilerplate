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
describe('Max height checks ', () => {
  it('test html file loads as expected', () => {
    cy.visit('cypress/fixtures/maxHeight.html');
    cy.get('#example1 > div').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example1 > div').invoke('attr', 'data-max-height').should('equal', 'parent');
    cy.get('#example1 > div').should('not.have.class', 'overflow');

    // we no longer support dymaic and it is now called dynamic
    cy.get('#example2 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example2 p')
      .invoke('attr', 'data-max-height')
      .should('equal', 'dynamic');
    cy.get('#example2 p').should('not.have.class', 'overflow');

    // check rounding is correct
    cy.get('#example3')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50.1875');
    cy.get('#example3 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example3 p').should('not.have.class', 'overflow');

    cy.get('#example4')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50.6875');
    cy.get('#example4 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '51');
    cy.get('#example4 p').should('not.have.class', 'overflow');

    cy.get('#example5')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50.2969');
    cy.get('#example5 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example5 p').should('not.have.class', 'overflow');

    // check q and p casue a scroll overflow
    cy.get('#example6')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '43');
    cy.get('#example6  > div').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example6  > div').should('have.class', 'overflow');

    // check q and p casue a scroll overflow but margin stops it
    cy.get('#example7')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '43');
    cy.get('#example7  > div').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example7  > div').should('have.class', 'overflow');

    // this should overflow
    cy.get('#example8 > div').should('have.class', 'overflow');

    // js targeted checks
    cy.get('#example9 .target')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50');
    cy.get('#example9 p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example9 p').should('not.have.class', 'overflow');

    cy.get('#example10 .first')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50');
    cy.get('#example10 .first p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example10 .first p').should('not.have.class', 'overflow');

    cy.get('#example10 .second')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50');
    cy.get('#example10 .second p').invoke('attr', 'data-calculated-scroll-height').should('equal', '51');
    cy.get('#example10 .second p').should('have.class', 'overflow');

    cy.get('#example11  p')
      .invoke('attr', 'data-calculated-height')
      .should('be.undefined');
    cy.get('#example11  p').invoke('attr', 'data-calculated-scroll-height').should('equal', '50');
    cy.get('#example11  p').should('not.have.class', 'overflow');

    cy.get('#example12  .height')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '101');
    cy.get('#example12  .height').invoke('attr', 'data-calculated-scroll-height').should('equal', '101');
    cy.get('#example12  .height').should('have.class', 'overflow');

    cy.get('#example13 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '101');
    cy.get('#example13 [data-max-height]').should('not.have.class', 'overflow');

    cy.get('#example14 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example14 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '42');
    cy.get('#example14 [data-max-height]').should(
      'have.class',
      'overflow',
    );

    cy.get('#example15 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example15 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50');
    cy.get('#example15 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example16 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example16 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '50.1875');
    cy.get('#example16 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example17 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example17 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '49.8906');
    cy.get('#example17 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example18 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example18 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '49.0938');
    cy.get('#example18 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example19 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example19 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '49.0156');
    cy.get('#example19 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example20 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '50');
    cy.get('#example20 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '48.8906');
    cy.get('#example20 [data-max-height]')
      .should('have.class', 'overflow');

    cy.get('#example21 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '93');
    cy.get('#example21 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '48.8906');
    cy.get('#example21 [data-max-height]')
      .should('have.class', 'overflow');

    cy.get('#example22 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '93');
    cy.get('#example22 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '92.0156');
    cy.get('#example22 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example23 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '93');
    cy.get('#example23 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '93.0156');
    cy.get('#example23 [data-max-height]')
      .should('not.have.class', 'overflow');

    cy.get('#example24 [data-max-height]')
      .invoke('attr', 'data-calculated-scroll-height')
      .should('equal', '93');
    cy.get('#example24 [data-max-height]')
      .invoke('attr', 'data-calculated-height')
      .should('equal', '91.8906');
    cy.get('#example24 [data-max-height]')
      .should('have.class', 'overflow');
  });
});
