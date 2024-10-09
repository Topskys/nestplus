import { Injectable } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import {
  EntityNotFoundError,
  In,
  IsNull,
  Not,
  SelectQueryBuilder,
} from 'typeorm';
import { PostOrderType } from '@/modules/core/constants';
import { QueryHook } from '@/modules/core/types';
import { CreatePostDto, UpdatePostDto, QueryPostDto } from '../dtos';
import { PostEntity } from '../entities';
import { CategoryRepository, PostRepository } from '../repositories';
import { CategoryService } from './category.service';

// 文章查询接口
type FindParams = {
  [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]?: QueryPostDto[key];
};

@Injectable()
export class PostService {
  // 此处需要注入`PostRepository`的依赖
  constructor(
    protected postRepository: PostRepository,
    protected categoryRepository: CategoryRepository,
    protected categoryService: CategoryService,
  ) {}
  // 查询文章列表
  async findList() {
    return (await this.getItemQuery()).getMany();
  }
  // 查询一篇文章的详细信息
  async findOne(id: string) {
    const query = await this.getItemQuery();
    const item = await query
      .where('post.id = :id', {
        id,
      })
      .getOne();
    if (isNil(item)) {
      throw new EntityNotFoundError(PostEntity, `Post ${id} not exists!`);
    }
    return item;
  }

  // 添加文章
  async create(data: CreatePostDto) {
    const createPostDto = {
      ...data,
      categories: data.categories
        ? await this.categoryRepository.findBy({
            id: In(data.categories),
          })
        : [],
    };
    const item = await this.postRepository.save(createPostDto);
    return await this.findOne(item.id);
  }

  // 更新文章
  async update(data: UpdatePostDto) {
    const post = (await this.findOne(data.id)) || undefined;
    if (data.categories) {
      this.postRepository
        .createQueryBuilder('post')
        .relation(PostEntity, 'categories')
        .of(post)
        .addAndRemove(data.categories, post.categories ?? []);
    }
    await this.postRepository.update(data.id, omit(data, ['id', 'categories']));
    return await this.findOne(data.id);
  }

  // 删除文章
  async delete(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post)
      throw new EntityNotFoundError(PostEntity, `Post ${id} not exists!`);
    return await this.postRepository.remove(post);
  }

  protected async getItemQuery(callback?: QueryHook<PostEntity>) {
    let query = this.postRepository.buildBaseQuery();
    if (!isNil(callback)) {
      query = await callback(query);
    }
    return query;
  }

  async paginate(params: FindParams, options: IPaginationOptions) {
    const query = await this.getListQuery(params);
    return paginate<PostEntity>(query, options);
  }

  protected async getListQuery(
    params: FindParams = {},
    callback?: QueryHook<PostEntity>,
  ) {
    const { category, orderBy, isPublished } = params;
    let query = this.postRepository.buildBaseQuery();
    if (typeof isPublished === 'boolean') {
      query = query.where({
        publishedAt: isPublished ? Not(IsNull()) : IsNull(),
      });
    }
    query = await this.queryOrderBy(query, orderBy);
    if (callback) {
      query = await callback(query);
    }
    if (category) {
      query = await this.queryByCategory(category, query);
    }
    return query;
  }

  protected async queryByCategory(
    id: string,
    query: SelectQueryBuilder<PostEntity>,
  ) {
    const root = await this.categoryService.findOne(id);
    const tree = await this.categoryRepository.findDescendantsTree(root);
    const flatDes = await this.categoryRepository.toFlatTrees(tree.children);
    const ids = [tree.id, ...flatDes.map((item) => item.id)];
    return query.where('categories.id IN (:...ids)', { ids });
  }

  protected async queryOrderBy(
    query: SelectQueryBuilder<PostEntity>,
    orderBy?: PostOrderType,
  ) {
    switch (orderBy) {
      case PostOrderType.CREATED:
        return query.orderBy('post.createdAt', 'DESC');
      case PostOrderType.UPDATED:
        return query.orderBy('post.updatedAt', 'DESC');
      case PostOrderType.PUBLISHED:
        return query.orderBy('post.publishedAt', 'DESC');
      case PostOrderType.COMMENT_COUNT:
        return query.orderBy('commentCount', 'DESC');
      case PostOrderType.CUSTOM:
        return query.orderBy('customOrder', 'DESC');
      default:
        return query
          .orderBy('post.createdAt', 'DESC')
          .addOrderBy('post.updatedAt', 'DESC')
          .addOrderBy('post.publishedAt', 'DESC')
          .addOrderBy('commentCount', 'DESC');
    }
  }
}
