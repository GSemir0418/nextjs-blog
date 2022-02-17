import axios from "axios";
import Form from "components/Form";
import { NextPage } from "next";
import { useCallback, useState } from "react";

const signUp: NextPage = () => {
  // 表单数据
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
  // 表单提交
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
  // onChange抽离
  const onChange = useCallback(
    (key, value) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );
  return (
    <>
      <h1>注册页面</h1>
      <Form
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
          {
            label: "确认密码",
            type: "password",
            value: formData.passwordConfirm,
            onChange: (e) => onChange("passwordConfirm", e.target.value),
            errors: errorData.passwordConfirm,
          },
        ]}
        onSubmit={onSubmit}
        buttons={<button type="submit">注册</button>}
      />
    </>
  );
};
export default signUp;
