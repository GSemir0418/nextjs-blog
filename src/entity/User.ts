import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";
import { getDatabaseConnection } from "lib/getDatabaseConnection";
import md5 from "md5";
import _ from "lodash";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column("varchar")
  username: string;
  @Column("varchar")
  passwordDigest: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // 用户与文章的一对多关系
  @OneToMany((type) => Post, (post) => post.author)
  posts: Post[];
  // 用户与评论的一对多关系
  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];
  // 以上为users表的列配置

  // 以下为实例属性与方法
  errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirm: [] as string[],
  };
  // 避免与passwordDigest混淆
  password: string;
  passwordConfirm: string;
  // 校验方法，涉及到查询数据库，因此是异步的
  async validate() {
    if (this.username.trim() === "") {
      this.errors.username.push("不能为空");
    }
    if (!/[a-zA-Z0-9]/.test(this.username.trim())) {
      this.errors.username.push("格式不合法");
    }
    if (this.username.trim().length > 42) {
      this.errors.username.push("太长");
    }
    if (this.username.trim().length <= 3) {
      this.errors.username.push("太短");
    }
    if (this.password === "") {
      this.errors.password.push("不能为空");
    }
    if (this.password !== this.passwordConfirm) {
      this.errors.passwordConfirm.push("密码不匹配");
    }
    const hasUser = await (
      await getDatabaseConnection()
    ).manager.find(User, { username: this.username });
    if (hasUser.length > 0) {
      this.errors.username.push("用户名已存在");
    }
  }
  // 是否有错误
  hasErrors() {
    return !!Object.values(this.errors).flat(Infinity).length;
  }
  // 在向数据库存入数据前，处理密码加密
  @BeforeInsert()
  generatePasswordDigest() {
    this.passwordDigest = md5(this.password);
  }
  // 类中如果有toJSON方法，其返回值则代表此类的实例stringify后的值
  toJSON() {
    return _.omit(this, [
      "password",
      "passwordConfirm",
      "passwordDigest",
      "errors",
    ]);
  }
}
