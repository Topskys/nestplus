import { TreeRepository } from 'typeorm';
import { CustomRepository } from '@/modules/core/decorators';
import { CategoryEntity } from '../entities';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends TreeRepository<CategoryEntity> {}
