import { registerDecorator, ValidationOptions } from 'class-validator';
import validator from 'validator';

/**
 * 必须是“区号，手机号”的形式
 *
 * @description 手机号验证规则
 */
export function IsMatchPhone(
  value: any,
  locale?: validator.MobilePhoneLocale,
  options?: validator.IsMobilePhoneOptions,
) {
  if (!value) return false;
  const phoneArr: string[] = value.split('.');
  if (phoneArr.length !== 2) return false;
  return validator.isMobilePhone(phoneArr.join(''), locale, options);
}

export function IsMatchPhone2(
  locale?: validator.MobilePhoneLocale | validator.MobilePhoneLocale[],
  options?: validator.IsMobilePhoneOptions,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [locale || 'any', options],
      validator: {
        validate(value: any, args: any) {
          return IsMatchPhone(value, args.constraints[0], args.constraints[1]);
        },
        defaultMessage: (_args: any) => {
          return `${_args.property} must be a valid phone number,eg： +86.12345678901`;
        },
      },
    });
  };
}
