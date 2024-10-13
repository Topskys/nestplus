import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isMatch' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // value will be the value of the field you validated
    // args will contain your constraint parameters and metadata
    const [relatedProperty] = args.constraints;
    const relatedValue = (args.object as any)[relatedProperty];
    return value === relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    const [relatedProperty] = args.constraints;
    return `${relatedProperty} and ${args.property} don't match`;
  }
}

export function isMatch(
  relatedProperty: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [relatedProperty],
      validator: MatchConstraint,
    });
  };
}
