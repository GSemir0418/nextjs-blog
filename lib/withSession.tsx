import { NextApiHandler } from "next";
import { withIronSession } from "next-iron-session";

export default function withSession(handler: NextApiHandler) {
  return withIronSession(handler, {
    // cookie加密所需的随机字符串
    // password: process.env.SECRET_COOKIE_PASSWORD,
    password: "56da34b1-fa9c-4c82-868f-0d8b349f797d",
    cookieName: "blog",
    cookieOptions: {
      // 如为true，则只允许https协议操作cookie
      secure: false,
    },
  });
}
