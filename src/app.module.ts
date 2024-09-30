import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from './call/call.schema';
import { CallController } from './call/call.controller';
import { CallRepository } from './call/call.repository';

const { DATABASE_URI = '', BUCKET_NAME = 'files' } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URI),
    MongooseModule.forFeature([
      {
        name: Call.name,
        schema: CallSchema,
      }
    ]),
  ],
  controllers: [CallController],
  providers: [
    CallRepository,
  ],
})
export class AppModule {}
