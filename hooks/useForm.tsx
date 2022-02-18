import { AxiosResponse } from "axios";
import { ReactChild, useCallback, useState } from "react";
type Field<T> = {
  label: string;
  type: "text" | "password" | "textarea";
  key: keyof T;
};
// 由于传入的initFormData类型不能确定，所以用泛型T来表示，在useForm<>中声明泛型T
export function useForm<T>(
  initFormData: T,
  submit: {
    request: (fd: T) => Promise<AxiosResponse<T>>;
    success: () => void;
  },
  fields: Field<T>[],
  buttons: ReactChild
) {
  const [formData, setFormData] = useState(initFormData);
  // 根据initFormData生成errorData
  const [errorData, setErrorData] = useState(() => {
    // [key in keyof T]表示e中key的类型与T中key的类型相匹配
    // 等价于e的下标的类型为('password'|'username')
    // 由于e的值也不能第一时间确定，因此其下标的类型是可选的？
    const e: { [key in keyof T]?: string[] } = {};
    for (let key in initFormData) {
      e[key] = [];
    }
    return e;
  });
  // onChange接受两个参数，分别是要改变值的key和对应的value
  const onChange = useCallback(
    (key: keyof T, value: any) => {
      // key可以用占位符的形式
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      submit.request(formData).then(submit.success, (error) => {
        if (error.response) {
          if (error.response.status === 422) {
            setErrorData(error.response.data);
          } else if (error.response.status === 401) {
            window.alert("请先登录");
            window.location.href = "/sign_in?return_to=/posts/new";
          }
        }
      });
    },
    [submit, formData]
  );
  const form = (
    <form onSubmit={onSubmit}>
      {fields.map((field, index) => (
        <div key={index}>
          <label>
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                onChange={(e) => onChange(field.key, e.target.value)}
                value={formData[field.key].toString()}
              />
            ) : (
              <input
                type={field.type}
                onChange={(e) => onChange(field.key, e.target.value)}
                value={formData[field.key].toString()}
              />
            )}
          </label>
          {errorData[field.key]?.length > 0 && (
            <div>{errorData[field.key].join(",")}</div>
          )}
        </div>
      ))}
      <div>{buttons}</div>
    </form>
  );
  return { form, setErrorData };
}
