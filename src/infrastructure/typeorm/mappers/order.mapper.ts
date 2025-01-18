import { OrderEntity } from '@Domain/entities/order.entity';
import { TotalPriceValueObject } from '@Domain/value-objects/total-price.value-objects';
import { OrderModel } from '../models/order.model';
import { OrderItemMapper } from './order-item.mapper';

export class OrderMapper {
  static toEntity(orderModel: OrderModel): OrderEntity {
    if (!orderModel) return null;

    return new OrderEntity(
      new TotalPriceValueObject(orderModel.totalPrice),
      orderModel.paymentStatus,
      orderModel.orderStatus,
      orderModel.createdAt,
      orderModel.estimatedPreparationTime,
      orderModel.OrderItems?.map(OrderItemMapper.toEntity),
      orderModel.userId,
      orderModel.id,
      orderModel.updatedAt,
    );
  }

  static toModel(orderEntity: OrderEntity): OrderModel {
    if (!orderEntity) return null;

    const model = new OrderModel();
    model.id = orderEntity.id;
    model.totalPrice = orderEntity.totalPrice.getValue();
    model.paymentStatus = orderEntity.paymentStatus;
    model.orderStatus = orderEntity.orderStatus;
    model.estimatedPreparationTime = orderEntity.estimatedPreparationTime;
    model.createdAt = orderEntity.createdAt;
    model.updatedAt = orderEntity.updatedAt;
    model.OrderItems = orderEntity.productsOrder?.map(OrderItemMapper.toModel);
    model.userId = orderEntity.userId;
    return model;
  }
}
