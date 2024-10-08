import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

@Injectable()
export class CreatePostDto {
  @MaxLength(255, {
    always: true,
    message: '文章标题长度最大为$constraint1',
  })
  @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
  @IsOptional({ groups: ['update'] })
  title!: string;

  @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
  @IsOptional({ groups: ['update'] })
  body!: string;

  @MaxLength(500, {
    always: true,
    message: '文章描述长度最大为$constraint1',
  })
  @IsOptional({ always: true })
  summary!: string;

  @MaxLength(20, {
    each: true,
    always: true,
    message: '每个关键字长度最大为$constraint1',
  })
  @IsOptional({ always: true })
  keywords!: string[];

  @IsUUID(undefined, { each: true, always: true, message: '分类ID格式错误' })
  @IsOptional({ always: true })
  categories?: string[];
}
