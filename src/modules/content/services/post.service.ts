import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { In } from 'typeorm';
import { QueryHook } from '@/modules/core/types';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { PostEntity } from '../entities';
import { CategoryRepository } from '../repositories';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
    // 此处需要注入`PostRepository`的依赖
    constructor(
        protected postRepository: PostRepository,
        protected categoryRepository: CategoryRepository,
    ) { }
    // 查询文章列表
    async findList() {
        return (await this.getItemQuery()).getMany();
    }
    // 查询一篇文章的详细信息
    async findOne(id: string) {
        const query = await this.getItemQuery();
        const item = await query.where('post.id = :id', {
            id,
        }).getOne();
        if (isNil(item)) { 
            throw new NotFoundException(`Post ${id} not exists!`); 
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
        if (!post) throw new NotFoundException(`Post ${id} not exists!`);
        return await this.postRepository.remove(post);
    }

    protected async getItemQuery(callback?: QueryHook<PostEntity>) {
        let query = this.postRepository.buildBaseQuery();
        if (!isNil(callback)) { query = await callback(query); }
        return query;
    }
}
