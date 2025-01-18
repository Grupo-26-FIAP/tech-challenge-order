import { OrderItemEntity } from '../entities/order-item.entity';

export interface IOrderItemRepository {
  save(productOrder: OrderItemEntity): Promise<OrderItemEntity>;
  update(id: number, productOrder: OrderItemEntity): Promise<OrderItemEntity>;
  delete(id: number): Promise<void>;
  findAll(): Promise<OrderItemEntity[]>;
  findById(id: number): Promise<OrderItemEntity>;
}

export const IOrderItemRepositorySymbol = Symbol('IOrderItemRepository');
