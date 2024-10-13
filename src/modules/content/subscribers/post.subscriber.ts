import { DataSource, EventSubscriber, LoadEvent } from 'typeorm';

import { PostBodyType } from '@/modules/core/constants';

import { BaseSubscriber } from '@/modules/core/crud';

import { SubscriberSetting } from '@/modules/core/types';

import { PostEntity } from '../entities';
import { PostRepository } from '../repositories';
import { SanitizeService } from '../services';

@EventSubscriber()
export class PostSubscriber extends BaseSubscriber<PostEntity> {
  protected entity = PostEntity;
  protected setting: SubscriberSetting = {};
  constructor(
    protected dataSource: DataSource,
    protected sanitizeService: SanitizeService,
    protected postRepository: PostRepository,
  ) {
    super(dataSource, postRepository);
  }

  /**
   * 加载文章数据的处理
   * @param entity
   * @param event
   */
  async afterLoad(entity: PostEntity, event?: LoadEvent<PostEntity>) {
    if (entity.type === PostBodyType.HTML) {
      entity.body = this.sanitizeService.sanitize(entity.body);
    }
  }
}
