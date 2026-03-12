describe('Login Test', function(){
  
  before(function () {
    cy.selectRandomValidUser()
  })

  it('logs in successfully with a valid user', function(){
      cy.visit('/')

      cy.fixture('selectedUser').then((user) => {
        cy.get('#user-name').type(user.username)
        cy.get('#password').type(user.password)
      })
      cy.get('#login-button').click()

      cy.url().should('include', '/inventory.html')
      cy.get('.inventory_list').should('be.visible')
  })

  it('shows an error message for invalid credentials', function() {
      cy.visit('/')
      cy.generateUser().then((Newuser) => {
        cy.get('#user-name').type(Newuser.username)
        cy.get('#password').type(Newuser.password)
      })
      cy.get('#login-button').click()
      cy.url().should('not.include', '/inventory.html')
      cy.get('[data-test="error"]').should('be.visible')
      .and('contain', 'Epic sadface: Username and password do not match any user in this service')
      cy.screenshot('invalid-credentials-error')
      cy.closeError()
  })

  it('shows an error message for empty credentials', () => {
    cy.visit('/')
    cy.get('#login-button').click()
    cy.url().should('not.include', '/inventory.html')
    cy.get('[data-test="error"]').should('be.visible')
    .and('contain', 'Epic sadface: Username is required')
    cy.screenshot('empty-credentials-error')
    cy.closeError()
  })

  it('shows an error message for empty password', function(){
    cy.visit('/')
    cy.fixture('selectedUser').then((user) => {
      cy.get('#user-name').type(user.username)
    })
    cy.get('#login-button').click()
    cy.url().should('not.include', '/inventory.html')
    cy.get('[data-test="error"]').should('be.visible')
    .and('contain', 'Epic sadface: Password is required')
    cy.screenshot('empty-password-error')
    cy.closeError()
  })

  it('shows an error message for empty username', function() {
    cy.visit('/')
    cy.fixture('selectedUser').then((user) => {
      cy.get('#password').type(user.password)
    })
    cy.get('#login-button').click()
    cy.url().should('not.include', '/inventory.html')
    cy.get('[data-test="error"]').should('be.visible')
    .and('contain', 'Epic sadface: Username is required')
    cy.screenshot('empty-username-error')
    cy.closeError()
  })

  it('shows an error message for locked out user', () => {
    cy.visit('/')
    cy.get('#user-name').type('locked_out_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.url().should('not.include', '/inventory.html')
    cy.get('[data-test="error"]').should('be.visible')
    .and('contain', 'Epic sadface: Sorry, this user has been locked out.')
    cy.screenshot('locked-out-user-error')
    cy.closeError()
  })

  it('can log out successfully', () => {
    cy.visit('/')
    cy.fixture('selectedUser').then((user) => {
      cy.get('#user-name').type(user.username)
      cy.get('#password').type(user.password)
    })
    cy.get('#login-button').click()
    cy.url().should('include', '/inventory.html')
    cy.get('#react-burger-menu-btn').click()
    cy.get('#logout_sidebar_link').click()
    cy.url().should('not.include', '/index.html')
  })
})