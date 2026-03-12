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
  cy.get('.inventory_item').its('length').then((length) => {
    const randomIndex = Math.floor(Math.random() * length)
    cy.get('.inventory_item').eq(randomIndex).find('button').click()
  })
})

Cypress.Commands.add('removeRandomProductFromCart', () => {
  cy.contains('Remove').its('length').then((length) => {
    const randomIndex = Math.floor(Math.random() * length)
    cy.contains('Remove').eq(randomIndex).click()
  })
})