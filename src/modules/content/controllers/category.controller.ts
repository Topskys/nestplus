import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from '../dtos';
import { CategoryService } from '../services';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // 分页查询
  @Get()
  @SerializeOptions({ groups: ['category-list'] })
  async list(
    @Query()
    query: QueryCategoryDto,
  ) {
    return this.categoryService.paginate(query);
  }

  @Get('tree')
  @SerializeOptions({ groups: ['category-tree'] })
  async tree() {
    return this.categoryService.findTrees();
  }

  @Get(':category')
  @SerializeOptions({ groups: ['category-detail'] })
  async show(@Param('category', new ParseUUIDPipe()) category: string) {
    return await this.categoryService.findOne(category);
  }

  @Post()
  @SerializeOptions({ groups: ['category-detail'] })
  async store(
    @Body()
    data: CreateCategoryDto,
  ) {
    return await this.categoryService.create(data);
  }

  @Patch()
  @SerializeOptions({ groups: ['category-detail'] })
  async update(
    @Body()
    data: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(data);
  }

  @Delete(':category')
  @SerializeOptions({ groups: ['category-detail'] })
  async destroy(@Param('category', new ParseUUIDPipe()) category: string) {
    return await this.categoryService.delete(category);
  }
}
