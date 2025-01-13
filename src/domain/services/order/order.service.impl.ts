import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { CreateOrderEntity } from '../../entities/create-order.entity';
import { OrderEntity } from '../../entities/order.entity';
import { ProductOrderEntity } from '../../entities/product-order.entity';
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
    // @Inject(IProductOrderRepositorySymbol)
    // private readonly productOrderRepository: IProductOrderRepository,
    // @Inject(IProductServiceSymbol)
    // private readonly productService: IProductService,
    // @Inject(IUserServiceSymbol)
    // private readonly userService: IUserService,
  ) {}

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
      const now = new Date();
      const preparationDuration = now.getTime() - order.updatedAt.getTime();
      order.preparationTime = Math.ceil(preparationDuration / 1000 / 60);
    }

    this.repository.save(order);
  }

  async createOrder(order: CreateOrderEntity): Promise<OrderEntity> {
    //let user: UserEntity;

    if (order.cpf) {
      const cpf = order.cpf;
      //user = await this.userService.getOne({ cpf });
    }

    const productsOrder: ProductOrderEntity[] = [];
    const totalPrice = 0;
    const estimatedPreparationTime = 0;

    for (const productOrder of order.productOrders) {
      // const product = await this.productService.findById(
      //   productOrder.productId,
      // );
      // if (product) {
      //   totalPrice += product.price * productOrder.quantity;
      //   estimatedPreparationTime +=
      //     product.preparationTime * productOrder.quantity;
      //   const productOrderEntity = await this.productOrderRepository.save(
      //     new ProductOrderEntity(productOrder.quantity, product, new Date()),
      //   );
      //   productsOrder.push(productOrderEntity);
      // } else {
      //   throw new NotFoundException(
      //     `Product with ID ${productOrder.productId} not found`,
      //   );
      // }
    }

    const orderEntity = new OrderEntity(
      new TotalPriceValueObject(totalPrice),
      null,
      OrderStatusType.NONE,
      new Date(),
      estimatedPreparationTime,
      productsOrder,
      null,
    );

    return this.repository.save(orderEntity);
  }

  async approveOrder(id: number): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    //order.paymentStatus = PaymentStatusType.APPROVED;
    order.orderStatus = OrderStatusType.RECEIVED;
    this.repository.save(order);
  }

  async cancelOrder(id: number): Promise<void> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    //order.paymentStatus = PaymentStatusType.CANCELED;
    this.repository.save(order);
  }

  async findOrderById(id: number): Promise<OrderEntity> {
    return this.repository.findById(id);
  }

  // async findAllOrders(userToken: ITokenPayload): Promise<OrderEntity[]> {
  //   //return this.repository.findAll(userToken);
  // }
}
