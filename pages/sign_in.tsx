import axios from "axios";
import { useForm } from "hooks/useForm";
import withSession from "lib/withSession";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { User } from "src/entity/User";

const signIn: NextPage<{ user: User }> = (props) => {
  const initFormData = { username: "", password: "" };
  // 由于initFormData是静态对象数据，因此可以偷懒，直接指定其类型为typeof initFormData即可
  const onSubmit = (formData: typeof initFormData) => {
    axios.post("api/v1/sessions", formData).then(
      () => {
        window.alert("登录成功!");
      },
      (error) => {
        if (error.response) {
          if (error.response.status === 422) {
            setErrorData(error.response.data);
          }
        }
      }
    );
  };
  const { form, setErrorData } = useForm(
    initFormData,
    onSubmit,
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
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }
);
