import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { OrchestrationService } from '../queue/orchestration.service';
import { Category } from './category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryService {
  constructor(
    private readonly callRepository: CategoryRepository,
    private readonly orchestrationService: OrchestrationService,
    private readonly logger: Logger,
  ) {}

  async getById(id: string): Promise<Category | null> {
    return this.callRepository.getById(id);
  }

  async getAll(): Promise<Category[]> {
    const result = await this.callRepository.getAll();

    return result.map((category) => ({
      id: category.id,
      title: category.title,
      points: category.points,
    }));
  }

  async create(categoryData: CreateCategoryDto): Promise<Category> {
    const uuid = uuidv4();
    const result = await this.callRepository.create({
      id: uuid,
      title: categoryData.title.trim(),
      points: categoryData.points,
    });
    return result;
  }

  async update(
    id: string,
    updateData: UpdateCategoryDto,
  ): Promise<Category | null> {
    const result = await this.callRepository.update(id, updateData);
    if (!result) {
      return null;
    }

    return {
      id: result.id,
      title: result.title,
      points: result.points,
    };
  }

  async delete(id: string): Promise<Category | null> {
    const result = await this.callRepository.delete(id);

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      title: result.title,
      points: result.points,
    };
  }
}
