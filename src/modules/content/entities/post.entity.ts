import { ManyToMany } from 'typeorm';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToMany, JoinTable } from 'typeorm';
import { PostBodyType } from '@/modules/core/constants';
import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';

@Entity('content_posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    comment: '标题',
  })
  title!: string;

  @Column({
    nullable: true,
    comment: '描述',
  })
  summary?: string;

  @Column({
    type: 'text',
    comment: '内容',
  })
  body!: string;

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: '关键字',
  })
  keywords?: string[];

  @CreateDateColumn({
    comment: '创建时间',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updatedAt!: Date;

  // 文章与分类反向多对多关联
  @ManyToMany((type) => CategoryEntity, (category) => category.posts, {
    cascade: true,
  })
  @JoinTable()
  categories!: CategoryEntity[];

  // 文章与评论一对多关联
  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    cascade: true,
  })
  comments!: CommentEntity[];

  // 评论数量
  // 虚拟字段,在Repository中通过QueryBuilder设置
  commentCount!: number;

  @Column({ comment: '发布时间', type: 'varchar', nullable: true })
  publishedAt?: Date | null;

  @Column({ comment: '文章排序', default: 0 })
  customOrder!: number;

  @Column({
    comment: '文章类型',
    type: 'enum',
    enum: PostBodyType,
    default: PostBodyType.MD,
  })
  type!: PostBodyType;
}
