import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './category.schema';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    @Get()
    async getAll(): Promise<Category[]> {
        return this.categoryRepository.getAll();
    }

    @Post()
    async create(@Body() category: Category): Promise<Category> {
        return this.categoryRepository.create(category);
    }
}