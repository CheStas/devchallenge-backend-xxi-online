import { Logger, Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Call, CallSchema } from './call/call.schema';
import { Category, CategorySchema } from './category/category.schema';
import { BucketService } from './file/bucket.service';
import { CallRepository } from './call/call.repository';
import { CallController } from './call/call.controller';
import { CategoryController } from './category/category.controller';
import { CategoryRepository } from './category/category.repository';
import { CallService } from './call/call.service';

const { DATABASE_URI = '', BUCKET_NAME = 'files' } = process.env;

@Module({
  imports: [
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
    CallService,
    CallRepository,
    CategoryRepository,
    {
      provide: BucketService,
      inject: [getConnectionToken()],
      useFactory: async ( connection: Connection) => {
        return new BucketService(connection.db, {
          bucketName: BUCKET_NAME,
       });
      }
    }
  ],
})
export class AppModule {}
