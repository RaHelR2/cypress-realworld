describe('Login Test', () => {
  
  it('logs in successfully with standard_user', () => {
    cy.visit('/')

    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()

    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_list').should('be.visible')
  })
})