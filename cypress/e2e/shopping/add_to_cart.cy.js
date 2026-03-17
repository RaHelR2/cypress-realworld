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

  it('should add multiple products to the cart and verify they are added to cart', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').then((items) => {
      const productsToAdd = Math.floor(Math.random() * (items.length - 1)) + 2
      cy.log(`Adding ${productsToAdd} products to the cart`)

      for (let i = 0; i < productsToAdd; i++) {
        cy.addRandomProductToCart().wait(500)
      }
    cy.get('.shopping_cart_badge').should('be.visible').and('have.text', productsToAdd.toString())

    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_item').should('have.length', productsToAdd)
    })
    
  })

  it('should remove products from the cart and verify they are removed', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').then((items) => {
      const productsToAdd = Math.floor(Math.random() * (items.length - 1)) + 2
      cy.log(`Adding ${productsToAdd} products to the cart`)
      for (let i = 0; i < productsToAdd; i++) {
        cy.addRandomProductToCart()
      }
    cy.get('.shopping_cart_badge').should('be.visible').and('have.text', productsToAdd.toString())

    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_item').should('have.length', productsToAdd)
    cy.get('[data-test="continue-shopping"]').click()
    cy.url().should('include', '/inventory.html')
    
    const productsToRemove = Math.floor(productsToAdd / 2)
    cy.log(`Removing ${productsToRemove} products from the cart`)
      for (let i = 0; i < productsToRemove; i++) {
        cy.removeRandomProductFromCart().wait(500)
        const remainingProducts = productsToAdd - (i + 1)
        cy.get('.shopping_cart_badge').should('be.visible').and('have.text', remainingProducts.toString())
        cy.get('.shopping_cart_link').click()
        cy.url().should('include', '/cart.html')
        cy.get('.cart_item').should('have.length', remainingProducts)
        cy.get('[data-test="continue-shopping"]').click()
        cy.url().should('include', '/inventory.html')
      }
    })
  })

it('should open product details and add to cart from there', () => {
  cy.url().should('include', '/inventory.html')
  cy.get('.inventory_item').then((items) => {

    const productsToAdd = Math.floor(Math.random() * (items.length - 1)) + 2
    cy.log(`Adding ${productsToAdd} products to the cart`)

    for (let i = 0; i < productsToAdd; i++) {
      cy.openRandomAvailableProduct(true).wait(500)
        cy.get('.shopping_cart_badge').should('have.text', (i + 1).toString())
        cy.get('[data-test="back-to-products"]').click()
        cy.url().should('include', '/inventory.html')
        cy.get('.shopping_cart_badge').should('have.text', (i + 1).toString())
      }
    })
  })

it('should remove products from product details page and verify they are removed', () => {

  cy.url().should('include', '/inventory.html')
  cy.get('.inventory_item').its('length').then((totalProducts) => {

    const productsToAdd = Math.floor(Math.random() * (totalProducts - 1)) + 2
    cy.log(`Adding ${productsToAdd} products`)
    for (let i = 0; i < productsToAdd; i++) {
      cy.openRandomAvailableProduct(true).wait(500)
      cy.get('.shopping_cart_badge').should('have.text', (i + 1).toString())
      cy.get('[data-test="back-to-products"]').click()
      cy.url().should('include', '/inventory.html')
      cy.get('.shopping_cart_badge').should('have.text', (i + 1).toString())
    }
    
    const productsToRemove = Math.floor(productsToAdd / 2)
    cy.log(`Removing ${productsToRemove} products`)
    for (let i = 0; i < productsToRemove; i++) {
      cy.openRandomAddedProduct(true).wait(500)
      const expectedRemaining = productsToAdd - i - 1
      cy.get('.shopping_cart_badge').should('have.text', expectedRemaining.toString())
      cy.get('[data-test="back-to-products"]').click()
      cy.url().should('include', '/inventory.html')
      cy.get('.shopping_cart_badge').should('have.text', expectedRemaining.toString())
    }
  })
})

  afterEach(() => {
    cy.ResetWebsite()
  })

})