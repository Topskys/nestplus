import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos';
import { CommentService } from '../services';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  @SerializeOptions({})
  async index() {
    return await this.commentService.find();
  }

  @Post()
  async store(
    @Body()
    data: CreateCommentDto,
  ) {
    return await this.commentService.create(data);
  }

  @Delete(':comment')
  async destroy(@Param('comment', new ParseUUIDPipe()) comment: string) {
    return await this.commentService.delete(comment);
  }
}
