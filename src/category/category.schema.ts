import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  _id?: Types.ObjectId;

  @Prop({ unique: true, required: true })
  id: string;

  @Prop({ unique: true, required: true })
  title: string;

  @Prop({ required: false, type: [String], default: [] })
  points: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
