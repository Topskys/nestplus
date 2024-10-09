import {
  ArgumentMetadata,
  Injectable,
  Paramtype,
  ValidationPipe,
} from '@nestjs/common';
import { merge } from 'lodash';
import { DTO_VALIDATION_OPTIONS } from '../constants';

/**
 * 自定义验证管道
 */
@Injectable()
export class AppPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype, type } = metadata;
    // 获取要验证的dto类
    const dto = metatype as any;
    // 获取dto类的装饰器元数据的自定义验证选项
    const options = Reflect.getMetadata(DTO_VALIDATION_OPTIONS, dto) || {};

    // 备份默认的验证选项
    const originOptions = { ...this.validatorOptions };
    // 把当前已设置的class-transform选项解构到备份对象
    const originTransform = { ...this.transformOptions };
    // 把自定义的class-transform和type结构出来
    const { transformOptions, type: optionsType, ...customOptions } = options;

    // 根据DTO类上设置的type类设置当前DTO请求类型，默认为‘body’
    const requestType: Paramtype = optionsType ?? 'body';
    // 若被验证DTO设置的请求类型与当前请求类型不一致，则不进行验证（跳过此管道）
    if (requestType !== type) return value;

    // 合并当前transform选项和自定义选项
    if (transformOptions) {
      this.transformOptions = merge(
        this.transformOptions,
        transformOptions ?? {},
        {
          arrayMerge: (_d, s, _o) => s,
        },
      );
    }
    // 合并当前验证选项和自定义选项
    this.validatorOptions = merge(this.validatorOptions, customOptions ?? {}, {
      arrayMerge: (_d, s, _o) => s,
    });

    // 序列化并验证dto对象
    let result = await super.transform(value, metadata);
    // 若dto类中存在transform静态方法，则返回调用进一步transform后的结果
    if (typeof result.transform === 'function') {
      result = await result.transform(result);
      const { transform, ...data } = result;
      result = data;
    }

    // 重置验证选项
    this.validatorOptions = originOptions;
    // 重置transform选项
    this.transformOptions = originTransform;
    return result;
  }
}
