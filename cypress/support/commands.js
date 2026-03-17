const { faker } = require('@faker-js/faker');

Cypress.Commands.add('generateUser', () => {
  const user = {
    username: faker.internet.username(),//.toLowerCase(),
    password: faker.internet.password({
      length: 12,
      memorable: false,
      pattern: /[A-Za-z0-9!@#$%^&*]/
    }),
    email: faker.internet.email().toLowerCase(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };

  return cy.wrap(user);
});

Cypress.Commands.add('closeError',() => {
    cy.get('[data-test="error"]').should('be.visible')
    cy.get('[data-test="error-button"]').click()
    cy.get('[data-test="error"]').should('not.exist')
})

Cypress.Commands.add('selectRandomValidUser', (validation) => {

  cy.fixture('users').then((users) => {

    // Filter only valid users
    const filterKey = validation === 'sort' ? 'ValidSort' : 'validLogin';
    const validUsers = users.filter(user => user[filterKey] === true);

    // Safety check
    if (validUsers.length === 0) {
      throw new Error('No valid users found in fixture file.')
    }

    // Pick random user
    const selectedUser = validUsers[Math.floor(Math.random() * validUsers.length)]

    // save to file
    cy.writeFile('cypress/fixtures/selectedUser.json', selectedUser)
  })

})

Cypress.Commands.add('loginAsUser', () => {
  cy.visit('/')
  cy.fixture('selectedUser').then((user) => {
    cy.get('#user-name').type(user.username)
    cy.get('#password').type(user.password)
    cy.get('#login-button').click()
  })
})

Cypress.Commands.add('addRandomProductToCart', () => {
  cy.get('.inventory_item').then((items) => {
    const available = items.filter((i, el) => 
      el.querySelector('[data-test^="add-to-cart"]')
    )
    const randomIndex = Math.floor(Math.random() * available.length)

    cy.wrap(available[randomIndex])
      .find('[data-test^="add-to-cart"]')
      .click()

  })
})

Cypress.Commands.add('removeRandomProductFromCart', () => {
   cy.get('.inventory_item').then((items) => {
    const available = items.filter((i, el) => 
      el.querySelector('[data-test^="remove"]')
    )
    const randomIndex = Math.floor(Math.random() * available.length)

    cy.wrap(available[randomIndex])
      .find('[data-test^="remove"]')
      .click()
  })
})

Cypress.Commands.add('getCartCount', () => {
  cy.get('body').then(($body) => {
    if ($body.find('.shopping_cart_badge').length) {
      cy.get('.shopping_cart_badge')
        .invoke('text')
        .then(Number)
    } else {
      cy.wrap(0)
    }
  })
})

Cypress.Commands.add('verifyCartBadge', (count) => {
  cy.get('.shopping_cart_badge')
    .should('be.visible')
    .and('have.text', count.toString())
})

Cypress.Commands.add('openRandomAvailableProduct', (add=false) => {

  cy.get('.inventory_item').then((items) => {

    const available = items.filter((index, el) =>
      el.querySelector('[data-test^="add-to-cart"]')
    )

    const randomIndex = Math.floor(Math.random() * available.length)

    cy.wrap(available[randomIndex])
      .find('.inventory_item_name')
      .click()

  })
  if (add) {
    cy.get('[data-test^="add-to-cart"]').should('be.visible').click()
  }
})

Cypress.Commands.add('openRandomAddedProduct', (remove=false) => {

  cy.get('.inventory_item').then((items) => {

    const removable = items.filter((index, el) =>
      el.querySelector('[data-test^="remove"]')
    )

    const randomIndex = Math.floor(Math.random() * removable.length)

    cy.wrap(removable[randomIndex])
      .find('.inventory_item_name')
      .click()

  })
  if (remove) {
    cy.get('[data-test^="remove"]').should('be.visible').click()
  }

})

Cypress.Commands.add('ResetWebsite',() =>{
  cy.visit('/')
  cy.get('#user-name').type('standard_user')
  cy.get('#password').type('secret_sauce')
  cy.get('#login-button').click()
  cy.url().should('include', '/inventory.html')
  cy.get('#react-burger-menu-btn').click()
  cy.get('#reset_sidebar_link').click().wait(500)
})