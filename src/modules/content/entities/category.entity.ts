import { Exclude, Expose } from 'class-transformer';
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

@Exclude() // 使用自动化序列化时排除该字段
@Entity('content_categories')
@Tree('materialized-path') // 物理路径嵌套树需要使用`@Tree`装饰器并以'materialized-path'作为参数传入
export class CategoryEntity extends BaseEntity {
  @Expose() // 使用自动化序列化时包含该字段
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column({ comment: '分类名称' })
  name!: string;

  // 子分类
  @Expose({ groups: ['category-tree'] })
  @TreeChildren({ cascade: true })
  children!: CategoryEntity[];

  // 父分类
  @Expose({ groups: ['category-detail'] })
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

  @Expose({ groups: ['category-tree', 'category-detail', 'category-list'] })
  @Column({ comment: '分类排序', default: 0 })
  order!: number;

  // 虚拟字段
  @Expose({ groups: ['category-list'] })
  level = 0;
}
