import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isNil, merge } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

type Condition = {
  entity: ObjectType<any>;
  parentKey?: string;
  property?: string;
};

/**
 * @description 验证属性模型下同级别某个字段的唯一性
 */
@ValidatorConstraint({ name: 'entityTreeUnique', async: true })
@Injectable()
export class UniqueTreeConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(value: any, args?: ValidationArguments) {
    const config: Omit<Condition, 'entity'> = {
      parentKey: 'parent',
      property: args.property,
    };
    const condition = ('entity' in args.constraints
      ? merge(config, args.constraints[0])
      : {
          ...config,
          entity: args.constraints[0],
        }) as unknown as Required<Condition>;
    //  需要查询的属性名，默认为当前验证的属性
    const argsObj = args.object as any;
    if (!condition.entity) return false;
    try {
      const repo = this.dataSource.getRepository(condition.entity);
      if (isNil(value)) return false;
      const collection = await repo.find({
        where: {
          parent: !argsObj[condition.parentKey]
            ? null
            : {
                id: argsObj[condition.parentKey],
              },
        },
        withDeleted: true,
      });
      return collection.every((item) => item[condition.property] !== value);
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (err) {
      return false;
    }
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

export function IsTreeUnique(
  params: ObjectType<any> | Condition,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [params],
      validator: UniqueTreeConstraint,
    });
  };
}
