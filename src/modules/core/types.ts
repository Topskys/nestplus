import { SelectQueryBuilder } from 'typeorm';

/**
 * 为query添加查询的回调函数接口
 */
export type QueryHook<Entity> = (
  hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;
