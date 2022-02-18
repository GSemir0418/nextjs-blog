import { getDatabaseConnection } from "lib/getDatabaseConnection";
import withSession from "lib/withSession";
import { NextApiHandler } from "next";
import { Post } from "src/entity/Post";

const Posts: NextApiHandler = withSession(async (req, res) => {
  // 如果是post方法，说明是新增文章
  if (req.method === "POST") {
    const connection = await getDatabaseConnection();
    const { title, content } = req.body;
    const post = new Post();
    post.title = title;
    post.content = content;
    const user = req.session.get("currentUser");
    post.author = user;
    await connection.manager.save(post);
    res.json(post);
    // res.json相当于以下四行的功能
    // res.statusCode = 200;
    // res.setHeader("Content-Type", "application/json;charset:utf-8");
    // res.write(JSON.stringify(req.body));
    // res.end()
  }
});
export default Posts;
