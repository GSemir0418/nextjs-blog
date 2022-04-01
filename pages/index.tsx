import { NextPage } from "next";
import Link from "next/link";
const Home: NextPage = () => {
  return (
    <>
      <div className="cover">
          <img src="/logo.png" alt="" />
          <h2><Link href={'/posts'}><a>文章列表</a></Link></h2>
      </div>
      <style jsx>{`
        .cover{
            height: 100vh;
            background: #f9fbe7;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
        .cover img{
            width: 300px;
            margin-bottom: 50px;
        }
        .cover a:visited{
            color: #4caf50;
        }
        .cover a:hover{
            color: #c0ca33;
        }
      `}</style>
    </>
  );
};
export default Home
