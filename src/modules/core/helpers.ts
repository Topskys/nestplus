import {
  IPaginationMeta,
  ObjectLiteral,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PaginateDto } from './types';

/**
 * 用于请求验证中的number数据转义
 * @param value 需要转义的值
 */
export function tNumber(value?: string | number): string | number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    try {
      return Number(value);
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      return value;
    }
  }
  return value;
}

/**
 * 用于请求验证中的boolean数据转义
 * @param value 需要转义的值
 */
export function tBoolean(
  value?: string | boolean,
): string | boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value.toLowerCase());
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      return value;
    }
  }
  return value;
}

/**
 * 用于请求验证中转义null
 * @param value 需要转义的值
 */
export function tNull(value?: string | null): string | null | undefined {
  return value === 'null' ? null : value;
}

/**
 * 手动分页
 * @param {PaginateDto} param0 {page,limit}
 * @param {T[]} data
 */
export function manualPaginate<T extends ObjectLiteral>(
  { page, limit }: PaginateDto,
  data: T[],
): Pagination<T> {
  let items: T[] = [];
  const totalItems = data.length;
  const totalRst = totalItems / limit;
  const totalPages =
    totalRst > Math.floor(totalRst)
      ? Math.floor(totalRst) + 1
      : Math.floor(totalRst);
  let itemCount = 0;
  if (page <= totalPages) {
    itemCount =
      page === totalPages ? totalItems - (totalPages - 1) * limit : limit;
    const start = (page - 1) * limit;
    items = data.slice(start, start + itemCount);
  }
  const meta: IPaginationMeta = {
    itemCount,
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage: limit,
  };
  return { items, meta };
}
