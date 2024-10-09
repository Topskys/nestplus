import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCommentDto } from '../dtos';
import { CommentService } from '../services';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  async index() {
    return await this.commentService.find();
  }

  @Post()
  async store(
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
      }),
    )
    data: CreateCommentDto,
  ) {
    return await this.commentService.create(data);
  }

  @Delete(':comment')
  async destroy(@Param('comment', new ParseUUIDPipe()) comment: string) {
    return await this.commentService.delete(comment);
  }
}
