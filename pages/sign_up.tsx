import axios from "axios";
import { useForm } from "hooks/useForm";
import { NextPage } from "next";

const signUp: NextPage = () => {
  const initFormData = { username: "", password: "", passwordConfirm: "" };
  // 由于initFormData是静态对象数据，因此可以偷懒，直接指定其类型为typeof initFormData即可
  const onSubmit = (formData: typeof initFormData) => {
    axios.post("api/v1/users", formData).then(
      () => {
        window.alert("注册成功!");
        window.location.href = "/sign_in";
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
      { label: "用户名", type: "password", key: "password" },
      { label: "用户名", type: "password", key: "passwordConfirm" },
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
