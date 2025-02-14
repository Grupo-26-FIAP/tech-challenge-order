const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const supertest = require('supertest');
const app = require('../../src/app');

class CustomWorld {
  constructor() {
    this.request = supertest(app);
    this.response = null;
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  // Preparação antes de cada teste (ex: limpar banco de dados, configurar mocks, etc.)
});

After(async function () {
  // Cleanup após cada teste
});
