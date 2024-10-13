import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { CommentEntity } from '../entities';
import { PostEntity } from '../entities/post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
  protected qbName = 'post';

  buildBaseQuery() {
    return (
      this.createQueryBuilder(this.getQBName())
        // 加入分类关联
        .leftJoinAndSelect(`${this.getQBName()}.categories`, 'categories')
        // 建立子查询用于查询评论数量
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(c.id)', 'count')
            .from(CommentEntity, 'c')
            .where(`c.${this.getQBName()}.id = ${this.getQBName()}.id`);
        }, 'commentCount')
        // 把评论数量赋值给虚拟字段commentCount
        .loadRelationCountAndMap(
          `${this.getQBName()}.commentCount`,
          `${this.getQBName()}.comments`,
        )
    );
  }
}
