import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { MessageHandler } from './message.handler';
config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

console.log({ queueUrl: process.env.QUEUE_URL });
console.log({ queueUrl: process.env.AWS_REGION });

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: 'order-created-queue',
          queueUrl: process.env.QUEUE_URL,
          region: process.env.AWS_REGION,
        },
      ],
      producers: [],
    }),
  ],
  controllers: [],
  providers: [MessageHandler],
})
export class ConsumerModule {}
