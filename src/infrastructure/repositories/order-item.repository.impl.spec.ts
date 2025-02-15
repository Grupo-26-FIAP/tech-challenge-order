import { OrderItemEntity } from '@Domain/entities/order.entity';
import { OrderItemMapper } from '@Infrastructure/typeorm/mappers/order-item.mapper';
import { OrderItemModel } from '@Infrastructure/typeorm/models/order-item.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemRepositoryImpl } from './order-item.repository.impl';

describe('OrderItemRepositoryImpl', () => {
  let repository: OrderItemRepositoryImpl;
  let orderItemRepository: Repository<OrderItemModel>;

  const mockOrderItemModel = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    productId: 100,
    quantity: 10,
    order: null,
  } as OrderItemModel;

  const mockOrderItemEntity = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    quantity: 10,
    productId: 100,
  } as OrderItemEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemRepositoryImpl,
        {
          provide: getRepositoryToken(OrderItemModel),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<OrderItemRepositoryImpl>(OrderItemRepositoryImpl);
    orderItemRepository = module.get<Repository<OrderItemModel>>(
      getRepositoryToken(OrderItemModel),
    );
  });

  it('should save an order item', async () => {
    jest
      .spyOn(orderItemRepository, 'save')
      .mockResolvedValue(mockOrderItemModel);
    jest.spyOn(OrderItemMapper, 'toModel').mockReturnValue(mockOrderItemModel);
    jest
      .spyOn(OrderItemMapper, 'toEntity')
      .mockReturnValue(mockOrderItemEntity);

    const result = await repository.save(mockOrderItemEntity);
    expect(result).toEqual(mockOrderItemEntity);
  });

  it('should update an order item', async () => {
    jest
      .spyOn(orderItemRepository, 'preload')
      .mockResolvedValue(mockOrderItemModel);
    jest
      .spyOn(orderItemRepository, 'save')
      .mockResolvedValue(mockOrderItemModel);
    jest.spyOn(OrderItemMapper, 'toModel').mockReturnValue(mockOrderItemModel);
    jest
      .spyOn(OrderItemMapper, 'toEntity')
      .mockReturnValue(mockOrderItemEntity);

    const result = await repository.update(1, mockOrderItemEntity);
    expect(result).toEqual(mockOrderItemEntity);
  });

  it('should return null if order item to update is not found', async () => {
    jest.spyOn(orderItemRepository, 'preload').mockResolvedValue(null);

    const result = await repository.update(1, mockOrderItemEntity);
    expect(result).toBeNull();
  });

  it('should delete an order item', async () => {
    jest.spyOn(orderItemRepository, 'softDelete').mockResolvedValue(undefined);

    await repository.delete(1);
    expect(orderItemRepository.softDelete).toHaveBeenCalledWith(1);
  });

  it('should find all order items', async () => {
    jest
      .spyOn(orderItemRepository, 'find')
      .mockResolvedValue([mockOrderItemModel]);
    jest
      .spyOn(OrderItemMapper, 'toEntity')
      .mockReturnValue(mockOrderItemEntity);

    const result = await repository.findAll();
    expect(result).toEqual([mockOrderItemEntity]);
  });

  it('should find an order item by id', async () => {
    jest
      .spyOn(orderItemRepository, 'findOne')
      .mockResolvedValue(mockOrderItemModel);
    jest
      .spyOn(OrderItemMapper, 'toEntity')
      .mockReturnValue(mockOrderItemEntity);

    const result = await repository.findById(1);
    expect(result).toEqual(mockOrderItemEntity);
  });

  it('should return null if order item by id is not found', async () => {
    jest.spyOn(orderItemRepository, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(1);
    expect(result).toBeNull();
  });
});
