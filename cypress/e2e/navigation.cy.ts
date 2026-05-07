describe("Character navigation", () => {
  beforeEach(() => {
    cy.intercept("POST", "https://rickandmortyapi.com/graphql", (req) => {
      const body = req.body;
      if (body?.variables?.id !== undefined) {
        req.reply({ fixture: "character.json" });
      } else {
        req.reply({ fixture: "characters.json" });
      }
    }).as("graphql");
    cy.visit("/");
    cy.get("[data-testid='character-card']", { timeout: 10000 }).should("exist");
  });

  it("opens character modal when clicking a card", () => {
    cy.get("[data-testid='character-card']").first().click();
    cy.url().should("include", "/character/");
    cy.get("[data-testid='character-detail']").should("be.visible");
  });

  it("closes modal and returns to home with back navigation", () => {
    cy.get("[data-testid='character-card']").first().click();
    cy.url().should("include", "/character/");
    cy.go("back");
    cy.url().should("eq", Cypress.config("baseUrl") + "/");
    cy.get("[data-testid='character-card']").should("exist");
  });

  it("loads character full page when navigating directly to URL", () => {
    cy.visit("/character/1");
    cy.get("[data-testid='character-detail']", { timeout: 10000 }).should("be.visible");
    cy.contains("Rick Sanchez").should("be.visible");
  });
});

describe("Episode navigation", () => {
  it("navigates to episode page and back", () => {
    cy.visit("/character/1");
    cy.get("[data-testid='episode-navigator']", { timeout: 10000 }).should("exist");
    cy.get("[data-testid='episode-navigator']").find("button[aria-label]").first().click();
    cy.url().should("include", "/episode/");
    cy.contains("Go Back").click();
    cy.url().should("include", "/character/1");
  });

  it("navigates character → episode → character chain", () => {
    cy.visit("/character/1");
    cy.get("[data-testid='episode-navigator']", { timeout: 10000 }).should("exist");
    cy.get("[data-testid='episode-navigator']").find("button[aria-label]").first().click();
    cy.url().should("include", "/episode/");
    cy.get("[title]").first().click();
    cy.url().should("include", "/character/");
    cy.go("back");
    cy.url().should("include", "/episode/");
    cy.contains("Go Back").click();
    cy.url().should("include", "/character/1");
  });
});
