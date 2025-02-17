import { CreateOrderEntity } from '@Domain/entities/create-order.entity';
import { OrderItemEntity } from '@Domain/entities/order-item.entity';
import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderItemRepository,
  IOrderItemRepositorySymbol,
} from '@Domain/repositories/order-item.repository';
import {
  IOrderRepository,
  IOrderRepositorySymbol,
} from '@Domain/repositories/order.repository';
import { OrderServiceImpl } from '@Domain/services/order/order.service.impl';
import { TotalPriceValueObject } from '@Domain/value-objects/total-price.value-objects';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';

describe('OrderServiceImpl', () => {
  let service: OrderServiceImpl;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let orderItemRepository: jest.Mocked<IOrderItemRepository>;

  const mockDate = new Date('2023-01-01T00:00:00Z');

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
    orderRepository = module.get(IOrderRepositorySymbol);
    orderItemRepository = module.get(IOrderItemRepositorySymbol);

    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    const mockCreateOrderEntity: CreateOrderEntity = {
      userId: '1',
      orderItems: [
        {
          quantity: 2,
          productId: 1,
          price: 10,
          preparationTime: 15,
        },
      ],
    };

    const mockOrderItemEntity = new OrderItemEntity(2, 1, mockDate);
    const mockOrderEntity = new OrderEntity(
      new TotalPriceValueObject(20),
      PaymentStatusType.PENDING,
      OrderStatusType.NONE,
      mockDate,
      0,
      30,
      [mockOrderItemEntity],
      '1',
    );

    it('should create an order successfully', async () => {
      // Arrange
      orderItemRepository.save.mockResolvedValueOnce(mockOrderItemEntity);
      orderRepository.save.mockResolvedValueOnce(mockOrderEntity);

      // Act
      const result = await service.createOrder(mockCreateOrderEntity);

      // Assert
      expect(result).toEqual(mockOrderEntity);
      expect(orderItemRepository.save).toHaveBeenCalledTimes(1);
      expect(orderRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const mockOrder = new OrderEntity(
      new TotalPriceValueObject(100),
      PaymentStatusType.APPROVED,
      OrderStatusType.IN_PREPARATION,
      mockDate,
      0,
      30,
      [],
      '1',
    );

    it('should update order status successfully', async () => {
      // Arrange
      orderRepository.findById.mockResolvedValueOnce(mockOrder);
      orderRepository.save.mockResolvedValueOnce(mockOrder);

      const order = new OrderEntity(
        new TotalPriceValueObject(200),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        new Date(),
        20,
        undefined,
        [],
      );

      // Act
      await service.update(1, OrderStatusType.READY);

      // Assert
      expect(orderRepository.findById).toHaveBeenCalledWith(1);
      expect(orderRepository.save).toHaveBeenCalledWith(order);
    });

    it('should throw NotFoundException when order not found', async () => {
      // Arrange
      orderRepository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.update(1, OrderStatusType.READY)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('approveOrder', () => {
    const mockOrder = new OrderEntity(
      new TotalPriceValueObject(100),
      PaymentStatusType.PENDING,
      OrderStatusType.NONE,
      mockDate,
      0,
      30,
      [],
      '1',
    );

    it('should approve order successfully', async () => {
      // Arrange
      orderRepository.findById.mockResolvedValueOnce(mockOrder);
      orderRepository.save.mockResolvedValueOnce(mockOrder);

      // Act
      await service.approveOrder(1);

      // Assert
      expect(mockOrder.paymentStatus).toBe(PaymentStatusType.APPROVED);
      expect(mockOrder.orderStatus).toBe(OrderStatusType.RECEIVED);
      expect(orderRepository.save).toHaveBeenCalled();
    });
  });

  describe('cancelOrder', () => {
    const mockOrder = new OrderEntity(
      new TotalPriceValueObject(100),
      PaymentStatusType.PENDING,
      OrderStatusType.NONE,
      mockDate,
      0,
      30,
      [],
      '1',
    );

    it('should cancel order successfully', async () => {
      // Arrange
      orderRepository.findById.mockResolvedValueOnce(mockOrder);
      orderRepository.save.mockResolvedValueOnce(mockOrder);

      // Act
      await service.cancelOrder(1);

      // Assert
      expect(mockOrder.paymentStatus).toBe(PaymentStatusType.CANCELED);
      expect(orderRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOrderById', () => {
    const mockOrder = new OrderEntity(
      new TotalPriceValueObject(100),
      PaymentStatusType.PENDING,
      OrderStatusType.NONE,
      mockDate,
      0,
      30,
      [],
      '1',
    );

    it('should find order by id successfully', async () => {
      // Arrange
      orderRepository.findById.mockResolvedValueOnce(mockOrder);

      // Act
      const result = await service.findOrderById(1);

      // Assert
      expect(result).toEqual(mockOrder);
      expect(orderRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when order not found', async () => {
      // Arrange
      orderRepository.findById.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.findOrderById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllOrders', () => {
    const mockOrders = [
      new OrderEntity(
        new TotalPriceValueObject(100),
        PaymentStatusType.PENDING,
        OrderStatusType.NONE,
        mockDate,
        0,
        30,
        [],
        '1',
      ),
    ];

    it('should find all orders successfully', async () => {
      // Arrange
      orderRepository.findAll.mockResolvedValueOnce(mockOrders);

      // Act
      const result = await service.findAllOrders();

      // Assert
      expect(result).toEqual(mockOrders);
      expect(orderRepository.findAll).toHaveBeenCalled();
    });
  });
});
