import { GetServerSideProps, NextPage } from "next";
import { getDatabaseConnection } from "lib/getDatabaseConnection";
import { Post } from "src/entity/Post";
import Link from "next/link";
import qs from "query-string";
import { usePager } from "hooks/usePager";

type Props = {
  posts: Post[];
  count: number;
  page: number;
  pageSize: number;
  totalPage: number;
};

const PostsIndex: NextPage<Props> = (props) => {
  const { posts, count, page, totalPage } = props;
  const { pager } = usePager({ page, totalPage });
  return (
    <>
      <div className="posts">
        <h1>文章列表 ({count})</h1>
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
        .onePost {
          border-bottom: 1px solid #ddd;
          padding: 8px 0;
        }
      `}</style>
    </>
  );
};
export default PostsIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection();
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
      // 将数据返回给前端SSR页面
      posts: JSON.parse(JSON.stringify(posts)),
      count,
      page,
      pageSize,
      totalPage: Math.ceil(count / pageSize),
    },
  };
};
