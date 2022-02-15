import { getDatabaseConnection } from "lib/getDatabaseConnection";
import md5 from "md5";
import { NextApiHandler } from "next";
import { User } from "src/entity/User";

const Users: NextApiHandler = async (req, res) => {
  // 在req.body中获取请求数据
  const { username, password, passwordConfirm } = req.body;
  res.setHeader("Content-Type", "application/json;Chartset:UTF-8");
  const connection = await getDatabaseConnection();
  // 错误收集
  const errors = {
    username: [],
    password: [],
    passwordConfirm: [],
  } as any;
  // 表单校验
  if (username.trim() === "") {
    errors.username.push("不能为空");
  }
  if (!/[a-zA-Z0-9]/.test(username.trim())) {
    errors.username.push("格式不合法");
  }
  if (username.trim().length > 42) {
    errors.username.push("太长");
  }
  if (username.trim().length <= 3) {
    errors.username.push("太短");
  }
  if (password === "") {
    errors.password.push("不能为空");
  }
  if (password !== passwordConfirm) {
    errors.passwordConfirm.push("密码不匹配");
  }
  const hasUser = await connection.manager.find(User, { username });
  if (hasUser.length > 0) {
    errors.username.push("用户名已存在");
  }
  // 判断有无错误
  const hasError = !!Object.values(errors).flat(Infinity).length;
  if (hasError) {
    res.statusCode = 422;
    res.write(JSON.stringify(errors));
  } else {
    // 校验通过，保存user至数据库
    const user = new User();
    user.username = username;
    // 密码暂时使用md5加密，但不推荐
    user.passwordDigest = md5(password);
    await connection.manager.save(user);
    res.statusCode = 200;
    res.write(JSON.stringify(user));
  }
  // 最后关闭响应
  res.end();
};
export default Users;
