import {
  IOrderItemRepository,
  IOrderItemRepositorySymbol,
} from '@Domain/repositories/order-item.repository';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { CreateOrderEntity } from '../../entities/create-order.entity';
import { OrderItemEntity } from '../../entities/order-item.entity';
import { OrderEntity } from '../../entities/order.entity';
import {
  IOrderRepository,
  IOrderRepositorySymbol,
} from '../../repositories/order.repository';
import { TotalPriceValueObject } from '../../value-objects/total-price.value-objects';
import { OrderServiceImpl } from './order.service.impl';

describe('OrderServiceImpl', () => {
  let service: OrderServiceImpl;
  let orderRepository: IOrderRepository;
  let orderItemRepository: IOrderItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderServiceImpl,
        {
          provide: IOrderRepositorySymbol,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: IOrderItemRepositorySymbol,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderServiceImpl>(OrderServiceImpl);
    orderRepository = module.get<IOrderRepository>(IOrderRepositorySymbol);
    orderItemRepository = module.get<IOrderItemRepository>(
      IOrderItemRepositorySymbol,
    );
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const orderItem = new OrderItemEntity(2, 1, new Date());
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue(orderItem);

      const order = new CreateOrderEntity(
        [{ price: 100, quantity: 2, preparationTime: 10, productId: 1 }],
        '1',
      );
      order.userId = '1';

      const orderItems = order.orderItems.map(
        (item) => new OrderItemEntity(item.price, item.quantity, new Date()),
      );

      const orderEntity = new OrderEntity(
        new TotalPriceValueObject(200),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        new Date(),
        20,
        undefined,
        orderItems,
      );
      jest.spyOn(orderRepository, 'save').mockResolvedValue(orderEntity);

      const result = await service.createOrder(order);
      expect(result).toEqual(orderEntity);
    });
  });

  describe('update', () => {
    it('should update an order status successfully', async () => {
      const order = new OrderEntity(
        new TotalPriceValueObject(200),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        new Date(),
        20,
        undefined,
        [],
      );
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      await service.update(1, OrderStatusType.READY);
      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

      await expect(service.update(1, OrderStatusType.READY)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('approveOrder', () => {
    it('should approve an order successfully', async () => {
      const order = new OrderEntity(
        new TotalPriceValueObject(200),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        new Date(),
        20,
        undefined,
        [],
      );
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      await service.approveOrder(1);
      expect(order.paymentStatus).toBe(PaymentStatusType.APPROVED);
      expect(order.orderStatus).toBe(OrderStatusType.RECEIVED);
      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

      await expect(service.approveOrder(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order successfully', async () => {
      const order = new OrderEntity(
        new TotalPriceValueObject(200),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        new Date(),
        20,
        undefined,
        [],
      );
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(order);

      await service.cancelOrder(1);
      expect(order.paymentStatus).toBe(PaymentStatusType.CANCELED);
      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

      await expect(service.cancelOrder(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOrderById', () => {
    it('should find an order by id successfully', async () => {
      const order = new OrderEntity(
        new TotalPriceValueObject(200),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        new Date(),
        20,
        undefined,
        [],
      );
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(order);

      const result = await service.findOrderById(1);
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if order not found', async () => {
      jest.spyOn(orderRepository, 'findById').mockResolvedValue(null);

      await expect(service.findOrderById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllOrders', () => {
    it('should find all orders successfully', async () => {
      const orders = [
        new OrderEntity(
          new TotalPriceValueObject(200),
          PaymentStatusType.PENDING,
          OrderStatusType.NONE,
          new Date(),
          20,
          undefined,
          [],
        ),
      ];
      jest.spyOn(orderRepository, 'findAll').mockResolvedValue(orders);

      const result = await service.findAllOrders();
      expect(result).toEqual(orders);
    });
  });
});
