import axios from "axios";
import Form from "components/Form";
import withSession from "lib/withSession";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useCallback, useState } from "react";
import { User } from "src/entity/User";

const signIn: NextPage<{ user: User }> = (props) => {
  // 表格数据
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // 错误数据
  const [errorData, setErrorData] = useState({
    username: [],
    password: [],
  });
  // 表单提交
  const onSubmit = useCallback(
    (e) => {
      // 禁用默认事件
      e.preventDefault();
      axios.post("api/v1/sessions", formData).then(
        (res) => {
          if (res.status === 200) {
            window.alert("登录成功!");
          }
        },
        (error) => {
          if (error.response) {
            if (error.response.status === 422) {
              setErrorData(error.response.data);
            }
          }
        }
      );
    },
    [formData]
  );
  // onChange也可以进一步抽离
  const onChange = useCallback(
    (key, value) => {
      // key可以用占位符的形式
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );
  return (
    <>
      {props.user && <div>当前登录的用户为{props.user.username}</div>}
      <h1>用户登录</h1>
      <Form
        onSubmit={onSubmit}
        fields={[
          {
            label: "用户名",
            type: "text",
            value: formData.username,
            onChange: (e) => onChange("username", e.target.value),
            errors: errorData.username,
          },
          {
            label: "密码",
            type: "password",
            value: formData.password,
            onChange: (e) => onChange("password", e.target.value),
            errors: errorData.password,
          },
        ]}
        buttons={<button type="submit">登录</button>}
      />
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
