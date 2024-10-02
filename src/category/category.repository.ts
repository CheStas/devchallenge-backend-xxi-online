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
    return this.categoryModel.find().exec();
  }

  async create(categoryData: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel({
      id: categoryData.id || uuidv4(),
      title: categoryData.title,
      points: categoryData.points,
    });

    try {
      return newCategory.save();
    } catch (e) {
      if (e.code === 11000) {
        // MongoDB duplicate key error code
        throw new UnprocessableEntityException(
          'Category with this topic name already exist',
        );
      } else {
        throw e;
      }
    }
  }

  async update(
    id: string,
    updateData: UpdateCategoryDto,
  ): Promise<Category | null> {
    try {
      return this.categoryModel
        .findOneAndUpdate(
          { id },
          {
            ...(updateData.title ? { title: updateData.title.trim() } : {}),
            ...(updateData.points ? { points: updateData.points } : {}),
          },
          { new: true },
        )
        .exec();
    } catch (e) {
      if (e.code === 11000) {
        // MongoDB duplicate key error code
        throw new UnprocessableEntityException(
          'Category with this topic name already exist',
        );
      } else {
        throw e;
      }
    }
  }

  async delete(id: string): Promise<Category | null> {
    return this.categoryModel
      .findOneAndDelete({
        id: id,
      })
      .exec();
  }
}
