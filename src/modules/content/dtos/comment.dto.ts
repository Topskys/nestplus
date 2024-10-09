import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { DtoValidation } from '@/modules/core/decorators';

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateCommentDto {
  @IsUUID(undefined, { message: '文章ID格式错误' })
  @IsDefined({ message: '评论文章ID必须指定' })
  post!: string;

  @MaxLength(1000, { message: '评论内容不能超过$constraint1个字符' })
  @IsNotEmpty({ message: '评论内容不能为空' })
  body!: string;

  @IsUUID(undefined, { message: '父分类ID格式不正确' })
  @ValidateIf((p) => p.parent !== null && p.parent)
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value))
  parent?: string;
}
