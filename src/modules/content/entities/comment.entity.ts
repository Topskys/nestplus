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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ comment: '评论内容', type: 'text' })
  body!: string;

  @TreeChildren({ cascade: true })
  children!: CommentEntity[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent?: CommentEntity | null;

  // 评论与文章多对一,并触发`CASCADE`
  @ManyToOne(() => PostEntity, (post) => post.comments, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post!: PostEntity;

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
