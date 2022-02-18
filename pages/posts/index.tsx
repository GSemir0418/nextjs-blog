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
    <div>
      <h1>文章列表 ({count})</h1>
      {posts.map((post) => (
        <div>
          <Link key={post.id} href={`/posts/${post.id}`}>
            <a>{post.title}</a>
          </Link>
        </div>
      ))}
      <footer>{pager}</footer>
    </div>
  );
};
export default PostsIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection();
  // 分页
  // 从url中分离出page
  const { query } = qs.parseUrl(context.req.url);
  const page = parseInt(query.page?.toString() || "1");
  const pageSize = 1;
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
