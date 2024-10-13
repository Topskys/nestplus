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
  // 默认忽略字段为id
  ignore?: string;
  // 若没有指定字段则使用当前验证的属性作为查询依据
  property?: string;
};

/**
 * 在更新时验证唯一性，通过指定ignore忽略的字段
 */
@ValidatorConstraint({ name: 'entityItemUniqueExist', async: true })
@Injectable()
export class UniqueExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}
  async validate(value: any, args?: ValidationArguments) {
    const config: Omit<Condition, 'entity'> = {
      ignore: 'id',
      property: args.property,
    };
    const condition = ('entity' in args.constraints[0]
      ? merge(config, args.constraints[0])
      : {
          ...config,
          entity: args.constraints[0],
        }) as unknown as Required<Condition>;
    if (!condition.entity) return false;
    const ignoreValue = (args.object as any)[condition.ignore];
    if (ignoreValue === undefined) return false;
    const repo = this.dataSource.getRepository(condition.entity);
    const item = await repo.findOne({
      where: {
        [condition.property]: value,
        [condition.ignore]: ignoreValue,
      },
    });
    return !item;
  }
  defaultMessage(args?: ValidationArguments) {
    const { entity, property } = args.constraints[0];
    const queryProperty = property ?? args.property;
    if (!(args.object as any).getManager) {
      return `getManager function not been found!`;
    }
    if (!entity) {
      return `Model not been specified!`;
    }
    return `${queryProperty} of ${entity.name} must be unique!`;
  }
}

export function IsUniqueExist(
  params: ObjectType<any> | Condition,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, parentPropertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: parentPropertyName,
      options: validationOptions,
      constraints: [params],
      validator: UniqueExistConstraint,
    });
  };
}
