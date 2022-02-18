import axios from "axios";
import { useForm } from "hooks/useForm";
import { NextPage } from "next";

const createPost: NextPage = () => {
  const { form } = useForm(
    { title: "", content: "" },
    {
      request: (formData) => axios.post("/api/v1/posts", formData),
      success: () => window.alert("提交成功"),
    },
    [
      { label: "标题", type: "text", key: "title" },
      { label: "内容", type: "textarea", key: "content" },
    ],
    <button type="submit">提交</button>
  );
  return <div>{form}</div>;
};
export default createPost;
