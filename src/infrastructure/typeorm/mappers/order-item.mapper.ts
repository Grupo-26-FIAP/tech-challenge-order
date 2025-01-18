import { OrderItemEntity } from '@Domain/entities/order.entity';
import { OrderItemModel } from '../models/order-item.model';

export class OrderItemMapper {
  static toEntity(orderModel: OrderItemModel): OrderItemEntity {
    if (!orderModel) return null;

    return new OrderItemEntity(
      orderModel.quantity,
      orderModel.productId,
      orderModel.createdAt,
      orderModel.id,
    );
  }

  static toModel(orderEntity: OrderItemEntity): OrderItemModel {
    if (!orderEntity) return null;

    const model = new OrderItemModel();
    model.id = orderEntity.id;
    model.quantity = orderEntity.quantity;
    model.createdAt = orderEntity.createdAt;
    model.productId = orderEntity.productId;

    return model;
  }
}
