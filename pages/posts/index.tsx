import { GetServerSideProps, NextPage } from "next";
import { getDatabaseConnection } from "lib/getDatabaseConnection";
import { Post } from "src/entity/Post";
import Link from "next/link";
import qs from "query-string";

type Props = {
  posts: Post[];
  count: number;
  page: number;
  pageSize: number;
  totalPage: number;
};

const PostsIndex: NextPage<Props> = (props) => {
  const { posts, count, page, pageSize, totalPage } = props;
  return (
    <div>
      <h1>文章列表</h1>
      {posts.map((post) => (
        <div>
          <Link key={post.id} href={`/posts/${post.id}`}>
            <a>{post.title}</a>
          </Link>
        </div>
      ))}
      <footer>
        共{count}篇文章,当前是第{page}页,每页{pageSize}条
        <div>
          {page !== 1 && (
            <Link href={`?page=${page - 1}`}>
              <a>上一页</a>
            </Link>
          )}
          {page < totalPage && (
            <Link href={`?page=${page + 1}`}>
              <a>下一页</a>
            </Link>
          )}
        </div>
      </footer>
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
  const pageSize = 3;
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
      totalPage: Math.floor(count / pageSize),
    },
  };
};
