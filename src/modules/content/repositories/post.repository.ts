import { Repository } from 'typeorm';
import { CustomRepository } from '@/modules/core/decorators';
import { CommentEntity } from '../entities';
import { PostEntity } from '../entities/post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  buildBaseQuery() {
    return (
      this.createQueryBuilder('post')
        // 加入分类关联
        .leftJoinAndSelect('post.categories', 'categories')
        // 建立子查询用于查询评论数量
        .addSelect((subQuery) => {
          return subQuery
            .select('COUNT(c.id)', 'count')
            .from(CommentEntity, 'c')
            .where('c.post.id = post.id');
        }, 'commentCount')
        // 把评论数量赋值给虚拟字段commentCount
        .loadRelationCountAndMap('post.commentCount', 'post.comments')
    );
  }
}
