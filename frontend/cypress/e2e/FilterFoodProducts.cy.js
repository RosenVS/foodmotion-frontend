describe('Filter Food Products', () => {
  it('Signs up and logs in successfully', () => {
    cy.visit('http://localhost:3000')
    cy.get('.appBarLoginBtn')
      .should('exist') 
      .and('have.text', 'Login') 
      .click() 
  
    cy.url().should('eq', 'http://localhost:3000/login')

    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');

    cy.get('input[name="email"]').type('vartan@gmail.com');
    cy.get('input[name="password"]').type('Minecraft12.');

    cy.contains('Sign In').should('exist');

    cy.contains('Sign In').click();

    cy.intercept('GET', 'https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product', {
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
    cy.wait(1000);
  
    cy.get('#foodproducts')
      .should('exist')
      .and('have.text', 'Food Products')
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

    cy.get('#avatar').click();
    cy.wait(100);
    
    cy.contains("Logout").click();
    cy.wait(100);

    cy.contains("Login");  });
});
