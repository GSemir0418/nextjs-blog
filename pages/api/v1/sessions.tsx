import withSession from "lib/withSession";
import { NextApiHandler } from "next";
import SignIn from "src/model/SignIn";

const Sessions: NextApiHandler = async (req, res) => {
  const { username, password } = req.body;
  res.setHeader("Content-Type", "application/json;charset:utf-8");
  const signIn = new SignIn(username, password);
  await signIn.validate();
  if (signIn.hasErrors()) {
    res.statusCode = 422;
    res.end(JSON.stringify(signIn.errors));
  } else {
    // 登录成功时将user保存至服务器的session['currentUser']
    req.session.set("currentUser", signIn.user);
    await req.session.save();
    res.statusCode = 200;
    res.end(JSON.stringify(signIn.user));
  }
};
export default withSession(Sessions);
