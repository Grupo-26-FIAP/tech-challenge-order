import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariableModule } from '@Shared/config/environment-variable/environment-variable.module';
import { ApproveOrderUseCase } from './application/use-cases/approve-order.use-case';
import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { FindAllOrdersUseCase } from './application/use-cases/find-all-orders.use-case';
import { FindOrderByIdUseCase } from './application/use-cases/find-order-by-id.use-case';
import { UpdateOrderUseCase } from './application/use-cases/update-order.use-case';
import { IOrderRepositorySymbol } from './domain/repositories/order.repository';
import { IOrderServiceSymbol } from './domain/services/order.service';
import { OrderServiceImpl } from './domain/services/order.service.impl';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { PostgresConfigService } from './infrastructure/typeorm/config/postgres.config.service';
import { OrderController } from './presentation/controllers/order.controller';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    TypeOrmModule.forFeature([OrderModel]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
    }),

    EnvironmentVariableModule.forRoot({ isGlobal: true }),
    TerminusModule,
  ],
  providers: [
    OrderServiceImpl,
    CreateOrderUseCase,
    CancelOrderUseCase,
    UpdateOrderUseCase,
    ApproveOrderUseCase,
    FindOrderByIdUseCase,
    FindAllOrdersUseCase,
    {
      provide: IOrderRepositorySymbol,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: IOrderServiceSymbol,
      useClass: OrderServiceImpl,
    },
  ],
  controllers: [OrderController],
})
export class AppModule {}
