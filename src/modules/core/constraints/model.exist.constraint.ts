import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource, ObjectType, Repository } from 'typeorm';

/**
 * 查询某个字段的值的记录是否在某个表中存在
 */
@ValidatorConstraint({ name: 'entityItemExist', async: true })
@Injectable()
export class ModelExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, args?: ValidationArguments) {
    let repo: Repository<any>;
    if (!value) return true;
    // 默认对比字段是id
    let map = 'id';
    if ('entity' in args.constraints) {
      map = args.constraints[0]['map'] ?? 'id';
      repo = this.dataSource.getRepository(args.constraints[0]['entity']);
    } else {
      repo = this.dataSource.getRepository(args.constraints[0]);
    }
    // 通过查询记录是否存在来验证
    const item = await repo.findOne({ where: { [map]: value } });
    return !!item;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    if (!validationArguments.constraints[0]) {
      return 'Model not been specified!';
    }
    return `All instance of ${validationArguments.property} must been exsits in database!`;
  }
}

export function IsModelExist(
  entity: ObjectType<any>,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: ModelExistConstraint,
    });
  };
}
