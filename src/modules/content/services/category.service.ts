import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { EntityManager } from 'typeorm';
import { manualPaginate } from '@/modules/core/helpers';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { QueryCategoryDto } from '../dtos/query-category.dto';
import { CategoryRepository } from '../repositories';

@Injectable()
export class CategoryService {
  constructor(
    protected entityManager: EntityManager,
    protected categoryRepository: CategoryRepository,
  ) {}

  /**
   * 查询分页后的扁平化分类
   */
  async paginate(query: QueryCategoryDto) {
    const tree = await this.findTrees();
    const list = await this.categoryRepository.toFlatTrees(tree);
    return manualPaginate(query, list);
  }

  async findTrees() {
    return this.categoryRepository.findTrees();
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOneOrFail({
      where: { id },
      relations: ['parent'], // 同时查询父分类
    });
  }

  async create(data: CreateCategoryDto) {
    const item = await this.categoryRepository.save({
      ...data,
      parent: await this.getParent(data.parent),
    });
    return await this.findOne(item.id);
  }

  async update(data: UpdateCategoryDto) {
    const parent = await this.getParent(data.parent);
    const querySet = omit(data, ['id', 'parent']);
    if (Object.keys(querySet).length > 0) {
      await this.categoryRepository.update(data.id, querySet);
    }
    const cat = await this.findOne(data.id);
    const shouldUpdateParent =
      (!isNil(cat.parent) && !isNil(parent) && cat.parent.id !== parent.id) ||
      (isNil(cat.parent) && !isNil(parent)) ||
      (!isNil(cat.parent) && isNil(parent));
    // 父分类单独更新
    if (parent !== undefined && shouldUpdateParent) {
      cat.parent = parent;
      await this.entityManager.save(cat);
    }
    return cat;
  }

  async delete(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category ${id} not exists!`);
    }
    await this.categoryRepository.remove(category);
    return category;
  }

  protected async getParent(id?: string) {
    if (!id) return null;
    const parent = await this.categoryRepository.findOne({ where: { id } });
    if (!parent)
      throw new NotFoundException(`Parent category ${id} not exists!`);
    return parent;
  }
}
