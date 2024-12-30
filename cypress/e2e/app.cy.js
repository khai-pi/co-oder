describe("Navigation", () => {
  it("should navigate to the projects page", () => {
    cy.visit("http://localhost:3000/");

    cy.get("nav").within(() => {
      cy.get('a[href*="projects"]').should("be.visible").click();
    });

    cy.url().should("include", "/projects");
  });
});
