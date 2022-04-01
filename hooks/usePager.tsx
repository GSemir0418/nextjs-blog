import Link from "next/link";
import _ from "lodash";

type Options = {
  page: number;
  totalPage: number;
  urlMaker?: (n: number) => string;
};
const defaultUrlMaker = (n: number) => `?page=${n}`;
export function usePager(options: Options) {
  const { page, totalPage, urlMaker: _urlMaker } = options;
  const urlMaker = _urlMaker || defaultUrlMaker;
  // 显示的页码分别是当前页的+-3与首页和尾页
  const numbers = [1, totalPage];
  for (let i = page - 3; i <= page + 3; i++) {
    numbers.push(i);
  }
  // 对范围内的数据进行去重排序并筛选页码内的数字
  const pageNumbers = _.uniq(numbers)
    .sort()
    .filter((i) => i >= 1 && i <= totalPage);
  // 当位于首页时，会出现[1,2,3,4,6]，需要在缺省初补充-1占位
  // [1,2,3,4,6] => [1,2,3,4,-1,6]
  // 思路：reduce初始值为[],我们让每一项值与累加结果数组的最后一项值相减
  // 如果差为1，则利用concat将两者拼接并作为结果返回，否则拼接-1与下一项
  const result = pageNumbers.reduce(
    (result, n) =>
      n - (result[result.length - 1] || 0) === 1
        ? result.concat(n)
        : result.concat(-1, n),
    []
  );

  const pager =
    totalPage > 1 ? (
      <div className="wrapper">
        {page !== 1 && (
          <Link href={urlMaker(page - 1)}>
            <a>{"<"}</a>
          </Link>
        )}
        {result.map((i) =>
          i === -1 ? (
            <span>...</span>
          ) : (
            <Link href={urlMaker(i)}>
              <a>{i}</a>
            </Link>
          )
        )}
        {page < totalPage && (
          <Link href={urlMaker(page + 1)}>
            <a>{">"}</a>
          </Link>
        )}
        <span>
          第 {page} / {totalPage} 页
        </span>
        <style jsx>{`
          .wrapper {
            margin: 0 -8px;
            padding: 8px 0;
          }
          .wrapper > a,
          .wrapper > span {
            margin: 0 8px;
          }
        `}</style>
      </div>
    ) : null;
  return { pager };
}
