import { FindTreeOptions, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { OrderType, QueryTrashMode } from './constants';

/**
 * 为query添加查询的回调函数接口
 */
export type QueryHook<Entity> = (
  hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

/**
 * 分页验证DTO接口
 */
export interface PaginateDto {
  page: number;
  limit: number;
}

/**
 * 排序类型,{字段名称: 排序方法}
 * 如果多个值则传入数组即可
 * 排序方法不设置,默认DESC
 */
export type OrderQueryType =
  | string
  | { name: string; order: `${OrderType}` }
  | Array<{ name: string; order: `${OrderType}` } | string>;

/**
 * 数据列表查询类型
 */
export interface QueryParams<E extends ObjectLiteral> {
  addQuery?: (query: SelectQueryBuilder<E>) => SelectQueryBuilder<E>;
  orderBy?: OrderQueryType;
}

/**
 * 树形数据表查询参数
 */
export type TreeQueryParams<E extends ObjectLiteral> = FindTreeOptions &
  QueryParams<E>;

/**
 * 服务类数据列表查询类型
 */
export type QueryListParams<E extends ObjectLiteral> = Omit<
  TreeQueryParams<E>,
  'withTrashed'
> & {
  trashed?: `${QueryTrashMode}`;
};

/**
 * 订阅设置属性
 */
export type SubscriberSetting = {
  // 监听的模型是否为树模型
  tree?: boolean;
  // 是否支持软删除
  trash?: boolean;
};

/**
 * 软删除DTO接口
 */
export interface TrashedDto {
  trashed?: QueryTrashMode;
}

export interface QueryParams<E extends ObjectLiteral> {
  addQuery?: (query: SelectQueryBuilder<E>) => SelectQueryBuilder<E>;
  orderBy?: OrderQueryType;
  withTrashed?: boolean;
}
