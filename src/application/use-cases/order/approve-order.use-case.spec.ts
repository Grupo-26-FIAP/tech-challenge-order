import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { TotalPriceValueObject } from '@Domain/value-objects/total-price.value-objects';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { ApproveOrderUseCase } from './approve-order.use-case';

describe('ApproveOrderUseCase', () => {
  let useCase: ApproveOrderUseCase;
  let orderService: IOrderService;
  let messageProducer: MessageProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApproveOrderUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: {
            findOrderById: jest.fn(),
            approveOrder: jest.fn(),
          },
        },
        {
          provide: MessageProducer,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ApproveOrderUseCase>(ApproveOrderUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
    messageProducer = module.get<MessageProducer>(MessageProducer);
  });

  it('should approve order and send message successfully', async () => {
    const orderId = 1;
    const order: OrderEntity = {
      id: orderId,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPrice: new TotalPriceValueObject(100),
      paymentStatus: 'PAID' as PaymentStatusType,
      orderStatus: 'APPROVED' as OrderStatusType,
      estimatedPreparationTime: 30,
      productsOrder: [],
    };

    jest.spyOn(orderService, 'findOrderById').mockResolvedValue(order);
    jest.spyOn(orderService, 'approveOrder').mockResolvedValue(undefined);
    jest.spyOn(messageProducer, 'sendMessage').mockResolvedValue(undefined);

    await useCase.execute(orderId);

    expect(orderService.findOrderById).toHaveBeenCalledWith(orderId);
    expect(orderService.approveOrder).toHaveBeenCalledWith(orderId);
    expect(messageProducer.sendMessage).toHaveBeenCalledWith(
      'order-ready-for-production-queue.fifo',
      order,
    );
  });

  it('should throw NotFoundException if order is not found', async () => {
    const orderId = 1;

    jest.spyOn(orderService, 'findOrderById').mockResolvedValue(null);

    await expect(useCase.execute(orderId)).rejects.toThrow(NotFoundException);
    expect(orderService.findOrderById).toHaveBeenCalledWith(orderId);
    expect(orderService.approveOrder).not.toHaveBeenCalled();
    expect(messageProducer.sendMessage).not.toHaveBeenCalled();
  });
});
