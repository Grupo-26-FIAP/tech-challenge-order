import { ProductResponseDto } from '@Application/dtos/response/product/product.response.dto';
import {
  CreateOrderEntity,
  CreateProductOrderEntity as CreateOrderItemEntity,
} from '@Domain/entities/create-order.entity';
import { OrderEntity } from '@Domain/entities/order.entity';
import { CreateOrderRequestDto } from '../dtos/request/order/create-order.request.dto';
import { OrderResponseDto } from '../dtos/response/order/order.response.dto';

export class OrderMapper {
  static toCreateOrderEntity(
    dto: CreateOrderRequestDto,
    productsDetails: ProductResponseDto[],
  ): CreateOrderEntity {
    const orderItems = dto.orderItems.map((orderItem) => {
      const product = productsDetails.find(
        (productDetail) => productDetail.id == orderItem.productId,
      );

      if (!product) throw new Error('Produto inválido');

      return new CreateOrderItemEntity(
        orderItem.productId,
        orderItem.quantity,
        product.price,
        product.preparationTime,
      );
    });

    return new CreateOrderEntity(orderItems, dto.userId);
  }

  static toResponseDto(
    orderEntity: OrderEntity,
    productsDto?: ProductResponseDto[],
  ): OrderResponseDto {
    return {
      id: orderEntity.id,
      totalPrice: orderEntity.totalPrice.getValue(),
      estimatedPreparationTime: orderEntity.estimatedPreparationTime,
      preparationTime: orderEntity.preparationTime,
      user: orderEntity.userId,
      paymentStatus: orderEntity.paymentStatus,
      orderStatus: orderEntity.orderStatus,
      createdAt: orderEntity.createdAt,
      updatedAt: orderEntity.updatedAt,
      productOrders: productsDto?.filter((product) =>
        orderEntity.productsOrder?.some(
          (productOrder) => productOrder.productId === product.id,
        ),
      ),
    };
  }
}
