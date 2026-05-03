require("@faker-js/faker")

describe('Inventory Shopping Flow', () => {
    before(() => {
        cy.selectRandomValidUser('sort')
        cy.ResetWebsite()
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

  it('should toggle add to remove button correctly', () => {
  cy.url().should('include', '/inventory.html')

  cy.get('[data-test^="add-to-cart"]').first().click()
  cy.get('[data-test^="remove"]').should('exist')

  cy.get('[data-test^="remove"]').first().click()
  cy.get('[data-test^="add-to-cart"]').should('exist')
})

})

  afterEach(() => {
    cy.ResetWebsite()
  })

})

describe('Cart Functionality', () => {
    before(() => {
    cy.selectRandomValidUser('sort')
  })
  beforeEach(() => {
    cy.loginAsUser()
  })

  it('should navigate to cart page', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
  })

  it('should display correct product name and price in cart', () => {
    cy.url().should('include', '/inventory.html')

    cy.get('.inventory_item')
      .should('have.length.at.least', 1)
      .first()
      .then($item => {
        const name = $item.find('.inventory_item_name').text()
        const price = $item.find('.inventory_item_price').text()

        // click using wrapped element
        cy.wrap($item).find('[data-test^="add-to-cart"]').click()

        cy.get('.shopping_cart_link').click()

        cy.contains('.inventory_item_name', name).should('exist')
        cy.contains('.inventory_item_price', price).should('exist')
    })
})
it('should remove only one item from multiple items in cart', () => {
  cy.url().should('include', '/inventory.html')

  cy.addRandomProductToCart()
  cy.addRandomProductToCart()

  cy.get('.shopping_cart_badge').should('have.text', '2')

  cy.get('.shopping_cart_link').click()
  cy.get('.cart_item').should('have.length', 2)

  cy.get('[data-test^="remove"]').first().click()

  cy.get('.cart_item').should('have.length', 1)
  cy.get('.shopping_cart_badge').should('have.text', '1')
})

  it( 'should display cart items and total price', () => {
    cy.url().should('include', '/inventory.html')
    // add random number of products to cart
    const productsToAdd = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < productsToAdd; i++) {
      cy.addRandomProductToCart().wait(500)
    }
    // open cart and verify items and total price
    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_item').should('have.length', productsToAdd)
    cy.get('.item_pricebar').should('be.visible')
  })

  it('should remove items from cart and update total price', () => {
    cy.url().should('include', '/inventory.html')
    cy.addRandomProductToCart()
    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_item').should('have.length', 1)
    cy.get('.item_pricebar').should('be.visible')
    cy.get('[data-test^="remove"]').click()
    cy.get('.cart_item').should('have.length', 0)
  })

  it('should calculate total price correctly', () => {
  cy.url().should('include', '/inventory.html')

  let total = 0

  cy.get('.inventory_item').each(($el, index) => {
    if (index < 2) {
      const price = parseFloat($el.find('.inventory_item_price').text().replace('$', ''))
      total += price
      cy.wrap($el).find('[data-test^="add-to-cart"]').click()
    }
  })

  cy.get('.shopping_cart_link').click()

  cy.get('.inventory_item_price').then($prices => {
    let cartTotal = 0
    $prices.each((_, el) => {
      cartTotal += parseFloat(el.innerText.replace('$', ''))
    })

    expect(cartTotal).to.eq(total)
  })
})

  it('should show empty cart when no items added', () => {
  cy.url().should('include', '/inventory.html')

  cy.get('.shopping_cart_link').click()
  cy.url().should('include', '/cart.html')

  cy.get('.cart_item').should('not.exist')
  cy.get('.shopping_cart_badge').should('not.exist')
})

it('should persist cart after page reload', () => {
  cy.url().should('include', '/inventory.html')

  cy.addRandomProductToCart()
  cy.get('.shopping_cart_badge').invoke('text').as('countBefore')
  cy.reload()

  cy.get('@countBefore').then(count => {
    cy.get('.shopping_cart_badge').should('have.text', count)
  })

  cy.get('.shopping_cart_link').click()
  cy.get('.cart_item').should('have.length.at.least', 1)
})


afterEach(() => {  cy.ResetWebsite()})
})