import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

@Injectable()
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
