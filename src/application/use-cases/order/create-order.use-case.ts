import { ProductResponseDto } from '@Application/dtos/response/product/product.response.dto';
import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from '../../dtos/request/order/create-order.request.dto';
import { OrderResponseDto } from '../../dtos/response/order/order.response.dto';
import { OrderMapper } from '../../mappers/order.mapper';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(IOrderServiceSymbol)
    private readonly service: IOrderService,
  ) {}

  async execute(dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    //findAllProducts
    const productsDto = [
      {
        id: 1,
        category: 'Lanche',
        description: 'Hamburguer',
        enabled: true,
        figureUrl: 'teste',
        name: 'Hamburguer',
        price: 10,
        preparationTime: 30,
      },
      {
        id: 2,
        category: 'Bebida',
        description: 'Heineken',
        enabled: true,
        figureUrl: 'teste',
        name: 'Cerveja',
        price: 8,
        preparationTime: 1,
      },
      {
        id: 3,
        category: 'Acompanhamento',
        description: 'Batatas fritas com chedar',
        enabled: true,
        figureUrl: 'teste',
        name: 'Batata frita',
        price: 20,
        preparationTime: 20,
      },
    ] as ProductResponseDto[];

    const orderEntityRequest = OrderMapper.toCreateOrderEntity(
      dto,
      productsDto,
    );

    const orderEntity = await this.service.createOrder(orderEntityRequest);
    return OrderMapper.toResponseDto(orderEntity);
  }
}
