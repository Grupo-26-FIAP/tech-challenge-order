import { CreateOrderRequestDto } from '@Application/dtos/request/order/create-order.request.dto';
import { OrderResponseDto } from '@Application/dtos/response/order/order.response.dto';
import { CreateOrderUseCase } from '@Application/use-cases/order/create-order.use-case';
import { FindAllOrdersUseCase } from '@Application/use-cases/order/find-all-orders.use-case';
import { FindOrderByIdUseCase } from '@Application/use-cases/order/find-order-by-id.use-case';
import { ProductServiceImpl } from '@Infrastructure/services/product.service.impl';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUser as GetCurrentUserToken } from '@Shared/decorators/get-user-id.decorator';

@ApiTags('Orders')
@Controller('/orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    @Inject(ProductServiceImpl)
    private readonly productServiceImpl: ProductServiceImpl,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth()
  async createOrder(
    @Body() dto: CreateOrderRequestDto,
    @GetCurrentUserToken() userToken: string,
  ): Promise<OrderResponseDto> {
    return this.createOrderUseCase.execute(dto, userToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um pedido por ID' })
  @ApiOperation({ summary: 'Cancela um pedido' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado',
    type: OrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'ID inválido' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findOrderById(@Param('id') id: number): Promise<OrderResponseDto> {
    return this.findOrderByIdUseCase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos' })
  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso proibido' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: [OrderResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async findAllOrders(): Promise<OrderResponseDto[]> {
    return this.findAllOrdersUseCase.execute();
  }
}
