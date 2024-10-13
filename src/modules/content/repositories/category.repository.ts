import { OrderType } from '@/modules/core/constants';
import { BaseTreeRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { CategoryEntity } from '../entities';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends BaseTreeRepository<CategoryEntity> {
  protected dbName = 'category';
  protected orderBy = { name: 'customOrder', order: OrderType.ASC };
}
