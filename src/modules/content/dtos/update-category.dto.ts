import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
  @IsDefined({ groups: ['update'], message: '分类ID必须指定' })
  id!: string;
}
