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
describe("Textfit", () => {
  it("test html file loads as expected", () => {
    cy.visit("cypress/fixtures/textfit.html");

    cy.get("#example1 p").should("have.css", "font-size", "20px");
    cy.get("#example2 p").should("have.css", "font-size", "75.98px");
    cy.get("#example3 h4").should("have.css", "font-size", "75.8px");
    cy.get("#example4 h4").should("have.css", "font-size", "75.4px");
  });
});
