import { OrderEntity } from '@Domain/entities/order.entity';
import { OrderRepositoryImpl } from '@Infrastructure/repositories/order.repository.impl';
import { OrderMapper } from '@Infrastructure/typeorm/mappers/order.mapper';
import { OrderModel } from '@Infrastructure/typeorm/models/order.model';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('OrderRepositoryImpl', () => {
  let repository: OrderRepositoryImpl;
  let orderRepository: Repository<OrderModel>;

  const mockOrderModel = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as OrderModel;

  const mockOrderEntity = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as OrderEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepositoryImpl,
        {
          provide: getRepositoryToken(OrderModel),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<OrderRepositoryImpl>(OrderRepositoryImpl);
    orderRepository = module.get<Repository<OrderModel>>(
      getRepositoryToken(OrderModel),
    );
  });

  it('should save an order', async () => {
    jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrderModel);
    jest.spyOn(OrderMapper, 'toModel').mockReturnValue(mockOrderModel);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

    const result = await repository.save(mockOrderEntity);
    expect(result).toEqual(mockOrderEntity);
  });

  it('should update an order', async () => {
    jest.spyOn(orderRepository, 'preload').mockResolvedValue(mockOrderModel);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrderModel);
    jest.spyOn(OrderMapper, 'toModel').mockReturnValue(mockOrderModel);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

    const result = await repository.update(1, mockOrderEntity);
    expect(result).toEqual(mockOrderEntity);
  });

  it('should return null if order to update is not found', async () => {
    jest.spyOn(orderRepository, 'preload').mockResolvedValue(null);

    const result = await repository.update(1, mockOrderEntity);
    expect(result).toBeNull();
  });

  it('should delete an order', async () => {
    jest.spyOn(orderRepository, 'softDelete').mockResolvedValue(undefined);

    await repository.delete(1);
    expect(orderRepository.softDelete).toHaveBeenCalledWith(1);
  });

  it('should find all orders', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([mockOrderModel]);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

    const result = await repository.findAll();
    expect(result).toEqual([mockOrderEntity]);
  });

  it('should find an order by id', async () => {
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrderModel);
    jest.spyOn(OrderMapper, 'toEntity').mockReturnValue(mockOrderEntity);

    const result = await repository.findById(1);
    expect(result).toEqual(mockOrderEntity);
  });

  it('should return null if order by id is not found', async () => {
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

    const result = await repository.findById(1);
    expect(result).toBeNull();
  });
});
