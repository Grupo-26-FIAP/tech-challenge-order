import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { UpdateOrderRequestDto } from '../../dtos/request/order/update-order.request.dto';
import { UpdateOrderUseCase } from './update-order.use-case';

describe('UpdateOrderUseCase', () => {
  let updateOrderUseCase: UpdateOrderUseCase;
  let orderService: IOrderService;

  const mockOrderService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    updateOrderUseCase = module.get<UpdateOrderUseCase>(UpdateOrderUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
  });

  it('should be defined', () => {
    expect(updateOrderUseCase).toBeDefined();
  });

  it('should call update method of orderService with correct parameters', async () => {
    const dto: UpdateOrderRequestDto = {
      id: 1,
      orderStatus: OrderStatusType.READY,
    };
    await updateOrderUseCase.execute(dto);
    expect(orderService.update).toHaveBeenCalledWith(dto.id, dto.orderStatus);
  });

  it('should throw an error if update method of orderService fails', async () => {
    const dto: UpdateOrderRequestDto = {
      id: 1,
      orderStatus: OrderStatusType.READY,
    };
    mockOrderService.update.mockRejectedValueOnce(new Error('Update failed'));

    await expect(updateOrderUseCase.execute(dto)).rejects.toThrow(
      'Update failed',
    );
  });
});
