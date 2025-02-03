import { ApproveOrderUseCase } from '@Application/use-cases/order/approve-order.use-case';
import { UpdateOrderUseCase } from '@Application/use-cases/order/update-order.use-case';
import { IOrderItemRepositorySymbol } from '@Domain/repositories/order-item.repository';
import { IOrderRepositorySymbol } from '@Domain/repositories/order.repository';
import { IOrderServiceSymbol } from '@Domain/services/order/order.service';
import { OrderServiceImpl } from '@Domain/services/order/order.service.impl';
import { OrderItemRepositoryImpl } from '@Infrastructure/repositories/order-item.repository.impl';
import { OrderRepositoryImpl } from '@Infrastructure/repositories/order.repository.impl';
import { PostgresConfigService } from '@Infrastructure/typeorm/config/postgres.config.service';
import { OrderItemModel } from '@Infrastructure/typeorm/models/order-item.model';
import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { ProducerModule } from '../producer/producer.module';
import { MessageHandler } from './message.handler';
config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  sessionToken: process.env.SESSION_TOKEN,
});

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: process.env.PAYMENT_QUEUE_NAME,
          queueUrl: process.env.PAYMENT_QUEUE_URL,
          region: process.env.AWS_REGION,
        },
        {
          name: process.env.PRODUCTION_QUEUE_NAME,
          queueUrl: process.env.PRODUCTION_QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
      producers: [],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    TypeOrmModule.forFeature([OrderModel, OrderItemModel]),
    ProducerModule,
  ],
  controllers: [],
  providers: [
    ApproveOrderUseCase,
    UpdateOrderUseCase,
    MessageHandler,
    {
      provide: IOrderRepositorySymbol,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: IOrderServiceSymbol,
      useClass: OrderServiceImpl,
    },
    {
      provide: IOrderItemRepositorySymbol,
      useClass: OrderItemRepositoryImpl,
    },
  ],
})
export class ConsumerModule {}
