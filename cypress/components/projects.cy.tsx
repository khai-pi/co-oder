import React from "react";

import { MainNavigationMenu } from "../../src/components/shared/MainNavigationMenu";
import { AuthProvider } from "../../src/context/auth-context";

describe("<MainNavigationMenu />", () => {
  it("renders navigation links", () => {
    cy.mount(
      <AuthProvider>
        <MainNavigationMenu />
      </AuthProvider>
    );
    cy.get("nav").within(() => {
      cy.get('a[href*="projects"]').should("be.visible");
    });
  });
});
