import { Model } from 'mongoose';
import { Category } from './category.schema';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoryRepository {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    ) {}

    async getById(id: string): Promise<Category | null> {
        return this.categoryModel.findById(id).exec();
    }

    async getAll(): Promise<Category[]> {
        const result = await this.categoryModel.find().exec();
 
        return result.map(category => ({
            id: category.id,
            title: category.title, 
            points: category.points
        }));
    }

    async create(categoryData: CreateCategoryDto): Promise<Category> {
        const uuid = uuidv4();
        const newCategory = new this.categoryModel({
            id: uuid,
            title: categoryData.title.trim(),
            points: categoryData.points,
        });

        try {
            const result = await newCategory.save();
            return {
                id: result.id,
                title: result.title,
                points: result.points
            }
        } catch(e) {
            if (e.code === 11000) { // MongoDB duplicate key error code
                throw new UnprocessableEntityException('Category with this topic name already exist');;
            } else {
                throw e;
            }
        }
    }

    async update(id: string, updateData: UpdateCategoryDto): Promise<Category | null> {
        try {
            const result = await this.categoryModel.findOneAndUpdate({ id }, {
                ...(updateData.title ? {title: updateData.title.trim()} : {}),
                ...(updateData.points ? {points: updateData.points} : {}),
            }, { new: true }).exec();

            if (!result) {
                return null;
            }
    
            return {
                id: result.id,
                title: result.title,
                points: result.points
            }
        } catch(e) {
            if (e.code === 11000) { // MongoDB duplicate key error code
                throw new UnprocessableEntityException('Category with this topic name already exist');;
            } else {
                throw e;
            }
        }
    }

    async delete(id: string): Promise<Category | null> {
        const result = await this.categoryModel.findOneAndDelete({
            id: id,
        }).exec();

        if (!result) {
            return null;
        }

        return {
            id: result.id,
            title: result.title,
            points: result.points
        };
    }
}