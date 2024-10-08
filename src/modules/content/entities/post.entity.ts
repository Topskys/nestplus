import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('content_posts')
export class PostEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        comment: '标题'
    })
    title!: string;

    @Column({
        nullable: true,
        comment: '描述'
    })
    summary?: string;

    @Column({
        type: 'text',
        comment: '内容'
    })
    body!: string;

    @Column({
        type: 'simple-array',
        nullable: true,
        comment: '关键字'
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
}