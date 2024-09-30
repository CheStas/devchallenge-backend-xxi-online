import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from './call/call.schema';
import { Category, CategorySchema } from './category/category.schema';
import { CallRepository } from './call/call.repository';
import { CallController } from './call/call.controller';
import { CategoryController } from './category/category.controller';
import { CategoryRepository } from './category/category.repository';

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
    CallRepository,
    CategoryRepository,
  ],
})
export class AppModule {}
