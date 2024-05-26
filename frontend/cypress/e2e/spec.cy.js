// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })



describe('My First Test', () => {
  it('Visits the Cypress website', () => {
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

  })
})

