import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsUUID,
  MaxLength,
  IsDefined,
  ValidateIf,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { DtoValidation } from '@/modules/core/decorators';
import { tNumber } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';

@Injectable()
@DtoValidation({ type: 'query' })
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

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateCategoryDto {
  @MaxLength(25, {
    always: true,
    message: '分类名称不能超过$constraint1个字符',
  })
  @IsNotEmpty({ groups: ['create'], message: '分类名称不能为空' })
  @IsOptional({ groups: ['update'] })
  name!: string;

  @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
  @ValidateIf((p) => p.parent !== null && p.parent)
  @IsOptional({ always: true })
  @Transform(({ value }) => (value === 'null' ? null : value))
  parent?: string;
}

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
  @IsDefined({ groups: ['update'], message: '分类ID必须指定' })
  id!: string;
}
