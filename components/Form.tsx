import { ChangeEventHandler, FormEventHandler, ReactChild } from "react";

type Props = {
  fields: {
    label: string;
    type: "text" | "password" | "textarea";
    value: string | number;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    errors: string[];
  }[];
  onSubmit: FormEventHandler;
  buttons: ReactChild;
};

const Form: React.FC<Props> = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      {props.fields.map((field) => (
        <div>
          <label>
            {field.label}
            <input
              type={field.type}
              onChange={field.onChange}
              value={field.value}
            />
          </label>
          {field.errors?.length > 0 && <div>{field.errors.join(",")}</div>}
        </div>
      ))}
      <div>{props.buttons}</div>
    </form>
  );
};
export default Form;
