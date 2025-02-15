const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../src/app'); // AJUSTAR

let response;
let requestData;

Given('que eu tenho um payload válido para um novo pedido', function () {
  requestData = {
    orderItems: [{ productId: 1, quantity: 2 }],
  };
});

Given('que eu tenho um payload inválido para um novo pedido', function () {
  requestData = {};
});

When('eu envio uma requisição POST para "/orders"', async function () {
  response = await request(app).post('/orders').send(requestData);
});

Then('a resposta deve ter status {int}', function (statusCode) {
  expect(response.status).to.equal(statusCode);
});

Then('o corpo da resposta deve conter um ID de pedido', function () {
  expect(response.body).to.have.property('id');
});

Then('o status do pagamento deve ser {string}', function (paymentStatus) {
  expect(response.body.paymentStatus).to.equal(paymentStatus);
});

Then('o status do pedido deve ser {string}', function (orderStatus) {
  expect(response.body.orderStatus).to.equal(orderStatus);
});