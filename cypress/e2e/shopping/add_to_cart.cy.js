describe('Shopping Flow', () => {
    before(() => {
        cy.selectRandomValidUser('sort')
    })
    beforeEach(() => {
        cy.loginAsUser()
    })

    it('should add a product to the cart', () => {
    cy.url().should('include', '/inventory.html')
    cy.addRandomProductToCart()
    cy.get('.shopping_cart_badge').should('be.visible').and('have.text', '1')
  })

  it('should remove a product from the cart', () => {
    cy.url().should('include', '/inventory.html')
    cy.addRandomProductToCart()
    cy.get('.shopping_cart_badge').should('be.visible').and('have.text', '1')
    cy.removeRandomProductFromCart()
    cy.get('.shopping_cart_badge').should('not.exist')
  })

  it('should navigate to the cart page and return to inventory', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_list').should('be.visible')
    cy.get('[data-test="continue-shopping"]').click()
    cy.url().should('include', '/inventory.html')
  })


})