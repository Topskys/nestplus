import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { tNumber } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';

@Injectable()
export class QueryCategoryDto implements PaginateDto {
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
