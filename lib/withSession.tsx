import { GetServerSideProps, NextApiHandler } from "next";
import { withIronSession } from "next-iron-session";

export default function withSession(
  handler: NextApiHandler | GetServerSideProps
) {
  return withIronSession(handler, {
    // cookie加密所需的随机字符串
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: "blog",
    cookieOptions: {
      // 如为true，则只允许https协议操作cookie
      secure: false,
    },
  });
}
