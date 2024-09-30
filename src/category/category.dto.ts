import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from './category.schema';

export class CreateCategoryDto extends Category {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  points: string[];
}

export class UpdateCategoryDto extends Category {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    title: string;
  
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    points: string[];
  }