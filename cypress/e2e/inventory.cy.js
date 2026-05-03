describe('Inventory Page Appearance', () => {
  before(() => {
    cy.selectRandomValidUser('sort')
  })
  beforeEach(() => {
    cy.loginAsUser()
  })
 
  it('Should display inventory items', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_list').should('be.visible')
    cy.get('.inventory_item').should('have.length.greaterThan', 0)
  })

  it('should display title, cart icon and side menu', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.app_logo').should('be.visible').and('have.text', 'Swag Labs')
    cy.get('.shopping_cart_link').should('be.visible')
    cy.get('#react-burger-menu-btn').should('be.visible')
  })
it('should have add to cart buttons for each product', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('button').should('be.visible').and('contain', 'Add to cart')
    })
  })

  it('should have product images for each item', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('.inventory_item_img').should('be.visible')
    })
  })

  it('should have product descriptions for each item', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('.inventory_item_desc').should('be.visible')
    })
  })

  it('should have product prices for each item', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_item').each(($item) => {
      cy.wrap($item).find('.inventory_item_price').should('be.visible')
    })
  })
})

describe('Inventory Sorting Functionality', () => {
  before(() => {
    cy.selectRandomValidUser('sort')
  })
  beforeEach(() => {
    cy.loginAsUser()
  })

  it('should have default sorting as name A to Z', () => {
    cy.url().should('include', '/inventory.html').wait(500)
    cy.get('.product_sort_container').should('have.value', 'az')
    cy.get('.inventory_item_name').first()
    cy.get('.inventory_item_name').then(($names) => {
      const nameValues = $names.map((index, html) => html.innerText).get()
      const sortedNames = [...nameValues].sort()
      expect(nameValues).to.deep.equal(sortedNames)
    })
  })

  it('should sort products by price low to high', () => {
    cy.url().should('include', '/inventory.html').wait(500)
    cy.get('.product_sort_container').select('Price (low to high)').wait(500)
    cy.get('[data-test="active-option"]').should('have.text', 'Price (low to high)').wait(500)
    cy.get('.inventory_item_price').then(($prices) => {
      const priceValues = $prices.map((index, html) => parseFloat(html.innerText.replace('$', ''))).get()
      const sortedPrices = [...priceValues].sort((a, b) => a - b)
      cy.log('Extracted Prices:', priceValues)
      cy.log('Sorted Prices:', sortedPrices)
      expect(priceValues).to.deep.equal(sortedPrices)
    })
  })

  it('should sort products by price high to low', () => {
    cy.url().should('include', '/inventory.html').wait(500)
    cy.get('.product_sort_container').select('Price (high to low)').wait(500)
    cy.get('[data-test="active-option"]').should('have.text', 'Price (high to low)').wait(500)
    cy.get('.inventory_item_price').then(($prices) => {
      const priceValues = $prices.map((index, html) => parseFloat(html.innerText.replace('$', ''))).get()
      const sortedPrices = [...priceValues].sort((a, b) => b - a)
      expect(priceValues).to.deep.equal(sortedPrices)
    })
  })

  it('should sort products by name A to Z', () => {
    cy.url().should('include', '/inventory.html').wait(500)
    cy.get('.product_sort_container').select('Name (A to Z)').wait(500)
    cy.get('[data-test="active-option"]').should('have.text', 'Name (A to Z)').wait(500)
    cy.get('.inventory_item_name').first()
    cy.get('.inventory_item_name').then(($names) => {
      const nameValues = $names.map((index, html) => html.innerText).get()
      const sortedNames = [...nameValues].sort()
      expect(nameValues).to.deep.equal(sortedNames)
    })
  })

  it('should sort products by name Z to A', () => {
    cy.url().should('include', '/inventory.html').wait(500)
    cy.get('.product_sort_container').select('Name (Z to A)').wait(500)
    cy.get('[data-test="active-option"]').should('have.text', 'Name (Z to A)').wait(500)
    cy.get('.inventory_item_name').first()
    cy.get('.inventory_item_name').then(($names) => {
      const nameValues = $names.map((index, html) => html.innerText).get()
      const sortedNames = [...nameValues].sort().reverse()
      expect(nameValues).to.deep.equal(sortedNames)
    })
  })

  it('should reset sorting selection after page refresh', () => {
    cy.url().should('include', '/inventory.html').wait(500)
    cy.get('.product_sort_container').select('Price (low to high)').wait(500)
    cy.get('[data-test="active-option"]').should('have.text', 'Price (low to high)').wait(500)
    cy.reload()
    cy.get('.product_sort_container').should('have.value', 'az')
    cy.get('[data-test="active-option"]').should('have.text', 'Name (A to Z)')
  })

  it.skip('should show error message for error user', () => {
    cy.visit('/')
    cy.get('#user-name').type('error_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.url().should('include', '/inventory.html')
    cy.get('.product_sort_container').select('Price (low to high)').wait(500)
    cy.get('[data-test="error"]')
    .should('be.visible')
    .and('contain','Sorting is broken!')
  })
})