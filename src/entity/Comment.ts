import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column("text")
  content: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // 评论与用户的多对一关联
  @ManyToOne((type) => User, (user) => user.comments)
  user: User;
  // 评论与文章的多对一关联
  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;
}
