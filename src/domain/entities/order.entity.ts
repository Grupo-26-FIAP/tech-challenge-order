import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { TotalPriceValueObject } from '../value-objects/total-price.value-objects';

export class OrderEntity {
  constructor(
    public totalPrice: TotalPriceValueObject,
    public paymentStatus: PaymentStatusType,
    public orderStatus: OrderStatusType,
    public createdAt: Date,
    public preparationTime: number,
    public estimatedPreparationTime: number,
    public productsOrder: OrderItemEntity[],
    public userId?: number,
    public id?: number,
    public updatedAt?: Date,
  ) {}
}

export class OrderItemEntity {
  constructor(
    public quantity: number,
    public productId: number,
    public createdAt: Date,
    public id?: number,
  ) {}
}
