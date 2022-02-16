import { getDatabaseConnection } from "lib/getDatabaseConnection";
import md5 from "md5";
import { User } from "src/entity/User";

export default class SignIn {
  username: string;
  password: string;
  user: User;
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
  errors = { username: [] as string[], password: [] as string[] };
  async validate() {
    if (this.username.trim() === "") {
      this.errors.username.push("请填写用户名");
    }
    const connection = await getDatabaseConnection();
    const user = await connection.manager.findOne(User, {
      where: { username: this.username },
    });
    this.user = user;
    if (user) {
      if (user.passwordDigest !== md5(this.password)) {
        this.errors.password.push("密码不匹配");
      }
    } else {
      this.errors.username.push("用户名不存在");
    }
  }
  hasErrors() {
    return !!Object.values(this.errors).flat(Infinity).length;
  }
}
