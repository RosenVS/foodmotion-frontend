describe('Food Products Manager', () => {
  it('Gets Food Products', () => {
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

    cy.get('#foodproducts-manager')
      .should('exist')
      .and('have.text', 'Food Products')
      .click();

    cy.url().should('eq', 'http://localhost:3000/manager/food-products');
   
  });

  it('Deletes Food Product', () => {
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
    cy.wait(500)
  
    cy.get('#foodproducts-manager')
      .should('exist')
      .and('have.text', 'Food Products')
      .click();
    cy.wait(500)
  
    cy.url().should('eq', 'http://localhost:3000/manager/food-products');
    cy.wait(500)
    
    cy.intercept('DELETE', /http:\/\/localhost:8080\/api\/food-product\/\d+/, {
      statusCode: 200,
      body: 'OK'
    }).as('deleteFoodProduct');
  
    cy.get('.selectProductDelete').first().click();
    cy.wait(500)
    cy.get('.confirmDeletion').click();
    
    cy.wait('@deleteFoodProduct').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it('Update Food Product', () => {
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
    cy.wait(500)
  
    cy.get('#foodproducts-manager')
      .should('exist')
      .and('have.text', 'Food Products')
      .click();
    cy.wait(500)
  
    cy.url().should('eq', 'http://localhost:3000/manager/food-products');
    cy.wait(500)
    
   
  
    cy.get('.selectProductUpdate').first().click();
    cy.wait(500)

    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="name"]').type('{selectall}{backspace}');
    cy.get('input[name="name"]').type('Corn Bread');

    cy.get('input[name="nutrition.protein.totalProtein"]').should('exist');
    cy.get('input[name="nutrition.protein.totalProtein"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.protein.totalProtein"]').type('7.1');

    cy.get('input[name="nutrition.fat.totalFat"]').should('exist');
    cy.get('input[name="nutrition.fat.totalFat"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.fat.totalFat"]').type('1.4');
    
    cy.get('input[name="nutrition.fat.transFat"]').should('exist');
    cy.get('input[name="nutrition.fat.transFat"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.fat.transFat"]').type('0.8');

    cy.get('input[name="nutrition.carbs.totalCarbs"]').should('exist');
    cy.get('input[name="nutrition.carbs.totalCarbs"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.carbs.totalCarbs"]').type('4.9');

    cy.get('input[name="nutrition.carbs.sugar"]').should('exist');
    cy.get('input[name="nutrition.carbs.sugar"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.carbs.sugar"]').type('2.1');

    cy.get('input[name="dietaryRestrictions.glutenFree"]').should('exist');
    cy.get('input[name="dietaryRestrictions.glutenFree"]').type('{selectall}{backspace}');
    cy.get('input[name="dietaryRestrictions.glutenFree"]').type('true');

    cy.get('input[name="dietaryRestrictions.vegan"]').should('exist');
    cy.get('input[name="dietaryRestrictions.vegan"]').type('{selectall}{backspace}');
    cy.get('input[name="dietaryRestrictions.vegan"]').type('true');

    cy.intercept('PUT', /http:\/\/localhost:8080\/api\/food-product\/\d+/, {
      statusCode: 200,
      body: 'OK'
    }).as('updateFoodProduct');

    cy.get('.confirmUpdate').first().click();

  });


  it('Create Food Product', () => {
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
    cy.wait(500)
  
    cy.get('#foodproducts-manager')
      .should('exist')
      .and('have.text', 'Food Products')
      .click();
    cy.wait(500)
  
    cy.url().should('eq', 'http://localhost:3000/manager/food-products');
    cy.wait(500)
    
   
  
    cy.get('#btnCreateFoodProduct').first().click();
    cy.wait(500)

    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="name"]').type('{selectall}{backspace}');
    cy.get('input[name="name"]').type('Corn Bread');

    cy.get('input[name="nutrition.protein.totalProtein"]').should('exist');
    cy.get('input[name="nutrition.protein.totalProtein"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.protein.totalProtein"]').type('7.1');

    cy.get('input[name="nutrition.fat.totalFat"]').should('exist');
    cy.get('input[name="nutrition.fat.totalFat"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.fat.totalFat"]').type('1.4');
    
    cy.get('input[name="nutrition.fat.transFat"]').should('exist');
    cy.get('input[name="nutrition.fat.transFat"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.fat.transFat"]').type('0.8');

    cy.get('input[name="nutrition.carbs.totalCarbs"]').should('exist');
    cy.get('input[name="nutrition.carbs.totalCarbs"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.carbs.totalCarbs"]').type('4.9');

    cy.get('input[name="nutrition.carbs.sugar"]').should('exist');
    cy.get('input[name="nutrition.carbs.sugar"]').type('{selectall}{backspace}');
    cy.get('input[name="nutrition.carbs.sugar"]').type('2.1');

    cy.get('input[name="dietaryRestrictions.glutenFree"]').should('exist');
    cy.get('input[name="dietaryRestrictions.glutenFree"]').type('{selectall}{backspace}');
    cy.get('input[name="dietaryRestrictions.glutenFree"]').type('true');

    cy.get('input[name="dietaryRestrictions.vegan"]').should('exist');
    cy.get('input[name="dietaryRestrictions.vegan"]').type('{selectall}{backspace}');
    cy.get('input[name="dietaryRestrictions.vegan"]').type('true');

    cy.intercept('POST', 'http://localhost:8080/api/food-product', {
      statusCode: 201,
      body: 
        {
          "id": 3, 
          "name": "Corn Bread",
          "nutrition": {
            "protein": {
              "totalProtein": 7.1
            },
            "fat": {
              "totalFat": 1.4,
              "transFat": 0.8
            },
            "carbs": {
              "totalCarbs": 4.9,
              "sugar": 2.1
            }
          },
          "dietaryRestrictions": {
            "glutenFree": true,
            "lactoseFree": false, 
            "vegan": true,
            "vegetarian": false 
          }
        }
    }).as('createFoodProduct');
    

    cy.wait('@getFoodProducts'); // Wait for the second GET request to complete.

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
            },
            {
                "id": 3,
                "name": "Corn Bread",
                "nutrition": {
                    "protein": {
                        "totalProtein": 7.1
                    },
                    "fat": {
                        "totalFat": 1.4,
                        "transFat": 0.8
                    },
                    "carbs": {
                        "totalCarbs": 4.9,
                        "sugar": 2.1
                    }
                },
                "dietaryRestrictions": {
                    "glutenFree": true,
                    "lactoseFree": false,
                    "vegan": true,
                    "vegetarian": false
                }
            }
        ]
    }).as('getFoodProducts'); // Set up intercept for the next GET request.

    cy.get('#confirmCreate').first().click();

  });
});
