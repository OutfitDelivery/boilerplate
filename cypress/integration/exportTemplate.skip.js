beforeEach(() => {
  Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production');
});

describe('Login', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true);
  });
  it('Login to platform', () => {
    cy.visit('https://bootstrap-old.staging.outfit.io/users/sign_in');
    cy.get('input[type="email"]').clear().type(Cypress.env('username'));
    cy.get('input[type="password"]').clear().type(Cypress.env('password'));
    cy.get('[type="submit"]').click();
    cy.url().should('eq', 'https://bootstrap-old.staging.outfit.io/');
  });
  it('create template', () => {
    cy.get('.hamburger').click();
    // cy.get('.button').contains('Templating').click()
    cy.get('[href="/templates"]').click();
    cy.get('[href="/templates/new"]').click();
    // await zipDirectory('/dist','/cypress/fixtures/boilerplate.zip');
    // cy.get('[type="file"]').attachFile('boilerplate.zip');

    // cy.get('[type="file"]').attachFile({
    //     fileContent: fileContent.toString(),
    //     fileName: 'testPicture.png',
    //     mimeType: 'image/png'
    // });
  });
  it('Load existing templates', () => {
    cy.visit('https://bootstrap-old.staging.outfit.io/previews/2ee81110-be94-11eb-8564-97465a3f844e/configurations/63712/p/');
    cy.get('.container').should('have.css', 'background-color', 'rgb(228, 30, 70)');
  });
});
