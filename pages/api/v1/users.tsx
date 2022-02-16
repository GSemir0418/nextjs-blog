import { getDatabaseConnection } from "lib/getDatabaseConnection";
import md5 from "md5";
import { NextApiHandler } from "next";
import { User } from "src/entity/User";

const Users: NextApiHandler = async (req, res) => {
  // 在req.body中获取请求数据
  const { username, password, passwordConfirm } = req.body;
  res.setHeader("Content-Type", "application/json;chartset:utf-8");
  const connection = await getDatabaseConnection();
  const user = new User();
  user.username = username;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.validate();
  if (user.hasErrors()) {
    res.statusCode = 422;
    res.write(JSON.stringify(user.errors));
  } else {
    await connection.manager.save(user);
    res.statusCode = 200;
    res.write(JSON.stringify(user));
  }
  // 最后关闭响应
  res.end();
};
export default Users;
