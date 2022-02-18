import axios from "axios";
import { useForm } from "hooks/useForm";
import { NextPage } from "next";

const signUp: NextPage = () => {
  const { form } = useForm(
    { username: "", password: "", passwordConfirm: "" },
    {
      request: (formData) => axios.post("/api/v1/users", formData),
      message: "注册成功",
    },
    [
      { label: "用户名", type: "text", key: "username" },
      { label: "密码", type: "password", key: "password" },
      { label: "确认密码", type: "password", key: "passwordConfirm" },
    ],
    <button type="submit">注册</button>
  );
  return (
    <>
      <h1>注册页面</h1>
      {form}
    </>
  );
};
export default signUp;
