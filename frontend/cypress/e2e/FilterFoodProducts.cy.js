describe('Filter Food Products', () => {
  it('Signs up and logs in successfully', () => {
    cy.visit('http://localhost:3000');

    cy.intercept('GET', 'http://localhost:8080/api/food-product', {
      statusCode: 200,
      body: [
        {
          "id": 1,
          "name": "Bread",
          "nutrition": {
            "protein": {
              "totalProtein": 10.5
            },
            "fat": {
              "totalFat": 15.2,
              "transFat": 2.0
            },
            "carbs": {
              "totalCarbs": 30.7,
              "sugar": 18.9
            }
          },
          "dietaryRestrictions": {
            "glutenFree": false,
            "lactoseFree": false,
            "vegan": false,
            "vegetarian": true
          }
        },
        {
          "id": 2,
          "name": "Banana",
          "nutrition": {
            "protein": {
              "totalProtein": 2.5
            },
            "fat": {
              "totalFat": 0.2,
              "transFat": 0.0
            },
            "carbs": {
              "totalCarbs": 10.7,
              "sugar": 0.9
            }
          },
          "dietaryRestrictions": {
            "glutenFree": true,
            "lactoseFree": true,
            "vegan": false,
            "vegetarian": true
          }
        }
      ]
    }).as('getFoodProducts');

    cy.get('#foodproducts')
      .should('exist')
      .and('have.text', 'Food Products 2')
      .click();

    cy.url().should('eq', 'http://localhost:3000/daily-nutrition/food-products');
    cy.wait(100);
    cy.get('.search-bar').type('Bread');
    cy.wait(100);
    cy.get('.search-bar').type('{selectall}{backspace}');
    
    cy.wait(100);

    cy.get('.left-panel')
    .contains('vegetarian')
    .click();

    cy.wait(100);

    cy.get('.left-panel')
    .contains('glutenFree')
    .click();

    cy.wait(100);

    cy.get('.left-panel')
    .contains('lactoseFree')
    .click();

    cy.wait(1);
    cy.get('.left-panel')
    .contains('vegan')
    .click();

    cy.wait(100);

    cy.contains("Login");
  });
});
