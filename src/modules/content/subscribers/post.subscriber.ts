import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  LoadEvent,
} from 'typeorm';
import { PostBodyType } from '@/modules/core/constants';
import { PostEntity } from '../entities';
import { SanitizeService } from '../services';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<PostEntity> {
  constructor(
    dataSource: DataSource,
    protected sanitizeService: SanitizeService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return PostEntity;
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
