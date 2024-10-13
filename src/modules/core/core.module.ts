import { DynamicModule, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  getDataSourceToken,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from './constants';
import {
  ModelExistConstraint,
  UniqueConstraint,
  UniqueExistConstraint,
  UniqueTreeConstraint,
  UniqueTreeExistConstraint,
} from './constraints';
import { AppFilter, AppInterceptor, AppPipe } from './providers';

export class CoreModule {
  public static forRoot(options: TypeOrmModuleOptions) {
    const imports: ModuleMetadata['imports'] = [TypeOrmModule.forRoot(options)];
    const providers: ModuleMetadata['providers'] = [
      {
        provide: APP_PIPE,
        useFactory: () =>
          new AppPipe({
            transform: true,
            forbidUnknownValues: true,
            validationError: { target: false },
          }),
      },
      {
        provide: APP_FILTER,
        useClass: AppFilter,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: AppInterceptor,
      },
      ModelExistConstraint,
      UniqueConstraint,
      UniqueExistConstraint,
      UniqueTreeConstraint,
      UniqueTreeExistConstraint,
    ];
    return {
      global: true,
      imports,
      providers,
      module: CoreModule,
    };
  }

  public static forRepository<T extends Type<any>>(
    repositories: T[],
    dataSourceName?: string,
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const Repo of repositories) {
      const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken(dataSourceName)],
        provide: Repo,
        useFactory: (dataSource: DataSource): typeof Repo => {
          const base = dataSource.getRepository<ObjectType<any>>(entity);
          return new Repo(base.target, base.manager, base.queryRunner);
        },
      });
    }

    return {
      global: true,
      exports: providers,
      module: CoreModule,
      providers,
    };
  }
}
