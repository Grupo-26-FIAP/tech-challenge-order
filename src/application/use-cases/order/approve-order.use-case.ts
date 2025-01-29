import {
  IOrderService,
  IOrderServiceSymbol,
} from '@Domain/services/order/order.service';
import { MessageProducer } from '@Infrastructure/queue/producer/producer.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ApproveOrderUseCase {
  constructor(
    @Inject(IOrderServiceSymbol)
    private readonly service: IOrderService,
    private readonly messageProducer: MessageProducer,
  ) {}

  async execute(id: number): Promise<void> {
    const order = await this.service.findOrderById(id);
    if (!order) throw new NotFoundException('Order not found');

    await this.service.approveOrder(id);

    await this.messageProducer.sendMessage(
      'order-ready-for-production-queue.fifo',
      order,
    );
  }
}
