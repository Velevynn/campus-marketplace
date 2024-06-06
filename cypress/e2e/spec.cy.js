describe("Login Functionality", () => {
  it("should successfully log in and redirect to profile", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[name="identifier"]').type("test@test.com");
    cy.get('input[name="password"]').type("test1234+");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/profile");

    // Check that a token is stored (assuming it is stored in local storage or a cookie)
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token") || win.document.cookie;
      expect(token).to.exist;
    });
  });
});

describe("Login Functionality", () => {
  it("should show an error for invalid identifier or password type", () => {
    cy.visit("http://localhost:3000/login");

    // Enter invalid login credentials
    cy.get('input[name="identifier"]').type("12345");
    cy.get('input[name="password"]').type("password123");

    cy.get('button[type="submit"]').click();

    cy.contains("Error: User not found")
      .should("be.visible")
      .and("have.css", "color", "rgb(255, 0, 0)");
  });
});

describe("Retrieve Listing Details", () => {
  it("should retrieve details of a specific listing", () => {
    const listingID = "833";

    // GET request to retrieve specific listing
    cy.request("GET", `http://localhost:8000/listings/${listingID}`).then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
      }
    );
  });
});
