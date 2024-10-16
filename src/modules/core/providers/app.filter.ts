import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { isObject } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

/**
 * 全局异常过滤器，用于响应自定义异常
 */
@Catch()
export class AppFilter<T = Error> extends BaseExceptionFilter<T> {
  protected resExceptions: Array<
    { class: Type<Error>; status?: number } | Type<Error>
  > = [{ class: EntityNotFoundError, status: HttpStatus.NOT_FOUND }];

  catch(exception: T, host: ArgumentsHost) {
    const applicationRef =
      this.applicationRef ||
      (this.httpAdapterHost && this.httpAdapterHost.httpAdapter)!;
    // 是否在自定义的异常处理类列表中
    const resException = this.resExceptions.find((item) =>
      'class' in item
        ? exception instanceof item.class
        : exception instanceof item,
    );

    // 如果不在自定义异常处理类列表也没有继承自HttpException
    if (!resException && !(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host, applicationRef);
    }

    let res: string | object = '';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      res = exception.getResponse();
      status = exception.getStatus();
    } else if (resException) {
      // 若在自定义异常处理类列表中
      const e = exception as unknown as Error;
      res = e.message;
      if ('class' in resException && resException.status) {
        status = resException.status;
      }
    }

    const message = isObject(res)
      ? res
      : {
          statusCode: status,
          message: resException,
        };
    applicationRef!.reply(host.getArgByIndex(1), message, status);
  }
}
