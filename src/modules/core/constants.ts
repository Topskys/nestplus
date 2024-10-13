// 传入装饰器的metadata数据标识
export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

/**
 * 用于控制发布文章的类型
 */
export enum PostBodyType {
  HTML = 'html',
  MD = 'markdown',
}

export enum PostOrderType {
  CREATED = 'createdAt',
  UPDATED = 'updatedAt',
  PUBLISHED = 'publishedAt',
  COMMENT_COUNT = 'commentCount',
  CUSTOM = 'custom',
}

/**
 * 装饰器选项
 */
export const DTO_VALIDATION_OPTIONS = 'DTO_VALIDATION_OPTIONS';

/**
 * 排序方式
 */
export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * 运行环境
 */
export enum EnvironmentType {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PREVIEW = 'preview',
}

export enum QueryTrashMode {
  ALL = 'all', // 包含已软删除和未软删除的数据
  ONLY = 'only', // 只包含软删除的数据
  NONE = 'none', // 只包含未软删除的数据
}
