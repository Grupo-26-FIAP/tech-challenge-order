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
import { FindOrderByIdUseCase } from './find-order-by-id.use-case';

describe('FindOrderByIdUseCase', () => {
  let useCase: FindOrderByIdUseCase;
  let orderService: IOrderService;

  const mockOrderService = {
    findOrderById: jest.fn(),
    totalPrice: 100,
    paymentStatus: PaymentStatusType.APPROVED,
    orderStatus: OrderStatusType.IN_PREPARATION,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderEntity: OrderEntity = {
    id: 1,
    totalPrice: new TotalPriceValueObject(100),
    paymentStatus: PaymentStatusType.APPROVED,
    orderStatus: OrderStatusType.IN_PREPARATION,
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedPreparationTime: 10,
    productsOrder: [],
  };

  const mockOrderResponseDto: OrderResponseDto = {
    id: 1,
    createdAt: new Date(),
    estimatedPreparationTime: 10,
    orderStatus: OrderStatusType.IN_PREPARATION,
    paymentStatus: PaymentStatusType.APPROVED,
    productOrders: [],
    totalPrice: 0,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOrderByIdUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    useCase = module.get<FindOrderByIdUseCase>(FindOrderByIdUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return an order response DTO when order is found', async () => {
    jest
      .spyOn(orderService, 'findOrderById')
      .mockResolvedValue(mockOrderEntity);
    jest
      .spyOn(OrderMapper, 'toResponseDto')
      .mockReturnValue(mockOrderResponseDto);

    const result = await useCase.execute(1);

    expect(orderService.findOrderById).toHaveBeenCalledWith(1);
    expect(OrderMapper.toResponseDto).toHaveBeenCalledWith(mockOrderEntity);
    expect(result).toEqual(mockOrderResponseDto);
  });

  it('should throw an error when order is not found', async () => {
    jest
      .spyOn(orderService, 'findOrderById')
      .mockRejectedValue(new Error('Order not found'));

    await expect(useCase.execute(1)).rejects.toThrow('Order not found');
    expect(orderService.findOrderById).toHaveBeenCalledWith(1);
  });
});
