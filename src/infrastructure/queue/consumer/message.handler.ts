import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';

@Injectable()
export class MessageHandler {
  private sqs: AWS.SQS;
  constructor() {
    this.sqs = new AWS.SQS();
  }

  @SqsMessageHandler('production_status_updated_queue', false)
  @SqsMessageHandler('payment_status_updated_queue', false)
  async handleMessage(message: AWS.SQS.Message) {
    const data = JSON.parse(message.Body);

    console.log({ data: data });

    await this.sqs
      .deleteMessage({
        QueueUrl: process.env.QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      })
      .promise();
  }
}
