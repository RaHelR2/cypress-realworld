describe('Inventory Page', () => {
  beforeEach(() => {
    //cy.selectRandomValidUser()
    cy.loginAsUser()
  })
  
  it('Should display inventory items', () => {
    cy.url().should('include', '/inventory.html')
    cy.get('.inventory_list').should('be.visible')
    cy.get('.inventory_item').should('have.length.greaterThan', 0)
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

 })