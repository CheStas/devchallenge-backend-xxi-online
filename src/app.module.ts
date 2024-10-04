import { Logger, Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Connection } from 'mongoose';
import { Call, CallSchema } from './call/call.schema';
import { Category, CategorySchema } from './category/category.schema';
import { BucketService } from './file/bucket.service';
import { CallRepository } from './call/call.repository';
import { CallController } from './call/call.controller';
import { CategoryController } from './category/category.controller';
import { CategoryRepository } from './category/category.repository';
import { CategoryService } from './category/category.service';
import { CallService } from './call/call.service';
import { FileService } from './file/file.service';
import { commands } from './queue/command';
import { OrchestrationService } from './queue/orchestration.service';
import { TranscribeProcessor } from './transcribe/transcribe.processor';
import { TokenClassificationProcessor } from './classify/token.classification.processor';
import { CategoryUpdateResolverProcessor } from './category/category.update.processor';

const {
  DATABASE_URI = '',
  BUCKET_NAME = 'files',
  REDIS_HOST = '',
  REDIS_PORT = '',
} = process.env;

@Module({
  imports: [
    HttpModule,
    BullModule.forRoot({
      connection: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
      },
    }),
    BullModule.registerQueue({ name: commands.TRANSCRIBE_CALL }),
    BullModule.registerQueue({ name: commands.CLASSIFY_TEXT }),
    BullModule.registerQueue({ name: commands.TOKENIZE_TEXT }),
    BullModule.registerQueue({ name: commands.CATEGORY_CLASSIFY_TEXT }),
    BullModule.registerQueue({ name: commands.CATEGORY_UPDATE_RESOLVE }),
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: commands.TRANSCRIBE_CALL,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: commands.CLASSIFY_TEXT,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: commands.TOKENIZE_TEXT,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: commands.CATEGORY_CLASSIFY_TEXT,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: commands.CATEGORY_UPDATE_RESOLVE,
      adapter: BullMQAdapter,
    }),
    MongooseModule.forRoot(DATABASE_URI),
    MongooseModule.forFeature([
      {
        name: Call.name,
        schema: CallSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [CallController, CategoryController],
  providers: [
    {
      provide: Logger,
      useValue: new Logger('AppCallModule'),
    },
    OrchestrationService,
    TranscribeProcessor,
    TokenClassificationProcessor,
    CategoryUpdateResolverProcessor,
    FileService,
    CallService,
    CallRepository,
    CategoryRepository,
    CategoryService,
    {
      provide: BucketService,
      inject: [getConnectionToken()],
      useFactory: async (connection: Connection) => {
        return new BucketService(connection.db, {
          bucketName: BUCKET_NAME,
        });
      },
    },
  ],
})
export class AppModule {}
