import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema({ timestamps: true })
export class Category {
    @Prop({ unique: true, required: true })
    id: string;

    @Prop({required: true })
    title: string;

    @Prop({required: true, type: [String] })
    points: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);