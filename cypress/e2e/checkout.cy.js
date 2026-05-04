import "@faker-js/faker"

describe('Checkout', () => {
    before(() => {
    cy.selectRandomValidUser('sort')
    cy.ResetWebsite()
  })
  beforeEach(() => {
    cy.loginAsUser()
  })

it("should show correct total price in checkout", () => {
  cy.FillCartWithRandomProducts()
  cy.get('[data-test="shopping-cart-link"]').click()
  let calculatedTotal = 0

  cy.get('[data-test="inventory-item-price"]')
    .each(($el) => {
      const priceText = $el.text(); 
      const price = parseFloat(priceText.replace('$', ''));
      calculatedTotal += price;
    })

  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type('John')
  cy.get('[data-test="lastName"]').type('Doe')
  cy.get('[data-test="postalCode"]').type('12345')
  cy.get('[data-test="continue"]').click()
  
  cy.get('[data-test="subtotal-label"]').then(total => {
    const totalText = total.text()
    const displayedTotal = parseFloat(totalText.split('$')[1])
    expect(displayedTotal).to.equal(calculatedTotal)
  })

  cy.get('[data-test="tax-label"]').then(tax => {
    const taxText = tax.text()
    const displayedTax = parseFloat(taxText.split('$')[1])
    const expectedTax = parseFloat((calculatedTotal * 0.08).toFixed(2))
    expect(displayedTax).to.equal(expectedTax)
  })

  cy.get('[data-test="total-label"]').then(total => {
    const totalText = total.text()
    const displayedTotal = parseFloat(totalText.split('$')[1])
    const expectedTotal = parseFloat((calculatedTotal * 1.08).toFixed(2))
    expect(displayedTotal).to.equal(expectedTotal)
  })
})

it("should complete checkout process successfully", () => {
  cy.addRandomProductToCart()
  cy.get('[data-test="shopping-cart-link"]').click()
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type('John')
  cy.get('[data-test="lastName"]').type('Doe')
  cy.get('[data-test="postalCode"]').type('12345')
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="finish"]').click()
  cy.get('[data-test="checkout-complete-container"]').should('contain', 'Thank you for your order!')
  cy.get('[data-test="back-to-products"]')
})

it("should show error message for missing required fields", () => {
  cy.addRandomProductToCart()
  cy.get('[data-test="shopping-cart-link"]').click()
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="error"]').should('contain', 'First Name is required')
  cy.get('[data-test="firstName"]').type('John')
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="error"]').should('contain', 'Last Name is required')
  cy.get('[data-test="lastName"]').type('Doe')
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="error"]').should('contain', 'Postal Code is required')
  cy.get('[data-test="postalCode"]').type('12345')
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="finish"]').click()
  cy.get('[data-test="checkout-complete-container"]').should('contain', 'Thank you for your order!')
})

it("should navigate back to products page after checkout", () => {
  cy.addRandomProductToCart()
  cy.get('[data-test="shopping-cart-link"]').click()
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type('John')
  cy.get('[data-test="lastName"]').type('Doe')
  cy.get('[data-test="postalCode"]').type('12345')
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="finish"]').click()
  cy.get('[data-test="back-to-products"]').click()
  cy.url().should('include', '/inventory.html')
})

it("should not allow checkout with empty cart", () => {
  //This test fails
  cy.get('[data-test="shopping-cart-link"]').click()
  cy.get('[data-test="checkout"]').should('be.disabled')
})

afterEach(() => {  cy.ResetWebsite()})
})