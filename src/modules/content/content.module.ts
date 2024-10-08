import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '../core/core.module';
import * as ControllerMaps from './controllers';
import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import * as RepositoryMaps from './repositories';
import * as ServiceMaps from './services';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const dtos = Object.values(DtoMaps);
const services = Object.values(ServiceMaps);
const controllers = Object.values(ControllerMaps);
@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    // 注册自定义Repository
    CoreModule.forRepository(repositories),
  ],
  controllers,
  providers: [...dtos, ...services],
  exports: [
    // 导出自定义Repository,以供其它模块使用
    CoreModule.forRepository(repositories),
    ...services,
  ],
})
export class ContentModule {}
