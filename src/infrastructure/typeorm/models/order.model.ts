import { OrderStatusType } from '@Shared/enums/order-status-type.enum';
import { PaymentStatusType } from '@Shared/enums/payment-status-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemModel } from './order-item.model';
@Entity({
  name: 'order',
  comment: 'Entidade que representa um pedido feito por um usuário.',
})
export class OrderModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'double precision',
    nullable: false,
    comment: 'Preço total do pedido',
  })
  totalPrice: number;

  @Column({
    type: 'integer',
    nullable: false,
    comment: 'Tempo estimado para a preparação do pedido em minutos.',
  })
  estimatedPreparationTime: number;

  @Column({
    type: 'integer',
    nullable: true,
    comment: 'Tempo de preparação do pedido em minutos.',
  })
  preparationTime?: number;

  userId: number;

  @Column({
    type: 'enum',
    enum: PaymentStatusType,
    default: PaymentStatusType.PENDING,
    comment: 'Status do pagamento do pedido',
  })
  paymentStatus: PaymentStatusType;

  @Column({
    type: 'enum',
    enum: OrderStatusType,
    default: OrderStatusType.NONE,
    comment: 'Status do pedido',
  })
  orderStatus: OrderStatusType;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    comment: 'Data de criação do pedido',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'now()',
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Data da última atualização do pedido',
  })
  updatedAt?: Date;

  @OneToMany(() => OrderItemModel, (productOrder) => productOrder.order, {
    eager: true,
  })
  OrderItems: OrderItemModel[];
}
