import { Expose, Type } from 'class-transformer';
import {
  Entity,
  BaseEntity,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('content_comments')
@Tree('materialized-path')
export class CommentEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column({ comment: '评论内容', type: 'text' })
  body!: string;

  @Expose()
  @TreeChildren({ cascade: true })
  children!: CommentEntity[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent?: CommentEntity | null;

  // 评论与文章多对一,并触发`CASCADE`
  @Expose()
  @ManyToOne(() => PostEntity, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: PostEntity;

  @Expose()
  @Type(() => Date)
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
}
