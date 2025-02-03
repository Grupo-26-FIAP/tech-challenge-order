import { UpdateOrderRequestDto } from '@Application/dtos/request/order/update-order.request.dto';
import { ApproveOrderUseCase } from '@Application/use-cases/order/approve-order.use-case';
import { UpdateOrderUseCase } from '@Application/use-cases/order/update-order.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

@Injectable()
export class MessageHandler {
  private sqs: AWS.SQS;
  constructor(
    @Inject(ApproveOrderUseCase)
    private readonly approveOrderUseCase: ApproveOrderUseCase,
    @Inject(UpdateOrderUseCase)
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {
    this.sqs = new AWS.SQS();
  }

  @SqsMessageHandler(process.env.PAYMENT_QUEUE_NAME, false)
  async handleMessage(message: AWS.SQS.Message) {
    const data = JSON.parse(message.Body);

    console.log('Message received', data);

    this.approveOrderUseCase.execute(Number(data.orderId));

    await this.sqs
      .deleteMessage({
        QueueUrl: process.env.PAYMENT_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise()
      .catch((error) => {
        console.log(error);
      });
  }

  @SqsMessageHandler(process.env.PRODUCTION_QUEUE_NAME, false)
  async handleMessagePayment(message: AWS.SQS.Message) {
    const data = JSON.parse(message.Body) as UpdateOrderRequestDto;

    console.log('Message received', data);

    this.updateOrderUseCase.execute(data);

    await this.sqs
      .deleteMessage({
        QueueUrl: process.env.PRODUCTION_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise()
      .catch((error) => {
        console.log(error);
      });
  }
}
