import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { TotalPriceValueObject } from '../value-objects/total-price.value-objects';

export class OrderEntity {
  constructor(
    public totalPrice: TotalPriceValueObject,
    public paymentStatus: any,
    public orderStatus: OrderStatusType,
    public createdAt: Date,
    public estimatedPreparationTime: number,
    public productsOrder: ProductOrderEntity[],
    public user?: any,
    public id?: number,
    public updatedAt?: Date,
    public preparationTime?: number,
  ) {}
}

export class ProductOrderEntity {
  constructor(
    public quantity: number,
    public product: any,
    public createdAt: Date,
    public id?: number,
  ) {}
}
