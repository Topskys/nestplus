import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { PostOrderType } from '@/modules/core/constants';
import { tBoolean, tNumber } from '@/modules/core/helpers';

@Injectable()
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
