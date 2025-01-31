import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { CreateOrderEntity } from '../../entities/create-order.entity';
import { OrderItemEntity } from '../../entities/order-item.entity';
import { OrderEntity } from '../../entities/order.entity';

import {
  IOrderItemRepository,
  IOrderItemRepositorySymbol,
} from '@Domain/repositories/order-item.repository';
import {
  IOrderRepository,
  IOrderRepositorySymbol,
} from '../../repositories/order.repository';
import { TotalPriceValueObject } from '../../value-objects/total-price.value-objects';
import { IOrderService } from './order.service';

@Injectable()
export class OrderServiceImpl implements IOrderService {
  constructor(
    @Inject(IOrderRepositorySymbol)
    private readonly repository: IOrderRepository,
    @Inject(IOrderItemRepositorySymbol)
    private readonly orderItemRepository: IOrderItemRepository,
  ) {}

  async createOrder(order: CreateOrderEntity): Promise<OrderEntity> {
    const orderItems: OrderItemEntity[] = [];
    let totalPrice = 0;
    let estimatedPreparationTime = 0;

    for (const orderItem of order.orderItems) {
      totalPrice += orderItem.price * orderItem.quantity;
      estimatedPreparationTime +=
        orderItem.preparationTime * orderItem.quantity;

      const orderItemEntity = await this.orderItemRepository.save(
        new OrderItemEntity(
          orderItem.quantity,
          orderItem.productId,
          new Date(),
        ),
      );

      orderItems.push(orderItemEntity);
    }

    const orderEntity = new OrderEntity(
      new TotalPriceValueObject(totalPrice),
      PaymentStatusType.PENDING,
      OrderStatusType.NONE,
      new Date(),
      estimatedPreparationTime,
      orderItems,
      order.userId,
    );

    return this.repository.save(orderEntity);
  }

  async update(id: number, orderStatus: OrderStatusType): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const previousStatus = order.orderStatus;
    order.orderStatus = orderStatus;

    if (
      previousStatus !== orderStatus &&
      previousStatus === OrderStatusType.IN_PREPARATION &&
      orderStatus === OrderStatusType.READY
    ) {
      // const now = new Date();
      // const preparationDuration = now.getTime() - order.updatedAt.getTime();
      // order.preparationTime = Math.ceil(preparationDuration / 1000 / 60);
    }

    this.repository.save(order);
  }

  async approveOrder(id: number): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    order.paymentStatus = PaymentStatusType.APPROVED;
    order.orderStatus = OrderStatusType.RECEIVED;
    this.repository.save(order);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    order.paymentStatus = PaymentStatusType.CANCELED;
    this.repository.save(order);
  }

  async findOrderById(id: number): Promise<OrderEntity> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    return this.repository.findAll();
  }
}
