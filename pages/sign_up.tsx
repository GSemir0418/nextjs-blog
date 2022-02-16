import axios from "axios";
import { NextPage } from "next";
import { useCallback, useState } from "react";

const signUp: NextPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
  });
  // 错误数据
  const [errorData, setErrorData] = useState({
    username: [],
    password: [],
    passwordConfirm: [],
  });
  const onSubmit = useCallback(
    (e) => {
      // 禁用默认事件
      e.preventDefault();
      axios.post("api/v1/users", formData).then(
        (res) => {
          if (res.status === 200) {
            window.alert("注册成功!");
            window.location.href = "/sign_in";
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
      <h1>注册页面</h1>
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
          <label>
            确认密码:{" "}
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  passwordConfirm: e.target.value,
                });
              }}
            />
          </label>
        </div>
        <div>
          {errorData.passwordConfirm?.length > 0 &&
            errorData.passwordConfirm.join(",")}
        </div>
        <div>
          <button type="submit">注册</button>
        </div>
      </form>
    </>
  );
};
export default signUp;
