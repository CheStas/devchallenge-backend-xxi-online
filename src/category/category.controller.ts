import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryRepository: CategoryService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  @Post()
  async create(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ): Promise<Category> {
    const result = await this.categoryRepository.update(id, category);
    if (!result) {
      throw new UnprocessableEntityException('Category not found');
    }
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Category> {
    const result = await this.categoryRepository.delete(id);
    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }
}
