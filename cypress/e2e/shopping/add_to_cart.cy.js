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


})