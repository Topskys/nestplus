import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoreModule } from "../core/core.module";
import { PostController } from "./controllers";
import { CreatePostDto, UpdatePostDto } from "./dtos";
import { PostEntity } from "./entities";
import { PostRepository } from "./repositories";
import { PostService } from "./services";


@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        // 注册自定义Repository
        CoreModule.forRepository([PostRepository]),
    ],
    providers: [PostService, CreatePostDto, UpdatePostDto],
    controllers: [PostController],
    exports: [
        PostService,
        // 导出自定义Repository,以供其它模块使用
        CoreModule.forRepository([PostRepository]),
    ],
})
export class ContentModule { }