const KNOWN_NAMES = ["rick", "morty"];

const graphqlHandler = (req: any) => {
  const filter = req.body?.variables?.filter;
  const nameFilter = filter?.name?.toLowerCase() ?? "";
  const hasMatch = !nameFilter || KNOWN_NAMES.some((n) => n.includes(nameFilter));

  if (hasMatch) {
    req.reply({ fixture: "characters.json" });
  } else {
    req.reply({
      body: { data: { characters: { info: null, results: [] } } },
    });
  }
};

describe("Home page", () => {
  beforeEach(() => {
    cy.intercept("POST", "https://rickandmortyapi.com/graphql", graphqlHandler).as(
      "graphql"
    );
    cy.visit("/");
    cy.get("[data-testid='character-card']", { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );
  });

  it("loads and shows character cards", () => {
    cy.get("[data-testid='character-card']").should("have.length.greaterThan", 0);
  });

  it("filters by name", () => {
    cy.get("input[placeholder='Search by name, species...']").type("Rick");
    cy.get("[data-testid='character-card']", { timeout: 5000 }).should(
      "have.length.greaterThan",
      0
    );
    cy.get("[data-testid='character-card']").first().should("contain.text", "Rick");
  });

  it("shows no-results message when search has no matches", () => {
    cy.get("input[placeholder='Search by name, species...']").type("xyzxyzxyz");
    cy.get("[data-testid='character-card']", { timeout: 5000 }).should("not.exist");
  });

  it("filters by status chip", () => {
    cy.get("[data-slot='select-trigger']").first().click();
    cy.contains("[role='option']", "Alive").click();
    cy.get("[data-testid='character-card']", { timeout: 5000 }).should(
      "have.length.greaterThan",
      0
    );
  });
});

describe("Episodes modal", () => {
  it("opens from header button", () => {
    cy.intercept("POST", "https://rickandmortyapi.com/graphql", (req) => {
      const query: string = req.body?.query ?? "";
      if (query.includes("GetEpisodes") || query.includes("episodes")) {
        req.reply({ fixture: "episodes.json" });
      } else {
        req.reply({ fixture: "characters.json" });
      }
    }).as("graphql");
    cy.visit("/");
    cy.contains("button", /episodes/i, { timeout: 10000 }).click();
    cy.contains(/all episodes/i).should("be.visible");
  });
});
