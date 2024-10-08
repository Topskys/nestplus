import { Injectable, NotFoundException } from "@nestjs/common";
import { omit } from "lodash";
import { CreatePostDto } from "../dtos/create-post.dto";
import { UpdatePostDto } from "../dtos/update-post.dto";
import { PostRepository } from "../repositories/post.repository";

@Injectable()
export class PostService {
    // 此处需要注入`PostRepository`的依赖
    constructor(private postRepository: PostRepository) { }
    // 查询文章列表
    async findList() {
        return await this.postRepository.find();
    }
    // 查询一篇文章的详细信息
    async findOne(id: string) {
        return await this.postRepository.findOneOrFail({ where: { id } });
    }
    // 添加文章
    async create(data: CreatePostDto) {
        const item = await this.postRepository.save(data);
        return await this.findOne(item.id);
    }

    // 更新文章
    async update(data: UpdatePostDto) {
        await this.postRepository.update(data.id, omit(data, ['id']));
        return await this.findOne(data.id);
    }

    // 删除文章
    async delete(id: string) {
        const post=await this.postRepository.findOne({where:{id}})
        if(!post) throw new NotFoundException(`Post ${id} not exists!`);
        return await this.postRepository.remove(post);
    }
}
