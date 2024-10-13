import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { merge } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

type Condition = {
  entity: ObjectType<any>;
  ignore?: string;
  // 查询条件字段，默认为指定的ignore
  findKey?: string;
  // 需要查询的属性名，默认为当前验证的属性
  property?: string;
  manager?: string;
};

/**
 * @description 在更新时验证树形数据同级别某个字段的唯一性，通过ignore指定忽略的字段
 */
@ValidatorConstraint({ name: 'entityTreeUniqueExist', async: true })
@Injectable()
export class UniqueTreeExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(value: any, args?: ValidationArguments) {
    const config: Omit<Condition, 'entity'> = {
      ignore: 'id',
      property: args.property,
    };
    const condition = ('entity' in args.constraints
      ? merge(config, args.constraints[0])
      : {
          ...config,
          entity: args.constraints[0],
        }) as unknown as Required<Condition>;
    if (!condition.findKey) {
      condition.findKey = condition.ignore;
    }
    if (!condition.entity) return false;
    const ignoreValue = (args.object as any)[condition.ignore];
    const keyValue = (args.object as any)[condition.findKey];
    if (!ignoreValue || !keyValue) return false;
    const repo = this.dataSource.getTreeRepository(condition.entity);
    const item = await repo.findOne({
      where: {
        [condition.findKey]: keyValue,
        [condition.ignore]: ignoreValue,
      },
    });
    return !item;
  }
  defaultMessage?(args?: ValidationArguments): string {
    const { entity, property } = args.constraints[0];
    const queryProperty = property ?? args.property;
    if (!entity) {
      return 'Model not been specified!';
    }
    return `${queryProperty} of ${entity.name} must been unique with siblings elements!`;
  }
}

export function IsTreeUniqueExist(
  params: ObjectType<any> | Condition,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [params],
      validator: UniqueTreeExistConstraint,
    });
  };
}
