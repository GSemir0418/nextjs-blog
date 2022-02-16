import axios from "axios";
import withSession from "lib/withSession";
import { GetServerSideProps, NextPage } from "next";
import { useCallback, useState } from "react";
import { User } from "src/entity/User";

const signIn: NextPage<{ user: User }> = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // 错误数据
  const [errorData, setErrorData] = useState({
    username: [],
    password: [],
  });
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
  return (
    <>
      {props.user && <div>当前登录的用户为{props.user.username}</div>}
      <h1>用户登录</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            用户名:{" "}
            <input
              type="text"
              value={formData.username}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  username: e.target.value,
                });
              }}
            />
          </label>
        </div>
        <div>
          {errorData.username?.length > 0 && errorData.username.join(",")}
        </div>
        <div>
          <label>
            密码:{" "}
            <input
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  password: e.target.value,
                });
              }}
            />
          </label>
        </div>
        <div>
          {errorData.password?.length > 0 && errorData.password.join(",")}
        </div>
        <div>
          <button type="submit">登录</button>
        </div>
      </form>
    </>
  );
};
export default signIn;

export const getServerSideProps: GetServerSideProps = withSession(
  // @ts-ignore
  async (context) => {
    // @ts-ignore
    const user = context.req.session.get("currentUser");
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  }
);
