import { Model } from 'mongoose';
import { Call } from './call.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CallRepository {
    constructor(
        @InjectModel(Call.name) private readonly callModel: Model<Call>,
    ) {}

    async getById(id: string): Promise<Call | null> {
        return this.callModel.findById(id).exec();
    }

    async create(callData: Partial<Call>): Promise<Call> {
        const uuid = uuidv4();
        const newCall = new this.callModel({
            ...callData,
            id: uuid,
        });
        return newCall.save();
    }

    async update(id: string, updateData: Partial<Call>): Promise<Call | null> {
        return this.callModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
}