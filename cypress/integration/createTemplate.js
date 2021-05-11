beforeEach(function () {
    // before each test, we can automatically preserve the
    // 'session_id' and 'remember_token' cookies. this means they
    // will not be cleared before the NEXT test starts.
    //
    // the name of your cookies will likely be different
    // this is just a simple example
    Cypress.Cookies.preserveOnce('_outfit_session_staging', '_outfit_session_production')
  })

describe('Login', () => {
    it('Does not do much!', () => {
        expect(true).to.equal(true)
    })
    it('Login to platform', () => {
        cy.visit("https://bootstrap-old.staging.outfit.io/users/sign_in")
        cy.get('input[type="email"]').clear().type(Cypress.env('username'))
        cy.get('input[type="password"]').clear().type(Cypress.env('password'))
        cy.get('[type="submit"]').click()
        cy.url().should('eq', 'https://bootstrap-old.staging.outfit.io/')
    })
    it('create template', () => {
        cy.get('.hamburger').click()
        // cy.get('.button').contains('Templating').click()
        cy.get('[href="/templates"]').click()
        cy.get('[href="/templates/new"]').click()
    })
  

})

