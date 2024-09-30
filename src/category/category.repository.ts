import { Model } from 'mongoose';
import { Category } from './category.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectModel(Category.name) private readonly callModel: Model<Category>,
    ) {}

    async getById(id: string): Promise<Category | null> {
        return this.callModel.findById(id).exec();
    }

    async getAll(): Promise<Category[]> {
        return this.callModel.find().exec();
    }

    async create(callData: Partial<Category>): Promise<Category> {
        const uuid = uuidv4();
        const newCategory = new this.callModel({
            id: uuid,
            ...callData
        });
        return newCategory.save();
    }

    async update(id: string, updateData: Partial<Category>): Promise<Category | null> {
        return this.callModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
}