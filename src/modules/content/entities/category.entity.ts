import {
  BaseEntity,
  Column,
  CreateDateColumn,
  TreeChildren,
  Entity,
  TreeParent,
  ManyToMany,
  PrimaryGeneratedColumn,
  Tree,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('content_categories')
@Tree('materialized-path') // 物理路径嵌套树需要使用`@Tree`装饰器并以'materialized-path'作为参数传入
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ comment: '分类名称' })
  name!: string;

  // 子分类
  @TreeChildren({ cascade: true })
  children!: CategoryEntity[];

  // 父分类
  @TreeParent({ onDelete: 'SET NULL' })
  parent?: CategoryEntity | null;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    //  default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    // default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt!: Date;

  // 分类与文章多对多关联
  @ManyToMany((type) => PostEntity, (post) => post.categories)
  posts!: PostEntity[];
}
