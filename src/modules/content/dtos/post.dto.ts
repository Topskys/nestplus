import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  Min,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDefined,
  MaxLength,
} from 'class-validator';
import { PostOrderType } from '@/modules/core/constants';
import { DtoValidation } from '@/modules/core/decorators';
import { tBoolean, tNumber } from '@/modules/core/helpers';

@Injectable()
@DtoValidation({ groups: ['create'] })
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

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
  @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
  id!: string;
}

@Injectable()
@DtoValidation({ type: 'query' })
export class QueryPostDto {
  @IsUUID(undefined, { message: '分类ID格式错误' })
  @IsOptional()
  category?: string;

  @Transform(({ value }) => tBoolean(value))
  @IsBoolean({ message: '发布状态查询必须是布尔值' })
  @IsOptional()
  isPublished?: boolean;

  @IsEnum(PostOrderType, {
    message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
  })
  @IsOptional()
  orderBy?: PostOrderType;

  @Transform(({ value }) => tNumber(value))
  @IsNumber()
  @Min(1, { message: '当前页必须大于1' })
  @IsOptional()
  page = 1;

  @Transform(({ value }) => tNumber(value))
  @Min(1, { message: '每页条数必须大于1' })
  @IsNumber()
  @IsOptional()
  limit = 10;
}
