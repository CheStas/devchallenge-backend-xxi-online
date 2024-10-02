import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongo, Types } from 'mongoose';
import { Category } from 'src/category/category.schema';


@Schema({ timestamps: true })
export class Call {
    @Prop({ unique: true, required: true })
    id: string;

    @Prop({required: false })
    name?: string;

    @Prop({required: false })
    location?: string;

    @Prop({required: false })
    emotional_tone?: string;

    @Prop({required: false })
    text?: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
    category?: Category[];

    @Prop({ type: mongo.ObjectId, required: true })
    fileId: mongo.ObjectId;

    @Prop({required: false })
    url?: string;

    // TODO add optional
    // - status
    // - errorName
    // - errorLocation
    // - errorEmotional_tone
    // - errorText
    // - errorCategory
}

export const CallSchema = SchemaFactory.createForClass(Call);