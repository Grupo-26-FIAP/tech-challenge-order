import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { TotalPriceValueObject } from '@Domain/value-objects/total-price.value-objects';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { OrderResponseDto } from '../../dtos/response/order/order.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import { FindAllOrdersUseCase } from './find-all-orders.use-case';

describe('FindAllOrdersUseCase', () => {
  let useCase: FindAllOrdersUseCase;
  let orderService: IOrderService;

  const mockOrderService = {
    findAllOrders: jest.fn(),
  };

  const mockOrderEntities: OrderEntity[] = [
    {
      id: 1,
      totalPrice: new TotalPriceValueObject(100),
      estimatedPreparationTime: 30,
      paymentStatus: PaymentStatusType.APPROVED,
      orderStatus: OrderStatusType.IN_PREPARATION,
      createdAt: new Date(),
      updatedAt: new Date(),
      productsOrder: [],
    },
    {
      id: 2,
      totalPrice: new TotalPriceValueObject(150),
      estimatedPreparationTime: 45,
      paymentStatus: PaymentStatusType.APPROVED,
      orderStatus: OrderStatusType.IN_PREPARATION,
      createdAt: new Date(),
      updatedAt: new Date(),
      productsOrder: [],
    },
  ];

  const mockOrderResponseDtos: OrderResponseDto[] = [
    {
      id: 1,
      totalPrice: 100,
      estimatedPreparationTime: 30,
      paymentStatus: PaymentStatusType.APPROVED,
      orderStatus: OrderStatusType.IN_PREPARATION,
      createdAt: new Date(),
      updatedAt: new Date(),
      productOrders: [],
    },
    {
      id: 2,
      totalPrice: 150,
      estimatedPreparationTime: 45,
      paymentStatus: PaymentStatusType.APPROVED,
      orderStatus: OrderStatusType.IN_PREPARATION,
      createdAt: new Date(),
      updatedAt: new Date(),
      productOrders: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllOrdersUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    useCase = module.get<FindAllOrdersUseCase>(FindAllOrdersUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return an array of order response DTOs when orders are found', async () => {
    jest
      .spyOn(orderService, 'findAllOrders')
      .mockResolvedValue(mockOrderEntities);
    jest.spyOn(OrderMapper, 'toResponseDto').mockImplementation((order) => {
      return mockOrderResponseDtos.find((dto) => dto.id === order.id);
    });

    const result = await useCase.execute();

    expect(orderService.findAllOrders).toHaveBeenCalled();
    expect(OrderMapper.toResponseDto).toHaveBeenCalledTimes(
      mockOrderEntities.length,
    );
    expect(result).toEqual(mockOrderResponseDtos);
  });

  it('should return an empty array when no orders are found', async () => {
    jest.spyOn(orderService, 'findAllOrders').mockResolvedValue([]);

    const result = await useCase.execute();

    expect(orderService.findAllOrders).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should throw an error when findAllOrders fails', async () => {
    jest
      .spyOn(orderService, 'findAllOrders')
      .mockRejectedValue(new Error('Failed to fetch orders'));

    await expect(useCase.execute()).rejects.toThrow('Failed to fetch orders');
    expect(orderService.findAllOrders).toHaveBeenCalled();
  });
});
