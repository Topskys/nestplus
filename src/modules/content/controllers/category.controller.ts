import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryService } from '../services';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async index() {
    return this.categoryService.findTrees();
  }

  @Get(':category')
  async show(@Param('category', new ParseUUIDPipe()) category: string) {
    return await this.categoryService.findOne(category);
  }

  @Post()
  async store(
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        groups: ['create'],
      }),
    )
    data: CreateCategoryDto,
  ) {
    return await this.categoryService.create(data);
  }

  @Patch()
  async update(
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        groups: ['update'],
      }),
    )
    data: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(data);
  }

  @Delete(':category')
  async destroy(@Param('category', new ParseUUIDPipe()) category: string) {
    return await this.categoryService.delete(category);
  }
}
