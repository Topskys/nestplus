import { Repository } from "typeorm";
import { CustomRepository } from "@/modules/core/decorators";
import { PostEntity } from "../entities/post.entity";

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> { }