import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type ModelType = 1 | 2 | 3 | 4 | 5;

/**
 * 密码校验
 */
@ValidatorConstraint({ name: 'isPassword', async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string, args?: ValidationArguments) {
    const validateModel: ModelType = args.constraints[0] ?? 1;
    switch (validateModel) {
      // 密码必须包含数字和字母（默认模式）
      case 1:
        return /\d/.test(value) && /[a-zA-Z]/.test(value);
      // 密码必须包含数字和小写字母
      case 2:
        return /\d/.test(value) && /[a-z]/.test(value);
      // 密码必须包含数字和大写字母
      case 3:
        return /\d/.test(value) && /[A-Z]/.test(value);
      // 密码必须包含数字和大小写字母
      case 4:
        return /\d/.test(value) && /[a-z]/.test(value) && /[A-Z]/.test(value);
      // 密码必须包含数字、大小写字母、特殊字符
      case 5:
        return (
          /\d/.test(value) &&
          /[a-z]/.test(value) &&
          /[A-Z]/.test(value) &&
          /[!@#$%^&]/.test(value)
        );
      default:
        return /\d/.test(value) && /[a-zA-Z]/.test(value);
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw new Error('Method not implemented.');
  }
}
