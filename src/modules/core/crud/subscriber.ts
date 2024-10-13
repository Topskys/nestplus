import { isNil } from 'lodash';
import {
  DataSource,
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  ObjectLiteral,
  ObjectType,
  Repository,
  TreeRepository,
  UpdateEvent,
} from 'typeorm';

import { BaseTreeRepository } from '../crud/tree.repository';
import { SubscriberSetting } from '../types';

import { BaseRepository } from './repository';

type SubscriberRepo<E extends ObjectLiteral> =
  | Repository<E>
  | TreeRepository<E>
  | BaseRepository<E>
  | BaseTreeRepository<E>;

/**
 * @description 模型基础订阅者
 */
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
  implements EntitySubscriberInterface<E>
{
  /**
   * @description 数据库连接
   * @protected
   * @type {Connection}
   */
  protected dataSource: DataSource;

  /**
   * @description EntityManager
   * @protected
   * @type {EntityManager}
   */
  protected em!: EntityManager;

  /**
   * @description 监听的模型
   * @protected
   * @abstract
   * @type {ObjectType<E>}
   */
  protected abstract entity: ObjectType<E>;

  /**
   * @description 自定义存储类
   * @protected
   * @type {Type<SubscriberRepo<E>>}
   */
  protected repository?: SubscriberRepo<E>;

  /**
   * @description 一些相关的设置
   * @protected
   * @type {SubscriberSetting}
   */
  protected setting!: SubscriberSetting;

  constructor(dataSource: DataSource, repository?: SubscriberRepo<E>) {
    this.dataSource = dataSource;
    this.dataSource.subscribers.push(this);
    this.setRepository(repository);
    if (!this.setting) this.setting = {};
  }

  listenTo() {
    return this.entity;
  }

  async afterLoad(entity: any) {
    // 是否启用树形
    if (this.setting.tree && isNil(entity.level)) entity.level = 0;
  }

  protected setRepository(repository?: SubscriberRepo<E>) {
    this.repository = isNil(repository)
      ? this.dataSource.getRepository(this.entity)
      : repository;
  }

  /**
   * @description 判断某个属性是否被更新
   * @protected
   * @param {keyof E} column
   * @param {UpdateEvent<E>} event
   */
  protected isUpdated(column: keyof E, event: UpdateEvent<E>) {
    return !!event.updatedColumns.find((item) => item.propertyName === column);
  }
}
