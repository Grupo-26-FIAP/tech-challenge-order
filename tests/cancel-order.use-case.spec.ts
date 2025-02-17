import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CancelOrderUseCase } from '../src/application/use-cases/order/cancel-order.use-case';

describe('CancelOrderUseCase', () => {
  let cancelOrderUseCase: CancelOrderUseCase;
  let orderService: IOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelOrderUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: {
            cancelOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    cancelOrderUseCase = module.get<CancelOrderUseCase>(CancelOrderUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
  });

  it('should be defined', () => {
    expect(cancelOrderUseCase).toBeDefined();
  });

  it('should cancel an order successfully', async () => {
    const orderId = 1;
    jest.spyOn(orderService, 'cancelOrder').mockResolvedValueOnce();

    await expect(cancelOrderUseCase.execute(orderId)).resolves.not.toThrow();
    expect(orderService.cancelOrder).toHaveBeenCalledWith(orderId);
  });

  it('should throw an error if canceling an order fails', async () => {
    const orderId = 1;
    const error = new Error('Order cancellation failed');
    jest.spyOn(orderService, 'cancelOrder').mockRejectedValueOnce(error);

    await expect(cancelOrderUseCase.execute(orderId)).rejects.toThrow(error);
    expect(orderService.cancelOrder).toHaveBeenCalledWith(orderId);
  });
});
