import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getDatabaseConnection } from "lib/getDatabaseConnection";
import { Post } from "src/entity/Post";
import Link from "next/link";
import qs from "query-string";
import { usePager } from "hooks/usePager";
import withSession from "lib/withSession";

type Props = {
  posts: Post[];
  count: number;
  page: number;
  pageSize: number;
  totalPage: number;
  currentUser: User;
};

const PostsIndex: NextPage<Props> = (props) => {
  const { currentUser, posts, count, page, totalPage } = props;
  const { pager } = usePager({ page, totalPage });
  return (
    <>
      <div className="posts">
        <header>
          <h1>文章列表 ({count})</h1>
          {currentUser && (
            <Link href={"/posts/new"}>
              <a>添加文章</a>
            </Link>
          )}
        </header>
        {posts.map((post) => (
          <div className="onePost">
            <Link key={post.id} href={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </div>
        ))}
        <footer>{pager}</footer>
      </div>
      <style jsx>{`
        .posts {
          max-width: 800px;
          margin: 0 auto;
          padding: 16px;
        }
        .posts > header {
          display: flex;
          align-items: center;
        }
        .posts > header > h1 {
          margin-right: auto;
        }
        .onePost {
          border-bottom: 1px solid #ddd;
          padding: 8px 0;
        }
      `}</style>
    </>
  );
};
export default PostsIndex;

export const getServerSideProps: GetServerSideProps = withSession(
  async (context:GetServerSidePropsContext) => {
    const connection = await getDatabaseConnection();
    // 后端从session中取出currentUser
    const currentUser = (context.req as any).session.get("currentUser") || null;
    // 分页
    // 从url中分离出page
    const { query } = qs.parseUrl(context.req.url);
    const page = parseInt(query.page?.toString() || "1");
    const pageSize = 5;
    // 查询数据库，并返回posts和总数count
    const [posts, count] = await connection.manager.findAndCount(Post, {
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      props: {
        currentUser,
        // 将数据返回给前端SSR页面
        posts: JSON.parse(JSON.stringify(posts)),
        count,
        page,
        pageSize,
        totalPage: Math.ceil(count / pageSize),
      },
    };
  }
);
