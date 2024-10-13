import { isNil } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';

import { BaseTreeRepository } from '../../core/crud/tree.repository';
import { CustomRepository } from '../../core/decorators';
import { TreeQueryParams } from '../../core/types';
import { CommentEntity } from '../entities';

@CustomRepository(CommentEntity)
export class CommentRepository extends BaseTreeRepository<CommentEntity> {
  protected qbName = 'comment';

  protected orderBy = 'createdAt';

  buildBaseQuery(): SelectQueryBuilder<CommentEntity> {
    return this.createQueryBuilder(this.qbName)
      .leftJoinAndSelect(`${this.getQBName()}.parent`, 'parent')
      .leftJoinAndSelect(`${this.qbName}.post`, 'post');
  }

  async findTrees(
    params: TreeQueryParams<CommentEntity> & { post?: string } = {},
  ): Promise<CommentEntity[]> {
    return super.findTrees({
      ...params,
      addQuery: (qb) => {
        return isNil(params.post)
          ? qb
          : qb.where('post.id = :id', { id: params.post });
      },
    });
  }
}
