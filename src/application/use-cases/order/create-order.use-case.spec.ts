import { OrderEntity } from '@Domain/entities/order.entity';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { TotalPriceValueObject } from '@Domain/value-objects/total-price.value-objects';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { IProductService } from '@Infrastructure/services/product.service';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { CreateOrderRequestDto } from '../../dtos/request/order/create-order.request.dto';
import { OrderResponseDto } from '../../dtos/response/order/order.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';
import { CreateOrderUseCase } from './create-order.use-case';

describe('CreateOrderUseCase', () => {
  let createOrderUseCase: CreateOrderUseCase;
  let orderService: IOrderService;
  let productService: IProductService;
  let messageProducer: MessageProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
        {
          provide: IOrderServiceSymbol,
          useValue: {
            createOrder: jest.fn(),
          },
        },
        {
          provide: IProductService,
          useValue: {
            findProducts: jest.fn(),
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

    createOrderUseCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderService = module.get<IOrderService>(IOrderServiceSymbol);
    productService = module.get<IProductService>(IProductService);
    messageProducer = module.get<MessageProducer>(MessageProducer);
  });

  it('should be defined', () => {
    expect(createOrderUseCase).toBeDefined();
  });

  it('should create an order successfully', async () => {
    const dto: CreateOrderRequestDto = {
      orderItems: [
        /* mock order items */
      ],
      /* other mock data */
    };
    const productsDto = [
      /* mock products */
    ];
    const orderEntityRequest = {
      orderItems: [
        /* mock order items */
      ],
      userId: 1,
    };
    const orderEntity: OrderEntity = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPrice: new TotalPriceValueObject(100),
      paymentStatus: 'PAID' as PaymentStatusType,
      orderStatus: 'CREATED' as OrderStatusType,
      estimatedPreparationTime: 30,
      productsOrder: [
        /* mock product orders */
      ],
    };
    const orderDto: OrderResponseDto = {
      id: 1,
      totalPrice: 100,
      estimatedPreparationTime: 30,
      paymentStatus: 'PAID' as PaymentStatusType,
      orderStatus: 'CREATED' as OrderStatusType,
      createdAt: new Date(),
      updatedAt: new Date(),
      productOrders: [
        /* mock product orders */
      ],
    };

    jest
      .spyOn(productService, 'findProducts')
      .mockResolvedValueOnce(productsDto);
    jest
      .spyOn(OrderMapper, 'toCreateOrderEntity')
      .mockReturnValueOnce(orderEntityRequest);
    jest.spyOn(orderService, 'createOrder').mockResolvedValueOnce(orderEntity);
    jest.spyOn(OrderMapper, 'toResponseDto').mockReturnValueOnce(orderDto);
    jest.spyOn(messageProducer, 'sendMessage').mockResolvedValueOnce(undefined);

    const result = await createOrderUseCase.execute(dto);

    expect(result).toEqual(orderDto);
    expect(productService.findProducts).toHaveBeenCalled();
    expect(OrderMapper.toCreateOrderEntity).toHaveBeenCalledWith(
      dto,
      productsDto,
    );
    expect(orderService.createOrder).toHaveBeenCalledWith(orderEntityRequest);
    expect(OrderMapper.toResponseDto).toHaveBeenCalledWith(
      orderEntity,
      productsDto,
    );
    expect(messageProducer.sendMessage).toHaveBeenCalledWith(
      'order-created-queue.fifo',
      orderDto,
    );
  });

  it('should throw an error if creating an order fails', async () => {
    const dto: CreateOrderRequestDto = {
      orderItems: [
        /* mock order items */
      ],
      /* other mock data */
    };
    const productsDto = [
      /* mock products */
    ];
    const orderEntityRequest = {
      orderItems: [
        /* mock order items */
      ],
      userId: 1,
    };
    const error = new Error('Order creation failed');

    jest
      .spyOn(productService, 'findProducts')
      .mockResolvedValueOnce(productsDto);
    jest
      .spyOn(OrderMapper, 'toCreateOrderEntity')
      .mockReturnValueOnce(orderEntityRequest);
    jest.spyOn(orderService, 'createOrder').mockRejectedValueOnce(error);

    await expect(createOrderUseCase.execute(dto)).rejects.toThrow(error);
    expect(productService.findProducts).toHaveBeenCalled();
    expect(OrderMapper.toCreateOrderEntity).toHaveBeenCalledWith(
      dto,
      productsDto,
    );
    expect(orderService.createOrder).toHaveBeenCalledWith(orderEntityRequest);
  });
});
