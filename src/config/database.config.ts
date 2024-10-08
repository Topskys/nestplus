import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const database: () => TypeOrmModuleOptions = () => ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'db_test',
    // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV !== 'production',
    // 在Webpack热更新可以保持连接
    keepConnectionAlive: true,
});
