import { Model } from 'mongoose';
import { Call } from './call.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CallRepository {
  constructor(
    @InjectModel(Call.name) private readonly callModel: Model<Call>,
  ) {}

  async getById(id: string): Promise<Call | null> {
    return this.callModel.findOne({ id }).exec();
  }

  async create(callData: Partial<Call>): Promise<Call> {
    const newCall = new this.callModel(callData);
    return newCall.save();
  }

  async update(id: string, updateData: Partial<Call>): Promise<Call | null> {
    return this.callModel
      .findOneAndUpdate({ id }, updateData, { new: true })
      .exec();
  }
}
