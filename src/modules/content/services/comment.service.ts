import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import { TreeRepository } from 'typeorm';
import { CreateCommentDto } from '../dtos';
import { CommentEntity } from '../entities';
import { PostRepository } from '../repositories';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    protected commentRepository: TreeRepository<CommentEntity>,
    protected postRepository: PostRepository,
  ) {}

  async find(post?: string) {
    return post
      ? await this.commentRepository.find({
          where: { post: { id: post } },
          relations: ['children'],
        })
      : await this.commentRepository.find({
          relations: ['children'],
        });
  }

  async create(data: CreateCommentDto) {
    const item = await this.commentRepository.save({
      ...data,
      parent: await this.getParent(data.parent),
      post: await this.getPost(data.post),
    });
    return await this.commentRepository.findOneOrFail({
      where: { id: item.id },
    });
  }

  async delete(id: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(`Comment ${id} not found!`);
    return await this.commentRepository.remove(comment);
  }

  protected async getParent(id?: string) {
    if (!id) return null;
    const parent = await this.commentRepository.findOne({ where: { id } });
    if (!parent)
      throw new NotFoundException(`Parent comment ${id} not exists!`);
    return parent;
  }

  async getPost(id: string) {
    const post = await this.postRepository.findOne({ where: { id } });
    if (isNil(post))
      throw new NotFoundException(
        `The post ${post} which comment belongs not exists!`,
      );
    return post;
  }
}
