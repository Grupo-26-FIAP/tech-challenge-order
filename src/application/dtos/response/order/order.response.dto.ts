import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import { Expose } from 'class-transformer';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { ProductResponseDto } from '../product/product.response.dto';

export class OrderResponseDto {
  @ApiProperty({
    description: 'ID do pedido.',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Preço total do pedido.',
    example: 100.0,
  })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    type: 'integer',
    nullable: false,
    description: 'Tempo estimado para a preparação do pedido em minutos.',
  })
  @IsNumber()
  estimatedPreparationTime: number;

  @ApiProperty({
    type: 'integer',
    nullable: false,
    description: 'Tempo de preparo do pedido em minutos',
  })
  @IsNumber()
  preparationTime: number;

  @ApiProperty({
    type: 'integer',
    description: 'Usuário que fez o pedido.',
    example: '49399781899',
    nullable: true,
  })
  @Expose()
  @IsString()
  user?: string;

  @ApiProperty({
    description: 'Status do pagamento do pedido.',
    example: 'pending',
  })
  paymentStatus: PaymentStatusType;

  @ApiProperty({
    description: 'Status do pedido.',
    example: 'none',
  })
  orderStatus: OrderStatusType;

  @ApiProperty({
    description: 'Data de criação do pedido.',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do pedido.',
    example: '2024-01-02T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Lista de produtos e quantidades no pedido.',
    type: [ProductResponseDto],
    example: [{ productId: 1, quantity: 2 }],
  })
  @Expose()
  @IsObject()
  productOrders: ProductResponseDto[];
}
