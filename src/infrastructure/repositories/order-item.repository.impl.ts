import { OrderItemEntity } from '@Domain/entities/order.entity';
import { IOrderItemRepository } from '@Domain/repositories/order-item.repository';
import { OrderItemMapper } from '@Infrastructure/typeorm/mappers/order-item.mapper';
import { OrderItemModel } from '@Infrastructure/typeorm/models/order-item.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OrderItemRepositoryImpl implements IOrderItemRepository {
  constructor(
    @InjectRepository(OrderItemModel)
    private readonly orderItemRepository: Repository<OrderItemModel>,
  ) {}

  async save(productOrder: OrderItemEntity): Promise<OrderItemEntity> {
    const productOrderModel = OrderItemMapper.toModel(productOrder);
    const savedModel = await this.orderItemRepository.save(productOrderModel);
    return OrderItemMapper.toEntity(savedModel);
  }

  async update(
    id: number,
    productOrder: OrderItemEntity,
  ): Promise<OrderItemEntity> {
    const productOrderModel = await this.orderItemRepository.preload({
      id: id,
      ...OrderItemMapper.toModel(productOrder),
    });
    if (!productOrderModel) return null;
    const updatedOrderItem =
      await this.orderItemRepository.save(productOrderModel);
    return OrderItemMapper.toEntity(updatedOrderItem);
  }

  async delete(id: number): Promise<void> {
    await this.orderItemRepository.softDelete(id);
  }

  async findAll(): Promise<OrderItemEntity[]> {
    const productsOrder = await this.orderItemRepository.find();
    return productsOrder.map(OrderItemMapper.toEntity);
  }

  async findById(id: number): Promise<OrderItemEntity> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
    });
    return OrderItemMapper.toEntity(orderItem);
  }
}
