import { CreateOrderUseCase } from '@Application/use-cases/order/create-order.use-case';
import { FindAllOrdersUseCase } from '@Application/use-cases/order/find-all-orders.use-case';
import { FindOrderByIdUseCase } from '@Application/use-cases/order/find-order-by-id.use-case';
import { Given, Then, When } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { strict as assert } from 'assert';
import { OrderController } from 'src/presentation/controllers/order.controller';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

let app: INestApplication;
let response: request.Response;

const mockOrder = {
  execute: async () => {},
};

Given('the system is running', async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
    controllers: [OrderController],
    providers: [
      {
        provide: CreateOrderUseCase,
        useValue: { execute: async () => mockOrder },
      },
      {
        provide: FindOrderByIdUseCase,
        useValue: { execute: async () => mockOrder },
      },
      {
        provide: FindAllOrdersUseCase,
        useValue: { execute: async () => mockOrder },
      },
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

When('I request the list of all orders', async () => {
  response = await request(app.getHttpServer()).get(`/orders`);
});

Then('the system should return the list of orders with HTTP code 200', () => {
  console.log({ responseBody: response.body });
  assert.strictEqual(response.status, 200);
  assert.deepEqual(response.body, {});
});
