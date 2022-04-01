import axios from "axios";
import { useForm } from "hooks/useForm";
import withSession from "lib/withSession";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { User } from "src/entity/User";
import qs from "query-string";

const signIn: NextPage<{ user: User }> = (props) => {
  const { form } = useForm(
    { username: "", password: "" },
    {
      request: (formData) => axios.post("/api/v1/sessions", formData),
      // 登录后需利用return_to参数返回到指定路由
      success: () => {
        window.alert("登录成功");
        // 使用query-string库解析url
        const query = qs.parse(window.location.search.substring(1));
        window.location.href = query.return_to?.toString() || '/posts';
      },
    },
    [
      { label: "用户名", type: "text", key: "username" },
      { label: "密码", type: "password", key: "password" },
    ],
    <button type="submit">登录</button>
  );
  return (
    <>
      {props.user && <div>当前登录的用户为{props.user.username}</div>}
      <h1>用户登录</h1>
      {form}
    </>
  );
};
export default signIn;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    // @ts-ignore
    const user = context.req.session.get("currentUser");
    return {
      props: {
        user: JSON.parse(JSON.stringify(user ?? "")),
      },
    };
  }
);
