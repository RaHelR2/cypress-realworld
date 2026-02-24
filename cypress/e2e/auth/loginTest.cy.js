describe('Login Flow', () => {

  it('Should login successfully with valid credentials', () => {
    cy.visit('/#/login')

    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('Password123')
    cy.contains('button', 'Sign in').click()

    cy.contains('Your Feed').should('be.visible')
  })

})