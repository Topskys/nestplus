import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostService } from '../services/post.service';

// 控制器URL的前缀
@Controller('posts')
export class PostController {
  constructor(protected postService: PostService) {}

  // 通过分页查询数据
  @Get()
  async index(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    )
    { page, limit, ...params }: QueryPostDto,
  ) {
    return await this.postService.paginate(params, { page, limit });
  }

  /**
   * 查询所有文章
   */
  @Get('all')
  async findAll() {
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
    return await this.postService.create(data);
  }

  /**
   * @description 更新文章
   * @param {UpdatePostDto} data 文章数据
   */
  @Patch()
  async update(
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false }, // 不在错误中暴露target
        groups: ['update'],
      }),
    )
    data: UpdatePostDto,
  ) {
    return await this.postService.update(data);
  }

  /**
   * @description 删除文章
   * @param { string }post 文章id
   */
  @Delete(':post')
  async destroy(@Param('post', new ParseUUIDPipe()) post: string) {
    return await this.postService.delete(post);
  }
}
