import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, ValidationPipe } from "@nestjs/common";
import { CreatePostDto } from "../dtos/create-post.dto";
import { UpdatePostDto } from "../dtos/update-post.dto";
import { PostService } from "../services/post.service";

// 控制器URL的前缀
@Controller('posts')
export class PostController {
    constructor(protected postService: PostService) { }

    /**
     * 查询所有文章
     */
    @Get()
    async index() {
        return this.postService.findList();
    }

    /**
     * 查询文章
     * @param post 文章id
     */
    @Get(':post')
    async show(@Param('post', new ParseUUIDPipe()) post: string) {
        return this.postService.findOne(post);
    }

    /**
     * 创建文章
     * @param data 文章数据
     */
    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                // 不在错误中暴露target
                validationError: { target: false },
                groups: ['create'],
            }),
        )
        data: CreatePostDto,
    ) {
        return this.postService.create(data);
    }

    /**
     * @description 更新文章
     * @param {UpdatePostDto} data 文章数据
     */
    @Patch()
    async update(@Body(
        new ValidationPipe({
            transform: true,
            forbidUnknownValues: true,
            validationError: { target: false }, // 不在错误中暴露target
            groups: ['update']
        })
    ) data: UpdatePostDto) {
        return this.postService.update(data);
    }

    /**
     * @description 删除文章
     * @param { string }post 文章id
     */
    @Delete(':post')
    async destroy(@Param('post', new ParseUUIDPipe()) post: string) {
        return this.postService.delete(post);
    }
}