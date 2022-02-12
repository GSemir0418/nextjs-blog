import "reflect-metadata";
import { createConnection } from "typeorm";
import { Post } from "./entity/Post";
import { User } from "./entity/User";
import { Comment } from "./entity/Comment";

createConnection()
  .then(async (connection) => {
    const { manager } = connection;
    // 创建user1
    const u1 = new User();
    u1.username = "gsq";
    u1.passwordDigest = "xxx";
    await manager.save(u1);
    //  创建post1
    const p1 = new Post();
    p1.title = "Post 1";
    p1.content = "My First Post";
    // 创建关联后，可以直接以对象的方式赋值
    p1.author = u1;
    await manager.save(p1);
    // 创建comment1
    const c1 = new Comment();
    c1.content = "Awsome!";
    c1.post = p1;
    c1.user = u1;
    await manager.save(c1);
    connection.close();
  })
  .catch((error) => console.log(error));
