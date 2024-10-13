import { isNil } from 'lodash';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { OrderType } from '../constants';
import { getOrderByQuery } from '../helpers';
import { OrderQueryType } from '../types';

/**
 * @description 基础Repository
 */
export abstract class BaseRepository<
  E extends ObjectLiteral,
> extends Repository<E> {
  /**
   * 构建查询时默认的模型对应的查询名称
   * @param qbName the name of the query builder
   */
  protected abstract qbName: string;

  /**
   * @description 默认排序规则，可以通过每个方法的orderBy选项进行覆盖
   */
  protected orderBy?: string | { name: string; order: `${OrderType}` };

  /**
   * @description 构建基础查询器
   */
  buildBaseQuery() {
    return this.createQueryBuilder(this.qbName);
  }
  /**
   * @description 返回查询器名称
   */
  getQBName() {
    return this.qbName;
  }
  /**
   * 生成排序QueryBuilder
   * @param qb 查询器
   * @param orderBy 排序规则
   */
  protected getOrderByQuery(
    qb: SelectQueryBuilder<E>,
    orderBy?: OrderQueryType,
  ) {
    const orderByQuery = orderBy ?? this.orderBy;
    return !isNil(orderByQuery)
      ? getOrderByQuery(qb, this.qbName, orderByQuery)
      : qb;
  }
}
