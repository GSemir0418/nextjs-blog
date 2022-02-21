/// <reference types="next" />
/// <reference types="next/types/global" />
// 出现了import这个动作后，此文件就不再作为全局的类型定义文件了
// 所以要将type Post转移到其他以d.ts结尾的文件中
import * as next from "next";

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "next" {
  import { Session } from "next-iron-session";
  interface NextApiRequest {
    session: Session;
  }
}
