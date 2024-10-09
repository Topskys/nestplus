import { SelectQueryBuilder, TreeRepository } from 'typeorm';
import { CustomRepository } from '@/modules/core/decorators';
import { CategoryEntity } from '../entities';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends TreeRepository<CategoryEntity> {
  /**
   * 为根分类列表查询添加排序
   */
  findRoots(): Promise<CategoryEntity[]> {
    const escapeAlias = (alias: string) =>
      this.manager.connection.driver.escape(alias);
    const escapeColumn = (column: string) =>
      this.manager.connection.driver.escape(column);
    const parentPropertyName =
      this.manager.connection.namingStrategy.joinColumnName(
        this.metadata.treeParentRelation!.propertyName,
        this.metadata.primaryColumns[0].propertyName,
      );
    return this.createQueryBuilder('treeEntity')
      .orderBy('treeEntity.order', 'ASC')
      .where(
        `${escapeAlias('treeEntity')}.${escapeColumn(parentPropertyName)} IS NULL`,
      )
      .getMany();
  }

  /**
   * 为后代分类查询器添加排序
   *
   * @param alias 别名
   * @param closureTableAlias
   * @param entity
   */
  createDescendantsQueryBuilder(
    alias: string,
    closureTableAlias: string,
    entity: CategoryEntity,
  ): SelectQueryBuilder<CategoryEntity> {
    return super
      .createDescendantsQueryBuilder(alias, closureTableAlias, entity)
      .orderBy(`${alias}.order`, 'ASC');
  }

  /**
   * 为祖先分类查询器添加排序
   * @param alias
   * @param closureTableAlias
   * @param entity
   */
  createAncestorsQueryBuilder(
    alias: string,
    closureTableAlias: string,
    entity: CategoryEntity,
  ): SelectQueryBuilder<CategoryEntity> {
    return super
      .createDescendantsQueryBuilder(alias, closureTableAlias, entity)
      .orderBy(`${alias}.order`, 'ASC');
  }

  /**
   * 递归将树形结构扁平化
   */
  async toFlatTrees(
    trees: CategoryEntity[],
    level = 0,
    relations: string[] = [],
  ): Promise<CategoryEntity[]> {
    const data: CategoryEntity[] = [];
    for (const tree of trees) {
      const item = await this.findOneOrFail({
        where: {
          id: tree.id,
        },
        relations,
      });
      item.level = level;
      data.push(item!);
      data.push(
        ...(await this.toFlatTrees(tree.children!, level + 1, relations)),
      );
    }
    return data;
  }
}
